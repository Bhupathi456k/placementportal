import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity, 
    get_jwt, create_refresh_token
)
from datetime import datetime
import re
from models import db, User, StudentProfile, HodProfile, Department
from services.email_service import email_service

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    return len(password) >= 6

def generate_student_id():
    """Generate unique student ID"""
    import random
    import string
    return 'STU' + ''.join(random.choices(string.digits, k=6))

def generate_employee_id():
    """Generate unique employee ID for HOD/TPO"""
    import random
    import string
    return 'EMP' + ''.join(random.choices(string.digits, k=6))

@auth_bp.route('/register', methods=['POST'])
def register():
    """User registration endpoint"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'role']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        role = data['role']
        
        # Validate email format
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password
        if not validate_password(password):
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400
        
        # Validate role
        if role not in ['student', 'hod', 'tpo']:
            return jsonify({'error': 'Invalid role'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'User already exists'}), 409
        
        # Create user
        user = User(email=email, role=role, is_approved=(role in ['tpo']))  # TPO is auto-approved
        user.set_password(password)
        
        db.session.add(user)
        db.session.flush()  # Get user ID without committing
        
        # Create role-specific profile
        if role == 'student':
            # Validate student-specific fields
            required_student_fields = ['first_name', 'last_name', 'department_id', 'batch_year']
            for field in required_student_fields:
                if not data.get(field):
                    return jsonify({'error': f'{field} is required for student'}), 400
            
            # Check if department exists
            department = Department.query.get(data['department_id'])
            if not department:
                return jsonify({'error': 'Invalid department'}), 400
            
            # Create student profile
            student_profile = StudentProfile(
                user_id=user.id,
                student_id=generate_student_id(),
                first_name=data['first_name'],
                last_name=data['last_name'],
                department_id=data['department_id'],
                batch_year=data['batch_year'],
                cgpa=data.get('cgpa'),
                phone=data.get('phone'),
                date_of_birth=data.get('date_of_birth'),
                gender=data.get('gender'),
                address=data.get('address')
            )
            db.session.add(student_profile)
            
        elif role == 'hod':
            # Validate HOD-specific fields
            required_hod_fields = ['first_name', 'last_name', 'department_id']
            for field in required_hod_fields:
                if not data.get(field):
                    return jsonify({'error': f'{field} is required for HOD'}), 400
            
            # Check if department exists
            department = Department.query.get(data['department_id'])
            if not department:
                return jsonify({'error': 'Invalid department'}), 400
            
            # Create HOD profile
            hod_profile = HodProfile(
                user_id=user.id,
                employee_id=generate_employee_id(),
                first_name=data['first_name'],
                last_name=data['last_name'],
                department_id=data['department_id'],
                phone=data.get('phone'),
                qualification=data.get('qualification'),
                experience_years=data.get('experience_years', 0)
            )
            db.session.add(hod_profile)
            
            # Update department HOD
            department.hod_user_id = user.id
        
        # For TPO, no additional profile needed initially
        
        db.session.commit()
        
        # Send welcome email
        try:
            email_service.send_welcome_email(user, data.get('first_name', ''))
        except Exception as e:
            print(f"Failed to send welcome email: {str(e)}")
        
        return jsonify({
            'message': 'Registration successful',
            'user': user.to_dict(),
            'status': 'pending_approval' if role == 'student' else 'approved'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        
        # Find user
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 403
        
        if not user.is_approved and user.role == 'student':
            return jsonify({'error': 'Account pending approval'}), 403
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Create access tokens
        access_token = create_access_token(identity=user.id, additional_claims={'role': user.role})
        refresh_token = create_refresh_token(identity=user.id)
        
        # Get user profile data
        user_data = user.to_dict()
        if user.role == 'student' and user.student_profile:
            user_data['profile'] = user.student_profile.to_dict()
        elif user.role == 'hod' and user.hod_profile:
            user_data['profile'] = user.hod_profile.to_dict()
        
        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Login failed: {str(e)}'}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.is_active:
            return jsonify({'error': 'Invalid token'}), 401
        
        new_token = create_access_token(identity=current_user_id, additional_claims={'role': user.role})
        
        return jsonify({
            'access_token': new_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Token refresh failed: {str(e)}'}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """User logout endpoint"""
    try:
        # In a production system, you would blacklist the token
        # For now, we'll just return success
        return jsonify({'message': 'Successfully logged out'}), 200
        
    except Exception as e:
        return jsonify({'error': f'Logout failed: {str(e)}'}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.is_active:
            return jsonify({'error': 'User not found or inactive'}), 404
        
        user_data = user.to_dict()
        
        # Get role-specific profile
        if user.role == 'student' and user.student_profile:
            user_data['profile'] = user.student_profile.to_dict()
        elif user.role == 'hod' and user.hod_profile:
            user_data['profile'] = user.hod_profile.to_dict()
        
        return jsonify({'user': user_data}), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get profile: {str(e)}'}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update current user profile"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.is_active:
            return jsonify({'error': 'User not found or inactive'}), 404
        
        data = request.get_json()
        
        # Update user email if provided
        if data.get('email'):
            new_email = data['email'].lower().strip()
            if not validate_email(new_email):
                return jsonify({'error': 'Invalid email format'}), 400
            
            # Check if email is already taken by another user
            existing_user = User.query.filter(User.email == new_email, User.id != user.id).first()
            if existing_user:
                return jsonify({'error': 'Email already taken'}), 409
            
            user.email = new_email
        
        # Update password if provided
        if data.get('new_password'):
            if not user.check_password(data.get('current_password', '')):
                return jsonify({'error': 'Current password is incorrect'}), 400
            
            if not validate_password(data['new_password']):
                return jsonify({'error': 'New password must be at least 6 characters long'}), 400
            
            user.set_password(data['new_password'])
        
        # Update role-specific profile
        if user.role == 'student' and user.student_profile:
            profile = user.student_profile
            
            # Update allowed fields
            updatable_fields = ['first_name', 'last_name', 'cgpa', 'phone', 'date_of_birth', 'gender', 'address']
            for field in updatable_fields:
                if field in data:
                    setattr(profile, field, data[field])
        
        elif user.role == 'hod' and user.hod_profile:
            profile = user.hod_profile
            
            # Update allowed fields
            updatable_fields = ['first_name', 'last_name', 'phone', 'qualification', 'experience_years']
            for field in updatable_fields:
                if field in data:
                    setattr(profile, field, data[field])
        
        db.session.commit()
        
        # Return updated user data
        user_data = user.to_dict()
        if user.role == 'student' and user.student_profile:
            user_data['profile'] = user.student_profile.to_dict()
        elif user.role == 'hod' and user.hod_profile:
            user_data['profile'] = user.hod_profile.to_dict()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user_data
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update profile: {str(e)}'}), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.is_active:
            return jsonify({'error': 'User not found or inactive'}), 404
        
        data = request.get_json()
        
        if not data.get('current_password') or not data.get('new_password'):
            return jsonify({'error': 'Current and new password are required'}), 400
        
        if not user.check_password(data['current_password']):
            return jsonify({'error': 'Current password is incorrect'}), 400
        
        if not validate_password(data['new_password']):
            return jsonify({'error': 'New password must be at least 6 characters long'}), 400
        
        user.set_password(data['new_password'])
        db.session.commit()
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to change password: {str(e)}'}), 500

@auth_bp.route('/departments', methods=['GET'])
def get_departments():
    """Get list of departments for registration"""
    try:
        departments = Department.query.filter_by(is_active=True).all()
        return jsonify({
            'departments': [dept.to_dict() for dept in departments]
        }), 200
    except Exception as e:
        return jsonify({'error': f'Failed to get departments: {str(e)}'}), 500
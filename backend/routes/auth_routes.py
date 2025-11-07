import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity, 
    get_jwt, create_refresh_token
)
from datetime import datetime
import re
import sys
import os

# Add the parent directory to the Python path to fix imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import from models (db and all models are defined in models.py)
from models import db, User, StudentProfile, HodProfile, Department
from services.email_service import email_service

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    return len(password) >= 6

@auth_bp.route('/register', methods=['POST'])
def register():
    """User registration endpoint"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'role', 'first_name', 'last_name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        role = data['role']
        first_name = data['first_name'].strip()
        last_name = data['last_name'].strip()
        
        # Validate email format
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password
        if not validate_password(password):
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        # Validate role
        if role not in ['student', 'hod', 'tpo']:
            return jsonify({'error': 'Invalid role'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'User with this email already exists'}), 409
        
        # Create new user
        user = User(
            email=email,
            role=role,
            is_active=True,
            is_approved=False if role == 'student' else True
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.flush()  # Get user ID without committing
        
        # Create role-specific profile
        if role == 'student':
            # Validate student-specific fields
            if not data.get('student_id') or not data.get('department_id') or not data.get('batch_year'):
                db.session.rollback()
                return jsonify({'error': 'Student ID, department, and batch year are required'}), 400
            
            # Check if department exists
            department = Department.query.get(data['department_id'])
            if not department:
                db.session.rollback()
                return jsonify({'error': 'Invalid department'}), 400
            
            # Check if student ID is unique
            existing_student = StudentProfile.query.filter_by(student_id=data['student_id']).first()
            if existing_student:
                db.session.rollback()
                return jsonify({'error': 'Student ID already exists'}), 409
            
            student_profile = StudentProfile(
                user_id=user.id,
                student_id=data['student_id'],
                first_name=first_name,
                last_name=last_name,
                department_id=data['department_id'],
                batch_year=data['batch_year'],
                cgpa=data.get('cgpa'),
                phone=data.get('phone'),
                gender=data.get('gender')
            )
            db.session.add(student_profile)
            
        elif role == 'hod':
            # Validate HOD-specific fields
            if not data.get('employee_id') or not data.get('department_id'):
                db.session.rollback()
                return jsonify({'error': 'Employee ID and department are required for HOD'}), 400
            
            # Check if department exists
            department = Department.query.get(data['department_id'])
            if not department:
                db.session.rollback()
                return jsonify({'error': 'Invalid department'}), 400
            
            # Check if employee ID is unique
            existing_hod = HodProfile.query.filter_by(employee_id=data['employee_id']).first()
            if existing_hod:
                db.session.rollback()
                return jsonify({'error': 'Employee ID already exists'}), 409
            
            hod_profile = HodProfile(
                user_id=user.id,
                employee_id=data['employee_id'],
                first_name=first_name,
                last_name=last_name,
                department_id=data['department_id'],
                phone=data.get('phone'),
                qualification=data.get('qualification'),
                experience_years=data.get('experience_years', 0)
            )
            db.session.add(hod_profile)
            
            # Update department HOD if not set
            if not department.hod_user_id:
                department.hod_user_id = user.id
        
        # Commit all changes
        db.session.commit()
        
        # Send welcome email
        try:
            email_service.send_welcome_email(user, first_name)
        except Exception as e:
            print(f"Welcome email failed: {str(e)}")
        
        return jsonify({
            'message': 'Registration successful',
            'user': {
                'id': user.id,
                'email': user.email,
                'role': user.role,
                'is_approved': user.is_approved
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        
        # Find user
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 401
        
        if not user.is_approved:
            return jsonify({'error': 'Account pending approval'}), 403
        
        # Create access token
        access_token = create_access_token(
            identity=user.id,
            additional_claims={'role': user.role}
        )
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'role': user.role,
                'is_approved': user.is_approved
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Login failed: {str(e)}'}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """User logout endpoint"""
    try:
        # In a more sophisticated implementation, you might want to blacklist the token
        # For now, we'll just return success
        return jsonify({'message': 'Logout successful'}), 200
    except Exception as e:
        return jsonify({'error': f'Logout failed: {str(e)}'}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        profile_data = user.to_dict()
        
        # Add role-specific profile data
        if user.role == 'student' and user.student_profile:
            profile_data['student_profile'] = user.student_profile.to_dict()
        elif user.role == 'hod' and user.hod_profile:
            profile_data['hod_profile'] = user.hod_profile.to_dict()
        
        return jsonify({'profile': profile_data}), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get profile: {str(e)}'}), 500

@auth_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Validate required fields
        if not data.get('current_password') or not data.get('new_password'):
            return jsonify({'error': 'Current password and new password are required'}), 400
        
        # Verify current password
        if not user.check_password(data['current_password']):
            return jsonify({'error': 'Current password is incorrect'}), 400
        
        # Validate new password
        if not validate_password(data['new_password']):
            return jsonify({'error': 'New password must be at least 6 characters'}), 400
        
        # Update password
        user.set_password(data['new_password'])
        db.session.commit()
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Password change failed: {str(e)}'}), 500

@auth_bp.route('/departments', methods=['GET'])
def get_departments():
    """Get all departments (for registration dropdown)"""
    try:
        departments = Department.query.filter_by(is_active=True).all()
        return jsonify({
            'departments': [dept.to_dict() for dept in departments]
        }), 200
    except Exception as e:
        return jsonify({'error': f'Failed to get departments: {str(e)}'}), 500
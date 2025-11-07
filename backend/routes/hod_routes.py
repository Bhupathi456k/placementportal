from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, StudentProfile, HodProfile, Department
from services.report_service import report_service

hod_bp = Blueprint('hod', __name__)

@hod_bp.route('/students', methods=['GET'])
@jwt_required()
def get_department_students():
    """Get all students in HOD's department"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'hod':
            return jsonify({'error': 'Access denied'}), 403
        
        hod_profile = user.hod_profile
        if not hod_profile:
            return jsonify({'error': 'HOD profile not found'}), 404
        
        students = StudentProfile.query.filter_by(
            department_id=hod_profile.department_id,
            is_active=True
        ).all()
        
        return jsonify({
            'students': [student.to_dict() for student in students]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@hod_bp.route('/approve-student', methods=['PUT'])
@jwt_required()
def approve_student():
    """Approve a student registration"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'hod':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        student_user_id = data.get('student_user_id')
        
        if not student_user_id:
            return jsonify({'error': 'Student user ID is required'}), 400
        
        student_user = User.query.get(student_user_id)
        if not student_user or student_user.role != 'student':
            return jsonify({'error': 'Invalid student'}), 404
        
        # Check if student is in HOD's department
        hod_profile = user.hod_profile
        if student_user.student_profile.department_id != hod_profile.department_id:
            return jsonify({'error': 'Student not in your department'}), 403
        
        # Approve student
        student_user.is_approved = True
        db.session.commit()
        
        return jsonify({'message': 'Student approved successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@hod_bp.route('/analytics', methods=['GET'])
@jwt_required()
def get_department_analytics():
    """Get department placement analytics"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'hod':
            return jsonify({'error': 'Access denied'}), 403
        
        hod_profile = user.hod_profile
        if not hod_profile:
            return jsonify({'error': 'HOD profile not found'}), 404
        
        # Generate analytics
        analytics = report_service.generate_department_analytics(hod_profile.department_id)
        
        return jsonify(analytics), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
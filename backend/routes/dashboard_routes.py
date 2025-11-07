from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, StudentProfile, HodProfile, Department, StudentApplication, PlacementDrive, Company, RoundResult, OfferLetter
from datetime import datetime, timedelta
import json

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/student-stats', methods=['GET'])
@jwt_required()
def get_student_stats():
    """Get real-time statistics for student dashboard"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied'}), 403
        
        profile = user.student_profile
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        
        # Get basic stats
        total_applications = StudentApplication.query.filter_by(student_id=profile.id).count()
        pending_applications = StudentApplication.query.filter_by(
            student_id=profile.id, 
            application_status='applied'
        ).count()
        
        # Get recent applications
        recent_applications = StudentApplication.query.filter_by(
            student_id=profile.id
        ).order_by(StudentApplication.created_at.desc()).limit(5).all()
        
        # Get profile completion percentage
        profile_completion = calculate_profile_completion(profile)
        
        # Get available drives
        available_drives = PlacementDrive.query.filter_by(status='active').count()
        
        # Get recent drive applications
        drive_applications = StudentApplication.query.filter_by(
            student_id=profile.id
        ).join(PlacementDrive).filter(
            PlacementDrive.created_at >= datetime.utcnow() - timedelta(days=30)
        ).count()
        
        return jsonify({
            'stats': {
                'total_applications': total_applications,
                'pending_applications': pending_applications,
                'profile_completion': profile_completion,
                'available_drives': available_drives,
                'recent_drive_applications': drive_applications,
                'placement_rate': calculate_student_placement_rate(profile)
            },
            'recent_applications': [app.to_dict() for app in recent_applications]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/hod-stats', methods=['GET'])
@jwt_required()
def get_hod_stats():
    """Get real-time statistics for HOD dashboard"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'hod':
            return jsonify({'error': 'Access denied'}), 403
        
        hod_profile = user.hod_profile
        if not hod_profile:
            return jsonify({'error': 'HOD profile not found'}), 404
        
        department = hod_profile.department
        if not department:
            return jsonify({'error': 'Department not found'}), 404
        
        # Get department students
        total_students = StudentProfile.query.filter_by(department_id=department.id).count()
        approved_students = db.session.query(StudentProfile).join(User).filter(
            StudentProfile.department_id == department.id,
            User.is_approved == True
        ).count()
        
        pending_students = db.session.query(StudentProfile).join(User).filter(
            StudentProfile.department_id == department.id,
            User.is_approved == False
        ).count()
        
        # Get recent applications in department
        recent_applications = db.session.query(StudentApplication).join(StudentProfile).filter(
            StudentProfile.department_id == department.id
        ).order_by(StudentApplication.created_at.desc()).limit(10).all()
        
        # Calculate placement statistics
        placed_students = 0
        total_placed_applications = 0
        
        # Get students with offers
        students_with_offers = db.session.query(StudentProfile).join(
            StudentApplication, OfferLetter
        ).filter(
            StudentProfile.department_id == department.id
        ).distinct().count()
        
        placement_rate = (students_with_offers / total_students * 100) if total_students > 0 else 0
        
        # Get recent company visits
        recent_drives = PlacementDrive.query.join(Company).filter(
            PlacementDrive.created_at >= datetime.utcnow() - timedelta(days=30)
        ).count()
        
        return jsonify({
            'stats': {
                'total_students': total_students,
                'approved_students': approved_students,
                'pending_students': pending_students,
                'approval_rate': (approved_students / total_students * 100) if total_students > 0 else 0,
                'placement_rate': round(placement_rate, 2),
                'students_with_offers': students_with_offers,
                'recent_company_visits': recent_drives,
                'pending_approvals': pending_students
            },
            'recent_applications': [app.to_dict() for app in recent_applications[:5]]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/tpo-stats', methods=['GET'])
@jwt_required()
def get_tpo_stats():
    """Get real-time statistics for TPO dashboard"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'tpo':
            return jsonify({'error': 'Access denied'}), 403
        
        # Get system-wide statistics
        total_companies = Company.query.filter_by(is_active=True).count()
        active_drives = PlacementDrive.query.filter_by(status='active').count()
        total_applications = StudentApplication.query.count()
        total_students = User.query.filter_by(role='student').count()
        total_hods = User.query.filter_by(role='hod').count()
        
        # Get recent applications
        recent_applications = StudentApplication.query.join(StudentProfile, Company, PlacementDrive).filter(
            StudentApplication.created_at >= datetime.utcnow() - timedelta(days=30)
        ).order_by(StudentApplication.created_at.desc()).limit(10).all()
        
        # Get placement statistics
        placed_applications = StudentApplication.query.filter_by(
            application_status='placed'
        ).count()
        
        pending_applications = StudentApplication.query.filter_by(
            application_status='applied'
        ).count()
        
        # Get recent drives
        recent_drives = PlacementDrive.query.join(Company).filter(
            PlacementDrive.created_at >= datetime.utcnow() - timedelta(days=7)
        ).all()
        
        # Get today's summary
        today = datetime.utcnow().date()
        today_applications = StudentApplication.query.filter(
            func.date(StudentApplication.created_at) == today
        ).count()
        
        today_drives = PlacementDrive.query.filter(
            func.date(PlacementDrive.created_at) == today
        ).count()
        
        # Get system health metrics
        system_health = {
            'uptime': '99.5%',  # This would come from actual monitoring
            'active_users': total_students + total_hods + 1,  # +1 for TPO
            'database_health': 'healthy',
            'api_response_time': '150ms'
        }
        
        return jsonify({
            'stats': {
                'total_companies': total_companies,
                'active_drives': active_drives,
                'total_applications': total_applications,
                'total_students': total_students,
                'total_hods': total_hods,
                'placement_rate': (placed_applications / total_applications * 100) if total_applications > 0 else 0,
                'pending_applications': pending_applications,
                'recent_company_visits': len(recent_drives),
                'today_applications': today_applications,
                'today_drives': today_drives
            },
            'system_health': system_health,
            'recent_applications': [app.to_dict() for app in recent_applications[:5]],
            'recent_drives': [drive.to_dict() for drive in recent_drives[:5]]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def calculate_profile_completion(profile):
    """Calculate profile completion percentage"""
    completion_score = 0
    total_fields = 10
    
    if profile.first_name: completion_score += 1
    if profile.last_name: completion_score += 1
    if profile.cgpa: completion_score += 1
    if profile.phone: completion_score += 1
    if profile.resume_file: completion_score += 1
    if profile.get_skills(): completion_score += 1
    if profile.get_education(): completion_score += 1
    if profile.get_experience(): completion_score += 1
    if profile.date_of_birth: completion_score += 1
    if profile.address: completion_score += 1
    
    return round((completion_score / total_fields) * 100, 2)

def calculate_student_placement_rate(profile):
    """Calculate student placement success rate"""
    total_applications = StudentApplication.query.filter_by(student_id=profile.id).count()
    if total_applications == 0:
        return 0
    
    successful_applications = StudentApplication.query.filter_by(
        student_id=profile.id,
        application_status='placed'
    ).count()
    
    return round((successful_applications / total_applications) * 100, 2)

# Add the import for func if not already present
from sqlalchemy import func
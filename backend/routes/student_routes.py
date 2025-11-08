from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, StudentProfile, Department, StudentApplication, PlacementDrive, RoundResult, OfferLetter
from services.ai_service import ai_service
from services.file_service import file_service
from services.email_service import email_service
from datetime import datetime
import json

student_bp = Blueprint('student', __name__)

@student_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_student_profile():
    """Get current student profile"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied'}), 403
        
        profile = user.student_profile
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        
        return jsonify({'profile': profile.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@student_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_student_profile():
    """Update student profile"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied'}), 403
        
        profile = user.student_profile
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        allowed_fields = ['first_name', 'last_name', 'cgpa', 'phone', 'date_of_birth', 'gender', 'address']
        for field in allowed_fields:
            if field in data:
                setattr(profile, field, data[field])
        
        # Update arrays
        if 'skills' in data:
            profile.set_skills(data['skills'])
        if 'experience' in data:
            profile.set_experience(data['experience'])
        if 'education' in data:
            profile.set_education(data['education'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'profile': profile.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@student_bp.route('/upload-resume', methods=['POST'])
@jwt_required()
def upload_resume():
    """Upload student resume"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied'}), 403
        
        profile = user.student_profile
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        
        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file provided'}), 400
        
        file = request.files['resume']
        
        # Save resume file
        result = file_service.save_resume(file, profile.student_id)
        
        if result['success']:
            # Update profile with resume filename
            profile.resume_file = result['filename']
            
            # Extract resume data using AI
            if ai_service.is_enabled():
                try:
                    extracted_data = ai_service.extract_resume_data(result['filepath'])
                    if extracted_data.get('success'):
                        # Update profile with extracted data
                        data = extracted_data.get('data', {})
                        if data.get('skills'):
                            profile.set_skills(data['skills'])
                        if data.get('experience'):
                            profile.set_experience(data['experience'])
                        if data.get('education'):
                            profile.set_education(data['education'])
                except Exception as e:
                    print(f"Resume extraction failed: {str(e)}")
            
            db.session.commit()
            
            return jsonify({
                'message': 'Resume uploaded successfully',
                'file_info': result
            }), 200
        else:
            return jsonify({'error': result['error']}), 400
            
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@student_bp.route('/applications', methods=['GET'])
@jwt_required()
def get_student_applications():
    """Get student's applications"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied'}), 403
        
        profile = user.student_profile
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        
        applications = StudentApplication.query.filter_by(student_id=profile.id).all()
        
        return jsonify({
            'applications': [app.to_dict() for app in applications]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@student_bp.route('/apply-drive', methods=['POST'])
@jwt_required()
def apply_to_drive():
    """Apply to a placement drive"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied'}), 403
        
        profile = user.student_profile
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        
        data = request.get_json()
        drive_id = data.get('drive_id')
        
        if not drive_id:
            return jsonify({'error': 'Drive ID is required'}), 400
        
        # Check if drive exists and is active
        drive = PlacementDrive.query.get(drive_id)
        if not drive or drive.status != 'active':
            return jsonify({'error': 'Drive not found or not active'}), 404
        
        # Check eligibility
        if drive.min_cgpa and profile.cgpa and profile.cgpa < drive.min_cgpa:
            return jsonify({'error': 'CGPA not meeting minimum requirement'}), 400
        
        # Check if already applied
        existing_app = StudentApplication.query.filter_by(
            student_id=profile.id,
            drive_id=drive_id
        ).first()
        
        if existing_app:
            return jsonify({'error': 'Already applied to this drive'}), 409
        
        # Create application
        application = StudentApplication(
            student_id=profile.id,
            drive_id=drive_id,
            application_status='applied'
        )
        
        # Calculate AI score if service is available
        if ai_service.is_enabled() and profile.skills and drive.required_skills:
            try:
                student_skills = profile.get_skills()
                job_requirements = drive.get_required_skills()
                score_result = ai_service.calculate_job_fit_score(
                    student_skills, job_requirements, 
                    float(profile.cgpa) if profile.cgpa else 0,
                    float(drive.min_cgpa) if drive.min_cgpa else 0
                )
                if score_result.get('success'):
                    application.ai_score = score_result['ai_score']['total_score']
            except Exception as e:
                print(f"AI scoring failed: {str(e)}")
        
        db.session.add(application)
        db.session.commit()
        
        # Send confirmation email
        try:
            email_service.send_application_confirmation(
                user.email,
                f"{profile.first_name} {profile.last_name}",
                drive.company.name,
                drive.job_role,
                drive.title
            )
        except Exception as e:
            print(f"Email sending failed: {str(e)}")
        
        return jsonify({
            'message': 'Application submitted successfully',
            'application': application.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@student_bp.route('/resume-suggestions', methods=['POST'])
@jwt_required()
def get_resume_suggestions():
    """Get AI-powered resume suggestions"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied'}), 403
        
        profile = user.student_profile
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        
        data = request.get_json()
        target_role = data.get('target_role', 'Software Engineer')
        
        # Get current skills
        current_skills = profile.get_skills()
        
        # Get AI suggestions
        suggestions = ai_service.generate_resume_suggestions(current_skills, target_role)
        
        return jsonify(suggestions), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@student_bp.route('/available-drives', methods=['GET'])
@jwt_required()
def get_available_drives():
    """Get all available drives for student"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied'}), 403
        
        profile = user.student_profile
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        
        # Get active drives that student hasn't applied to yet
        applied_drive_ids = [app.drive_id for app in profile.applications]
        
        drives = PlacementDrive.query.filter(
            PlacementDrive.status == 'active',
            ~PlacementDrive.id.in_(applied_drive_ids)
        ).all()
        
        # Check eligibility for each drive
        eligible_drives = []
        for drive in drives:
            drive_data = drive.to_dict()
            
            # Check CGPA eligibility
            if drive.min_cgpa and profile.cgpa and profile.cgpa < drive.min_cgpa:
                drive_data['eligible'] = False
                drive_data['ineligibility_reason'] = 'CGPA below minimum requirement'
            else:
                drive_data['eligible'] = True
                drive_data['ineligibility_reason'] = None
            
            eligible_drives.append(drive_data)
        
        return jsonify({
            'drives': eligible_drives
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@student_bp.route('/results', methods=['GET'])
@jwt_required()
def get_student_results():
    """Get student's interview results"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied'}), 403
        
        profile = user.student_profile
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        
        # Get student's applications and their results
        applications = StudentApplication.query.filter_by(student_id=profile.id).all()
        results = []
        
        for app in applications:
            round_results = RoundResult.query.filter_by(application_id=app.id).all()
            for result in round_results:
                result_data = result.to_dict()
                result_data['application'] = app.to_dict()
                results.append(result_data)
        
        return jsonify({
            'results': results
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
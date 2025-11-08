from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Company, PlacementDrive
from services.file_service import file_service
from services.ai_service import ai_service
from datetime import datetime

tpo_bp = Blueprint('tpo', __name__)

@tpo_bp.route('/drives', methods=['GET'])
@jwt_required()
def get_drives():
    """Get all placement drives (TPO only)"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'tpo':
            return jsonify({'error': 'Access denied'}), 403
        
        drives = PlacementDrive.query.all()
        return jsonify({
            'drives': [drive.to_dict() for drive in drives]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tpo_bp.route('/drives', methods=['POST'])
@jwt_required()
def create_drive():
    """Create new placement drive (TPO only)"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'tpo':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        
        # Create placement drive
        drive = PlacementDrive(
            company_id=data['company_id'],
            title=data['title'],
            job_description=data.get('job_description'),
            job_role=data['job_role'],
            eligibility_criteria=data.get('eligibility_criteria'),
            package_offered=data.get('package_offered'),
            location=data.get('location'),
            drive_date=data.get('drive_date'),
            application_deadline=data.get('application_deadline'),
            status='draft',
            max_applicants=data.get('max_applicants'),
            min_cgpa=data.get('min_cgpa'),
            created_by=current_user_id
        )
        
        # Set required skills
        if 'required_skills' in data:
            drive.set_required_skills(data['required_skills'])
        
        db.session.add(drive)
        db.session.commit()
        
        return jsonify({
            'message': 'Drive created successfully',
            'drive': drive.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# AI-powered TPO Quick Action Endpoints

@tpo_bp.route('/ai/company-insights', methods=['POST'])
@jwt_required()
def get_company_insights():
    """Get AI-powered insights for company management"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'tpo':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        company_id = data.get('company_id')
        
        if company_id:
            # Get specific company data
            company = Company.query.get(company_id)
            if not company:
                return jsonify({'error': 'Company not found'}), 404
            
            company_data = {
                'id': company.id,
                'name': company.name,
                'industry': company.industry,
                'website': company.website,
                'description': company.description,
                'contact_person': company.contact_person,
                'contact_email': company.contact_email,
                'contact_phone': company.contact_phone,
                'address': company.address,
                'created_at': company.created_at.isoformat() if company.created_at else None,
                'total_drives': len(company.drives) if hasattr(company, 'drives') else 0,
                'recent_activity': 'active'  # Mock data
            }
        else:
            # Get all companies overview
            companies = Company.query.all()
            company_data = {
                'total_companies': len(companies),
                'active_companies': len([c for c in companies if hasattr(c, 'drives')]),
                'companies': [c.to_dict() for c in companies[:10]]  # Limit for performance
            }
        
        # Generate AI insights
        insights = ai_service.generate_company_insights(company_data)
        
        return jsonify({
            'success': True,
            'data': insights,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tpo_bp.route('/ai/drive-analytics', methods=['POST'])
@jwt_required()
def get_drive_analytics():
    """Get AI-powered analytics for placement drives"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'tpo':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        drive_id = data.get('drive_id')
        
        if drive_id:
            # Get specific drive data
            drive = PlacementDrive.query.get(drive_id)
            if not drive:
                return jsonify({'error': 'Drive not found'}), 404
            
            drive_data = {
                'id': drive.id,
                'title': drive.title,
                'company_id': drive.company_id,
                'job_role': drive.job_role,
                'drive_date': drive.drive_date.isoformat() if drive.drive_date else None,
                'status': drive.status,
                'max_applicants': drive.max_applicants,
                'applications_count': len(drive.applications) if hasattr(drive, 'applications') else 0,
                'selections_count': 0,  # Would need to calculate from applications
                'eligibility_criteria': drive.eligibility_criteria,
                'package_offered': drive.package_offered
            }
        else:
            # Get all drives overview
            drives = PlacementDrive.query.all()
            drive_data = {
                'total_drives': len(drives),
                'active_drives': len([d for d in drives if d.status == 'active']),
                'upcoming_drives': len([d for d in drives if d.drive_date and d.drive_date > datetime.utcnow()]),
                'drives': [d.to_dict() for d in drives[:10]]  # Limit for performance
            }
        
        # Generate AI analytics
        analytics = ai_service.analyze_drive_performance(drive_data)
        
        return jsonify({
            'success': True,
            'data': analytics,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tpo_bp.route('/ai/application-insights', methods=['POST'])
@jwt_required()
def get_application_insights():
    """Get AI-powered insights for student applications"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'tpo':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        drive_id = data.get('drive_id')
        
        # Mock application data (in real implementation, this would come from database)
        applications_data = [
            {
                'student_id': 1,
                'student_name': 'John Doe',
                'student_cgpa': 8.5,
                'skills': ['Python', 'Java', 'JavaScript'],
                'application_date': '2025-11-01',
                'status': 'pending',
                'resume_score': 85
            },
            {
                'student_id': 2,
                'student_name': 'Jane Smith',
                'student_cgpa': 9.2,
                'skills': ['React', 'Node.js', 'Python'],
                'application_date': '2025-11-02',
                'status': 'shortlisted',
                'resume_score': 92
            },
            # Add more mock data as needed
        ]
        
        # Generate AI insights
        insights = ai_service.generate_application_insights(applications_data)
        
        return jsonify({
            'success': True,
            'data': insights,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tpo_bp.route('/ai/round-optimization', methods=['POST'])
@jwt_required()
def get_round_optimization():
    """Get AI-powered round optimization recommendations"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'tpo':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        round_id = data.get('round_id')
        
        # Mock round data
        round_data = {
            'id': round_id or 1,
            'name': 'Technical Interview Round',
            'duration': 45,  # minutes
            'candidates_count': 50,
            'completion_rate': 85,
            'average_score': 78,
            'interviewer_count': 5,
            'questions_count': 20,
            'passing_score': 70
        }
        
        # Generate AI optimization
        optimization = ai_service.optimize_recruitment_rounds(round_data)
        
        return jsonify({
            'success': True,
            'data': optimization,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tpo_bp.route('/ai/comprehensive-reports', methods=['POST'])
@jwt_required()
def get_comprehensive_reports():
    """Generate AI-powered comprehensive reports"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'tpo':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        report_type = data.get('type', 'overview')
        date_range = data.get('date_range', 'last_6_months')
        
        # Mock report parameters
        report_params = {
            'type': report_type,
            'date_range': date_range,
            'department': data.get('department'),
            'company': data.get('company'),
            'include_predictions': data.get('include_predictions', True)
        }
        
        # Generate AI report
        report = ai_service.generate_comprehensive_reports(report_params)
        
        return jsonify({
            'success': True,
            'data': report,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tpo_bp.route('/ai/system-optimization', methods=['POST'])
@jwt_required()
def get_system_optimization():
    """Get AI-powered system optimization recommendations"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'tpo':
            return jsonify({'error': 'Access denied'}), 403
        
        # Mock system data
        system_data = {
            'total_users': 1250,
            'active_sessions': 45,
            'database_size': '2.5 GB',
            'api_response_time': '1.2s',
            'error_rate': '0.3%',
            'uptime': '99.5%',
            'storage_used': '75%',
            'last_maintenance': '2025-10-15'
        }
        
        # Generate AI optimization
        optimization = ai_service.optimize_system_settings(system_data)
        
        return jsonify({
            'success': True,
            'data': optimization,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tpo_bp.route('/live-stats', methods=['GET'])
@jwt_required()
def get_live_stats():
    """Get live statistics for TPO dashboard"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user or user.role != 'tpo':
            return jsonify({'error': 'Access denied'}), 403
        
        # Get real-time statistics
        companies = Company.query.all()
        drives = PlacementDrive.query.all()
        
        # Mock additional statistics
        stats = {
            'total_companies': len(companies),
            'active_drives': len([d for d in drives if d.status == 'active']),
            'total_applications': 1250,  # Mock data
            'successful_placements': 320,  # Mock data
            'pending_applications': 85,  # Mock data
            'system_health': 98.5,  # Mock data
            'response_time': '1.2s',  # Mock data
            'last_updated': datetime.utcnow().isoformat()
        }
        
        return jsonify({
            'success': True,
            'stats': stats
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tpo_bp.route('/companies', methods=['GET'])
@jwt_required()
def get_companies():
    """Get all companies (TPO only)"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'tpo':
            return jsonify({'error': 'Access denied'}), 403
        
        companies = Company.query.all()
        return jsonify({
            'companies': [company.to_dict() for company in companies]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tpo_bp.route('/companies', methods=['POST'])
@jwt_required()
def create_company():
    """Add new company (TPO only)"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'tpo':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        
        company = Company(
            name=data['name'],
            industry=data.get('industry'),
            website=data.get('website'),
            description=data.get('description'),
            contact_person=data.get('contact_person'),
            contact_email=data.get('contact_email'),
            contact_phone=data.get('contact_phone'),
            address=data.get('address')
        )
        
        db.session.add(company)
        db.session.commit()
        
        return jsonify({
            'message': 'Company added successfully',
            'company': company.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
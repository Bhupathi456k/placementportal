from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Company, PlacementDrive
from services.file_service import file_service

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
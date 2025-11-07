from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Company

company_bp = Blueprint('company', __name__)

@company_bp.route('/', methods=['GET'])
def get_companies():
    """Get all active companies"""
    try:
        companies = Company.query.filter_by(is_active=True).all()
        return jsonify({
            'companies': [company.to_dict() for company in companies]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@company_bp.route('/<int:company_id>', methods=['GET'])
def get_company(company_id):
    """Get specific company details"""
    try:
        company = Company.query.get(company_id)
        if not company:
            return jsonify({'error': 'Company not found'}), 404
        return jsonify({'company': company.to_dict()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
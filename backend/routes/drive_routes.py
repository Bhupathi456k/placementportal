from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, PlacementDrive, RecruitmentRound, StudentApplication, RoundResult
from services.email_service import email_service

drive_bp = Blueprint('drive', __name__)

@drive_bp.route('/', methods=['GET'])
def get_drives():
    """Get all active placement drives"""
    try:
        drives = PlacementDrive.query.filter_by(status='active').all()
        return jsonify({
            'drives': [drive.to_dict() for drive in drives]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@drive_bp.route('/<int:drive_id>', methods=['GET'])
def get_drive(drive_id):
    """Get specific drive details"""
    try:
        drive = PlacementDrive.query.get(drive_id)
        if not drive:
            return jsonify({'error': 'Drive not found'}), 404
        return jsonify({'drive': drive.to_dict()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@drive_bp.route('/<int:drive_id>/rounds', methods=['GET'])
def get_drive_rounds(drive_id):
    """Get recruitment rounds for a drive"""
    try:
        rounds = RecruitmentRound.query.filter_by(drive_id=drive_id).order_by(RecruitmentRound.order_sequence).all()
        return jsonify({
            'rounds': [round.to_dict() for round in rounds]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
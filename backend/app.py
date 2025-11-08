import os
from datetime import datetime, timezone
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_cors import CORS
from flask_mail import Mail
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///placement_portal.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_pre_ping': True,
    'pool_recycle': 3600,
}
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-string-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 86400  # 24 hours
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'true').lower() in ['true', 'on', '1']
app.config['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')

# Import models and routes first to get the db instance
from models import db
from models import User, StudentProfile, HodProfile, Department, EmailTemplate, EmailLog, Company, StudentApplication, PlacementDrive, RoundResult, OfferLetter, RecruitmentRound

# Initialize the database with the app
db.init_app(app)

# Initialize extensions
jwt = JWTManager(app)
cors = CORS(app, origins=["http://localhost:3000", "http://localhost:3001"])
mail = Mail(app)

# Create upload directory
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'resumes'), exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'offer_letters'), exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'reports'), exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'company_logos'), exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'profile_images'), exist_ok=True)
from routes.auth_routes import auth_bp
from routes.student_routes import student_bp
from routes.hod_routes import hod_bp
from routes.tpo_routes import tpo_bp
from routes.company_routes import company_bp
from routes.drive_routes import drive_bp
from routes.dashboard_routes import dashboard_bp
from routes.ai_routes import ai_routes_bp
from services.email_service import email_service
from services.ai_service import ai_service
from services.file_service import file_service
from services.report_service import report_service

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(student_bp, url_prefix='/api/student')
app.register_blueprint(hod_bp, url_prefix='/api/hod')
app.register_blueprint(tpo_bp, url_prefix='/api/tpo')
app.register_blueprint(company_bp, url_prefix='/api/companies')
app.register_blueprint(drive_bp, url_prefix='/api/drives')
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
app.register_blueprint(ai_routes_bp, url_prefix='/api/ai')

# Initialize services
email_service.init_app(app)
ai_service.init_app(app)
file_service.init_app(app)
report_service.init_app(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/docs', methods=['GET'])
def api_docs():
    """API documentation endpoint"""
    return jsonify({
        'message': 'Placement Management Portal API',
        'version': '1.0.0',
        'endpoints': {
            'Authentication': {
                'POST /api/auth/register': 'User registration',
                'POST /api/auth/login': 'User login',
                'POST /api/auth/logout': 'User logout',
                'GET /api/auth/profile': 'Get user profile'
            },
            'Student': {
                'GET /api/student/profile': 'Get student profile',
                'PUT /api/student/profile': 'Update student profile',
                'POST /api/student/upload-resume': 'Upload resume',
                'GET /api/student/applications': 'Get student applications',
                'POST /api/student/apply-drive': 'Apply to drive'
            },
            'HOD': {
                'GET /api/hod/students': 'Get department students',
                'PUT /api/hod/approve-student': 'Approve student',
                'GET /api/hod/analytics': 'Get department analytics',
                'GET /api/hod/reports': 'Generate reports'
            },
            'TPO': {
                'GET /api/tpo/drives': 'Get all drives',
                'POST /api/tpo/drives': 'Create new drive',
                'PUT /api/tpo/drives/<id>': 'Update drive',
                'GET /api/tpo/companies': 'Get companies',
                'POST /api/tpo/companies': 'Add company'
            }
        }
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
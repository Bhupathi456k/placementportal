import os
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import json

# db will be initialized in app.py
db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('student', 'hod', 'tpo'), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    is_approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Relationships
    student_profile = db.relationship('StudentProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    hod_profile = db.relationship('HodProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    created_drives = db.relationship('PlacementDrive', backref='creator', foreign_keys='PlacementDrive.created_by')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'role': self.role,
            'is_active': self.is_active,
            'is_approved': self.is_approved,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }

class Department(db.Model):
    __tablename__ = 'departments'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    code = db.Column(db.String(10), unique=True, nullable=False)
    description = db.Column(db.Text)
    hod_user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    student_profiles = db.relationship('StudentProfile', backref='department', foreign_keys='StudentProfile.department_id')
    hod_profiles = db.relationship('HodProfile', backref='department', foreign_keys='HodProfile.department_id')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'description': self.description,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class StudentProfile(db.Model):
    __tablename__ = 'student_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    student_id = db.Column(db.String(50), unique=True, nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), nullable=False)
    batch_year = db.Column(db.Integer, nullable=False)
    cgpa = db.Column(db.Numeric(3, 2))
    phone = db.Column(db.String(15))
    date_of_birth = db.Column(db.Date)
    gender = db.Column(db.Enum('male', 'female', 'other'))
    address = db.Column(db.Text)
    profile_image = db.Column(db.String(255))
    resume_file = db.Column(db.String(255))
    skills = db.Column(db.Text)  # JSON array
    experience = db.Column(db.Text)  # JSON array
    education = db.Column(db.Text)  # JSON array
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    applications = db.relationship('StudentApplication', backref='student', foreign_keys='StudentApplication.student_id', cascade='all, delete-orphan')
    offer_letters = db.relationship('OfferLetter', backref='student', foreign_keys='OfferLetter.student_id')
    
    def get_skills(self):
        return json.loads(self.skills) if self.skills else []
    
    def set_skills(self, skills):
        self.skills = json.dumps(skills)
    
    def get_experience(self):
        return json.loads(self.experience) if self.experience else []
    
    def set_experience(self, experience):
        self.experience = json.dumps(experience)
    
    def get_education(self):
        return json.loads(self.education) if self.education else []
    
    def set_education(self, education):
        self.education = json.dumps(education)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'student_id': self.student_id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'department_id': self.department_id,
            'department': self.department.to_dict() if self.department else None,
            'batch_year': self.batch_year,
            'cgpa': float(self.cgpa) if self.cgpa else None,
            'phone': self.phone,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'gender': self.gender,
            'address': self.address,
            'profile_image': self.profile_image,
            'resume_file': self.resume_file,
            'skills': self.get_skills(),
            'experience': self.get_experience(),
            'education': self.get_education(),
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class HodProfile(db.Model):
    __tablename__ = 'hod_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    employee_id = db.Column(db.String(50), unique=True, nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), nullable=False)
    phone = db.Column(db.String(15))
    qualification = db.Column(db.String(200))
    experience_years = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'employee_id': self.employee_id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'department_id': self.department_id,
            'department': self.department.to_dict() if self.department else None,
            'phone': self.phone,
            'qualification': self.qualification,
            'experience_years': self.experience_years,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Company(db.Model):
    __tablename__ = 'companies'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    industry = db.Column(db.String(100))
    website = db.Column(db.String(255))
    description = db.Column(db.Text)
    contact_person = db.Column(db.String(100))
    contact_email = db.Column(db.String(255))
    contact_phone = db.Column(db.String(15))
    address = db.Column(db.Text)
    logo = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    placement_drives = db.relationship('PlacementDrive', backref='company', cascade='all, delete-orphan')
    offer_letters = db.relationship('OfferLetter', backref='company')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'industry': self.industry,
            'website': self.website,
            'description': self.description,
            'contact_person': self.contact_person,
            'contact_email': self.contact_email,
            'contact_phone': self.contact_phone,
            'address': self.address,
            'logo': self.logo,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class PlacementDrive(db.Model):
    __tablename__ = 'placement_drives'
    
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    job_description = db.Column(db.Text)
    job_role = db.Column(db.String(100), nullable=False)
    eligibility_criteria = db.Column(db.Text)
    required_skills = db.Column(db.Text)  # JSON array
    package_offered = db.Column(db.Numeric(10, 2))
    location = db.Column(db.String(100))
    drive_date = db.Column(db.Date)
    application_deadline = db.Column(db.Date)
    status = db.Column(db.Enum('draft', 'active', 'closed', 'cancelled'), default='draft')
    max_applicants = db.Column(db.Integer)
    min_cgpa = db.Column(db.Numeric(3, 2))
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    recruitment_rounds = db.relationship('RecruitmentRound', backref='placement_drive', cascade='all, delete-orphan')
    student_applications = db.relationship('StudentApplication', backref='placement_drive', cascade='all, delete-orphan')
    
    def get_required_skills(self):
        return json.loads(self.required_skills) if self.required_skills else []
    
    def set_required_skills(self, skills):
        self.required_skills = json.dumps(skills)
    
    def to_dict(self):
        return {
            'id': self.id,
            'company_id': self.company_id,
            'company': self.company.to_dict() if self.company else None,
            'title': self.title,
            'job_description': self.job_description,
            'job_role': self.job_role,
            'eligibility_criteria': self.eligibility_criteria,
            'required_skills': self.get_required_skills(),
            'package_offered': float(self.package_offered) if self.package_offered else None,
            'location': self.location,
            'drive_date': self.drive_date.isoformat() if self.drive_date else None,
            'application_deadline': self.application_deadline.isoformat() if self.application_deadline else None,
            'status': self.status,
            'max_applicants': self.max_applicants,
            'min_cgpa': float(self.min_cgpa) if self.min_cgpa else None,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class RecruitmentRound(db.Model):
    __tablename__ = 'recruitment_rounds'
    
    id = db.Column(db.Integer, primary_key=True)
    drive_id = db.Column(db.Integer, db.ForeignKey('placement_drives.id'), nullable=False)
    round_name = db.Column(db.String(100), nullable=False)
    round_type = db.Column(db.Enum('screening', 'written', 'technical', 'hr', 'final'), nullable=False)
    description = db.Column(db.Text)
    duration_minutes = db.Column(db.Integer)
    max_marks = db.Column(db.Numeric(5, 2))
    is_elimination = db.Column(db.Boolean, default=True)
    scheduled_date = db.Column(db.DateTime)
    venue = db.Column(db.String(200))
    instructions = db.Column(db.Text)
    order_sequence = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    round_results = db.relationship('RoundResult', backref='recruitment_round', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'drive_id': self.drive_id,
            'round_name': self.round_name,
            'round_type': self.round_type,
            'description': self.description,
            'duration_minutes': self.duration_minutes,
            'max_marks': float(self.max_marks) if self.max_marks else None,
            'is_elimination': self.is_elimination,
            'scheduled_date': self.scheduled_date.isoformat() if self.scheduled_date else None,
            'venue': self.venue,
            'instructions': self.instructions,
            'order_sequence': self.order_sequence,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class StudentApplication(db.Model):
    __tablename__ = 'student_applications'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id'), nullable=False)
    drive_id = db.Column(db.Integer, db.ForeignKey('placement_drives.id'), nullable=False)
    application_status = db.Column(db.Enum('applied', 'under_review', 'shortlisted', 'rejected', 'selected', 'offer_sent', 'offer_accepted'), default='applied')
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    notes = db.Column(db.Text)
    ai_score = db.Column(db.Numeric(5, 2))
    resume_extracted_data = db.Column(db.Text)  # JSON data
    
    # Relationships
    round_results = db.relationship('RoundResult', backref='student_application', cascade='all, delete-orphan')
    offer_letters = db.relationship('OfferLetter', backref='application')
    
    def get_resume_extracted_data(self):
        return json.loads(self.resume_extracted_data) if self.resume_extracted_data else {}
    
    def set_resume_extracted_data(self, data):
        self.resume_extracted_data = json.dumps(data)
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'student': self.student.to_dict() if self.student else None,
            'drive_id': self.drive_id,
            'placement_drive': self.placement_drive.to_dict() if self.placement_drive else None,
            'application_status': self.application_status,
            'applied_at': self.applied_at.isoformat() if self.applied_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'notes': self.notes,
            'ai_score': float(self.ai_score) if self.ai_score else None,
            'resume_extracted_data': self.get_resume_extracted_data()
        }

class RoundResult(db.Model):
    __tablename__ = 'round_results'
    
    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('student_applications.id'), nullable=False)
    round_id = db.Column(db.Integer, db.ForeignKey('recruitment_rounds.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id'), nullable=False)
    status = db.Column(db.Enum('pending', 'passed', 'failed', 'absent'), default='pending')
    marks_obtained = db.Column(db.Numeric(5, 2))
    feedback = db.Column(db.Text)
    evaluated_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    evaluated_at = db.Column(db.DateTime)
    next_round_eligible = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    evaluator = db.relationship('User', foreign_keys=[evaluated_by])
    
    def to_dict(self):
        return {
            'id': self.id,
            'application_id': self.application_id,
            'round_id': self.round_id,
            'recruitment_round': self.recruitment_round.to_dict() if self.recruitment_round else None,
            'student_id': self.student_id,
            'status': self.status,
            'marks_obtained': float(self.marks_obtained) if self.marks_obtained else None,
            'feedback': self.feedback,
            'evaluated_by': self.evaluated_by,
            'evaluator': self.evaluator.to_dict() if self.evaluator else None,
            'evaluated_at': self.evaluated_at.isoformat() if self.evaluated_at else None,
            'next_round_eligible': self.next_round_eligible,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class OfferLetter(db.Model):
    __tablename__ = 'offer_letters'
    
    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('student_applications.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id'), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    offer_letter_file = db.Column(db.String(255))
    salary_package = db.Column(db.Numeric(10, 2), nullable=False)
    position_title = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date)
    offer_status = db.Column(db.Enum('sent', 'accepted', 'rejected', 'withdrawn'), default='sent')
    sent_date = db.Column(db.DateTime, default=datetime.utcnow)
    response_date = db.Column(db.DateTime)
    additional_terms = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'application_id': self.application_id,
            'student_id': self.student_id,
            'student': self.student.to_dict() if self.student else None,
            'company_id': self.company_id,
            'company': self.company.to_dict() if self.company else None,
            'offer_letter_file': self.offer_letter_file,
            'salary_package': float(self.salary_package),
            'position_title': self.position_title,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'offer_status': self.offer_status,
            'sent_date': self.sent_date.isoformat() if self.sent_date else None,
            'response_date': self.response_date.isoformat() if self.response_date else None,
            'additional_terms': self.additional_terms
        }

class EmailTemplate(db.Model):
    __tablename__ = 'email_templates'
    
    id = db.Column(db.Integer, primary_key=True)
    template_name = db.Column(db.String(100), unique=True, nullable=False)
    subject = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    template_type = db.Column(db.Enum('application_received', 'round_scheduled', 'result_announced', 'offer_sent', 'offer_accepted', 'rejection'), nullable=False)
    is_ai_generated = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'template_name': self.template_name,
            'subject': self.subject,
            'content': self.content,
            'template_type': self.template_type,
            'is_ai_generated': self.is_ai_generated,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class EmailLog(db.Model):
    __tablename__ = 'email_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    recipient_email = db.Column(db.String(255), nullable=False)
    subject = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    sent_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.Enum('sent', 'failed', 'bounced'), default='sent')
    template_id = db.Column(db.Integer, db.ForeignKey('email_templates.id'))
    recipient_user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    # Relationships
    template = db.relationship('EmailTemplate', foreign_keys=[template_id])
    recipient_user = db.relationship('User', foreign_keys=[recipient_user_id])
    
    def to_dict(self):
        return {
            'id': self.id,
            'recipient_email': self.recipient_email,
            'subject': self.subject,
            'content': self.content,
            'sent_at': self.sent_at.isoformat() if self.sent_at else None,
            'status': self.status,
            'template_id': self.template_id,
            'recipient_user_id': self.recipient_user_id
        }

class SystemSettings(db.Model):
    __tablename__ = 'system_settings'
    
    id = db.Column(db.Integer, primary_key=True)
    setting_key = db.Column(db.String(100), unique=True, nullable=False)
    setting_value = db.Column(db.Text)
    description = db.Column(db.Text)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'setting_key': self.setting_key,
            'setting_value': self.setting_value,
            'description': self.description,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
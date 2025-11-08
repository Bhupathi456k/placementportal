from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize database instance
db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('student', 'hod', 'tpo'), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    is_approved = db.Column(db.Boolean, default=True)  # Changed default to True for HOD and TPO
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
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
            'created_at': self.created_at.isoformat() if self.created_at else None
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
    hod = db.relationship('User', backref='department_hod')
    students = db.relationship('StudentProfile', backref='department')
    
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
            'created_at': self.created_at.isoformat() if self.created_at else None
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

    # Relationships
    user = db.relationship('User', backref='hod_profile')
    department = db.relationship('Department', backref='hod_profiles')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'employee_id': self.employee_id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'department_id': self.department_id,
            'phone': self.phone,
            'qualification': self.qualification,
            'experience_years': self.experience_years,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class EmailTemplate(db.Model):
    __tablename__ = 'email_templates'
    
    id = db.Column(db.Integer, primary_key=True)
    template_name = db.Column(db.String(100), unique=True, nullable=False)
    subject = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    template_type = db.Column(db.String(50), default='general')
    is_ai_generated = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
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
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class EmailLog(db.Model):
    __tablename__ = 'email_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    recipient_email = db.Column(db.String(255), nullable=False)
    recipient_user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    subject = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    template_id = db.Column(db.Integer, db.ForeignKey('email_templates.id'))
    status = db.Column(db.String(20), default='pending')  # pending, sent, failed
    sent_at = db.Column(db.DateTime, default=datetime.utcnow)
    error_message = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'recipient_email': self.recipient_email,
            'recipient_user_id': self.recipient_user_id,
            'subject': self.subject,
            'content': self.content,
            'template_id': self.template_id,
            'status': self.status,
            'sent_at': self.sent_at.isoformat() if self.sent_at else None,
            'error_message': self.error_message
        }

class Company(db.Model):
    __tablename__ = 'companies'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    industry = db.Column(db.String(100))
    website = db.Column(db.String(255))
    description = db.Column(db.Text)
    logo = db.Column(db.String(255))
    contact_person = db.Column(db.String(100))
    contact_email = db.Column(db.String(255))
    contact_phone = db.Column(db.String(20))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'industry': self.industry,
            'website': self.website,
            'description': self.description,
            'logo': self.logo,
            'contact_person': self.contact_person,
            'contact_email': self.contact_email,
            'contact_phone': self.contact_phone,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class PlacementDrive(db.Model):
    __tablename__ = 'placement_drives'

    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    job_role = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    requirements = db.Column(db.Text)
    min_cgpa = db.Column(db.Numeric(3, 2))
    max_backlogs = db.Column(db.Integer, default=0)
    required_skills = db.Column(db.Text)  # JSON array
    salary_package_min = db.Column(db.Numeric(10, 2))
    salary_package_max = db.Column(db.Numeric(10, 2))
    location = db.Column(db.String(200))
    drive_date = db.Column(db.Date)
    application_deadline = db.Column(db.Date)
    status = db.Column(db.String(20), default='draft')  # draft, active, closed
    total_vacancies = db.Column(db.Integer)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    company = db.relationship('Company', backref='drives')
    creator = db.relationship('User', backref='created_drives')
    
    def get_required_skills(self):
        return json.loads(self.required_skills) if self.required_skills else []
    
    def set_required_skills(self, skills):
        self.required_skills = json.dumps(skills)
    
    def to_dict(self):
        return {
            'id': self.id,
            'company_id': self.company_id,
            'title': self.title,
            'job_role': self.job_role,
            'description': self.description,
            'requirements': self.requirements,
            'min_cgpa': float(self.min_cgpa) if self.min_cgpa else None,
            'max_backlogs': self.max_backlogs,
            'required_skills': self.get_required_skills(),
            'salary_package_min': float(self.salary_package_min) if self.salary_package_min else None,
            'salary_package_max': float(self.salary_package_max) if self.salary_package_max else None,
            'location': self.location,
            'drive_date': self.drive_date.isoformat() if self.drive_date else None,
            'application_deadline': self.application_deadline.isoformat() if self.application_deadline else None,
            'status': self.status,
            'total_vacancies': self.total_vacancies,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class StudentApplication(db.Model):
    __tablename__ = 'student_applications'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id'), nullable=False)
    drive_id = db.Column(db.Integer, db.ForeignKey('placement_drives.id'), nullable=False)
    application_status = db.Column(db.String(20), default='applied')  # applied, under_review, interview_scheduled, interview_completed, offer_sent, accepted, rejected
    ai_score = db.Column(db.Numeric(5, 2))
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    student = db.relationship('StudentProfile', backref='applications')
    drive = db.relationship('PlacementDrive', backref='applications')
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'drive_id': self.drive_id,
            'application_status': self.application_status,
            'ai_score': float(self.ai_score) if self.ai_score else None,
            'applied_at': self.applied_at.isoformat() if self.applied_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class RoundResult(db.Model):
    __tablename__ = 'round_results'
    
    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('student_applications.id'), nullable=False)
    round_name = db.Column(db.String(100), nullable=False)
    round_type = db.Column(db.String(50))  # online_test, technical, hr, coding, etc.
    score = db.Column(db.Numeric(5, 2))
    max_score = db.Column(db.Numeric(5, 2))
    result = db.Column(db.String(20))  # pass, fail, pending
    feedback = db.Column(db.Text)
    conducted_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'application_id': self.application_id,
            'round_name': self.round_name,
            'round_type': self.round_type,
            'score': float(self.score) if self.score else None,
            'max_score': float(self.max_score) if self.max_score else None,
            'result': self.result,
            'feedback': self.feedback,
            'conducted_at': self.conducted_at.isoformat() if self.conducted_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class OfferLetter(db.Model):
    __tablename__ = 'offer_letters'
    
    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('student_applications.id'), nullable=False)
    offer_type = db.Column(db.String(50), default='full_time')  # full_time, internship, part_time
    position = db.Column(db.String(100), nullable=False)
    salary_package = db.Column(db.Numeric(10, 2))
    benefits = db.Column(db.Text)  # JSON array
    joining_date = db.Column(db.Date)
    location = db.Column(db.String(200))
    terms_conditions = db.Column(db.Text)
    offer_letter_file = db.Column(db.String(255))
    status = db.Column(db.String(20), default='pending')  # pending, sent, accepted, declined, expired
    sent_at = db.Column(db.DateTime)
    response_deadline = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def get_benefits(self):
        return json.loads(self.benefits) if self.benefits else []
    
    def set_benefits(self, benefits):
        self.benefits = json.dumps(benefits)
    
    def to_dict(self):
        return {
            'id': self.id,
            'application_id': self.application_id,
            'offer_type': self.offer_type,
            'position': self.position,
            'salary_package': float(self.salary_package) if self.salary_package else None,
            'benefits': self.get_benefits(),
            'joining_date': self.joining_date.isoformat() if self.joining_date else None,
            'location': self.location,
            'terms_conditions': self.terms_conditions,
            'offer_letter_file': self.offer_letter_file,
            'status': self.status,
            'sent_at': self.sent_at.isoformat() if self.sent_at else None,
            'response_deadline': self.response_deadline.isoformat() if self.response_deadline else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class RecruitmentRound(db.Model):
    __tablename__ = 'recruitment_rounds'
    
    id = db.Column(db.Integer, primary_key=True)
    drive_id = db.Column(db.Integer, db.ForeignKey('placement_drives.id'), nullable=False)
    round_name = db.Column(db.String(100), nullable=False)
    round_type = db.Column(db.String(50))  # online_test, technical, hr, coding, etc.
    description = db.Column(db.Text)
    scheduled_date = db.Column(db.DateTime)
    venue = db.Column(db.String(200))
    duration_minutes = db.Column(db.Integer)
    max_score = db.Column(db.Numeric(5, 2))
    passing_score = db.Column(db.Numeric(5, 2))
    instructions = db.Column(db.Text)
    is_mandatory = db.Column(db.Boolean, default=True)
    order = db.Column(db.Integer, default=1)  # Round order in the drive
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'drive_id': self.drive_id,
            'round_name': self.round_name,
            'round_type': self.round_type,
            'description': self.description,
            'scheduled_date': self.scheduled_date.isoformat() if self.scheduled_date else None,
            'venue': self.venue,
            'duration_minutes': self.duration_minutes,
            'max_score': float(self.max_score) if self.max_score else None,
            'passing_score': float(self.passing_score) if self.passing_score else None,
            'instructions': self.instructions,
            'is_mandatory': self.is_mandatory,
            'order': self.order,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
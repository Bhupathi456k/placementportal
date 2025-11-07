from flask import Flask
from flask_mail import Mail, Message
from models import User, EmailTemplate, EmailLog, db
import os

class EmailService:
    def __init__(self):
        self.mail = Mail()
    
    def init_app(self, app: Flask):
        """Initialize the email service with Flask app"""
        self.mail.init_app(app)
        self.app = app
    
    def send_email(self, recipient_email, subject, content, template_id=None, recipient_user_id=None):
        """Send email to a recipient"""
        try:
            # Log the email attempt
            email_log = EmailLog(
                recipient_email=recipient_email,
                subject=subject,
                content=content,
                template_id=template_id,
                recipient_user_id=recipient_user_id,
                status='sent'
            )
            db.session.add(email_log)
            
            # Create message
            msg = Message(
                subject=subject,
                recipients=[recipient_email],
                body=content
            )
            
            # Send email (in demo mode, we'll just log it)
            if self.app.config.get('MAIL_USERNAME') and self.app.config.get('MAIL_PASSWORD'):
                self.mail.send(msg)
            else:
                # Demo mode - just log the email
                print(f"Demo Email - To: {recipient_email}, Subject: {subject}")
                print(f"Content: {content}")
            
            db.session.commit()
            return True, "Email sent successfully"
            
        except Exception as e:
            # Log failed email
            if 'email_log' in locals():
                email_log.status = 'failed'
                db.session.commit()
            return False, f"Failed to send email: {str(e)}"
    
    def send_templated_email(self, recipient_email, template_name, variables, recipient_user_id=None):
        """Send email using a template"""
        try:
            # Get template
            template = EmailTemplate.query.filter_by(template_name=template_name).first()
            if not template:
                return False, "Template not found"
            
            # Replace variables in subject and content
            subject = template.subject
            content = template.content
            
            for key, value in variables.items():
                placeholder = f"{{{{{key}}}}}"
                subject = subject.replace(placeholder, str(value))
                content = content.replace(placeholder, str(value))
            
            # Send email
            return self.send_email(
                recipient_email=recipient_email,
                subject=subject,
                content=content,
                template_id=template.id,
                recipient_user_id=recipient_user_id
            )
            
        except Exception as e:
            return False, f"Failed to send templated email: {str(e)}"
    
    def send_welcome_email(self, user: User, first_name=""):
        """Send welcome email to new user"""
        variables = {
            'first_name': first_name or user.email.split('@')[0],
            'role': user.role.upper(),
            'email': user.email
        }
        
        if user.role == 'student':
            template_name = 'student_welcome'
            variables['status'] = 'pending_approval'
            variables['message'] = 'Your account is pending approval from your HOD.'
        else:
            template_name = 'user_welcome'
            variables['message'] = 'Your account has been created successfully.'
        
        return self.send_templated_email(user.email, template_name, variables, user.id)
    
    def send_application_confirmation(self, student_email, student_name, company_name, position, drive_title):
        """Send confirmation email when student applies to a drive"""
        variables = {
            'student_name': student_name,
            'company_name': company_name,
            'position': position,
            'drive_title': drive_title
        }
        
        return self.send_templated_email(student_email, 'application_received', variables)
    
    def send_round_scheduled_email(self, student_email, student_name, company_name, round_name, scheduled_date, venue):
        """Send email when a round is scheduled"""
        variables = {
            'student_name': student_name,
            'company_name': company_name,
            'round_name': round_name,
            'scheduled_date': scheduled_date,
            'venue': venue
        }
        
        return self.send_templated_email(student_email, 'round_scheduled', variables)
    
    def send_result_announcement_email(self, student_email, student_name, company_name, round_name, result, result_message=""):
        """Send email when round results are announced"""
        variables = {
            'student_name': student_name,
            'company_name': company_name,
            'round_name': round_name,
            'result': result,
            'result_message': result_message
        }
        
        return self.send_templated_email(student_email, 'result_announced', variables)
    
    def send_offer_letter_email(self, student_email, student_name, company_name, position, salary_package):
        """Send email when offer letter is sent"""
        variables = {
            'student_name': student_name,
            'company_name': company_name,
            'position': position,
            'salary_package': f"₹{salary_package:,.0f} per annum"
        }
        
        return self.send_templated_email(student_email, 'offer_sent', variables)
    
    def send_rejection_email(self, student_email, student_name, company_name, position, round_name=""):
        """Send rejection email to student"""
        variables = {
            'student_name': student_name,
            'company_name': company_name,
            'position': position,
            'round_name': round_name
        }
        
        return self.send_templated_email(student_email, 'rejection', variables)
    
    def send_bulk_emails(self, email_list, subject, content):
        """Send bulk emails to multiple recipients"""
        results = []
        
        for email_data in email_list:
            recipient_email = email_data['email']
            variables = email_data.get('variables', {})
            
            # Replace variables in subject and content
            final_subject = subject
            final_content = content
            
            for key, value in variables.items():
                placeholder = f"{{{{{key}}}}}"
                final_subject = final_subject.replace(placeholder, str(value))
                final_content = final_content.replace(placeholder, str(value))
            
            success, message = self.send_email(recipient_email, final_subject, final_content)
            results.append({
                'email': recipient_email,
                'success': success,
                'message': message
            })
        
        return results
    
    def get_email_templates(self):
        """Get all email templates"""
        try:
            templates = EmailTemplate.query.all()
            return [template.to_dict() for template in templates]
        except Exception as e:
            return []
    
    def create_email_template(self, template_name, subject, content, template_type, is_ai_generated=False):
        """Create a new email template"""
        try:
            template = EmailTemplate(
                template_name=template_name,
                subject=subject,
                content=content,
                template_type=template_type,
                is_ai_generated=is_ai_generated
            )
            
            db.session.add(template)
            db.session.commit()
            
            return template.to_dict()
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Failed to create template: {str(e)}")
    
    def update_email_template(self, template_id, subject=None, content=None):
        """Update an existing email template"""
        try:
            template = EmailTemplate.query.get(template_id)
            if not template:
                raise Exception("Template not found")
            
            if subject:
                template.subject = subject
            if content:
                template.content = content
            
            db.session.commit()
            
            return template.to_dict()
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Failed to update template: {str(e)}")
    
    def get_email_logs(self, limit=100):
        """Get recent email logs"""
        try:
            logs = EmailLog.query.order_by(EmailLog.sent_at.desc()).limit(limit).all()
            return [log.to_dict() for log in logs]
        except Exception as e:
            return []

# Create global email service instance
email_service = EmailService()
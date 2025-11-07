from flask import Flask
import os
import json
import re
from datetime import datetime
from typing import Dict, List, Any, Optional

# Try to import optional dependencies
try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    openai = None

try:
    import PyPDF2
    PYPDF2_AVAILABLE = True
except ImportError:
    PYPDF2_AVAILABLE = False
    PyPDF2 = None

try:
    from pdfminer.high_level import extract_text
    PDFMINER_AVAILABLE = True
except ImportError:
    PDFMINER_AVAILABLE = False
    extract_text = None

class AIService:
    def __init__(self):
        self.client = None
        self.app = None
    
    def init_app(self, app: Flask):
        """Initialize the AI service with Flask app"""
        self.app = app
        if OPENAI_AVAILABLE:
            api_key = app.config.get('OPENAI_API_KEY')
            if api_key:
                try:
                    self.client = openai.OpenAI(api_key=api_key)
                except Exception as e:
                    print(f"Failed to initialize OpenAI client: {e}")
                    self.client = None
        else:
            print("OpenAI not available - AI features will be disabled")
            self.client = None
    
    def is_enabled(self):
        """Check if AI service is enabled"""
        return self.client is not None
    
    def generate_email_template(self, template_type: str, context: Dict[str, Any]) -> Dict[str, str]:
        """Generate AI-powered email template"""
        if not self.is_enabled():
            return self._get_fallback_template(template_type, context)
        
        try:
            prompt = self._build_email_prompt(template_type, context)
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a professional email template generator for placement management. Create clear, professional, and engaging email templates."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            generated_content = response.choices[0].message.content
            
            # Parse the response to extract subject and content
            lines = generated_content.split('\n')
            subject = ""
            content = ""
            
            in_content = False
            for line in lines:
                if line.lower().startswith('subject:'):
                    subject = line.replace('subject:', '').strip()
                elif line.lower().startswith('content:') or line.lower().startswith('message:'):
                    in_content = True
                    content = line.split(':', 1)[1].strip() if ':' in line else ""
                elif in_content:
                    content += "\n" + line
            
            # Fallback if parsing fails
            if not subject:
                subject = self._get_default_subject(template_type)
            if not content:
                content = generated_content
            
            return {
                'subject': subject,
                'content': content,
                'is_ai_generated': True
            }
            
        except Exception as e:
            print(f"AI email generation failed: {str(e)}")
            return self._get_fallback_template(template_type, context)
    
    def _build_email_prompt(self, template_type: str, context: Dict[str, Any]) -> str:
        """Build prompt for email generation"""
        base_prompt = f"Create a professional email template for {template_type} in a placement management system."
        
        context_info = ""
        for key, value in context.items():
            context_info += f"\n{key}: {value}"
        
        return f"""
        {base_prompt}
        Context: {context_info}
        
        Please provide:
        1. A clear, engaging subject line
        2. Professional email content with proper formatting
        3. Use placeholders like {{student_name}}, {{company_name}}, {{position}} etc.
        4. Make it appropriate for academic placement context
        5. Keep it concise but informative
        
        Format the response as:
        Subject: [subject line]
        Content: [email content]
        """
    
    def _get_default_subject(self, template_type: str) -> str:
        """Get default subject based on template type"""
        subjects = {
            'application_received': 'Application Received - {company_name}',
            'round_scheduled': 'Interview Round Scheduled - {company_name}',
            'result_announced': 'Interview Results - {company_name}',
            'offer_sent': 'Job Offer - {company_name}',
            'offer_accepted': 'Offer Accepted - {company_name}',
            'rejection': 'Application Update - {company_name}'
        }
        return subjects.get(template_type, 'Placement Update')
    
    def _get_fallback_template(self, template_type: str, context: Dict[str, Any]) -> Dict[str, str]:
        """Get fallback template when AI is not available"""
        templates = {
            'application_received': {
                'subject': 'Application Received - {company_name}',
                'content': 'Dear {student_name},\n\nThank you for applying for the position of {position} at {company_name}.\n\nYour application has been received and is under review. We will contact you with further updates soon.\n\nBest regards,\nTPO Office'
            },
            'round_scheduled': {
                'subject': 'Interview Round Scheduled - {company_name}',
                'content': 'Dear {student_name},\n\nYou have been shortlisted for {round_name} at {company_name}.\n\nScheduled Date: {scheduled_date}\nVenue: {venue}\n\nPlease be prepared and arrive 15 minutes early.\n\nBest regards,\nTPO Office'
            },
            'result_announced': {
                'subject': 'Interview Results - {company_name}',
                'content': 'Dear {student_name},\n\nWe are pleased to inform you that you have {result} the {round_name} for {position} at {company_name}.\n\n{result_message}\n\nBest regards,\nTPO Office'
            },
            'offer_sent': {
                'subject': 'Job Offer - {company_name}',
                'content': 'Dear {student_name},\n\nCongratulations! We are delighted to offer you the position of {position} at {company_name}.\n\nPlease find the attached offer letter with detailed terms and conditions.\n\nLooking forward to working with you.\n\nBest regards,\n{company_name} HR Team'
            },
            'rejection': {
                'subject': 'Application Update - {company_name}',
                'content': 'Dear {student_name},\n\nThank you for your interest in the position of {position} at {company_name}.\n\nAfter careful consideration, we regret to inform you that you have not been selected for this round.\n\nWe appreciate your interest in our company and wish you all the best for your future endeavors.\n\nBest regards,\nTPO Office'
            }
        }
        
        template = templates.get(template_type, templates['application_received'])
        
        # Replace placeholders
        subject = template['subject']
        content = template['content']
        
        for key, value in context.items():
            placeholder = f"{{{{{key}}}}}"
            subject = subject.replace(placeholder, str(value))
            content = content.replace(placeholder, str(value))
        
        return {
            'subject': subject,
            'content': content,
            'is_ai_generated': False
        }
    
    def extract_resume_data(self, resume_file_path: str) -> Dict[str, Any]:
        """Extract structured data from resume using AI"""
        if not self.is_enabled():
            return self._extract_basic_resume_data(resume_file_path)
        
        try:
            # Extract text from resume
            resume_text = self._extract_text_from_file(resume_file_path)
            
            if not resume_text:
                return self._extract_basic_resume_data(resume_file_path)
            
            prompt = f"""
            Extract structured information from this resume text. Provide a JSON response with the following structure:
            {{
                "name": "Full Name",
                "email": "Email Address",
                "phone": "Phone Number",
                "skills": ["skill1", "skill2", ...],
                "education": [
                    {{
                        "degree": "Degree Name",
                        "institution": "Institution Name",
                        "year": "Year",
                        "cgpa": "CGPA/Percentage"
                    }}
                ],
                "experience": [
                    {{
                        "company": "Company Name",
                        "position": "Position",
                        "duration": "Duration",
                        "description": "Brief description"
                    }}
                ],
                "projects": [
                    {{
                        "title": "Project Title",
                        "description": "Project Description",
                        "technologies": ["tech1", "tech2"]
                    }}
                ],
                "summary": "Brief professional summary"
            }}
            
            Resume Text:
            {resume_text[:3000]}  # Limit to avoid token limits
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert resume parser. Extract structured information from resumes and return valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1500,
                temperature=0.3
            )
            
            extracted_data = response.choices[0].message.content
            
            # Parse JSON response
            try:
                data = json.loads(extracted_data)
                return {
                    'success': True,
                    'data': data,
                    'raw_text': resume_text
                }
            except json.JSONDecodeError:
                return self._extract_basic_resume_data(resume_file_path)
            
        except Exception as e:
            print(f"AI resume extraction failed: {str(e)}")
            return self._extract_basic_resume_data(resume_file_path)
    
    def _extract_text_from_file(self, file_path: str) -> str:
        """Extract text from various file formats"""
        try:
            if file_path.lower().endswith('.pdf'):
                if PYPDF2_AVAILABLE:
                    # Extract text from PDF using PyPDF2
                    text = ""
                    with open(file_path, 'rb') as file:
                        pdf_reader = PyPDF2.PdfReader(file)
                        for page in pdf_reader.pages:
                            text += page.extract_text() + "\n"
                    return text
                else:
                    print("PyPDF2 not available - cannot extract PDF text")
                    return ""
            elif file_path.lower().endswith(('.txt', '.doc', '.docx')):
                # For simplicity, handle text files
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
                    return file.read()
            else:
                return ""
        except Exception as e:
            print(f"Error extracting text from {file_path}: {str(e)}")
            return ""
    
    def _extract_basic_resume_data(self, resume_file_path: str) -> Dict[str, Any]:
        """Basic resume data extraction without AI"""
        try:
            text = self._extract_text_from_file(resume_file_path)
            
            # Basic pattern matching for common fields
            email_match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
            phone_match = re.search(r'\b\d{10,15}\b', text)
            
            # Extract skills (simple keyword matching)
            skill_keywords = ['python', 'java', 'javascript', 'react', 'node.js', 'mysql', 'html', 'css', 
                            'machine learning', 'data science', 'web development', 'android', 'ios']
            found_skills = [skill for skill in skill_keywords if skill.lower() in text.lower()]
            
            return {
                'success': True,
                'data': {
                    'email': email_match.group() if email_match else '',
                    'phone': phone_match.group() if phone_match else '',
                    'skills': found_skills,
                    'education': [],
                    'experience': [],
                    'projects': [],
                    'summary': ''
                },
                'raw_text': text,
                'extraction_method': 'basic'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'data': {}
            }
    
    def calculate_job_fit_score(self, student_skills: List[str], job_requirements: List[str], student_cgpa: float, min_cgpa: float) -> Dict[str, Any]:
        """Calculate AI-powered job fit score"""
        if not self.is_enabled():
            return self._calculate_basic_fit_score(student_skills, job_requirements, student_cgpa, min_cgpa)
        
        try:
            prompt = f"""
            Calculate a job fit score (0-100) for a student based on:
            Student Skills: {', '.join(student_skills)}
            Job Requirements: {', '.join(job_requirements)}
            Student CGPA: {student_cgpa}
            Minimum Required CGPA: {min_cgpa}
            
            Consider:
            1. Skill match percentage (60% weight)
            2. CGPA eligibility (25% weight) 
            3. Additional factors like skill relevance and depth (15% weight)
            
            Provide a JSON response:
            {{
                "total_score": 85,
                "skill_match_score": 80,
                "cgpa_score": 90,
                "additional_factors_score": 85,
                "recommendation": "Strong match - recommended for interview",
                "missing_skills": ["skill1", "skill2"],
                "matched_skills": ["skill1", "skill2", "skill3"],
                "reasoning": "Brief explanation of the scoring"
            }}
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert recruitment consultant. Calculate precise job fit scores and provide detailed analysis."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=800,
                temperature=0.3
            )
            
            response_text = response.choices[0].message.content
            
            try:
                score_data = json.loads(response_text)
                return {
                    'success': True,
                    'ai_score': score_data,
                    'is_ai_generated': True
                }
            except json.JSONDecodeError:
                return self._calculate_basic_fit_score(student_skills, job_requirements, student_cgpa, min_cgpa)
            
        except Exception as e:
            print(f"AI job fit calculation failed: {str(e)}")
            return self._calculate_basic_fit_score(student_skills, job_requirements, student_cgpa, min_cgpa)
    
    def _calculate_basic_fit_score(self, student_skills: List[str], job_requirements: List[str], student_cgpa: float, min_cgpa: float) -> Dict[str, Any]:
        """Calculate basic job fit score without AI"""
        try:
            # Skill matching
            student_skills_lower = [s.lower() for s in student_skills]
            job_requirements_lower = [j.lower() for j in job_requirements]
            
            matched_skills = [skill for skill in job_requirements_lower if skill in student_skills_lower]
            skill_match_score = (len(matched_skills) / len(job_requirements)) * 100 if job_requirements else 0
            
            # CGPA scoring
            cgpa_score = 100 if student_cgpa >= min_cgpa else (student_cgpa / min_cgpa) * 100
            
            # Total score
            total_score = (skill_match_score * 0.6) + (cgpa_score * 0.4)
            
            missing_skills = [req for req in job_requirements if req.lower() not in student_skills_lower]
            
            recommendation = "Recommended" if total_score >= 70 else "Not Recommended" if total_score < 50 else "Consider"
            
            return {
                'success': True,
                'ai_score': {
                    'total_score': round(total_score, 2),
                    'skill_match_score': round(skill_match_score, 2),
                    'cgpa_score': round(cgpa_score, 2),
                    'additional_factors_score': 0,
                    'recommendation': recommendation,
                    'missing_skills': missing_skills,
                    'matched_skills': matched_skills,
                    'reasoning': f"Based on {len(matched_skills)}/{len(job_requirements)} skill matches and CGPA eligibility"
                },
                'is_ai_generated': False
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def generate_resume_suggestions(self, current_skills: List[str], target_role: str) -> Dict[str, Any]:
        """Generate AI-powered resume suggestions"""
        if not self.is_enabled():
            return {
                'success': True,
                'suggestions': {
                    'suggested_skills': ['communication', 'leadership', 'problem solving'],
                    'improvement_areas': ['Add more technical projects', 'Include certifications'],
                    'formatting_tips': 'Use bullet points for achievements',
                    'content_suggestions': 'Quantify your achievements with numbers'
                }
            }
        
        try:
            prompt = f"""
            Provide resume improvement suggestions for a student targeting the role: {target_role}
            Current skills: {', '.join(current_skills)}
            
            Provide JSON response:
            {{
                "suggested_skills": ["skill1", "skill2"],
                "improvement_areas": ["area1", "area2"],
                "formatting_tips": "Professional formatting advice",
                "content_suggestions": "Content improvement suggestions",
                "project_suggestions": ["project1", "project2"],
                "certification_suggestions": ["cert1", "cert2"]
            }}
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a career counselor and resume expert. Provide actionable advice for resume improvement."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=600,
                temperature=0.7
            )
            
            suggestions_text = response.choices[0].message.content
            
            try:
                suggestions = json.loads(suggestions_text)
                return {
                    'success': True,
                    'suggestions': suggestions
                }
            except json.JSONDecodeError:
                return {
                    'success': True,
                    'suggestions': {
                        'suggested_skills': ['communication', 'leadership'],
                        'improvement_areas': ['Add more projects'],
                        'formatting_tips': 'Use bullet points',
                        'content_suggestions': 'Quantify achievements'
                    }
                }
            
        except Exception as e:
            print(f"AI resume suggestions failed: {str(e)}")
            return {
                'success': True,
                'suggestions': {
                    'suggested_skills': ['communication', 'leadership'],
                    'improvement_areas': ['Add more projects'],
                    'formatting_tips': 'Use bullet points',
                    'content_suggestions': 'Quantify achievements'
                }
            }

# Create global AI service instance
ai_service = AIService()
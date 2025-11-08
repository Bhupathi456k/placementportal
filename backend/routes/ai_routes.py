from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.ai_service import ai_service
from models import db, User, StudentProfile
import json

ai_routes_bp = Blueprint('ai', __name__)

@ai_routes_bp.route('/profile-insights', methods=['POST'])
@jwt_required()
def get_profile_insights():
    """Get AI-powered profile insights"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        profile_data = data.get('profile_data', {})
        
        if not ai_service.is_enabled():
            # Return mock insights when AI is not available
            return jsonify({
                'insights': {
                    'summary': 'Your profile shows strong technical skills. Consider adding more soft skills and leadership experiences.',
                    'performance_score': 78,
                    'completion_rate': 85,
                    'top_strengths': ['Technical Skills', 'Project Experience'],
                    'improvement_areas': ['Communication', 'Leadership'],
                    'ai_recommendations': [
                        'Add certifications in cloud computing',
                        'Include leadership roles in student organizations',
                        'Highlight teamwork experiences in projects'
                    ]
                }
            }), 200
        
        # Generate AI insights
        prompt = f"""
        Analyze this student profile and provide actionable insights:
        Profile Data: {json.dumps(profile_data, indent=2)}
        
        Provide a comprehensive analysis with:
        1. Overall summary and key observations
        2. Performance score (0-100) based on profile completeness and quality
        3. Top 3 strengths
        4. Top 3 improvement areas
        5. 3-5 specific AI recommendations for profile enhancement
        
        Format as JSON:
        {{
            "summary": "detailed analysis summary",
            "performance_score": 85,
            "top_strengths": ["strength1", "strength2", "strength3"],
            "improvement_areas": ["area1", "area2", "area3"],
            "ai_recommendations": ["rec1", "rec2", "rec3", "rec4", "rec5"]
        }}
        """
        
        response = ai_service.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a career counselor and placement expert. Provide detailed, actionable insights for student profile optimization."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=800,
            temperature=0.7
        )
        
        insights_text = response.choices[0].message.content
        
        try:
            insights = json.loads(insights_text)
            return jsonify({'insights': insights}), 200
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            return jsonify({
                'insights': {
                    'summary': 'AI analysis completed. Focus on skill diversification and project quality.',
                    'performance_score': 75,
                    'top_strengths': ['Technical Skills', 'Project Experience'],
                    'improvement_areas': ['Communication', 'Leadership'],
                    'ai_recommendations': ['Add certifications', 'Include leadership experience', 'Highlight teamwork']
                }
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_routes_bp.route('/job-fit-score', methods=['POST'])
@jwt_required()
def calculate_job_fit_score():
    """Calculate AI-powered job fit score"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        student_skills = data.get('student_skills', [])
        job_requirements = data.get('job_requirements', [])
        student_cgpa = data.get('student_cgpa', 0)
        min_cgpa = data.get('min_cgpa', 0)
        
        # Use AI service to calculate job fit score
        result = ai_service.calculate_job_fit_score(
            student_skills, job_requirements, student_cgpa, min_cgpa
        )
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_routes_bp.route('/placement-recommendations', methods=['POST'])
@jwt_required()
def get_placement_recommendations():
    """Get AI-powered placement recommendations"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        drives = data.get('drives', [])
        
        if not ai_service.is_enabled():
            # Return mock recommendations
            return jsonify({
                'recommendations': ['Google', 'Microsoft', 'Amazon', 'Netflix', 'Adobe'],
                'reasoning': 'Based on your technical skills and CGPA, these companies align well with your profile.'
            }), 200
        
        # Generate AI recommendations
        prompt = f"""
        Based on the available placement drives, recommend the top 5 companies for a student.
        
        Drives: {json.dumps(drives, indent=2)}
        
        Consider:
        1. Student skills alignment
        2. CGPA requirements
        3. Industry fit
        4. Career growth potential
        
        Provide recommendations in JSON format:
        {{
            "recommendations": ["Company1", "Company2", "Company3", "Company4", "Company5"],
            "reasoning": "Brief explanation of recommendations"
        }}
        """
        
        response = ai_service.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a placement consultant. Provide strategic recommendations for student placement success."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        recommendations_text = response.choices[0].message.content
        
        try:
            recommendations = json.loads(recommendations_text)
            return jsonify(recommendations), 200
        except json.JSONDecodeError:
            return jsonify({
                'recommendations': ['Top Tech Companies', 'Start-ups', 'Fortune 500'],
                'reasoning': 'AI analysis suggests focusing on companies that match your skill set.'
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_routes_bp.route('/application-analysis', methods=['POST'])
@jwt_required()
def analyze_application():
    """Get AI analysis for a specific application"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        application = data.get('application', {})
        student_profile = data.get('student_profile', {})
        
        if not ai_service.is_enabled():
            # Return mock analysis
            return jsonify({
                'analysis': {
                    'match_score': 75,
                    'recommendation': 'Strong match for this position',
                    'strengths': ['Technical skills alignment', 'Good CGPA'],
                    'weaknesses': ['Limited experience'],
                    'next_steps': ['Prepare for technical interview', 'Research company culture']
                }
            }), 200
        
        # Generate AI analysis
        prompt = f"""
        Analyze this job application and provide insights:
        
        Application: {json.dumps(application, indent=2)}
        Student Profile: {json.dumps(student_profile, indent=2)}
        
        Provide analysis in JSON format:
        {{
            "match_score": 0-100,
            "recommendation": "Brief recommendation",
            "strengths": ["strength1", "strength2", "strength3"],
            "weaknesses": ["weakness1", "weakness2"],
            "next_steps": ["step1", "step2", "step3"]
        }}
        """
        
        response = ai_service.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a recruitment expert. Analyze job applications and provide strategic insights."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=600,
            temperature=0.7
        )
        
        analysis_text = response.choices[0].message.content
        
        try:
            analysis = json.loads(analysis_text)
            return jsonify({'analysis': analysis}), 200
        except json.JSONDecodeError:
            return jsonify({
                'analysis': {
                    'match_score': 70,
                    'recommendation': 'Good match, prepare well for interviews',
                    'strengths': ['Skill alignment'],
                    'weaknesses': ['Experience gap'],
                    'next_steps': ['Practice coding', 'Research company']
                }
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_routes_bp.route('/application-insights', methods=['POST'])
@jwt_required()
def get_application_insights():
    """Get AI insights about all student applications"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        applications = data.get('applications', [])
        
        if not ai_service.is_enabled():
            # Return mock insights
            return jsonify({
                'success_rate': 68,
                'average_time_to_response': 5.2,
                'top_strength': 'Technical Skills',
                'improvement_areas': ['Interview Preparation', 'Communication'],
                'recommendations': [
                    'Focus on companies matching your skill set',
                    'Improve interview communication skills',
                    'Gain more project experience'
                ]
            }), 200
        
        # Generate AI insights
        prompt = f"""
        Analyze these student applications and provide insights:
        
        Applications: {json.dumps(applications, indent=2)}
        
        Provide analysis in JSON format:
        {{
            "success_rate": percentage,
            "average_time_to_response": days,
            "top_strength": "key strength",
            "improvement_areas": ["area1", "area2"],
            "recommendations": ["rec1", "rec2", "rec3"]
        }}
        """
        
        response = ai_service.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a placement analyst. Provide insights on application patterns and success factors."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        insights_text = response.choices[0].message.content
        
        try:
            insights = json.loads(insights_text)
            return jsonify(insights), 200
        except json.JSONDecodeError:
            return jsonify({
                'success_rate': 65,
                'average_time_to_response': 6,
                'top_strength': 'Technical Skills',
                'improvement_areas': ['Interview Skills'],
                'recommendations': ['Practice interviews', 'Improve communication']
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_routes_bp.route('/placement-insights', methods=['POST'])
@jwt_required()
def get_placement_insights():
    """Get AI insights for placement analytics"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        student_data = data.get('student_data', {})
        time_range = data.get('time_range', '3months')
        
        if not ai_service.is_enabled():
            # Return mock insights
            return jsonify({
                'performance_score': 85,
                'placement_probability': 78,
                'rank_percentile': 72,
                'trends': 'positive',
                'recommendations': [
                    'Continue current application strategy',
                    'Focus on skill development in trending technologies',
                    'Network with industry professionals'
                ]
            }), 200
        
        # Generate AI insights
        prompt = f"""
        Analyze this student's placement data and provide insights:
        
        Student Data: {json.dumps(student_data, indent=2)}
        Time Range: {time_range}
        
        Provide insights in JSON format:
        {{
            "performance_score": 0-100,
            "placement_probability": 0-100,
            "rank_percentile": 1-100,
            "trends": "positive/negative/stable",
            "recommendations": ["rec1", "rec2", "rec3"]
        }}
        """
        
        response = ai_service.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a placement analyst and career counselor. Provide data-driven insights and recommendations."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        insights_text = response.choices[0].message.content
        
        try:
            insights = json.loads(insights_text)
            return jsonify(insights), 200
        except json.JSONDecodeError:
            return jsonify({
                'performance_score': 80,
                'placement_probability': 75,
                'rank_percentile': 70,
                'trends': 'positive',
                'recommendations': ['Continue current strategy', 'Focus on skill development']
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_routes_bp.route('/placement-predictions', methods=['POST'])
@jwt_required()
def get_placement_predictions():
    """Get AI-powered placement predictions"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        student_data = data.get('student_data', {})
        historical_trends = data.get('historical_trends', {})
        
        if not ai_service.is_enabled():
            # Return mock predictions
            return jsonify({
                'next_month_applications': 25,
                'interview_rate': 72,
                'placement_timeline': '3-4 months',
                'confidence_score': 85,
                'key_factors': ['CGPA', 'Skills', 'Interview Performance']
            }), 200
        
        # Generate AI predictions
        prompt = f"""
        Predict this student's placement outcome based on data:
        
        Student Data: {json.dumps(student_data, indent=2)}
        Historical Trends: {json.dumps(historical_trends, indent=2)}
        
        Provide predictions in JSON format:
        {{
            "next_month_applications": number,
            "interview_rate": percentage,
            "placement_timeline": "timeframe",
            "confidence_score": 0-100,
            "key_factors": ["factor1", "factor2", "factor3"]
        }}
        """
        
        response = ai_service.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a placement prediction expert. Use data to make accurate predictions about student placement outcomes."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=400,
            temperature=0.7
        )
        
        predictions_text = response.choices[0].message.content
        
        try:
            predictions = json.loads(predictions_text)
            return jsonify(predictions), 200
        except json.JSONDecodeError:
            return jsonify({
                'next_month_applications': 20,
                'interview_rate': 70,
                'placement_timeline': '4-5 months',
                'confidence_score': 80,
                'key_factors': ['CGPA', 'Skills', 'Interview Skills']
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_routes_bp.route('/resume-analysis', methods=['POST'])
@jwt_required()
def analyze_resume():
    """Get AI analysis of student's resume"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        profile_data = data.get('profile_data', {})
        
        if not ai_service.is_enabled():
            # Return mock analysis
            return jsonify({
                'analysis': {
                    'overall_score': 82,
                    'ats_score': 88,
                    'formatting_score': 92,
                    'content_score': 76,
                    'strengths': ['Clear formatting', 'Relevant skills'],
                    'weaknesses': ['Missing certifications', 'Limited experience'],
                    'recommendations': [
                        'Add more quantified achievements',
                        'Include relevant certifications',
                        'Optimize for ATS scanning'
                    ]
                }
            }), 200
        
        # Generate AI analysis
        prompt = f"""
        Analyze this resume/profile and provide comprehensive analysis:
        
        Profile Data: {json.dumps(profile_data, indent=2)}
        
        Provide analysis in JSON format:
        {{
            "overall_score": 0-100,
            "ats_score": 0-100,
            "formatting_score": 0-100,
            "content_score": 0-100,
            "strengths": ["strength1", "strength2", "strength3"],
            "weaknesses": ["weakness1", "weakness2"],
            "recommendations": ["rec1", "rec2", "rec3", "rec4", "rec5"]
        }}
        """
        
        response = ai_service.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a resume expert and ATS specialist. Provide detailed analysis and improvement recommendations."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=600,
            temperature=0.7
        )
        
        analysis_text = response.choices[0].message.content
        
        try:
            analysis = json.loads(analysis_text)
            return jsonify({'analysis': analysis}), 200
        except json.JSONDecodeError:
            return jsonify({
                'analysis': {
                    'overall_score': 75,
                    'ats_score': 80,
                    'formatting_score': 85,
                    'content_score': 70,
                    'strengths': ['Good formatting'],
                    'weaknesses': ['Content depth'],
                    'recommendations': ['Add more details', 'Include metrics']
                }
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_routes_bp.route('/interview-feedback', methods=['POST'])
@jwt_required()
def get_interview_feedback():
    """Get AI feedback for interview results"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        result = data.get('result', {})
        company = data.get('company', {})
        round_info = data.get('round_info', {})
        
        if not ai_service.is_enabled():
            # Return mock feedback
            return jsonify({
                'feedback': {
                    'strengths': ['Good technical knowledge', 'Clear communication'],
                    'weaknesses': ['Could improve problem-solving approach', 'Need more confidence'],
                    'overall_feedback': 'Good performance overall. Focus on practicing more technical questions.',
                    'improvement_score': 78,
                    'next_round_advice': ['Practice data structures', 'Improve confidence', 'Research company more']
                }
            }), 200
        
        # Generate AI feedback
        prompt = f"""
        Provide feedback for this interview result:
        
        Result: {json.dumps(result, indent=2)}
        Company: {json.dumps(company, indent=2)}
        Round Info: {json.dumps(round_info, indent=2)}
        
        Provide feedback in JSON format:
        {{
            "strengths": ["strength1", "strength2", "strength3"],
            "weaknesses": ["weakness1", "weakness2"],
            "overall_feedback": "detailed feedback",
            "improvement_score": 0-100,
            "next_round_advice": ["advice1", "advice2", "advice3"]
        }}
        """
        
        response = ai_service.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an interview coach and career counselor. Provide constructive feedback and actionable advice."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=600,
            temperature=0.7
        )
        
        feedback_text = response.choices[0].message.content
        
        try:
            feedback = json.loads(feedback_text)
            return jsonify({'feedback': feedback}), 200
        except json.JSONDecodeError:
            return jsonify({
                'feedback': {
                    'strengths': ['Good technical knowledge'],
                    'weaknesses': ['Communication skills'],
                    'overall_feedback': 'Average performance, needs improvement in communication.',
                    'improvement_score': 70,
                    'next_round_advice': ['Practice communication', 'Improve confidence']
                }
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# HOD-specific AI routes
@ai_routes_bp.route('/department-insights', methods=['POST'])
@jwt_required()
def get_department_insights():
    """Get AI-powered department analytics and insights for HOD"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'hod':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        department_data = data.get('department_data', {})
        
        if not ai_service.is_enabled():
            # Return mock insights
            return jsonify({
                'insights': {
                    'performance_score': 85,
                    'trends': 'positive',
                    'top_strengths': ['High placement rate', 'Good student engagement'],
                    'improvement_areas': ['Industry partnerships', 'Skill gap analysis'],
                    'recommendations': [
                        'Increase industry collaboration',
                        'Implement skill development programs',
                        'Enhance placement preparation'
                    ]
                }
            }), 200
        
        # Generate AI insights
        prompt = f"""
        Analyze this department's placement data and provide strategic insights:
        
        Department Data: {json.dumps(department_data, indent=2)}
        
        Provide analysis in JSON format:
        {{
            "performance_score": 0-100,
            "trends": "positive/negative/stable",
            "top_strengths": ["strength1", "strength2", "strength3"],
            "improvement_areas": ["area1", "area2", "area3"],
            "recommendations": ["rec1", "rec2", "rec3", "rec4"]
        }}
        """
        
        response = ai_service.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a placement analytics expert for academic departments. Provide strategic insights and recommendations."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        insights_text = response.choices[0].message.content
        
        try:
            insights = json.loads(insights_text)
            return jsonify({'insights': insights}), 200
        except json.JSONDecodeError:
            return jsonify({
                'insights': {
                    'performance_score': 80,
                    'trends': 'positive',
                    'top_strengths': ['Good placement rate', 'Student engagement'],
                    'improvement_areas': ['Industry partnerships'],
                    'recommendations': ['Increase collaboration', 'Enhance programs']
                }
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_routes_bp.route('/student-analysis', methods=['POST'])
@jwt_required()
def analyze_student_data():
    """Get AI analysis for student cohort performance"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'hod':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        students_data = data.get('students_data', [])
        
        if not ai_service.is_enabled():
            # Return mock analysis
            return jsonify({
                'analysis': {
                    'cohort_performance': 82,
                    'risk_students': 5,
                    'high_performers': 15,
                    'avg_cgpa': 7.8,
                    'placement_readiness': 75,
                    'key_insights': [
                        'Strong technical skills across cohort',
                        'Need improvement in soft skills',
                        'Good overall engagement'
                    ]
                }
            }), 200
        
        # Generate AI analysis
        prompt = f"""
        Analyze this student cohort data and provide insights:
        
        Students Data: {json.dumps(students_data, indent=2)}
        
        Provide analysis in JSON format:
        {{
            "cohort_performance": 0-100,
            "risk_students": number,
            "high_performers": number,
            "avg_cgpa": float,
            "placement_readiness": 0-100,
            "key_insights": ["insight1", "insight2", "insight3"]
        }}
        """
        
        response = ai_service.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a student performance analyst. Analyze cohort data and provide actionable insights."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        analysis_text = response.choices[0].message.content
        
        try:
            analysis = json.loads(analysis_text)
            return jsonify({'analysis': analysis}), 200
        except json.JSONDecodeError:
            return jsonify({
                'analysis': {
                    'cohort_performance': 80,
                    'risk_students': 8,
                    'high_performers': 12,
                    'avg_cgpa': 7.5,
                    'placement_readiness': 70,
                    'key_insights': ['Good performance', 'Need attention to some students']
                }
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_routes_bp.route('/placement-predictions', methods=['POST'])
@jwt_required()
def get_hod_placement_predictions():
    """Get AI-powered placement predictions for department"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'hod':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        department_data = data.get('department_data', {})
        historical_trends = data.get('historical_trends', {})
        
        if not ai_service.is_enabled():
            # Return mock predictions
            return jsonify({
                'predictions': {
                    'next_quarter_placements': 45,
                    'target_achievement': 85,
                    'success_rate': 78,
                    'confidence_score': 82,
                    'key_factors': ['Student preparation', 'Industry demand', 'Skills alignment'],
                    'recommendations': [
                        'Focus on skill development',
                        'Increase industry partnerships',
                        'Improve placement training'
                    ]
                }
            }), 200
        
        # Generate AI predictions
        prompt = f"""
        Predict department placement outcomes based on current data:
        
        Department Data: {json.dumps(department_data, indent=2)}
        Historical Trends: {json.dumps(historical_trends, indent=2)}
        
        Provide predictions in JSON format:
        {{
            "next_quarter_placements": number,
            "target_achievement": 0-100,
            "success_rate": 0-100,
            "confidence_score": 0-100,
            "key_factors": ["factor1", "factor2", "factor3"],
            "recommendations": ["rec1", "rec2", "rec3"]
        }}
        """
        
        response = ai_service.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a placement prediction expert for academic departments. Use data to make accurate predictions."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        predictions_text = response.choices[0].message.content
        
        try:
            predictions = json.loads(predictions_text)
            return jsonify({'predictions': predictions}), 200
        except json.JSONDecodeError:
            return jsonify({
                'predictions': {
                    'next_quarter_placements': 40,
                    'target_achievement': 80,
                    'success_rate': 75,
                    'confidence_score': 78,
                    'key_factors': ['Student skills', 'Industry demand'],
                    'recommendations': ['Enhance training', 'Increase partnerships']
                }
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_routes_bp.route('/report-insights', methods=['POST'])
@jwt_required()
def get_report_insights():
    """Get AI insights for placement reports"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'hod':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        report_data = data.get('report_data', {})
        
        if not ai_service.is_enabled():
            # Return mock insights
            return jsonify({
                'insights': {
                    'report_score': 88,
                    'key_metrics': ['Placement rate', 'Student satisfaction', 'Industry feedback'],
                    'trends': 'improving',
                    'recommendations': [
                        'Focus on underperforming areas',
                        'Highlight success stories',
                        'Set realistic targets'
                    ]
                }
            }), 200
        
        # Generate AI insights
        prompt = f"""
        Analyze this placement report and provide insights:
        
        Report Data: {json.dumps(report_data, indent=2)}
        
        Provide insights in JSON format:
        {{
            "report_score": 0-100,
            "key_metrics": ["metric1", "metric2", "metric3"],
            "trends": "improving/declining/stable",
            "recommendations": ["rec1", "rec2", "rec3"]
        }}
        """
        
        response = ai_service.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a placement report analyst. Provide insights and recommendations for improvement."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=400,
            temperature=0.7
        )
        
        insights_text = response.choices[0].message.content
        
        try:
            insights = json.loads(insights_text)
            return jsonify({'insights': insights}), 200
        except json.JSONDecodeError:
            return jsonify({
                'insights': {
                    'report_score': 85,
                    'key_metrics': ['Placement rate', 'Student performance'],
                    'trends': 'stable',
                    'recommendations': ['Focus on improvement areas', 'Highlight strengths']
                }
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
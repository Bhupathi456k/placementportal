from flask import Flask
import os
from datetime import datetime, timedelta
import json
from typing import Dict, List, Any, Optional
import io
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import xlsxwriter
from collections import defaultdict

class ReportService:
    def __init__(self):
        self.app = None
    
    def init_app(self, app: Flask):
        """Initialize the report service with Flask app"""
        self.app = app
    
    def generate_department_analytics(self, department_id: int, start_date: str = None, end_date: str = None) -> Dict[str, Any]:
        """Generate analytics for a specific department"""
        try:
            from models import StudentProfile, StudentApplication, PlacementDrive, Company, db
            
            # Default date range (last 6 months)
            if not end_date:
                end_date = datetime.utcnow()
            if not start_date:
                start_date = end_date - timedelta(days=180)
            
            # Get all students in department
            students = StudentProfile.query.filter_by(department_id=department_id, is_active=True).all()
            
            # Get all applications from these students
            student_ids = [s.id for s in students]
            applications = StudentApplication.query.filter(
                StudentApplication.student_id.in_(student_ids)
            ).filter(
                StudentApplication.applied_at >= start_date,
                StudentApplication.applied_at <= end_date
            ).all()
            
            # Analytics calculations
            total_students = len(students)
            total_applications = len(applications)
            active_applications = len([a for a in applications if a.application_status in ['applied', 'under_review', 'shortlisted']])
            successful_placements = len([a for a in applications if a.application_status in ['selected', 'offer_accepted']])
            companies_visited = len(set([a.placement_drive.company_id for a in applications if a.placement_drive]))
            
            # Application status distribution
            status_distribution = defaultdict(int)
            for app in applications:
                status_distribution[app.application_status] += 1
            
            # Placement success rate
            success_rate = (successful_placements / total_applications * 100) if total_applications > 0 else 0
            
            # Average CGPA of students with successful placements
            successful_students = [a.student for a in applications if a.application_status in ['selected', 'offer_accepted']]
            avg_cgpa = sum(s.cgpa for s in successful_students if s.cgpa) / len(successful_students) if successful_students else 0
            
            return {
                'department_id': department_id,
                'report_period': {
                    'start_date': start_date.isoformat() if start_date else None,
                    'end_date': end_date.isoformat() if end_date else None
                },
                'summary': {
                    'total_students': total_students,
                    'total_applications': total_applications,
                    'active_applications': active_applications,
                    'successful_placements': successful_placements,
                    'companies_visited': companies_visited,
                    'success_rate': round(success_rate, 2),
                    'average_cgpa': round(float(avg_cgpa), 2)
                },
                'status_distribution': dict(status_distribution),
                'trend_data': self._generate_trend_data(applications, start_date, end_date),
                'top_companies': self._get_top_companies(applications),
                'generated_at': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            return {'error': str(e), 'success': False}
    
    def _generate_trend_data(self, applications: List, start_date: datetime, end_date: datetime) -> List[Dict]:
        """Generate monthly trend data for applications"""
        from models import StudentApplication
        from datetime import datetime, timedelta
        
        trends = []
        current_date = start_date.replace(day=1)  # Start of month
        
        while current_date <= end_date:
            month_end = (current_date + timedelta(days=32)).replace(day=1) - timedelta(days=1)
            
            month_applications = [
                a for a in applications 
                if current_date <= a.applied_at <= month_end
            ]
            
            successful_this_month = len([
                a for a in month_applications 
                if a.application_status in ['selected', 'offer_accepted']
            ])
            
            trends.append({
                'month': current_date.strftime('%Y-%m'),
                'applications': len(month_applications),
                'successful_placements': successful_this_month,
                'success_rate': (successful_this_month / len(month_applications) * 100) if month_applications else 0
            })
            
            # Move to next month
            if current_date.month == 12:
                current_date = current_date.replace(year=current_date.year + 1, month=1)
            else:
                current_date = current_date.replace(month=current_date.month + 1)
        
        return trends
    
    def _get_top_companies(self, applications: List) -> List[Dict]:
        """Get top companies by number of applications"""
        from collections import Counter
        
        company_counts = Counter()
        for app in applications:
            if app.placement_drive and app.placement_drive.company:
                company_counts[app.placement_drive.company.name] += 1
        
        return [
            {'company': company, 'applications': count}
            for company, count in company_counts.most_common(10)
        ]
    
    def generate_student_report(self, student_id: int, include_applications: bool = True) -> Dict[str, Any]:
        """Generate detailed report for a specific student"""
        try:
            from models import StudentProfile, StudentApplication, PlacementDrive, Company, RoundResult, OfferLetter, db
            
            student = StudentProfile.query.get(student_id)
            if not student:
                return {'error': 'Student not found', 'success': False}
            
            applications = StudentApplication.query.filter_by(student_id=student_id).all()
            
            # Student profile summary
            profile_data = student.to_dict()
            
            # Application summary
            app_summary = {
                'total_applications': len(applications),
                'applied': len([a for a in applications if a.application_status == 'applied']),
                'under_review': len([a for a in applications if a.application_status == 'under_review']),
                'shortlisted': len([a for a in applications if a.application_status == 'shortlisted']),
                'rejected': len([a for a in applications if a.application_status == 'rejected']),
                'selected': len([a for a in applications if a.application_status == 'selected']),
                'offer_accepted': len([a for a in applications if a.application_status == 'offer_accepted']),
            }
            
            # Application details
            applications_data = []
            if include_applications:
                for app in applications:
                    app_data = app.to_dict()
                    # Add round results
                    round_results = RoundResult.query.filter_by(application_id=app.id).all()
                    app_data['round_results'] = [rr.to_dict() for rr in round_results]
                    
                    # Add offer letter if exists
                    offer_letter = OfferLetter.query.filter_by(application_id=app.id).first()
                    if offer_letter:
                        app_data['offer_letter'] = offer_letter.to_dict()
                    
                    applications_data.append(app_data)
            
            return {
                'student': profile_data,
                'application_summary': app_summary,
                'applications': applications_data,
                'generated_at': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            return {'error': str(e), 'success': False}
    
    def generate_company_report(self, company_id: int, start_date: str = None, end_date: str = None) -> Dict[str, Any]:
        """Generate report for a company's recruitment activities"""
        try:
            from models import Company, PlacementDrive, StudentApplication, RoundResult, OfferLetter, db
            
            company = Company.query.get(company_id)
            if not company:
                return {'error': 'Company not found', 'success': False}
            
            drives = PlacementDrive.query.filter_by(company_id=company_id).all()
            
            # Get applications for all drives
            drive_ids = [d.id for d in drives]
            applications = StudentApplication.query.filter(
                StudentApplication.drive_id.in_(drive_ids)
            ).all()
            
            # Filter by date if provided
            if start_date or end_date:
                if start_date:
                    applications = [a for a in applications if a.applied_at >= start_date]
                if end_date:
                    applications = [a for a in applications if a.applied_at <= end_date]
            
            # Calculate metrics
            total_applications = len(applications)
            total_drives = len(drives)
            successful_hires = len([a for a in applications if a.application_status in ['selected', 'offer_accepted']])
            average_score = sum(a.ai_score for a in applications if a.ai_score) / len([a for a in applications if a.ai_score]) if any(a.ai_score for a in applications) else 0
            
            # Drive-wise breakdown
            drive_breakdown = []
            for drive in drives:
                drive_apps = [a for a in applications if a.drive_id == drive.id]
                drive_breakdown.append({
                    'drive': drive.to_dict(),
                    'applications': len(drive_apps),
                    'selected': len([a for a in drive_apps if a.application_status in ['selected', 'offer_accepted']]),
                    'success_rate': (len([a for a in drive_apps if a.application_status in ['selected', 'offer_accepted']]) / len(drive_apps) * 100) if drive_apps else 0
                })
            
            return {
                'company': company.to_dict(),
                'summary': {
                    'total_drives': total_drives,
                    'total_applications': total_applications,
                    'successful_hires': successful_hires,
                    'overall_success_rate': (successful_hires / total_applications * 100) if total_applications > 0 else 0,
                    'average_ai_score': round(float(average_score), 2)
                },
                'drive_breakdown': drive_breakdown,
                'generated_at': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            return {'error': str(e), 'success': False}
    
    def export_to_excel(self, data: Dict[str, Any], report_type: str, filename: str = None) -> str:
        """Export report data to Excel format"""
        try:
            if not filename:
                timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
                filename = f"report_{report_type}_{timestamp}.xlsx"
            
            filepath = os.path.join('uploads', 'reports', filename)
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            
            workbook = xlsxwriter.Workbook(filepath)
            worksheet = workbook.add_worksheet('Report')
            
            # Define formats
            header_format = workbook.add_format({
                'bold': True,
                'font_color': 'white',
                'bg_color': '#366092',
                'border': 1
            })
            
            data_format = workbook.add_format({'border': 1})
            
            # Write data based on report type
            if report_type == 'department':
                self._write_department_excel(workbook, worksheet, data, header_format, data_format)
            elif report_type == 'student':
                self._write_student_excel(workbook, worksheet, data, header_format, data_format)
            elif report_type == 'company':
                self._write_company_excel(workbook, worksheet, data, header_format, data_format)
            
            workbook.close()
            return filepath
            
        except Exception as e:
            raise Exception(f"Excel export failed: {str(e)}")
    
    def _write_department_excel(self, workbook, worksheet, data, header_format, data_format):
        """Write department analytics to Excel"""
        row = 0
        
        # Title
        worksheet.write(row, 0, 'Department Analytics Report', workbook.add_format({'bold': True, 'font_size': 16}))
        row += 2
        
        # Summary section
        summary = data.get('summary', {})
        headers = ['Metric', 'Value']
        
        for col, header in enumerate(headers):
            worksheet.write(row, col, header, header_format)
        row += 1
        
        for key, value in summary.items():
            worksheet.write(row, 0, key.replace('_', ' ').title(), data_format)
            worksheet.write(row, 1, value, data_format)
            row += 1
        
        row += 2
        
        # Status distribution
        if 'status_distribution' in data:
            worksheet.write(row, 0, 'Application Status Distribution', workbook.add_format({'bold': True}))
            row += 1
            
            headers = ['Status', 'Count']
            for col, header in enumerate(headers):
                worksheet.write(row, col, header, header_format)
            row += 1
            
            for status, count in data['status_distribution'].items():
                worksheet.write(row, 0, status.replace('_', ' ').title(), data_format)
                worksheet.write(row, 1, count, data_format)
                row += 1
    
    def _write_student_excel(self, workbook, worksheet, data, header_format, data_format):
        """Write student report to Excel"""
        row = 0
        
        # Student info
        student = data.get('student', {})
        worksheet.write(row, 0, f"Student Report: {student.get('first_name', '')} {student.get('last_name', '')}", workbook.add_format({'bold': True, 'font_size': 16}))
        row += 2
        
        # Student details
        for key, value in student.items():
            if key not in ['applications', 'department', 'to_dict']:
                worksheet.write(row, 0, key.replace('_', ' ').title(), data_format)
                worksheet.write(row, 1, str(value) if not isinstance(value, (dict, list)) else json.dumps(value), data_format)
                row += 1
        
        row += 2
        
        # Applications
        applications = data.get('applications', [])
        if applications:
            worksheet.write(row, 0, 'Applications', workbook.add_format({'bold': True}))
            row += 1
            
            headers = ['Company', 'Position', 'Status', 'Applied Date', 'AI Score']
            for col, header in enumerate(headers):
                worksheet.write(row, col, header, header_format)
            row += 1
            
            for app in applications:
                company = app.get('placement_drive', {}).get('company', {}).get('name', 'N/A')
                position = app.get('placement_drive', {}).get('job_role', 'N/A')
                status = app.get('application_status', 'N/A')
                date = app.get('applied_at', 'N/A')
                score = app.get('ai_score', 'N/A')
                
                worksheet.write(row, 0, company, data_format)
                worksheet.write(row, 1, position, data_format)
                worksheet.write(row, 2, status, data_format)
                worksheet.write(row, 3, date, data_format)
                worksheet.write(row, 4, score, data_format)
                row += 1
    
    def _write_company_excel(self, workbook, worksheet, data, header_format, data_format):
        """Write company report to Excel"""
        row = 0
        
        # Company info
        company = data.get('company', {})
        worksheet.write(row, 0, f"Company Report: {company.get('name', '')}", workbook.add_format({'bold': True, 'font_size': 16}))
        row += 2
        
        # Summary
        summary = data.get('summary', {})
        for key, value in summary.items():
            worksheet.write(row, 0, key.replace('_', ' ').title(), data_format)
            worksheet.write(row, 1, value, data_format)
            row += 1
        
        row += 2
        
        # Drive breakdown
        drive_breakdown = data.get('drive_breakdown', [])
        if drive_breakdown:
            worksheet.write(row, 0, 'Drive Performance', workbook.add_format({'bold': True}))
            row += 1
            
            headers = ['Drive Title', 'Applications', 'Selected', 'Success Rate %']
            for col, header in enumerate(headers):
                worksheet.write(row, col, header, header_format)
            row += 1
            
            for drive in drive_breakdown:
                drive_data = drive.get('drive', {})
                worksheet.write(row, 0, drive_data.get('title', 'N/A'), data_format)
                worksheet.write(row, 1, drive.get('applications', 0), data_format)
                worksheet.write(row, 2, drive.get('selected', 0), data_format)
                worksheet.write(row, 3, drive.get('success_rate', 0), data_format)
                row += 1
    
    def export_to_pdf(self, data: Dict[str, Any], report_type: str, filename: str = None) -> str:
        """Export report data to PDF format"""
        try:
            if not filename:
                timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
                filename = f"report_{report_type}_{timestamp}.pdf"
            
            filepath = os.path.join('uploads', 'reports', filename)
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            
            # Create PDF document
            doc = SimpleDocTemplate(filepath, pagesize=A4)
            styles = getSampleStyleSheet()
            story = []
            
            # Title
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=18,
                spaceAfter=30,
                alignment=TA_CENTER
            )
            
            if report_type == 'department':
                story.append(Paragraph("Department Analytics Report", title_style))
                self._write_department_pdf(story, data, styles)
            elif report_type == 'student':
                story.append(Paragraph("Student Report", title_style))
                self._write_student_pdf(story, data, styles)
            elif report_type == 'company':
                story.append(Paragraph("Company Report", title_style))
                self._write_company_pdf(story, data, styles)
            
            # Build PDF
            doc.build(story)
            return filepath
            
        except Exception as e:
            raise Exception(f"PDF export failed: {str(e)}")
    
    def _write_department_pdf(self, story, data, styles):
        """Write department data to PDF"""
        # Summary section
        story.append(Paragraph("Summary", styles['Heading2']))
        summary = data.get('summary', {})
        
        for key, value in summary.items():
            story.append(Paragraph(f"{key.replace('_', ' ').title()}: {value}", styles['Normal']))
        
        story.append(Spacer(1, 12))
        
        # Status distribution
        if 'status_distribution' in data:
            story.append(Paragraph("Application Status Distribution", styles['Heading2']))
            for status, count in data['status_distribution'].items():
                story.append(Paragraph(f"{status.replace('_', ' ').title()}: {count}", styles['Normal']))
    
    def _write_student_pdf(self, story, data, styles):
        """Write student data to PDF"""
        student = data.get('student', {})
        story.append(Paragraph("Student Information", styles['Heading2']))
        
        story.append(Paragraph(f"Name: {student.get('first_name', '')} {student.get('last_name', '')}", styles['Normal']))
        story.append(Paragraph(f"Student ID: {student.get('student_id', '')}", styles['Normal']))
        story.append(Paragraph(f"Department: {student.get('department', {}).get('name', '')}", styles['Normal']))
        story.append(Paragraph(f"CGPA: {student.get('cgpa', '')}", styles['Normal']))
        story.append(Paragraph(f"Batch: {student.get('batch_year', '')}", styles['Normal']))
        
        story.append(Spacer(1, 12))
        
        # Applications
        applications = data.get('applications', [])
        if applications:
            story.append(Paragraph("Applications", styles['Heading2']))
            for app in applications:
                company = app.get('placement_drive', {}).get('company', {}).get('name', 'N/A')
                position = app.get('placement_drive', {}).get('job_role', 'N/A')
                status = app.get('application_status', 'N/A')
                date = app.get('applied_at', 'N/A')
                
                story.append(Paragraph(f"• {company} - {position} ({status}) - {date}", styles['Normal']))
    
    def _write_company_pdf(self, story, data, styles):
        """Write company data to PDF"""
        company = data.get('company', {})
        story.append(Paragraph(f"Company: {company.get('name', '')}", styles['Normal']))
        story.append(Paragraph(f"Industry: {company.get('industry', '')}", styles['Normal']))
        story.append(Paragraph(f"Contact: {company.get('contact_email', '')}", styles['Normal']))
        
        story.append(Spacer(1, 12))
        
        # Summary
        summary = data.get('summary', {})
        story.append(Paragraph("Summary", styles['Heading2']))
        for key, value in summary.items():
            story.append(Paragraph(f"{key.replace('_', ' ').title()}: {value}", styles['Normal']))

# Create global report service instance
report_service = ReportService()
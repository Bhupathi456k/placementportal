#!/usr/bin/env python3
"""
Demo Data Seeder for Placement Portal
Creates demo users for testing the login functionality
"""

import sys
import os

# Add parent directory to path to import models
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app
from models import db, User, StudentProfile, HodProfile, Department

def create_demo_data():
    """Create demo users and departments"""
    with app.app_context():
        try:
            print("Creating demo data...")
            
            # Create departments first
            departments = [
                Department(name="Computer Science Engineering", code="CSE", description="Computer Science and Engineering Department"),
                Department(name="Electronics and Communication Engineering", code="ECE", description="Electronics and Communication Engineering Department"),
                Department(name="Mechanical Engineering", code="ME", description="Mechanical Engineering Department"),
                Department(name="Civil Engineering", code="CE", description="Civil Engineering Department"),
                Department(name="Information Technology", code="IT", description="Information Technology Department"),
                Department(name="Electrical Engineering", code="EE", description="Electrical Engineering Department")
            ]
            
            for dept in departments:
                existing = Department.query.filter_by(code=dept.code).first()
                if not existing:
                    db.session.add(dept)
                    print(f"Created department: {dept.name}")
            
            db.session.flush()  # Get department IDs
            
            # Get departments by code
            cse_dept = Department.query.filter_by(code="CSE").first()
            ece_dept = Department.query.filter_by(code="ECE").first()
            me_dept = Department.query.filter_by(code="ME").first()
            
            demo_users = [
                {
                    'email': 'student@demo.com',
                    'password': 'password123',
                    'role': 'student',
                    'is_approved': True,
                    'profile_data': {
                        'student_id': 'STU2024001',
                        'first_name': 'John',
                        'last_name': 'Doe',
                        'department_id': cse_dept.id if cse_dept else 1,
                        'batch_year': 2024,
                        'cgpa': 8.5,
                        'phone': '+91-9876543210',
                        'gender': 'male'
                    }
                },
                {
                    'email': 'hod@demo.com',
                    'password': 'password123',
                    'role': 'hod',
                    'is_approved': True,
                    'profile_data': {
                        'employee_id': 'HOD2024001',
                        'first_name': 'Dr. Jane',
                        'last_name': 'Smith',
                        'department_id': cse_dept.id if cse_dept else 1,
                        'phone': '+91-9876543211',
                        'qualification': 'Ph.D. in Computer Science',
                        'experience_years': 15
                    }
                },
                {
                    'email': 'tpo@demo.com',
                    'password': 'password123',
                    'role': 'tpo',
                    'is_approved': True,
                    'profile_data': {
                        'employee_id': 'TPO2024001',
                        'first_name': 'Prof. Robert',
                        'last_name': 'Johnson',
                        'department_id': ece_dept.id if ece_dept else 2,
                        'phone': '+91-9876543212',
                        'qualification': 'M.Tech in Electronics',
                        'experience_years': 12
                    }
                }
            ]
            
            for user_data in demo_users:
                # Check if user already exists
                existing_user = User.query.filter_by(email=user_data['email']).first()
                if existing_user:
                    print(f"User {user_data['email']} already exists, skipping...")
                    continue
                
                # Create user
                user = User(
                    email=user_data['email'],
                    role=user_data['role'],
                    is_active=True,
                    is_approved=user_data['is_approved']
                )
                user.set_password(user_data['password'])
                db.session.add(user)
                db.session.flush()  # Get user ID
                
                # Create role-specific profile
                profile_data = user_data['profile_data']
                
                if user_data['role'] == 'student':
                    student_profile = StudentProfile(
                        user_id=user.id,
                        student_id=profile_data['student_id'],
                        first_name=profile_data['first_name'],
                        last_name=profile_data['last_name'],
                        department_id=profile_data['department_id'],
                        batch_year=profile_data['batch_year'],
                        cgpa=profile_data['cgpa'],
                        phone=profile_data['phone'],
                        gender=profile_data['gender']
                    )
                    db.session.add(student_profile)
                    print(f"Created student profile: {user.email}")
                    
                elif user_data['role'] == 'hod':
                    hod_profile = HodProfile(
                        user_id=user.id,
                        employee_id=profile_data['employee_id'],
                        first_name=profile_data['first_name'],
                        last_name=profile_data['last_name'],
                        department_id=profile_data['department_id'],
                        phone=profile_data['phone'],
                        qualification=profile_data['qualification'],
                        experience_years=profile_data['experience_years']
                    )
                    db.session.add(hod_profile)
                    
                    # Update department HOD if not set
                    department = Department.query.get(profile_data['department_id'])
                    if department and not department.hod_user_id:
                        department.hod_user_id = user.id
                    
                    print(f"Created HOD profile: {user.email}")
                    
                elif user_data['role'] == 'tpo':
                    # For TPO, we can create a basic profile or just use the user data
                    tpo_profile = HodProfile(
                        user_id=user.id,
                        employee_id=profile_data['employee_id'],
                        first_name=profile_data['first_name'],
                        last_name=profile_data['last_name'],
                        department_id=profile_data['department_id'],
                        phone=profile_data['phone'],
                        qualification=profile_data['qualification'],
                        experience_years=profile_data['experience_years']
                    )
                    db.session.add(tpo_profile)
                    print(f"Created TPO profile: {user.email}")
            
            # Commit all changes
            db.session.commit()
            print("Demo data created successfully!")
            
            return True
            
        except Exception as e:
            print(f"Error creating demo data: {str(e)}")
            db.session.rollback()
            return False

def verify_demo_users():
    """Verify that demo users were created correctly"""
    with app.app_context():
        try:
            print("\nVerifying demo users...")
            
            demo_emails = ['student@demo.com', 'hod@demo.com', 'tpo@demo.com']
            
            for email in demo_emails:
                user = User.query.filter_by(email=email).first()
                if user:
                    print(f"✓ {email} - Role: {user.role}, Active: {user.is_active}, Approved: {user.is_approved}")
                else:
                    print(f"✗ {email} - User not found")
            
            return True
            
        except Exception as e:
            print(f"Error verifying demo users: {str(e)}")
            return False

if __name__ == "__main__":
    # Create demo data
    success = create_demo_data()
    if success:
        verify_demo_users()
        print("\nDemo data setup completed successfully!")
        print("You can now log in with:")
        print("- student@demo.com / password123")
        print("- hod@demo.com / password123")
        print("- tpo@demo.com / password123")
    else:
        print("Demo data setup failed!")
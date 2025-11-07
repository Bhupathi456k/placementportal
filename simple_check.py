#!/usr/bin/env python3

"""
Placement Management Portal - Simple Error Detection
"""

import os
import sys
import subprocess

def check_syntax():
    """Check for Python syntax errors"""
    print("=== CHECKING SYNTAX ERRORS ===")
    
    python_files = [
        'backend/app.py',
        'backend/models.py', 
        'backend/routes/auth_routes.py',
        'backend/routes/student_routes.py',
        'backend/routes/hod_routes.py',
        'backend/routes/tpo_routes.py',
        'backend/routes/company_routes.py',
        'backend/routes/drive_routes.py',
        'backend/services/ai_service.py',
        'backend/services/email_service.py',
        'backend/services/file_service.py',
        'backend/services/report_service.py'
    ]
    
    errors = 0
    
    for file_path in python_files:
        if os.path.exists(file_path):
            try:
                result = subprocess.run([sys.executable, '-m', 'py_compile', file_path], 
                                      capture_output=True, text=True)
                if result.returncode == 0:
                    print(f"OK {file_path}")
                else:
                    print(f"ERROR {file_path}: {result.stderr}")
                    errors += 1
            except Exception as e:
                print(f"ERROR {file_path}: {str(e)}")
                errors += 1
        else:
            print(f"MISSING {file_path}")
    
    return errors

def check_files():
    """Check for required files"""
    print("\n=== CHECKING REQUIRED FILES ===")
    
    required_files = [
        'backend/app.py',
        'backend/models.py',
        'backend/requirements.txt',
        'docker-compose.yml',
        'database/schema.sql',
        '.env.example'
    ]
    
    missing = 0
    
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"OK {file_path}")
        else:
            print(f"MISSING {file_path}")
            missing += 1
    
    return missing

def check_imports():
    """Check if basic imports work"""
    print("\n=== CHECKING IMPORTS ===")
    
    # Set Python path
    sys.path.insert(0, '.')
    
    try:
        import backend.models
        print("OK Models import")
    except Exception as e:
        print(f"ERROR Models import: {str(e)}")
        return False
    
    try:
        from backend.routes import auth_routes
        print("OK Auth routes import")
    except Exception as e:
        print(f"ERROR Auth routes import: {str(e)}")
        return False
    
    return True

def main():
    print("PLACEMENT MANAGEMENT PORTAL - ERROR CHECK")
    print("=" * 50)
    
    syntax_errors = check_syntax()
    missing_files = check_files()
    import_ok = check_imports()
    
    print("\n" + "=" * 50)
    print("SUMMARY")
    print("=" * 50)
    
    if syntax_errors == 0 and missing_files == 0 and import_ok:
        print("SUCCESS! No critical errors found.")
        print("System is ready for deployment.")
        print("Next: docker-compose up --build")
        return True
    else:
        print("ERRORS DETECTED:")
        if syntax_errors > 0:
            print(f"Syntax errors: {syntax_errors}")
        if missing_files > 0:
            print(f"Missing files: {missing_files}")
        if not import_ok:
            print("Import errors found")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
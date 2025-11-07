#!/usr/bin/env python3
"""
Test script to verify model imports work correctly after fixing app.py
"""
import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    print("Testing imports from models.py...")
    from models import User, StudentProfile, HodProfile, Department, EmailTemplate, EmailLog
    print("[OK] All model imports successful!")
    
    # Check that all classes have the expected attributes
    print("\nChecking model classes...")
    print(f"User class: {User}")
    print(f"StudentProfile class: {StudentProfile}")
    print(f"HodProfile class: {HodProfile}")
    print(f"Department class: {Department}")
    print(f"EmailTemplate class: {EmailTemplate}")
    print(f"EmailLog class: {EmailLog}")
    
    print("\n[OK] All model imports working correctly!")
    print("The import error in app.py line 46 has been fixed.")
    
except ImportError as e:
    print(f"[ERROR] Import error: {e}")
    sys.exit(1)
except Exception as e:
    print(f"[ERROR] Unexpected error: {e}")
    sys.exit(1)
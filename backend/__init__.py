# Placement Management Portal Backend
# Make this directory a Python package

from .models import db, User, Department, StudentProfile, HodProfile

__all__ = ['db', 'User', 'Department', 'StudentProfile', 'HodProfile']
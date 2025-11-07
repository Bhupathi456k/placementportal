from flask import Flask
import os
import uuid
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
import mimetypes
from datetime import datetime

class FileService:
    def __init__(self):
        self.app = None
        self.allowed_extensions = {'pdf', 'doc', 'docx', 'txt'}
        self.max_file_size = 16 * 1024 * 1024  # 16MB
    
    def init_app(self, app: Flask):
        """Initialize the file service with Flask app"""
        self.app = app
        self.upload_folder = app.config.get('UPLOAD_FOLDER', 'uploads')
        self._create_upload_directories()
    
    def _create_upload_directories(self):
        """Create necessary upload directories"""
        directories = [
            self.upload_folder,
            os.path.join(self.upload_folder, 'resumes'),
            os.path.join(self.upload_folder, 'offer_letters'),
            os.path.join(self.upload_folder, 'reports'),
            os.path.join(self.upload_folder, 'company_logos'),
            os.path.join(self.upload_folder, 'profile_images')
        ]
        
        for directory in directories:
            os.makedirs(directory, exist_ok=True)
    
    def allowed_file(self, filename):
        """Check if file extension is allowed"""
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in self.allowed_extensions
    
    def save_resume(self, file: FileStorage, student_id: str) -> Dict[str, str]:
        """Save student resume file"""
        try:
            if not file or not file.filename:
                return {'success': False, 'error': 'No file provided'}
            
            if not self.allowed_file(file.filename):
                return {'success': False, 'error': 'File type not allowed'}
            
            if file.content_length > self.max_file_size:
                return {'success': False, 'error': 'File size exceeds limit'}
            
            # Generate unique filename
            file_extension = file.filename.rsplit('.', 1)[1].lower()
            filename = f"resume_{student_id}_{uuid.uuid4().hex[:8]}.{file_extension}"
            filepath = os.path.join(self.upload_folder, 'resumes', filename)
            
            # Save file
            file.save(filepath)
            
            # Verify file was saved
            if os.path.exists(filepath):
                return {
                    'success': True,
                    'filename': filename,
                    'filepath': filepath,
                    'size': os.path.getsize(filepath),
                    'uploaded_at': datetime.utcnow().isoformat()
                }
            else:
                return {'success': False, 'error': 'Failed to save file'}
                
        except Exception as e:
            return {'success': False, 'error': f'File upload failed: {str(e)}'}
    
    def save_offer_letter(self, file: FileStorage, application_id: str) -> Dict[str, str]:
        """Save offer letter file"""
        try:
            if not file or not file.filename:
                return {'success': False, 'error': 'No file provided'}
            
            if not self.allowed_file(file.filename):
                return {'success': False, 'error': 'File type not allowed'}
            
            if file.content_length > self.max_file_size:
                return {'success': False, 'error': 'File size exceeds limit'}
            
            # Generate unique filename
            file_extension = file.filename.rsplit('.', 1)[1].lower()
            filename = f"offer_letter_{application_id}_{uuid.uuid4().hex[:8]}.{file_extension}"
            filepath = os.path.join(self.upload_folder, 'offer_letters', filename)
            
            # Save file
            file.save(filepath)
            
            if os.path.exists(filepath):
                return {
                    'success': True,
                    'filename': filename,
                    'filepath': filepath,
                    'size': os.path.getsize(filepath),
                    'uploaded_at': datetime.utcnow().isoformat()
                }
            else:
                return {'success': False, 'error': 'Failed to save file'}
                
        except Exception as e:
            return {'success': False, 'error': f'File upload failed: {str(e)}'}
    
    def save_company_logo(self, file: FileStorage, company_id: str) -> Dict[str, str]:
        """Save company logo file"""
        try:
            if not file or not file.filename:
                return {'success': False, 'error': 'No file provided'}
            
            # Allow image files for logos
            image_extensions = {'jpg', 'jpeg', 'png', 'gif', 'bmp'}
            file_extension = file.filename.rsplit('.', 1)[1].lower()
            
            if file_extension not in image_extensions:
                return {'success': False, 'error': 'Image file required for logo'}
            
            if file.content_length > (5 * 1024 * 1024):  # 5MB limit for images
                return {'success': False, 'error': 'Image size exceeds limit'}
            
            # Generate unique filename
            filename = f"logo_{company_id}_{uuid.uuid4().hex[:8]}.{file_extension}"
            filepath = os.path.join(self.upload_folder, 'company_logos', filename)
            
            # Save file
            file.save(filepath)
            
            if os.path.exists(filepath):
                return {
                    'success': True,
                    'filename': filename,
                    'filepath': filepath,
                    'size': os.path.getsize(filepath),
                    'uploaded_at': datetime.utcnow().isoformat()
                }
            else:
                return {'success': False, 'error': 'Failed to save file'}
                
        except Exception as e:
            return {'success': False, 'error': f'File upload failed: {str(e)}'}
    
    def save_profile_image(self, file: FileStorage, user_id: str) -> Dict[str, str]:
        """Save user profile image"""
        try:
            if not file or not file.filename:
                return {'success': False, 'error': 'No file provided'}
            
            # Allow image files for profile pictures
            image_extensions = {'jpg', 'jpeg', 'png', 'gif', 'bmp'}
            file_extension = file.filename.rsplit('.', 1)[1].lower()
            
            if file_extension not in image_extensions:
                return {'success': False, 'error': 'Image file required for profile picture'}
            
            if file.content_length > (3 * 1024 * 1024):  # 3MB limit for profile images
                return {'success': False, 'error': 'Image size exceeds limit'}
            
            # Generate unique filename
            filename = f"profile_{user_id}_{uuid.uuid4().hex[:8]}.{file_extension}"
            filepath = os.path.join(self.upload_folder, 'profile_images', filename)
            
            # Save file
            file.save(filepath)
            
            if os.path.exists(filepath):
                return {
                    'success': True,
                    'filename': filename,
                    'filepath': filepath,
                    'size': os.path.getsize(filepath),
                    'uploaded_at': datetime.utcnow().isoformat()
                }
            else:
                return {'success': False, 'error': 'Failed to save file'}
                
        except Exception as e:
            return {'success': False, 'error': f'File upload failed: {str(e)}'}
    
    def delete_file(self, filename: str, category: str) -> bool:
        """Delete a file from the upload directory"""
        try:
            filepath = os.path.join(self.upload_folder, category, filename)
            
            if os.path.exists(filepath):
                os.remove(filepath)
                return True
            return False
            
        except Exception as e:
            print(f"Error deleting file {filename}: {str(e)}")
            return False
    
    def get_file_url(self, filename: str, category: str) -> str:
        """Get the URL for accessing a file"""
        if not filename:
            return ""
        
        # In production, this would return a proper CDN or storage URL
        return f"/uploads/{category}/{filename}"
    
    def get_file_size(self, filename: str, category: str) -> int:
        """Get file size in bytes"""
        try:
            filepath = os.path.join(self.upload_folder, category, filename)
            if os.path.exists(filepath):
                return os.path.getsize(filepath)
            return 0
        except Exception as e:
            print(f"Error getting file size for {filename}: {str(e)}")
            return 0
    
    def get_file_info(self, filename: str, category: str) -> Dict[str, Any]:
        """Get comprehensive file information"""
        try:
            filepath = os.path.join(self.upload_folder, category, filename)
            
            if not os.path.exists(filepath):
                return {'exists': False}
            
            stat = os.stat(filepath)
            mime_type, _ = mimetypes.guess_type(filepath)
            
            return {
                'exists': True,
                'filename': filename,
                'size': stat.st_size,
                'created_at': datetime.fromtimestamp(stat.st_ctime).isoformat(),
                'modified_at': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                'mime_type': mime_type,
                'url': self.get_file_url(filename, category)
            }
            
        except Exception as e:
            print(f"Error getting file info for {filename}: {str(e)}")
            return {'exists': False, 'error': str(e)}
    
    def list_files(self, category: str, limit: int = 100) -> List[Dict[str, Any]]:
        """List files in a specific category"""
        try:
            category_path = os.path.join(self.upload_folder, category)
            
            if not os.path.exists(category_path):
                return []
            
            files = []
            for filename in os.listdir(category_path):
                filepath = os.path.join(category_path, filename)
                
                if os.path.isfile(filepath):
                    file_info = self.get_file_info(filename, category)
                    if file_info['exists']:
                        files.append(file_info)
            
            # Sort by modified date (newest first)
            files.sort(key=lambda x: x['modified_at'], reverse=True)
            
            return files[:limit]
            
        except Exception as e:
            print(f"Error listing files in {category}: {str(e)}")
            return []
    
    def copy_file(self, source_filename: str, source_category: str, 
                  dest_category: str, new_filename: str = None) -> Dict[str, str]:
        """Copy file from one category to another"""
        try:
            source_path = os.path.join(self.upload_folder, source_category, source_filename)
            
            if not os.path.exists(source_path):
                return {'success': False, 'error': 'Source file not found'}
            
            if new_filename is None:
                new_filename = source_filename
            
            dest_path = os.path.join(self.upload_folder, dest_category, new_filename)
            
            # Ensure destination directory exists
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            
            # Copy file
            import shutil
            shutil.copy2(source_path, dest_path)
            
            if os.path.exists(dest_path):
                return {
                    'success': True,
                    'filename': new_filename,
                    'filepath': dest_path,
                    'size': os.path.getsize(dest_path)
                }
            else:
                return {'success': False, 'error': 'Failed to copy file'}
                
        except Exception as e:
            return {'success': False, 'error': f'File copy failed: {str(e)}'}
    
    def generate_thumbnail(self, filename: str, category: str, 
                          thumbnail_size: tuple = (200, 200)) -> Dict[str, str]:
        """Generate thumbnail for image files"""
        try:
            from PIL import Image
            
            source_path = os.path.join(self.upload_folder, category, filename)
            
            if not os.path.exists(source_path):
                return {'success': False, 'error': 'Source file not found'}
            
            # Check if it's an image
            image_extensions = {'jpg', 'jpeg', 'png', 'gif', 'bmp'}
            file_extension = filename.rsplit('.', 1)[1].lower()
            
            if file_extension not in image_extensions:
                return {'success': False, 'error': 'File is not an image'}
            
            # Generate thumbnail
            with Image.open(source_path) as img:
                img.thumbnail(thumbnail_size, Image.Resampling.LANCZOS)
                
                thumbnail_name = f"thumb_{filename}"
                thumbnail_path = os.path.join(self.upload_folder, category, thumbnail_name)
                
                # Convert to RGB if necessary (for JPEG)
                if img.mode in ('RGBA', 'LA', 'P'):
                    img = img.convert('RGB')
                
                img.save(thumbnail_path, 'JPEG', quality=85)
                
                return {
                    'success': True,
                    'thumbnail_filename': thumbnail_name,
                    'thumbnail_path': thumbnail_path,
                    'size': os.path.getsize(thumbnail_path)
                }
                
        except Exception as e:
            return {'success': False, 'error': f'Thumbnail generation failed: {str(e)}'}

# Create global file service instance
file_service = FileService()
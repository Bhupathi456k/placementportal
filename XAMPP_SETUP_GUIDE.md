# XAMPP Integration Guide for Placement Management Portal

This guide will help you connect your Placement Management Portal project with your local XAMPP server.

## Prerequisites

1. **XAMPP Installation**: Make sure you have XAMPP installed on your Windows system
2. **Project Files**: Your project should be in `c:\Users\Lenovo\OneDrive\Desktop\web projects\resumemaker`

## Step 1: Start XAMPP Services

1. Open **XAMPP Control Panel**
2. Start the following services:
   - **Apache** (for web server)
   - **MySQL** (for database)

## Step 2: Create Database in phpMyAdmin

1. Open your web browser and go to: `http://localhost/phpmyadmin`
2. Click on **"New"** to create a new database
3. Enter database name: `placement_portal`
4. Select **Collation**: `utf8mb4_unicode_ci`
5. Click **"Create"**

## Step 3: Import Database Schema

1. In phpMyAdmin, select the `placement_portal` database
2. Click on **"Import"** tab
3. Click **"Choose File"** and select the file: `database/schema.sql` from your project
4. Click **"Go"** to import the schema

## Step 4: Configure Backend Environment

Create a `.env` file in your project root directory:

```bash
# Database Configuration (XAMPP)
DATABASE_URL=mysql://root:@localhost:3306/placement_portal
MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=placement_portal
MYSQL_USER=root
MYSQL_PASSWORD=

# Flask Configuration
SECRET_KEY=your-secret-key-change-in-production
JWT_SECRET_KEY=jwt-secret-string-change-in-production
FLASK_ENV=development

# OpenAI Configuration (Optional)
OPENAI_API_KEY=

# Email Configuration
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_USE_TLS=true

# Frontend Configuration
REACT_APP_API_URL=http://localhost:5000

# Redis Configuration (Optional - disable for now)
REDIS_URL=

# File Upload Configuration
MAX_FILE_SIZE=16777216
ALLOWED_FILE_EXTENSIONS=pdf,doc,docx,txt,jpg,jpeg,png,gif,bmp
```

## Step 5: Install Python Dependencies

1. Open Command Prompt in your project directory
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```
3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

## Step 6: Start the Backend Server

1. Make sure you're in the `backend` directory
2. Start the Flask application:
   ```bash
   python app.py
   ```
3. You should see: `Running on http://0.0.0.0:5000`

## Step 7: Start the Frontend

1. Open a new Command Prompt
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install Node.js dependencies (first time only):
   ```bash
   npm install
   ```
4. Start the React development server:
   ```bash
   npm start
   ```
5. You should see: `Local: http://localhost:3000`

## Step 8: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database (phpMyAdmin)**: http://localhost/phpmyadmin

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. **Check MySQL Service**: Ensure MySQL is running in XAMPP
2. **Check Port**: Make sure MySQL is using port 3306
3. **Check Credentials**: Verify root user has no password in XAMPP
4. **Create User**: If needed, create a specific database user:
   ```sql
   CREATE USER 'placement_user'@'localhost' IDENTIFIED BY 'placement_pass';
   GRANT ALL PRIVILEGES ON placement_portal.* TO 'placement_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### CORS Issues

If you get CORS errors:
1. Check that the backend is running on port 5000
2. Ensure CORS is properly configured in `backend/app.py`

### File Upload Issues

If file uploads fail:
1. Check that the `uploads` directory exists in the backend folder
2. Ensure proper write permissions

## Alternative: Using XAMPP's Built-in PHP MyAdmin

If you prefer using XAMPP's built-in setup:

1. **Copy Project to htdocs**:
   - Copy your project to `C:\xampp\htdocs\placement-portal\`
   - Access via `http://localhost/placement-portal`

2. **Configure Virtual Host** (Optional):
   - Edit `C:\xampp\apache\conf\extra\httpd-vhosts.conf`
   - Add virtual host configuration for your project

## Production Considerations

For production deployment:
1. Change default passwords
2. Use environment variables properly
3. Enable SSL/HTTPS
4. Configure proper file permissions
5. Set up proper backup strategy

## Security Notes

- **Never commit `.env` files with real credentials**
- Use strong passwords for database users
- Enable firewall rules for database access
- Regular security updates for XAMPP components

---

**Need Help?**
If you encounter issues, check the console logs for detailed error messages and verify each step carefully.
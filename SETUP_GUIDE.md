# Placement Management Portal - Installation & Setup Guide

## Overview
This is a comprehensive placement management system built for colleges to streamline campus recruitment processes. The system supports three user roles: Students, Head of Department (HOD), and Training & Placement Officer (TPO).

## System Architecture

### Backend (Flask + MySQL)
- **Flask REST API** with JWT authentication
- **MySQL Database** with optimized schema
- **AI Integration** for resume analysis, email generation, and job matching
- **File Handling** for resumes, offer letters, and documents
- **Email Services** for automated notifications
- **Report Generation** with Excel/PDF export

### Frontend (React)
- **Interactive UI** with Material-UI components
- **Role-based Dashboards** for each user type
- **Real-time Updates** and notifications
- **Responsive Design** for all devices

### Infrastructure
- **Docker Containerization** for easy deployment
- **Redis** for caching and task queuing
- **Environment Configuration** for different deployments

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose
- Git (to clone the repository)

### Installation Steps

1. **Clone and Setup**
```bash
# Clone the repository
git clone <repository-url>
cd placement-management-portal

# Copy environment file
cp .env.example .env
# Edit .env with your actual values
```

2. **Configure Environment**
Edit the `.env` file with your settings:
```bash
# Database
DATABASE_URL=mysql://placement_user:placement_pass@database:3306/placement_portal
MYSQL_ROOT_PASSWORD=placement123

# Security
SECRET_KEY=your-unique-secret-key
JWT_SECRET_KEY=your-jwt-secret

# OpenAI (Optional - for AI features)
OPENAI_API_KEY=your-openai-api-key

# Email (for notifications)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

3. **Start the System**
```bash
# Start all services
docker-compose up --build

# Or start in background
docker-compose up -d --build
```

4. **Access the Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api/docs

## Manual Installation

### Backend Setup

1. **Install Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

2. **Database Setup**
```bash
# Install MySQL
# Create database
mysql -u root -p
CREATE DATABASE placement_portal;

# Import schema
mysql -u root -p placement_portal < ../database/schema.sql
```

3. **Configure Environment**
```bash
# Set environment variables
export DATABASE_URL="mysql://root:password@localhost/placement_portal"
export SECRET_KEY="your-secret-key"
export JWT_SECRET_KEY="your-jwt-secret"
```

4. **Run Backend**
```bash
python app.py
```

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Configure API URL**
```bash
# Edit package.json or create .env
REACT_APP_API_URL=http://localhost:5000
```

3. **Run Frontend**
```bash
npm start
```

## User Roles & Features

### 1. Student Role
**Registration & Profile Management**
- Secure registration with department validation
- Profile creation with personal details, skills, experience, education
- Resume upload with AI-powered parsing
- Profile editing and management

**Placement Activities**
- View available placement drives
- Apply to drives (eligibility validation)
- Track application status
- View round results and feedback
- Download offer letters

**AI Features**
- AI-generated resume suggestions
- Job fit score calculation
- Automated resume validation

### 2. Head of Department (HOD) Role
**Student Management**
- View all students in department
- Approve/reject student registrations
- Edit student profiles if needed
- Manage department-specific data

**Analytics & Reporting**
- Department placement statistics
- Student performance analytics
- Placement success rates
- Generate reports (Excel/PDF)

**Oversight**
- Monitor placement activities
- Review student applications
- Department-level insights

### 3. Training & Placement Officer (TPO) Role
**Company Management**
- Add and manage company details
- Upload company logos
- Manage company contacts

**Placement Drive Management**
- Create and manage placement drives
- Set eligibility criteria and requirements
- Define recruitment rounds
- Schedule drive activities
- Manage application deadlines

**Recruitment Process**
- Review and filter applications
- Update application status
- Conduct recruitment rounds
- Manage results and feedback
- Issue offer letters

**System Administration**
- User management
- System configuration
- Email template management
- Report generation
- Analytics and insights

**AI-Powered Features**
- Automated candidate filtering
- AI-generated email templates
- Resume scoring and matching
- Candidate analysis

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Student Endpoints
- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update profile
- `POST /api/student/upload-resume` - Upload resume
- `GET /api/student/applications` - Get applications
- `POST /api/student/apply-drive` - Apply to drive
- `GET /api/student/available-drives` - View available drives

### HOD Endpoints
- `GET /api/hod/students` - Get department students
- `PUT /api/hod/approve-student` - Approve student
- `GET /api/hod/analytics` - Get analytics

### TPO Endpoints
- `GET /api/tpo/drives` - Get all drives
- `POST /api/tpo/drives` - Create drive
- `GET /api/tpo/companies` - Get companies
- `POST /api/tpo/companies` - Add company

## Database Schema

The system uses a normalized MySQL database with the following main tables:
- **users** - Authentication and basic user data
- **student_profiles** - Student-specific information
- **hod_profiles** - HOD-specific information
- **departments** - Academic departments
- **companies** - Company information
- **placement_drives** - Placement drive details
- **recruitment_rounds** - Recruitment process steps
- **student_applications** - Student applications
- **round_results** - Recruitment round results
- **offer_letters** - Offer letter management
- **email_templates** - Email template storage
- **email_logs** - Email sending logs

## AI Features

### Resume Analysis
- **Text Extraction** from PDF/DOC files
- **Skill Extraction** using AI parsing
- **Education & Experience** parsing
- **Profile Enhancement** suggestions

### Job Matching
- **AI-powered scoring** based on skills and CGPA
- **Compatibility analysis** between candidate and job requirements
- **Missing skill identification**
- **Recommendation engine**

### Email Generation
- **Context-aware templates** for different scenarios
- **Personalized content** based on user data
- **Professional formatting** for all communications
- **Multi-language support** (configurable)

### Content Generation
- **Smart suggestions** for profile improvement
- **Industry-specific advice** for resume enhancement
- **Skill recommendations** based on job trends
- **Career guidance** content

## Security Features

### Authentication & Authorization
- **JWT-based authentication** with role claims
- **Password hashing** using Werkzeug security
- **Role-based access control** (RBAC)
- **Session management** with token refresh

### Data Protection
- **Input validation** and sanitization
- **SQL injection protection** using SQLAlchemy
- **File upload security** with type validation
- **CORS configuration** for API security

### Privacy Compliance
- **Data encryption** for sensitive information
- **Audit logging** for user actions
- **Secure file storage** with access controls
- **Privacy settings** for data handling

## Performance & Scalability

### Database Optimization
- **Indexed queries** for fast retrieval
- **Efficient relationships** between tables
- **Query optimization** for analytics
- **Pagination** for large datasets

### Caching
- **Redis integration** for session storage
- **Query result caching** for analytics
- **Static file caching** for performance
- **API response caching** for frequently accessed data

### File Handling
- **Efficient upload** handling
- **File type validation** and security
- **Storage optimization** with compression
- **CDN integration** for file delivery

## Deployment Options

### Development
- **Local Docker setup** for development
- **Hot reloading** for frontend and backend
- **Debug mode** enabled
- **Detailed logging** for troubleshooting

### Production
- **Production Docker images** with optimizations
- **Environment-specific configuration**
- **Security hardening** measures
- **Performance monitoring** setup

### Cloud Deployment
- **AWS/GCP/Azure** compatible Docker setup
- **Load balancer** configuration
- **Auto-scaling** capabilities
- **Database migration** support

## Maintenance & Support

### Monitoring
- **Application health checks** at `/api/health`
- **Database connection** monitoring
- **API performance** tracking
- **Error logging** and alerting

### Backup & Recovery
- **Database backup** strategies
- **File storage backup** procedures
- **Configuration backup** management
- **Disaster recovery** planning

### Updates & Upgrades
- **Version control** for codebase
- **Database migration** scripts
- **Rolling deployment** support
- **Rollback capabilities**

## Troubleshooting

### Common Issues

**Database Connection**
```bash
# Check if MySQL is running
docker-compose ps database

# View database logs
docker-compose logs database
```

**Backend API Issues**
```bash
# Check backend logs
docker-compose logs backend

# Test API endpoint
curl http://localhost:5000/api/health
```

**Frontend Issues**
```bash
# Check frontend logs
docker-compose logs frontend

# Clear browser cache
# Check browser console for errors
```

**AI Features Not Working**
- Verify OpenAI API key in environment
- Check API key permissions and limits
- Review AI service logs for errors

### Support Resources
- **API Documentation**: Available at `/api/docs` when running
- **Health Check**: Available at `/api/health`
- **Error Logs**: Check container logs for detailed errors
- **Database Schema**: Reference `database/schema.sql`

## Development Guidelines

### Code Structure
- **Modular architecture** with clear separation of concerns
- **Service layer** for business logic
- **API versioning** for backward compatibility
- **Error handling** with proper HTTP status codes

### Best Practices
- **Input validation** for all user inputs
- **SQL injection protection** using ORM
- **Security headers** for all responses
- **Logging** for debugging and monitoring

### Testing
- **Unit tests** for core functionality
- **Integration tests** for API endpoints
- **Database tests** for model validation
- **Frontend tests** for UI components

This comprehensive system provides all the features requested for a modern placement management portal with AI integration, role-based access, and robust deployment capabilities.
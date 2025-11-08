# Placement Management Portal

A comprehensive web-based system for managing campus recruitment processes in colleges.

## System Overview

This portal streamlines campus recruitment with role-based access for:
- **Students**: Profile management, placement drive enrollment, resume building
- **Head of Department (HOD)**: Student approval, department analytics, reporting
- **Training & Placement Officer (TPO)**: Full system administration, company management, drive coordination

## Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: React with modern UI components and Material-UI
- **Database**: SQLite (default), MySQL support available
- **Authentication**: JWT-based role authentication
- **AI Features**: OpenAI API integration
- **Containerization**: Docker & Docker Compose
- **File Handling**: Resume uploads, offer letters, reports
- **UI Framework**: Material-UI with glass-morphism design

## Key Features

### Core Functionality
- Role-based authentication and authorization
- Placement drive creation and management
- Student registration and profile management
- Resume upload and processing
- Company management and recruitment rounds
- Automated email notifications
- Department-wise analytics and reporting
- Result tracking and status updates

### AI Integration
- AI-generated email templates
- Resume validation and scoring
- Automated result summarization
- Resume filtering and candidate matching
- Job-fit analysis
- ATS-friendly resume formatting

### Modern UI Features
- **Glass-morphism Design**: Beautiful glass-effect cards with backdrop blur
- **Smooth Animations**: Pulse effects, slide-in animations, hover transitions
- **Responsive Layout**: Mobile-friendly design for all devices
- **Interactive Elements**: Clickable cards, state transitions, micro-interactions
- **Professional Color Schemes**: Role-specific themes and gradients

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Running the Application

The application consists of two separate services that need to run simultaneously:

#### 1. Start the Backend (Terminal 1)
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the Flask backend server
python app.py
```

The backend will be available at: http://localhost:5000
- Health check: http://localhost:5000/api/health
- API docs: http://localhost:5000/api/docs

#### 2. Start the Frontend (Terminal 2)
```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the React development server
npm start
```

The frontend will be available at: http://localhost:3000

### Alternative: Docker Setup
```bash
# Start all services with Docker Compose
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### Testing the Application
Once both services are running:
1. Open http://localhost:3000 in your browser
2. Use the demo credentials to test different user roles:
   - **Student**: student@demo.com / password123
   - **HOD**: hod@demo.com / password123
   - **TPO**: tpo@demo.com / password123

## Project Structure

```
placement-management-portal/
├── backend/                 # Flask API backend
│   ├── app.py              # Main application
│   ├── models.py           # Database models
│   ├── routes/             # API routes
│   │   ├── auth_routes.py  # Authentication endpoints
│   │   ├── student_routes.py # Student endpoints
│   │   ├── hod_routes.py   # HOD endpoints
│   │   ├── tpo_routes.py   # TPO endpoints
│   │   ├── company_routes.py # Company management
│   │   └── drive_routes.py # Placement drives
│   ├── services/           # Business logic
│   │   ├── ai_service.py   # AI integration
│   │   ├── email_service.py # Email notifications
│   │   ├── file_service.py  # File handling
│   │   └── report_service.py # Report generation
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   │   ├── LoginPage.js # Authentication page
│   │   │   ├── StudentDashboard.js # Student interface
│   │   │   ├── HODDashboard.js # HOD interface
│   │   │   └── TPODashboard.js # TPO interface
│   │   ├── services/      # API services
│   │   │   └── authService.js # Authentication service
│   │   ├── App.js         # Main application component
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles with animations
│   └── package.json       # Node dependencies
├── database/              # Database schema
└── docker-compose.yml     # Docker orchestration
```

## User Roles & Permissions

### Student Role
- Register/login with profile creation
- Upload and manage resume
- View and enroll in placement drives
- Track application status
- Download offer letters
- AI-powered resume suggestions
- **Dashboard Features**: 
  - Personalized welcome with stats
  - Quick action grid for common tasks
  - Recent activity feed
  - Profile completion tracking

### HOD Role
- Approve student registrations within department
- View and edit student profiles
- Access department-level analytics
- Generate placement reports
- Export data (Excel/PDF)
- **Dashboard Features**:
  - Department performance metrics
  - Student approval workflow
  - Analytics and reporting tools
  - Management quick actions

### TPO/Admin Role
- Manage placement drives
- Add and manage company details
- Handle recruitment rounds
- Update selection/rejection lists
- Upload offer letters
- Send automated notifications
- System administration
- AI-powered candidate filtering
- **Dashboard Features**:
  - Comprehensive system overview
  - Company and placement statistics
  - Administrative tools grid
  - System performance monitoring

## API Documentation

The API provides endpoints for all operations. Access documentation at:
- Development: http://localhost:5000/api/docs
- API Base URL: http://localhost:5000/api

### Key Endpoints
- **Health Check**: GET /api/health
- **Authentication**: POST /api/auth/login, POST /api/auth/register
- **Student**: GET/POST /api/student/*
- **HOD**: GET/PUT /api/hod/*
- **TPO**: GET/POST/PUT /api/tpo/*
- **Companies**: GET/POST /api/companies/*
- **Drives**: GET/POST/PUT /api/drives/*

## Configuration

### Database Configuration
By default, the application uses SQLite for development:
```
DATABASE_URL=sqlite:///placement_portal.db
```

For MySQL (production), update the .env file:
```
DATABASE_URL=mysql://user:password@localhost:3306/placement_portal
```

### Environment Variables
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL=sqlite:///placement_portal.db

# Security
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=jwt-secret-key

# AI Features (Optional)
OPENAI_API_KEY=your-openai-api-key

# Email Configuration
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Troubleshooting

### Common Issues

**Backend won't start:**
- Ensure all Python dependencies are installed: `pip install -r backend/requirements.txt`
- Check if port 5000 is available
- Verify Python version is 3.8+

**Frontend won't start:**
- Ensure all Node dependencies are installed: `npm install`
- Check if port 3000 is available
- Clear npm cache if needed: `npm cache clean --force`

**Database issues:**
- SQLite database will be created automatically in development
- For MySQL, ensure the database exists before starting the application

**Authentication problems:**
- Check that JWT_SECRET_KEY is set in environment
- Verify API endpoints are accessible from the frontend

## License

This project is licensed under the MIT License.
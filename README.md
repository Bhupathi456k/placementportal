# Placement Management Portal

A comprehensive web-based system for managing campus recruitment processes in colleges.

## System Overview

This portal streamlines campus recruitment with role-based access for:
- **Students**: Profile management, placement drive enrollment, resume building
- **Head of Department (HOD)**: Student approval, department analytics, reporting
- **Training & Placement Officer (TPO)**: Full system administration, company management, drive coordination

## Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: React with modern UI components
- **Database**: MySQL
- **Authentication**: JWT-based role authentication
- **AI Features**: OpenAI API integration
- **Containerization**: Docker & Docker Compose
- **File Handling**: Resume uploads, offer letters, reports

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

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Python 3.8+
- Node.js 14+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd placement-management-portal
```

2. Start the services:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Manual Setup

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

#### Database Setup
```bash
mysql -u root -p < database/schema.sql
```

## Project Structure

```
placement-management-portal/
├── backend/                 # Flask API backend
│   ├── app.py              # Main application
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Helper functions
│   ├── database/           # Database setup
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Helper functions
│   └── package.json       # Node dependencies
├── database/              # Database schema and migrations
├── docker-compose.yml     # Docker orchestration
├── Dockerfile.backend     # Backend container
├── Dockerfile.frontend    # Frontend container
└── README.md             # This file
```

## User Roles & Permissions

### Student Role
- Register/login with profile creation
- Upload and manage resume
- View and enroll in placement drives
- Track application status
- Download offer letters
- AI-powered resume suggestions

### HOD Role
- Approve student registrations within department
- View and edit student profiles
- Access department-level analytics
- Generate placement reports
- Export data (Excel/PDF)

### TPO/Admin Role
- Manage placement drives
- Add and manage company details
- Handle recruitment rounds
- Update selection/rejection lists
- Upload offer letters
- Send automated notifications
- System administration
- AI-powered candidate filtering

## API Documentation

The API provides endpoints for all operations. Documentation available at `/api/docs` when running.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
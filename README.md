# Medical Internships Management System

A comprehensive full-stack web application for managing medical internships, connecting students, doctors, service chiefs, and administrative staff in healthcare institutions.

## Overview

This system streamlines the entire internship lifecycle - from posting opportunities to final evaluations - providing a centralized platform for all stakeholders in medical education.

##  Features

### For Students
- Browse and search available internships
- Submit applications with documents
- Track application status in real-time
- View evaluations and feedback
- Manage personal documents

### For Service Chiefs
- Create and manage internship postings
- Review and approve/reject applications
- Monitor student placements
- Validate evaluations

### For Doctors
- Supervise assigned students
- Submit performance evaluations
- Track student progress

### For Dean/Admin
- Complete system oversight
- User management (students, doctors, chiefs)
- Establishment and department management
- Generate statistics and reports
- System-wide monitoring

##  Tech Stack

### Backend
- **Node.js** with Express.js
- **MySQL** with Sequelize ORM
- **JWT** authentication
- **Socket.io** for real-time notifications
- **Multer** for file uploads
- **bcrypt** for password hashing

### Frontend
- **React.js**
- **Tailwind CSS** for styling
- Modern, responsive UI design

## Project Structure

```
src/
├── config/          # Database and app configuration
├── controllers/     # Request handlers
├── middleware/      # Auth, validation, upload middleware
├── models/          # Sequelize models
├── routes/          # API routes
├── service/         # Notification service
├── socket/          # WebSocket handlers
├── scripts/         # Database seeding scripts
└── utils/           # Helper functions
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- MySQL (v8+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd medical-internships-system
```

2. Install backend dependencies
```bash
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Configure environment variables
```bash
# Create .env file in root directory
PORT=5000
DB_HOST=localhost
DB_NAME=internship_db
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

5. Initialize database
```bash
# Run database migrations
npm run seed
```

6. Start the application
```bash
# Backend
npm start

# Frontend (in another terminal)
cd frontend
npm start
```

##  API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

### Students
- `GET /api/v1/students/dashboard` - Student dashboard
- `GET /api/v1/students/internships` - Browse internships
- `POST /api/v1/students/internships/:id/apply` - Apply to internship
- `GET /api/v1/students/applications` - View applications

### Service Chiefs
- `GET /api/v1/service-chiefs/dashboard` - Chief dashboard
- `POST /api/v1/service-chiefs/internships` - Create internship
- `GET /api/v1/service-chiefs/applications` - View applications
- `PATCH /api/v1/service-chiefs/applications/:id/status` - Update status

### Doctors
- `GET /api/v1/doctors/students` - View supervised students
- `POST /api/v1/doctors/evaluations/:id` - Submit evaluation

### Dean/Admin
- `GET /api/v1/dean/users` - Manage users
- `POST /api/v1/dean/establishments` - Create establishments
- `GET /api/v1/dean/statistics` - View statistics

##  Real-time Features

The system uses Socket.io for real-time notifications:
- Application status updates
- New internship postings
- Evaluation submissions
- System announcements

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- Input validation and sanitization

##  Database Schema

Key entities:
- **Users** (students, doctors, service_chiefs, dean)
- **Establishments** (hospitals, clinics)
- **Departments** (medical services)
- **Internships** (opportunities)
- **Applications** (student submissions)
- **Evaluations** (performance assessments)
- **Documents** (uploaded files)
- **Notifications** (system alerts)

##  User Roles

1. **Student** - Apply for internships, view evaluations
2. **Doctor** - Supervise students, submit evaluations
3. **Service Chief** - Manage internships, review applications
4. **Dean/Admin** - Full system administration


---

Built with ❤️ for improving medical education management

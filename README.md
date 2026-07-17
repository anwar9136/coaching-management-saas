<div align="center">

# Coaching Management System

A modern full-stack Coaching Management System built with the MERN Stack that enables coaching institutes to efficiently manage programs, courses, lectures, instructors, students, and lecture scheduling through a secure role-based dashboard.

**Live Demo:** https://YOUR_FRONTEND_URL

</div>

---

## Overview

The Coaching Management System is a Software-as-a-Service (SaaS) application designed for coaching institutes to digitize and simplify their day-to-day operations.

The platform provides separate dashboards for administrators and instructors, allowing administrators to manage the entire institute while instructors can manage their assigned lectures.

The application follows a scalable architecture using the MERN stack with JWT authentication and MongoDB Atlas for cloud data storage.

---

# Features

## Authentication & Authorization

- JWT Authentication
- Secure Password Hashing (bcrypt)
- Protected Routes
- Role-Based Access Control
- Persistent Login
- Instructor Approval Workflow

---

## Admin Features

- Dashboard Overview
- Manage Programs
- Manage Courses
- Manage Lectures
- Manage Students
- Manage Instructors
- Approve / Reject Instructor Requests
- Assign Instructors to Lectures
- Monitor Scheduled Lectures

---

## Instructor Features

- Instructor Dashboard
- View Assigned Lectures
- Update Instructor Profile
- View Course Information

---

## Program Management

- Create Programs
- Update Programs
- Delete Programs
- View Program Details

Examples:

- SSC
- HSC
- JEE
- NEET
- Programming
- Web Development

---

## Course Management

- Create Courses
- Edit Courses
- Delete Courses
- Organize Courses under Programs

---

## 🎥 Lecture Management

- Create Lectures
- Schedule Lectures
- Assign Instructor
- Update Lecture Details
- Delete Lectures
- View Lecture History

---

## Smart Lecture Scheduling

- Prevent Instructor Time Conflicts
- Validate Lecture Time Slots
- Multiple Lectures Per Day
- Automatic Availability Checking

---

## Student Management

- Register Students
- Program Enrollment
- Parent Information
- Fee Tracking
- Contact Details

---

## Cloud Features

- MongoDB Atlas Database
- Cloud Hosted Backend
- Cloud Hosted Frontend
- Environment Variable Configuration

---

# Tech Stack

### Frontend

- React
- React Router
- Axios
- Tailwind CSS
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

### Database

- MongoDB Atlas

### Deployment

- Frontend: Vercel
- Backend: Railway
- Database: MongoDB Atlas

---

# Project Structure

```
Coaching-Management-System
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── contexts
│   │   ├── hooks
│   │   ├── layouts
│   │   ├── pages
│   │   ├── services
│   │   └── utils
│   └── package.json
│
└── README.md
```

---

# Installation

## Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/coaching-management-system.git
```

```
cd coaching-management-system
```

---

## Backend Setup

```
cd backend
npm install
```

Create a `.env` file:

```
PORT=5000

MONGODB_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET_KEY
```

Run Backend

```
npm run dev
```

---

## Frontend Setup

```
cd frontend
npm install
```

Create a `.env` file

```
VITE_API_URL=http://localhost:5000/api
```

Run Frontend

```
npm run dev
```

---

# Roles

| Role | Permissions |
|------|-------------|
| Admin | Complete System Access |
| Instructor | Assigned Lectures & Profile |
| Pending Instructor | Await Approval |
| Student | Future Module |

---

# Screenshots

> Screenshots will be added soon.

- Login Page
- Admin Dashboard
- Instructor Dashboard
- Program Management
- Course Management
- Lecture Scheduling
- Student Management

---

# Live Demo

### Frontend

https://YOUR_FRONTEND_URL

### Backend API

https://YOUR_BACKEND_URL

---

# API Overview

### Authentication

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

### Programs

```
GET    /api/programs
POST   /api/programs
PUT    /api/programs/:id
DELETE /api/programs/:id
```

### Courses

```
GET    /api/courses
POST   /api/courses
PUT    /api/courses/:id
DELETE /api/courses/:id
```

### Lectures

```
GET    /api/lectures
POST   /api/lectures
PUT    /api/lectures/:id
DELETE /api/lectures/:id
```

### Students

```
GET    /api/students
POST   /api/students
PUT    /api/students/:id
DELETE /api/students/:id
```

### Instructors

```
GET    /api/instructors
PUT    /api/instructors/:id
```

---

# Future Enhancements

- Attendance Management
- Assignment Management
- Online Live Classes
- Payment Gateway Integration
- Email Notifications
- WhatsApp Notifications
- SMS Notifications
- Reports & Analytics
- Certificates
- Mobile Application

---

# Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

# Author

**Anwar Basha**

GitHub: https://github.com/YOUR_USERNAME

LinkedIn: https://linkedin.com/in/YOUR_PROFILE

---

# Support

If you found this project helpful, consider giving it a ⭐ on GitHub!

It helps others discover the project and motivates future development.

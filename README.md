# Hospital Backend System

This is a backend API system for managing hospital patient-doctor assignments, doctor notes, and scheduled reminders.

## Features

✔ User Authentication (Signup & Login)  
✔ Doctor Selection & Patient Assignments  
✔ Doctor Notes Submission (with AI Processing)  
✔ Secure Note Encryption  
✔ Automated Reminder Scheduling  
✔ Email Notifications

## Tech Stack

Node.js & Express.js (Backend Framework)
MongoDB & Mongoose (Database & ORM)
TypeScript (Strict Typing & Scalability)
JWT (JSON Web Token) (Authentication)
Bcrypt.js (Password Hashing)
Nodemailer (Email Notifications)
Google Gemini AI API (LLM Processing for Medical Actionable Steps)
Node-cron (Automated Scheduling for Reminders)

## Installation

1. **Clone the repository**  
   git clone https://github.com/yourusername/hospital-backend.git
   cd hospital-backend

2. **Install dependencies**
   npm install

3. **Set up .env file**
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/hospitalDB
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_email_password

4. **Start the server**
   npm run dev

## AI-Powered LLM Integration

This system leverages Google Gemini AI API to analyze doctor notes and extract structured, actionable steps:

Checklist: Immediate one-time tasks (e.g., "Buy medication").
Plan: A structured schedule (e.g., "Take medication daily for 7 days").
New notes cancel previous reminders, ensuring that patients always follow the latest instructions.
Example AI Response:
{
"checklist": ["Buy medication"],
"plan": [
{ "task": "Take medication", "repeat": "daily", "duration": "7 days" }
]
}

Automated Reminders (Cron Jobs)
The system automatically schedules patient reminders based on the AI-generated plan.

Uses node-cron to send daily reminders at 8 AM.
If a patient misses a check-in, the reminder extends (e.g., if a 7-day plan is missed once, reminders continue for 8 days).
Patients receive reminder emails until they check in.

**API Documentation**
View API docs at: http://localhost:5000/api-docs when the local server is running

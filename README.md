# Hospital Backend System

This is a backend API system for managing hospital patient-doctor assignments, doctor notes, and scheduled reminders.

## Features

✔ User Authentication (Signup & Login)  
✔ Doctor Selection & Patient Assignments  
✔ Doctor Notes Submission (with AI Processing)  
✔ Secure Note Encryption  
✔ Automated Reminder Scheduling  
✔ Email Notifications

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

**API Documentation**
    View API docs at: http://localhost:5000/api-docs when the local server is running
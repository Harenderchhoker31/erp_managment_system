EduMate — School ERP Management System

A full-stack School Management System with role-based dashboards for Admins, Teachers, and Students.

🌐 Live Demo: [erp-managment-system.vercel.app](https://erp-managment-system.vercel.app/login)
📁 Repository: github.com/Harenderchhoker31/erp_managment_system

🔐 Demo Login Credentials

Admin - admin@edumate.com  / admin  
Teacher - testteacher@teacher.edu / test
Student - test@student.edu / test

✨ Features
👨‍💼 Admin Panel

Manage students, teachers, and staff
View and configure school-wide settings
Monitor attendance, fees, and academic data
Role-based access control

👩‍🏫 Teacher Dashboard

View assigned classes and subjects
Manage student attendance
Upload grades and assignments
Communicate with students

🎓 Student Dashboard

View timetable and class schedule
Check attendance records
Access grades and results
View announcements and notices


🗂️ Project Structure
erp_managment_system/
├── backend/         # Node.js/Express REST API
├── frontend/        # React frontend application
└── README.md

🚀 Tech Stack
Frontend
TechnologyPurposeReactUI LibraryReact Router DOMClient-side routingTailwind CSSStylingViteBuild tool
Backend
TechnologyPurposeNode.jsRuntimeExpress.jsREST API frameworkMongoDBDatabaseJWTAuthentication

🛠️ Getting Started
Prerequisites

Node.js v18+
MongoDB (local or Atlas)
npm


Backend Setup
bash# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file
cp .env.example .env
# Fill in your MongoDB URI and JWT secret

# Start the development server
npm run dev
The API will run at http://localhost:5000

Frontend Setup
bash# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
The app will be available at http://localhost:5173

⚙️ Environment Variables
Create a .env file inside the backend/ directory:
envPORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

🚢 Deployment
This project is deployed using:

Frontend → Vercel
Backend → Your preferred Node.js host (Railway, Render, etc.)

Deploy Frontend to Vercel

Push the repo to GitHub.
Import the project into Vercel.
Set the root directory to frontend.
Vercel will auto-detect Vite settings.
Add your backend API URL as an environment variable.


🤝 Contributing

Fork the repository
Create a feature branch: git checkout -b feature/your-feature
Commit your changes: git commit -m "Add your feature"
Push to the branch: git push origin feature/your-feature
Open a Pull Request


👤 Author
Harenderchhoker31

GitHub: @Harenderchhoker31


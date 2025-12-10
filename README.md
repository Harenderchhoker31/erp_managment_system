# EduMate - Parent-Teacher Engagement & School Management Portal

A comprehensive school management system that enables seamless communication between parents and teachers, with features for tracking attendance, marks, assignments, events, and fee management.

## 🏗️ Project Structure

```
erp_managment_system/
├── frontend/          # React.js + Vite + TailwindCSS
├── backend/           # Node.js + Express + Prisma + MongoDB
└── README.md
```

## 🚀 Tech Stack

### Frontend
- **React.js** - UI Library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Prisma** - ORM
- **MongoDB** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Features

### Authentication & Authorization
- Role-based login (Parents, Teachers, Admin)
- JWT-based secure authentication

### For Parents
- Track multiple children's data
- View attendance reports
- Check exam marks and performance
- Monitor homework assignments
- Pay fees online
- Receive notifications and alerts
- Communicate with teachers

### For Teachers
- Upload student attendance
- Record exam marks
- Create assignments
- Post school events
- Manage class data

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Update .env file with your MongoDB connection string
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/edumate?retryWrites=true&w=majority"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=5000
```

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Push database schema:
```bash
npx prisma db push
```

6. Start development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - User login

### Students
- `GET /api/students` - Get parent's children

### Attendance
- `GET /api/attendance/:studentId` - Get student attendance
- `POST /api/attendance` - Upload attendance (Teacher)

### Marks
- `GET /api/marks/:studentId` - Get student marks
- `POST /api/marks` - Upload marks (Teacher)

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (Teacher)

### Assignments
- `GET /api/assignments/:studentId` - Get assignments
- `POST /api/assignments` - Create assignment (Teacher)

### Fees
- `GET /api/fee/:studentId` - Get fee details
- `POST /api/fee/pay` - Pay fees

### Notifications
- `GET /api/notifications` - Get user notifications

### Feedback
- `POST /api/feedback` - Submit feedback (Parent)

## 🔐 User Roles

### PARENT
- View children's academic data
- Pay fees
- Communicate with teachers
- Receive notifications

### TEACHER
- Manage student data
- Upload marks and attendance
- Create assignments and events
- View parent feedback

### ADMIN
- Manage all users
- Oversee system operations
- Generate reports

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`

### Backend (Render)
1. Connect GitHub repository to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables

## 📱 Future Enhancements

- Mobile app development
- Push notifications
- Advanced analytics
- File upload for assignments
- Video calling integration
- Multi-language support
- Offline mode capabilities

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

ADMIN_ID - admin@edumate.com
ADMIN_PASS - admin@123
TEACHER_ID - harry@teacher.edu
TEACHER_PASS - 12345
STUDENT_ID - akash@student.edu
STUDENT_PASS - 12345

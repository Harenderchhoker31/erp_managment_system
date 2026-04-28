# EduMate — School ERP Management System

> A full-stack School Management System with role-based dashboards for Admins, Teachers, and Students.

🌐 **Live Demo:** [erp-managment-system.vercel.app](https://erp-managment-system.vercel.app)  
📁 **Repository:** [github.com/Harenderchhoker31/erp_managment_system](https://github.com/Harenderchhoker31/erp_managment_system)

---

## 🔐 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@edumate.com | admin |
| Teacher | testteacher@teacher.edu | test |
| Student | test@student.edu | test |

---

## ✨ Features

### 👨‍💼 Admin Panel
- Manage students, teachers, and staff
- View and configure school-wide settings
- Monitor attendance, fees, and academic data
- Role-based access control

### 👩‍🏫 Teacher Dashboard
- View assigned classes and subjects
- Manage student attendance
- Upload grades and assignments
- Communicate with students

### 🎓 Student Dashboard
- View timetable and class schedule
- Check attendance records
- Access grades and results
- View announcements and notices

---

## 🗂️ Project Structure

```
erp_managment_system/
├── backend/         # Node.js/Express REST API
├── frontend/        # React frontend application
└── README.md
```

---

## 🚀 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React | UI Library |
| React Router DOM | Client-side routing |
| Tailwind CSS | Styling |
| Vite | Build tool |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | REST API framework |
| MongoDB | Database |
| JWT | Authentication |

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- npm

---

### Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file
cp .env.example .env
# Fill in your MongoDB URI and JWT secret

# Start the development server
npm run dev
```

The API will run at `http://localhost:5000`

---

### Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

## 🚢 Deployment

This project is deployed using:
- **Frontend** → [Vercel](https://vercel.com)
- **Backend** → Your preferred Node.js host (Railway, Render, etc.)

### Deploy Frontend to Vercel

1. Push the repo to GitHub.
2. Import the project into Vercel.
3. Set the **root directory** to `frontend`.
4. Vercel will auto-detect Vite settings.
5. Add your backend API URL as an environment variable.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 👤 Author

**Harenderchhoker31**

- GitHub: [@Harenderchhoker31](https://github.com/Harenderchhoker31)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

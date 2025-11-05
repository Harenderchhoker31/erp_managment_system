import { useAuth } from '../context/AuthContext';
import AdminPanel from './AdminPanel';
import StudentPanel from './StudentPanel';
import TeacherPanel from './TeacherPanel';

const Dashboard = () => {
  const { user } = useAuth();

  // Check user role first, then email domain
  if (user?.role === 'ADMIN') {
    return <AdminPanel />;
  }
  
  if (user?.email?.includes('@student.in')) {
    return <StudentPanel />;
  }
  
  if (user?.email?.includes('@teachers.in')) {
    return <TeacherPanel />;
  }

  // Default dashboard for other users
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to EduMate
        </h2>
        <p className="text-gray-600">
          Role: {user?.role} | Email: {user?.email}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
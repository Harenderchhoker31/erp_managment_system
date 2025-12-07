import { useAuth } from '../context/AuthContext';
import AdminPanel from './admin/AdminPanel';
import StudentPanel from './student/StudentPanel';
import TeacherPanel from './TeacherPanel';

const Dashboard = () => {
  const { user } = useAuth();


  if (user?.role === 'ADMIN') {
    return <AdminPanel />;
  }
  
  if (user?.role === 'STUDENT' || user?.email?.includes('@student.in')) {
    return <StudentPanel />;
  }
  
  if (user?.role === 'TEACHER' || user?.email?.includes('@teachers.in')) {
    return <TeacherPanel />;
  }

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
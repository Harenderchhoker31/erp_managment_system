import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SeeStudents from '../components/SeeStudents';
import SeeTeachers from '../components/SeeTeachers';
import AssignClass from '../components/AssignClass';

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const [activeDialog, setActiveDialog] = useState('dashboard');
  const [message, setMessage] = useState('');

  const handleSuccess = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🗞️' },
    { id: 'students', label: 'Manage Students', icon: '👥' },
    { id: 'teachers', label: 'Manage Teachers', icon: '👨' },
    { id: 'assign', label: 'Assign Classes', icon: '📚' },
    { id: 'attendance', label: 'Attendance', icon: '📋' },
    { id: 'marks', label: 'Marks & Grades', icon: '📊' },
    { id: 'events', label: 'Events & Notice', icon: '📅' },
    { id: 'fees', label: 'Fee Management', icon: '💰' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-red-600">EduMate Admin</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome, {user?.name}</p>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveDialog(item.id)}
              className="w-full flex items-center px-6 py-3 text-left text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-6 left-6">
          <button 
            onClick={logout}
            className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
          >
            <span className="mr-2">🚪</span>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b p-6">
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-600 mt-1">Manage students, teachers, and school operations</p>
        </header>
        
        <main className="p-6 h-full">
          {message && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded">
              <p className="text-green-700">{message}</p>
            </div>
          )}
          
          {activeDialog === 'dashboard' && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Admin Dashboard</h3>
              <p className="text-gray-600">Choose from the menu to manage different aspects of the school system</p>
            </div>
          )}
          
          {activeDialog === 'students' && (
            <div className="bg-white rounded-lg shadow-sm h-full">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">Manage Students</h2>
              </div>
              <div className="p-6 h-full overflow-auto">
                <SeeStudents
                  onClose={() => setActiveDialog(null)}
                  onSuccess={handleSuccess}
                  inline={true}
                />
              </div>
            </div>
          )}
          
          {activeDialog === 'teachers' && (
            <div className="bg-white rounded-lg shadow-sm h-full">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">Manage Teachers</h2>
              </div>
              <div className="p-6 h-full overflow-auto">
                <SeeTeachers
                  onClose={() => setActiveDialog(null)}
                  onSuccess={handleSuccess}
                  inline={true}
                />
              </div>
            </div>
          )}
          
          {activeDialog === 'assign' && (
            <AssignClass
              onClose={() => setActiveDialog(null)}
              onSuccess={handleSuccess}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
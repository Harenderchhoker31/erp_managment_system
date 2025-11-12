import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AddStudent from '../components/AddStudent';
import AddTeacher from '../components/AddTeacher';
import AssignClass from '../components/AssignClass';

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const [activeDialog, setActiveDialog] = useState(null);
  const [message, setMessage] = useState('');

  const handleSuccess = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-red-600">EduMate - Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button 
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h2>
          <p className="text-gray-600">Manage students, teachers, and school operations</p>
        </div>
        
        {message && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded">
            <p className="text-green-700">{message}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">See Students</h3>
            <p className="text-gray-600 mb-4">View and manage students</p>
            <button
              onClick={() => setActiveDialog('students')}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              See Students
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">See Teachers</h3>
            <p className="text-gray-600 mb-4">View and manage teachers</p>
            <button
              onClick={() => setActiveDialog('teachers')}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              See Teachers
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Assign Classes</h3>
            <p className="text-gray-600 mb-4">Assign teachers to classes</p>
            <button
              onClick={() => setActiveDialog('assign')}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Assign Class
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">School Settings</h3>
            <p className="text-gray-600">Configure system settings</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fee Management</h3>
            <p className="text-gray-600">Manage fee structure</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600">School performance analytics</p>
          </div>
        </div>
      </main>
      
      {activeDialog === 'student' && (
        <AddStudent
          onClose={() => setActiveDialog(null)}
          onSuccess={handleSuccess}
        />
      )}
      
      {activeDialog === 'teacher' && (
        <AddTeacher
          onClose={() => setActiveDialog(null)}
          onSuccess={handleSuccess}
        />
      )}
      
      {activeDialog === 'assign' && (
        <AssignClass
          onClose={() => setActiveDialog(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default AdminPanel;
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AddStudent from '../components/AddStudent';
import AddTeacher from '../components/AddTeacher';

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [message, setMessage] = useState('');

  const handleSuccess = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-red-50">
      <nav className="bg-red-600 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-white">EduMate - Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Student</h3>
              <p className="text-gray-600 mb-4">Add new student to database</p>
              <button
                onClick={() => setShowAddStudent(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add Student
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Teacher</h3>
              <p className="text-gray-600 mb-4">Add new teacher to database</p>
              <button
                onClick={() => setShowAddTeacher(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add Teacher
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">System Reports</h3>
              <p className="text-gray-600">View attendance and performance</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">School Settings</h3>
              <p className="text-gray-600">Configure system settings</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Fee Management</h3>
              <p className="text-gray-600">Manage fee structure</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics</h3>
              <p className="text-gray-600">School performance analytics</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
              <p className="text-gray-600">Send system-wide alerts</p>
            </div>
          </div>
        </div>
      </main>
      
      {showAddStudent && (
        <AddStudent
          onClose={() => setShowAddStudent(false)}
          onSuccess={handleSuccess}
        />
      )}
      
      {showAddTeacher && (
        <AddTeacher
          onClose={() => setShowAddTeacher(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default AdminPanel;
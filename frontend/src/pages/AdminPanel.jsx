import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AddStudent from '../components/AddStudent';
import AddTeacher from '../components/AddTeacher';

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const [activeDialog, setActiveDialog] = useState(null);
  const [message, setMessage] = useState('');

  const handleSuccess = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      <nav className="bg-gradient-to-r from-red-600 to-red-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white flex items-center">
                🏫 EduMate - Admin Panel
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white font-medium">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                🚪 Logout
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
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100">
              <div className="text-center">
                <div className="text-4xl mb-3">🎓</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Add Student</h3>
                <p className="text-gray-600 mb-4">Add new student to database</p>
                <button
                  onClick={() => setActiveDialog('student')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  ➕ Add Student
                </button>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100">
              <div className="text-center">
                <div className="text-4xl mb-3">👩‍🏫</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Add Teacher</h3>
                <p className="text-gray-600 mb-4">Add new teacher to database</p>
                <button
                  onClick={() => setActiveDialog('teacher')}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  ➕ Add Teacher
                </button>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-100">
              <div className="text-center">
                <div className="text-4xl mb-3">📈</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">System Reports</h3>
                <p className="text-gray-600">View attendance and performance</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-100">
              <div className="text-center">
                <div className="text-4xl mb-3">⚙️</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">School Settings</h3>
                <p className="text-gray-600">Configure system settings</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-yellow-100">
              <div className="text-center">
                <div className="text-4xl mb-3">💰</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Fee Management</h3>
                <p className="text-gray-600">Manage fee structure</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-indigo-100">
              <div className="text-center">
                <div className="text-4xl mb-3">📉</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Analytics</h3>
                <p className="text-gray-600">School performance analytics</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-pink-100">
              <div className="text-center">
                <div className="text-4xl mb-3">🔔</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Notifications</h3>
                <p className="text-gray-600">Send system-wide alerts</p>
              </div>
            </div>
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
    </div>
  );
};

export default AdminPanel;
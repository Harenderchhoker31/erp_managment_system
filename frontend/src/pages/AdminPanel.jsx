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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-50">
      <nav className="bg-white shadow-xl border-b-4 border-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl text-white">🏫</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  EduMate
                </h1>
                <p className="text-sm text-gray-600 font-medium">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-500">Administrator</p>
                <p className="font-semibold text-gray-800">{user?.name}</p>
              </div>
              <button
                onClick={logout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
          <p className="text-gray-600">Manage students, teachers, and school operations</p>
        </div>
        
        {message && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-800 px-6 py-4 rounded-r-xl mb-8 shadow-lg">
            <div className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              {message}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <div className="text-4xl mb-3">🏫</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Assign Classes</h3>
                <p className="text-gray-600 mb-4">Assign teachers to classes</p>
                <button
                  onClick={() => setActiveDialog('assign')}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  ➕ Assign Class
                </button>
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
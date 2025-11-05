import { useAuth } from '../context/AuthContext';

const StudentPanel = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white flex items-center">
                🎓 EduMate - Student Panel
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white font-medium">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100 cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-3">📅</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">My Attendance</h3>
                <p className="text-gray-600">View your attendance record</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100 cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">My Marks</h3>
                <p className="text-gray-600">Check exam results</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-100 cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-3">📝</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Assignments</h3>
                <p className="text-gray-600">View homework and assignments</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-100 cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-3">🕰️</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Timetable</h3>
                <p className="text-gray-600">View class schedule</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-pink-100 cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Events</h3>
                <p className="text-gray-600">School events and activities</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-yellow-100 cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-3">🔔</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Notifications</h3>
                <p className="text-gray-600">Important updates</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentPanel;
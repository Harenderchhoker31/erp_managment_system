import { useAuth } from '../context/AuthContext';

const TeacherPanel = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-green-50">
      <nav className="bg-green-600 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-white">EduMate - Teacher Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Mark Attendance</h3>
              <p className="text-gray-600">Record student attendance</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Marks</h3>
              <p className="text-gray-600">Enter exam and test scores</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create Assignments</h3>
              <p className="text-gray-600">Post homework and tasks</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">My Classes</h3>
              <p className="text-gray-600">Manage class schedules</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Student Reports</h3>
              <p className="text-gray-600">View student performance</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Events</h3>
              <p className="text-gray-600">Create school events</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherPanel;
import { useAuth } from '../../../context/AuthContext';

const Sidebar = ({ activeDialog, setActiveDialog }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'students', label: 'Manage Students' },
    { id: 'teachers', label: 'Manage Teachers' },
    { id: 'assign', label: 'Assign Classes' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'marks', label: 'Marks & Grades' },
    { id: 'events', label: 'Events & Notice' },
    { id: 'fees', label: 'Fee Management' },
    { id: 'notifications', label: 'Notifications' },
  ];

  return (
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
            className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
              activeDialog === item.id
                ? 'bg-red-100 text-red-600 border-r-4 border-red-600'
                : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
            }`}
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
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
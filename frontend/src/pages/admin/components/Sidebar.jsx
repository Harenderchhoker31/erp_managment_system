import { useAuth } from '../../../context/AuthContext';

const Sidebar = ({ activeDialog, setActiveDialog }) => {
  const { logout, user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'students', label: 'Manage Students' },
    { id: 'teachers', label: 'Manage Teachers' },
    { id: 'view-classes', label: 'Classes' },
    { id: 'assign', label: 'Assign Classes' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-red-600">
        <h1 className="text-2xl font-bold text-white">EduMate</h1>
        <p className="text-red-100 text-sm mt-1">Admin Panel</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-bold text-white">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900 truncate">{user?.name || 'Administrator'}</p>
            <p className="text-gray-600 text-xs truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveDialog(item.id)}
            className={`w-full text-left px-4 py-3 mb-1 rounded transition-colors ${activeDialog === item.id
              ? 'bg-red-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
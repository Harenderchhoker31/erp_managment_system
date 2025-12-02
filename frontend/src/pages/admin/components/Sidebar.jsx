import { useAuth } from '../../../context/AuthContext';

const Sidebar = ({ activeDialog, setActiveDialog }) => {
  const { logout, user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard'},
    { id: 'students', label: 'Manage Students'},
    { id: 'teachers', label: 'Manage Teachers'},
    { id: 'view-classes', label: 'Manage Classes' },
    { id: 'assign', label: 'Assign Class'},
    { id: 'events-notices', label: 'Events & Notice' },
    { id: 'salary', label: 'Salary Management' },
    { id: 'fees', label: 'Fees Management' },
  ];

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col fixed left-0 top-0 z-10">
      <div className="p-4 bg-red-600 text-white">
        <h1 className="text-xl font-bold">EduMate</h1>
        <p className="text-sm">Admin Panel</p>
      </div>

      <div className="p-3 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveDialog(item.id)}
            className={`w-full text-left p-3 mb-1 rounded flex items-center gap-3 ${activeDialog === item.id
              ? 'bg-red-600 text-white'
              : 'hover:bg-gray-100'
              }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-3 border-t">
        <button
          onClick={logout}
          className="w-full p-3 bg-gray-200 rounded hover:bg-gray-300 text-sm flex items-center gap-2"
        >
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
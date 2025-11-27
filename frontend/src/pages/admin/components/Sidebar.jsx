import { useAuth } from '../../../context/AuthContext';

const Sidebar = ({ activeDialog, setActiveDialog }) => {
  const { logout, user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', color: 'from-blue-500 to-blue-600' },
    { id: 'students', label: 'Students', icon: '👨‍🎓', color: 'from-green-500 to-green-600' },
    { id: 'teachers', label: 'Teachers', icon: '👨‍🏫', color: 'from-purple-500 to-purple-600' },
    { id: 'assign', label: 'Assign Classes', icon: '📚', color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="w-72 bg-gradient-to-b from-red-600 via-red-700 to-red-800 text-white min-h-screen flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-red-500/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-red-600">E</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">EduMate</h1>
            <p className="text-red-200 text-xs">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 bg-red-800/30 border-b border-red-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-white shadow-md">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{user?.name || 'Administrator'}</p>
            <p className="text-red-200 text-xs truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveDialog(item.id)}
            className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-300 transform hover:scale-105 group ${activeDialog === item.id
                ? 'bg-white text-red-600 shadow-xl scale-105'
                : 'hover:bg-red-700/50 text-white'
              }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${activeDialog === item.id
                  ? `bg-gradient-to-br ${item.color} shadow-lg`
                  : 'bg-red-800/30 group-hover:bg-red-700'
                }`}>
                <span className="text-xl">{item.icon}</span>
              </div>
              <div className="flex-1">
                <span className="font-semibold block">{item.label}</span>
                {activeDialog === item.id && (
                  <span className="text-xs text-red-400">Active</span>
                )}
              </div>
              {activeDialog === item.id && (
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              )}
            </div>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-red-500/30 space-y-3">
        <div className="px-4 py-2 bg-red-800/30 rounded-lg">
          <p className="text-xs text-red-200">System Status</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">All Systems Online</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
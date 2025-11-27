import { useAuth } from '../../../context/AuthContext';

const StudentSidebar = ({ activeSection, setActiveSection }) => {
    const { logout } = useAuth();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'attendance', label: 'Attendance', icon: '📅' },
        { id: 'marks', label: 'Marks', icon: '📝' },
        { id: 'assignments', label: 'Assignments', icon: '📚' },
        { id: 'fees', label: 'Fees', icon: '💰' },
        { id: 'events', label: 'Events', icon: '🎉' },
    ];

    return (
        <div className="w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white min-h-screen flex flex-col">
            <div className="p-6 border-b border-indigo-500">
                <h1 className="text-2xl font-bold">EduMate</h1>
                <p className="text-indigo-200 text-sm mt-1">Student Portal</p>
            </div>

            <nav className="flex-1 p-4">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all duration-200 flex items-center gap-3 ${activeSection === item.id
                                ? 'bg-white text-indigo-600 shadow-lg'
                                : 'hover:bg-indigo-700 text-white'
                            }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-indigo-500">
                <button
                    onClick={logout}
                    className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200 font-medium"
                >
                    🚪 Logout
                </button>
            </div>
        </div>
    );
};

export default StudentSidebar;

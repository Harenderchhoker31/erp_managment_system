import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { teacherAPI } from '../../../utils/api';

const TeacherSidebar = ({ activeSection, setActiveSection }) => {
  const { logout, user } = useAuth();
  const [isClassTeacher, setIsClassTeacher] = useState(false);

  useEffect(() => {
    checkClassTeacherStatus();
  }, []);

  const checkClassTeacherStatus = async () => {
    try {
      const response = await teacherAPI.getClasses();
      const hasClassTeacherRole = response.data.some(cls => cls.isClassTeacher);
      setIsClassTeacher(hasClassTeacherRole);
    } catch (error) {
      console.error('Error checking class teacher status:', error);
    }
  };

  const baseMenuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'marks', label: 'Upload Marks' },
    { id: 'assignments', label: 'Assignments' },
    { id: 'classes', label: 'My Classes' },
    { id: 'students', label: 'View Students' },
    { id: 'create-events', label: 'Create Events' },
  ];

  const menuItems = isClassTeacher 
    ? [baseMenuItems[0], { id: 'attendance', label: 'Mark Attendance' }, ...baseMenuItems.slice(1), { id: 'notices', label: 'Create Notice' }, { id: 'feedback', label: 'Parent Feedback' }]
    : [...baseMenuItems, { id: 'notices', label: 'Create Notice' }, { id: 'feedback', label: 'Parent Feedback' }];

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col fixed left-0 top-0 z-10">
      <div className="p-4 bg-red-600 text-white">
        <h1 className="text-xl font-bold">EduMate</h1>
        <p className="text-sm">Teacher Panel</p>
      </div>

      <div className="p-3 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm">
            {user?.name?.charAt(0) || 'T'}
          </div>
          <div>
            <p className="text-sm font-medium">{user?.name || 'Teacher'}</p>
            <p className="text-xs text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full text-left p-3 mb-1 rounded flex items-center gap-3 ${activeSection === item.id
              ? 'bg-red-600 text-white'
              : 'hover:bg-gray-100'
              }`}
          >
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

export default TeacherSidebar;

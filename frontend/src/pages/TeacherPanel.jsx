import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TeacherSidebar from './teacher/components/TeacherSidebar';
import TeacherDashboard from './teacher/components/TeacherDashboard';
import MarkAttendance from './teacher/components/MarkAttendance';
import UploadMarks from './teacher/components/UploadMarks';
import CreateAssignment from './teacher/components/CreateAssignment';
import ViewClasses from './teacher/components/ViewClasses';
import CreateEvent from './teacher/components/CreateEvent';

const TeacherPanel = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <TeacherDashboard />;
      case 'attendance':
        return <MarkAttendance />;
      case 'marks':
        return <UploadMarks />;
      case 'assignments':
        return <CreateAssignment />;
      case 'classes':
        return <ViewClasses />;
      case 'events':
        return <CreateEvent />;
      default:
        return <TeacherDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TeacherSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b p-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace(/([A-Z])/g, ' $1')}
          </h2>
          <p className="text-gray-600 mt-1">Welcome, {user?.name}</p>
        </header>

        <main className="p-6 flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default TeacherPanel;
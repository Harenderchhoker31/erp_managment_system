import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TeacherSidebar from './teacher/components/TeacherSidebar';
import TeacherDashboard from './teacher/components/TeacherDashboard';
import MarkAttendance from './teacher/components/MarkAttendance';
import UploadMarks from './teacher/components/UploadMarks';
import CreateAssignment from './teacher/components/CreateAssignment';
import ViewClasses from './teacher/components/ViewClasses';
import CreateEvent from './teacher/components/CreateEvent';
import ViewStudents from './teacher/components/ViewStudents';
import ViewNotices from './teacher/components/ViewNotices';
import ParentFeedback from './teacher/components/ParentFeedback';

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
      case 'students':
        return <ViewStudents />;
      case 'events':
        return <CreateEvent />;
      case 'notices':
        return <ViewNotices />;
      case 'feedback':
        return <ParentFeedback />;
      default:
        return <TeacherDashboard />;
    }
  };

  const handleSuccess = (msg) => {
    // Handle success messages if needed
    console.log(msg);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TeacherSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b p-6">
          <h2 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h2>
          <p className="text-gray-600 mt-1">Manage classes, attendance, and student progress</p>
        </header>

        <main className="p-6 h-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default TeacherPanel;
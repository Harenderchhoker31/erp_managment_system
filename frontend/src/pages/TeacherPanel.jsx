import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { teacherAPI } from '../utils/api';
import TeacherSidebar from './teacher/components/TeacherSidebar';
import TeacherDashboard from './teacher/components/TeacherDashboard';
import MarkAttendance from './teacher/components/MarkAttendance';
import UploadMarks from './teacher/components/UploadMarks';
import CreateAssignment from './teacher/components/CreateAssignment';
import ViewClasses from './teacher/components/ViewClasses';
import CreateEvent from './teacher/components/CreateEvent';
import CreateEventComponent from './teacher/components/CreateEventComponent';
import ViewStudents from './teacher/components/ViewStudents';

import ParentFeedback from './teacher/components/ParentFeedback';

const TeacherPanel = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
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

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <TeacherDashboard />;
      case 'attendance':
        if (!isClassTeacher) {
          return (
            <div className="bg-white border border-gray-300 rounded p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Access Restricted</h3>
              <p className="text-gray-600">Only class teachers can mark attendance.</p>
            </div>
          );
        }
        return <MarkAttendance />;
      case 'marks':
        return <UploadMarks />;
      case 'assignments':
        return <CreateAssignment />;
      case 'classes':
        return <ViewClasses />;
      case 'students':
        return <ViewStudents />;

      case 'create-events':
        return <CreateEventComponent />;
      case 'notices':
        return <CreateEvent />;
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
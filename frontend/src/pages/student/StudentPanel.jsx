import { useState } from 'react';
import StudentSidebar from './components/StudentSidebar';
import StudentDashboard from './components/StudentDashboard';
import ViewAttendance from './components/ViewAttendance';
import ViewMarks from './components/ViewMarks';
import ViewAssignments from './components/ViewAssignments';
import ViewFees from './components/ViewFees';
import ViewEvents from './components/ViewEvents';
import ViewNotices from './components/ViewNotices';
import SendFeedback from './components/SendFeedback';

const StudentPanel = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <StudentDashboard />;
      case 'attendance':
        return <ViewAttendance />;
      case 'marks':
        return <ViewMarks />;
      case 'assignments':
        return <ViewAssignments />;
      case 'fees':
        return <ViewFees />;
      case 'events':
        return <ViewEvents />;
      case 'notices':
        return <ViewNotices />;
      case 'feedback':
        return <SendFeedback />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StudentSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b p-6">
          <h2 className="text-2xl font-bold text-gray-900">Student Portal</h2>
          <p className="text-gray-600 mt-1">Access your academic information and school updates</p>
        </header>

        <main className="p-6 h-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default StudentPanel;
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import StudentSidebar from './student/components/StudentSidebar';
import StudentDashboard from './student/components/StudentDashboard';
import AttendanceView from './student/components/AttendanceView';
import MarksView from './student/components/MarksView';
import AssignmentsView from './student/components/AssignmentsView';
import FeesView from './student/components/FeesView';
import EventsView from './student/components/EventsView';

const StudentPanel = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <StudentDashboard />;
      case 'attendance':
        return <AttendanceView />;
      case 'marks':
        return <MarksView />;
      case 'assignments':
        return <AssignmentsView />;
      case 'fees':
        return <FeesView />;
      case 'events':
        return <EventsView />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StudentSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b p-6">
          <h2 className="text-2xl font-bold text-gray-900">Student Dashboard</h2>
          <p className="text-gray-600 mt-1">View your academic progress and school information</p>
        </header>

        <main className="p-6 h-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default StudentPanel;
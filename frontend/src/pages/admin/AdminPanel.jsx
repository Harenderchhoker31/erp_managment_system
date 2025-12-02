import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ManageStudents from './components/ManageStudents';
import ManageTeachers from './components/ManageTeachers';
import ManageClasses from './components/ManageClasses';
import ViewClasses from './components/ViewClasses';
import ManageEventsNotices from './components/ManageEventsNotices';
import SalaryManagement from './components/SalaryManagement';
import FeeManagement from './components/FeeManagement';

const AdminPanel = () => {
  const [activeDialog, setActiveDialog] = useState('dashboard');
  const [message, setMessage] = useState('');

  const handleSuccess = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const renderContent = () => {
    switch (activeDialog) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <ManageStudents onSuccess={handleSuccess} />;
      case 'teachers':
        return <ManageTeachers onSuccess={handleSuccess} />;
      case 'view-classes':
        return <ViewClasses />;
      case 'assign':
        return <ManageClasses onSuccess={handleSuccess} />;
      case 'events-notices':
        return <ManageEventsNotices onSuccess={handleSuccess} />;
      case 'salary':
        return <SalaryManagement onSuccess={handleSuccess} />;
      case 'fees':
        return <FeeManagement onSuccess={handleSuccess} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeDialog={activeDialog} setActiveDialog={setActiveDialog} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b p-6">
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-600 mt-1">Manage students, teachers, and school operations</p>
        </header>

        <main className="p-6 h-full">
          {message && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded">
              <p className="text-green-700">{message}</p>
            </div>
          )}

          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
/* completed */
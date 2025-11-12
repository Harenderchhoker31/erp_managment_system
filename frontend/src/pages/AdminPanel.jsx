import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AddStudent from '../components/AddStudent';
import AddTeacher from '../components/AddTeacher';
import AssignClass from '../components/AssignClass';

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const [activeDialog, setActiveDialog] = useState(null);
  const [message, setMessage] = useState('');

  const handleSuccess = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <nav>
        <div>
          <div>
            <div>
              <h1>EduMate - Admin</h1>
            </div>
            <div>
              <span>Welcome, {user?.name}</span>
              <button onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div>
          <h2>
            Admin Dashboard
          </h2>
          <p>Manage students, teachers, and school operations</p>
        </div>
        
        {message && (
          <div>
            {message}
          </div>
        )}
        
        <div>
          <div>
            <h3>Add Student</h3>
            <p>Add new student to database</p>
            <button
              onClick={() => setActiveDialog('student')}
            >
              Add Student
            </button>
          </div>
          
          <div>
            <h3>Add Teacher</h3>
            <p>Add new teacher to database</p>
            <button
              onClick={() => setActiveDialog('teacher')}
            >
              Add Teacher
            </button>
          </div>
          
          <div>
            <h3>Assign Classes</h3>
            <p>Assign teachers to classes</p>
            <button
              onClick={() => setActiveDialog('assign')}
            >
              Assign Class
            </button>
          </div>
          
          <div>
            <h3>School Settings</h3>
            <p>Configure system settings</p>
          </div>
          
          <div>
            <h3>Fee Management</h3>
            <p>Manage fee structure</p>
          </div>
          
          <div>
            <h3>Analytics</h3>
            <p>School performance analytics</p>
          </div>
        </div>
      </main>
      
      {activeDialog === 'student' && (
        <AddStudent
          onClose={() => setActiveDialog(null)}
          onSuccess={handleSuccess}
        />
      )}
      
      {activeDialog === 'teacher' && (
        <AddTeacher
          onClose={() => setActiveDialog(null)}
          onSuccess={handleSuccess}
        />
      )}
      
      {activeDialog === 'assign' && (
        <AssignClass
          onClose={() => setActiveDialog(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default AdminPanel;
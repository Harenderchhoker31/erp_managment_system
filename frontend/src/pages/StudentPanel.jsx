import { useAuth } from '../context/AuthContext';

const StudentPanel = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <nav>
        <div>
          <div>
            <div>
              <h1>EduMate - Student</h1>
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
            Student Dashboard
          </h2>
          <p>Track your academic progress and school activities</p>
        </div>
        
        <div>
          <div>
            <h3>My Attendance</h3>
            <p>View your attendance record</p>
          </div>
          
          <div>
            <h3>My Marks</h3>
            <p>Check exam results</p>
          </div>
          
          <div>
            <h3>Assignments</h3>
            <p>View homework and assignments</p>
          </div>
          
          <div>
            <h3>Timetable</h3>
            <p>View class schedule</p>
          </div>
          
          <div>
            <h3>Events</h3>
            <p>School events and activities</p>
          </div>
          
          <div>
            <h3>Notifications</h3>
            <p>Important updates</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentPanel;
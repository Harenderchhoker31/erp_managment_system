import { useAuth } from '../context/AuthContext';

const TeacherPanel = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <nav>
        <div>
          <div>
            <div>
              <h1>EduMate - Teacher</h1>
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
            Teacher Dashboard
          </h2>
          <p>Manage your classes and students</p>
        </div>
        
        <div>
          <div>
            <h3>Mark Attendance</h3>
            <p>Record student attendance</p>
          </div>
          
          <div>
            <h3>Upload Marks</h3>
            <p>Enter exam scores</p>
          </div>
          
          <div>
            <h3>Create Assignments</h3>
            <p>Post homework tasks</p>
          </div>
          
          <div>
            <h3>My Classes</h3>
            <p>Manage class schedules</p>
          </div>
          
          <div>
            <h3>Student Reports</h3>
            <p>View student performance</p>
          </div>
          
          <div>
            <h3>Events</h3>
            <p>Create school events</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherPanel;
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.data?.error?.includes('expired')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  signup: (userData) => api.post('/api/auth/signup', userData),
};

// Admin API
export const adminAPI = {
  getStudents: () => api.get('/api/admin/students'),
  addStudent: (studentData) => api.post('/api/admin/students', studentData),
  updateStudent: (id, studentData) => api.put(`/api/admin/students/${id}`, studentData),
  deleteStudent: (id) => api.delete(`/api/admin/students/${id}`),
  getTeachers: () => api.get('/api/admin/teachers'),
  addTeacher: (teacherData) => api.post('/api/admin/teachers', teacherData),
  updateTeacher: (id, teacherData) => api.put(`/api/admin/teachers/${id}`, teacherData),
  deleteTeacher: (id) => api.delete(`/api/admin/teachers/${id}`),
  assignClass: (assignmentData) => api.post('/api/admin/assign-class', assignmentData),
  getTeacherClasses: (teacherId) => api.get(`/api/admin/teacher-classes/${teacherId}`),
  getClasses: () => api.get('/api/admin/classes'),
  getAllClasses: () => api.get('/api/admin/all-classes'),
  getStudentsByClass: (className, section) => api.get(`/api/admin/students/class/${encodeURIComponent(className)}/${encodeURIComponent(section)}`),
  getStats: () => api.get('/api/admin/stats'),
  getMarks: () => api.get('/api/admin/marks'),
};

// Student API
export const studentAPI = {
  getProfile: () => api.get('/api/student/profile'),
  getAttendance: () => api.get('/api/student/attendance'),
  getMarks: () => api.get('/api/student/marks'),
  getAssignments: () => api.get('/api/student/assignments'),
  getFees: () => api.get('/api/student/fees'),
  getEvents: () => api.get('/api/student/events'),
  getNotifications: () => api.get('/api/student/notifications'),
};

// Teacher API
export const teacherAPI = {
  getProfile: () => api.get('/api/teacher/profile'),
  getClasses: () => api.get('/api/teacher/classes'),
  getStudents: (className, section) => api.get(`/api/teacher/students/${className}/${section}`),
  markAttendance: (attendanceData) => api.post('/api/teacher/attendance', attendanceData),
  uploadMarks: (marksData) => api.post('/api/teacher/marks', marksData),
  createAssignment: (assignmentData) => api.post('/api/teacher/assignments', assignmentData),
  getAssignments: () => api.get('/api/teacher/assignments'),
  createEvent: (eventData) => api.post('/api/teacher/events', eventData),
  getMyEvents: () => api.get('/api/teacher/events'),
  getEvents: () => api.get('/api/admin/events'),
  createNotice: (noticeData) => api.post('/api/teacher/notices', noticeData),
  getNotices: () => api.get('/api/teacher/notices'),
  getFeedback: () => api.get('/api/teacher/feedback'),
};

export default api;
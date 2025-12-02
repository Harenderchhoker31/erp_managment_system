import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ students: 0, teachers: 0, classes: 0, attendance: {} });
  const [thoughtOfDay, setThoughtOfDay] = useState('Education is the most powerful weapon which you can use to change the world.');
  const [isEditingThought, setIsEditingThought] = useState(false);
  const [tempThought, setTempThought] = useState('');
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);
  const [feeStats, setFeeStats] = useState({ paid: 0, unpaid: 0 });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchStats();
    fetchUpcomingEvents();
    fetchRecentNotices();
    fetchFeeStats();
  }, []);

  useEffect(() => {
    fetchFeeStats();
  }, [selectedMonth, selectedYear]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://erp-managment-system-xx77.vercel.app/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats({
        students: response.data.totalStudents,
        teachers: response.data.totalTeachers,
        classes: response.data.totalClasses,
        attendance: response.data.attendance
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchUpcomingEvents = async () => {
    try {
      const response = await api.get('/api/admin/events');
      const now = new Date();
      const upcoming = response.data
        .filter(event => new Date(event.date) >= now)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);
      setUpcomingEvents(upcoming);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setUpcomingEvents([]);
    }
  };

  const fetchRecentNotices = async () => {
    try {
      const response = await api.get('/api/admin/notices');
      const recent = response.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      setRecentNotices(recent);
    } catch (error) {
      console.error('Failed to fetch notices:', error);
      setRecentNotices([]);
    }
  };

  const fetchFeeStats = async () => {
    try {
      const [studentsRes, feesRes] = await Promise.all([
        api.get('/api/admin/students'),
        api.get('/api/admin/fees')
      ]);
      
      const totalStudents = studentsRes.data.length;
      const paidFees = feesRes.data.filter(f => 
        f.month === selectedMonth && 
        f.year === selectedYear && 
        f.status === 'PAID'
      ).length;
      
      setFeeStats({
        paid: paidFees,
        unpaid: totalStudents - paidFees
      });
    } catch (error) {
      console.error('Failed to fetch fee stats:', error);
    }
  };

  const handleEditThought = () => {
    setTempThought(thoughtOfDay);
    setIsEditingThought(true);
  };

  const handleSaveThought = () => {
    setThoughtOfDay(tempThought);
    setIsEditingThought(false);
  };

  const handleCancelEdit = () => {
    setTempThought('');
    setIsEditingThought(false);
  };

  const handleDeleteThought = () => {
    setThoughtOfDay('');
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">{stats.students}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Teachers</p>
            <p className="text-2xl font-bold text-gray-900">{stats.teachers}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 mb-2">Fee Status</p>
            <select
              value={`${selectedYear}-${String(selectedMonth).padStart(2, '0')}`}
              onChange={(e) => {
                const [year, month] = e.target.value.split('-');
                setSelectedYear(parseInt(year));
                setSelectedMonth(parseInt(month));
              }}
              className="w-full px-2 py-1 border rounded text-xs mb-3"
            >
              {Array.from({ length: 12 }, (_, i) => {
                const month = i + 1;
                const year = selectedYear;
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return (
                  <option key={`${year}-${month}`} value={`${year}-${String(month).padStart(2, '0')}`}>
                    {monthNames[month - 1]} {year}
                  </option>
                );
              })}
            </select>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-green-600">Paid:</span>
                <span className="text-sm font-semibold text-green-600">{feeStats.paid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-red-600">Unpaid:</span>
                <span className="text-sm font-semibold text-red-600">{feeStats.unpaid}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thought of the Day */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">💭 Thought of the Day</h3>
          <div className="flex space-x-2">
            {!isEditingThought && (
              <>
                <button
                  onClick={handleEditThought}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteThought}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {isEditingThought ? (
          <div className="space-y-3">
            <textarea
              value={tempThought}
              onChange={(e) => setTempThought(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows="3"
              placeholder="Enter thought of the day..."
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSaveThought}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg">
            {thoughtOfDay ? (
              <p className="text-gray-700 italic text-center">"{thoughtOfDay}"</p>
            ) : (
              <p className="text-gray-500 text-center">No thought added yet. Click Edit to add one.</p>
            )}
          </div>
        )}
      </div>

      {/* Events and Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Upcoming Events</h3>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-medium text-gray-800">{event.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  <p className="text-xs text-blue-600 mt-2">
                    {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No upcoming events scheduled.</p>
          )}
        </div>

        {/* Recent Notices */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Recent Notices</h3>
          {recentNotices.length > 0 ? (
            <div className="space-y-3">
              {recentNotices.map((notice) => (
                <div key={notice.id} className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-gray-800">{notice.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded ${
                      notice.type === 'GENERAL' ? 'bg-gray-100 text-gray-800' :
                      notice.type === 'ATTENDANCE' ? 'bg-yellow-100 text-yellow-800' :
                      notice.type === 'MARKS' ? 'bg-green-100 text-green-800' :
                      notice.type === 'EVENT' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {notice.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{notice.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent notices.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import { useState, useEffect } from 'react';
import api from '../../../utils/api';

const Calendar = ({ events, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const getEventsForDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date.startsWith(dateStr));
  };
  
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];
  
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          ‹
        </button>
        <h3 className="text-lg font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button 
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          ›
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-semibold p-2 text-gray-600">{day}</div>
        ))}
        
        {days.map((day, index) => {
          const dayEvents = day ? getEventsForDate(day) : [];
          return (
            <div 
              key={index} 
              className={`p-2 h-12 border rounded cursor-pointer hover:bg-gray-50 ${
                day ? 'bg-white' : 'bg-gray-100'
              } ${dayEvents.length > 0 ? 'bg-blue-50 border-blue-200' : ''}`}
              onClick={() => day && onDateSelect && onDateSelect(day)}
            >
              {day && (
                <>
                  <div className="text-sm">{day}</div>
                  {dayEvents.length > 0 && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto"></div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ManageEventsNotices = ({ onSuccess }) => {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  
  const [eventData, setEventData] = useState({ title: '', description: '', date: '' });
  const [noticeData, setNoticeData] = useState({ title: '', message: '', type: 'GENERAL' });

  const fetchEvents = async () => {
    try {
      const response = await api.get('/api/admin/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchNotices = async () => {
    try {
      const response = await api.get('/api/admin/notices');
      setNotices(response.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchNotices();
  }, []);

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/events', eventData);
      onSuccess('Event created successfully');
      setEventData({ title: '', description: '', date: '' });
      setShowEventForm(false);
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/notices', noticeData);
      onSuccess('Notice created successfully');
      setNoticeData({ title: '', message: '', type: 'GENERAL' });
      setShowNoticeForm(false);
      fetchNotices();
    } catch (error) {
      console.error('Error creating notice:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/api/admin/events/${eventId}`);
        onSuccess('Event deleted successfully');
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleDeleteNotice = async (noticeId) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await api.delete(`/api/admin/notices/${noticeId}`);
        onSuccess('Notice deleted successfully');
        fetchNotices();
      } catch (error) {
        console.error('Error deleting notice:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'events' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
          >
            Events
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'notices' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
          >
            Notices
          </button>
        </div>
        <button
          onClick={() => activeTab === 'events' ? setShowEventForm(true) : setShowNoticeForm(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Add {activeTab === 'events' ? 'Event' : 'Notice'}
        </button>
      </div>

      {/* Event Form */}
      {showEventForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleEventSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Event Title"
              value={eventData.title}
              onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <textarea
              placeholder="Event Description"
              value={eventData.description}
              onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows="3"
              required
            />
            <input
              type="datetime-local"
              value={eventData.date}
              onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <div className="flex space-x-3">
              <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg">Create</button>
              <button type="button" onClick={() => setShowEventForm(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Notice Form */}
      {showNoticeForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleNoticeSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Notice Title"
              value={noticeData.title}
              onChange={(e) => setNoticeData({ ...noticeData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <textarea
              placeholder="Notice Message"
              value={noticeData.message}
              onChange={(e) => setNoticeData({ ...noticeData, message: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows="3"
              required
            />
            <select
              value={noticeData.type}
              onChange={(e) => setNoticeData({ ...noticeData, type: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="GENERAL">General</option>
              <option value="ATTENDANCE">Attendance</option>
              <option value="MARKS">Marks</option>
              <option value="EVENT">Event</option>
              <option value="FEE">Fee</option>
            </select>
            <div className="flex space-x-3">
              <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg">Create</button>
              <button type="button" onClick={() => setShowNoticeForm(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Content */}
      {activeTab === 'events' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-4">Calendar View</h4>
            <Calendar events={events} />
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Upcoming Events</h4>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {events.map((event) => (
                <div key={event.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-800">{event.title}</h5>
                      <p className="text-gray-600 mt-1 text-sm">{event.description}</p>
                      <p className="text-sm text-blue-600 mt-2 font-medium">
                        {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="ml-2 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h4 className="text-lg font-semibold mb-4">All Notices</h4>
          <div className="grid gap-4">
            {notices.map((notice) => (
              <div key={notice.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-semibold text-gray-800">{notice.title}</h5>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded ${
                      notice.type === 'GENERAL' ? 'bg-gray-100 text-gray-800' :
                      notice.type === 'ATTENDANCE' ? 'bg-yellow-100 text-yellow-800' :
                      notice.type === 'MARKS' ? 'bg-green-100 text-green-800' :
                      notice.type === 'EVENT' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {notice.type}
                    </span>
                    <button
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mt-2">{notice.message}</p>
                <p className="text-xs text-gray-500 mt-3">
                  Created: {new Date(notice.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEventsNotices;
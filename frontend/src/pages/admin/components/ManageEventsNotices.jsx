import { useState, useEffect } from 'react';
import api from '../../../utils/api';

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
      <div className="grid gap-4">
        {activeTab === 'events' && events.map((event) => (
          <div key={event.id} className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold">{event.title}</h4>
            <p className="text-gray-600 mt-1">{event.description}</p>
            <p className="text-sm text-blue-600 mt-2">{new Date(event.date).toLocaleString()}</p>
          </div>
        ))}
        
        {activeTab === 'notices' && notices.map((notice) => (
          <div key={notice.id} className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold">{notice.title}</h4>
            <p className="text-gray-600 mt-1">{notice.message}</p>
            <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-xs rounded">{notice.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageEventsNotices;
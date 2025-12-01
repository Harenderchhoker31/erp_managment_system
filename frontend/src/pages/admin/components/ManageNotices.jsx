import { useState, useEffect } from 'react';
import api from '../../../utils/api';

const ManageNotices = ({ onSuccess }) => {
  const [notices, setNotices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'GENERAL'
  });

  const fetchNotices = async () => {
    try {
      const response = await api.get('/api/admin/notices');
      setNotices(response.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/notices', formData);
      onSuccess('Notice created successfully');
      setFormData({ title: '', message: '', type: 'GENERAL' });
      setShowForm(false);
      fetchNotices();
    } catch (error) {
      console.error('Error creating notice:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Manage Notices</h3>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Add Notice
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows="4"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="GENERAL">General</option>
                <option value="ATTENDANCE">Attendance</option>
                <option value="MARKS">Marks</option>
                <option value="EVENT">Event</option>
                <option value="FEE">Fee</option>
              </select>
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg">
                Create Notice
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {notices.map((notice) => (
          <div key={notice.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{notice.title}</h4>
                <p className="text-gray-600 mt-1">{notice.message}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-xs rounded">
                  {notice.type}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(notice.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageNotices;
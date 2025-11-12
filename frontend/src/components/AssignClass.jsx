import { useState, useEffect } from 'react';
import axios from 'axios';

const AssignClass = ({ onClose, onSuccess }) => {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    teacherId: '',
    className: '',
    section: '',
    subject: '',
    isClassTeacher: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/api/admin/teachers');
      setTeachers(response.data);
    } catch (error) {
      setError('Failed to fetch teachers');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/api/admin/assign-class', formData);
      onSuccess('Teacher assigned to class successfully');
      onClose();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to assign teacher');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-100" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Assign Teacher to Class</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <select
              value={formData.teacherId}
              onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Teacher</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} - {teacher.subject}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Class (e.g., 10th)"
              value={formData.className}
              onChange={(e) => setFormData({...formData, className: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Section (e.g., A)"
              value={formData.section}
              onChange={(e) => setFormData({...formData, section: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <input
            type="text"
            placeholder="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isClassTeacher"
              checked={formData.isClassTeacher}
              onChange={(e) => setFormData({...formData, isClassTeacher: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="isClassTeacher" className="text-sm text-gray-700">
              Is Class Teacher
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Assigning...' : 'Assign Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignClass;
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
    <div onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <div>
          <h2>Assign Teacher to Class</h2>
          <button onClick={onClose}>
            ×
          </button>
        </div>
        
        {error && (
          <div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <select
              value={formData.teacherId}
              onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
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

          <div>
            <div>
              <input
                type="text"
                placeholder="Class (e.g., 10th)"
                value={formData.className}
                onChange={(e) => setFormData({...formData, className: e.target.value})}
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Section (e.g., A)"
                value={formData.section}
                onChange={(e) => setFormData({...formData, section: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              required
            />
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                checked={formData.isClassTeacher}
                onChange={(e) => setFormData({...formData, isClassTeacher: e.target.checked})}
              />
              Is Class Teacher
            </label>
          </div>

          <div>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
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
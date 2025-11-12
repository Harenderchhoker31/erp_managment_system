import { useState } from 'react';
import axios from 'axios';

const AddStudent = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    rollNo: '',
    class: '',
    section: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    phone: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    bloodGroup: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/api/admin/students', formData);
      onSuccess('Student added successfully');
      onClose();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add student');
    }
    setLoading(false);
  };

  return (
    <div onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <div>
          <h2>Add New Student</h2>
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
            <div>
              <input
                type="email"
                placeholder="Email (must contain @student.in)"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Roll Number"
                value={formData.rollNo}
                onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Class"
                value={formData.class}
                onChange={(e) => setFormData({...formData, class: e.target.value})}
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Section"
                value={formData.section}
                onChange={(e) => setFormData({...formData, section: e.target.value})}
                required
              />
            </div>
            <div>
              <input
                type="date"
                placeholder="Date of Birth"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                required
              />
            </div>
            <div>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          
          <div>
            <textarea
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              rows="2"
              required
            />
          </div>

          <div>
            <div>
              <input
                type="text"
                placeholder="Parent Name"
                value={formData.parentName}
                onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                required
              />
            </div>
            <div>
              <input
                type="tel"
                placeholder="Parent Phone"
                value={formData.parentPhone}
                onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Parent Email"
                value={formData.parentEmail}
                onChange={(e) => setFormData({...formData, parentEmail: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
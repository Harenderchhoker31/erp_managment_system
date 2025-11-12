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
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Student</h2>
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
          <div className="grid grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Email (must contain @student.in)"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Roll Number"
              value={formData.rollNo}
              onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Class"
              value={formData.class}
              onChange={(e) => setFormData({...formData, class: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Section"
              value={formData.section}
              onChange={(e) => setFormData({...formData, section: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="date"
              placeholder="Date of Birth"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <select
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Blood Group"
              value={formData.bloodGroup}
              onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <textarea
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="2"
            required
          />

          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Parent Name"
              value={formData.parentName}
              onChange={(e) => setFormData({...formData, parentName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="tel"
              placeholder="Parent Phone"
              value={formData.parentPhone}
              onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="email"
              placeholder="Parent Email"
              value={formData.parentEmail}
              onChange={(e) => setFormData({...formData, parentEmail: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
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
import { useState } from 'react';
import api from '../utils/api';

const EditTeacher = ({ teacher, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: teacher.email || '',
    name: teacher.name || '',
    employeeId: teacher.employeeId || '',
    subject: teacher.subject || '',
    qualification: teacher.qualification || '',
    experience: teacher.experience || '',
    dateOfBirth: teacher.dateOfBirth ? teacher.dateOfBirth.split('T')[0] : '',
    gender: teacher.gender || '',
    address: teacher.address || '',
    phone: teacher.phone || '',
    alternatePhone: teacher.alternatePhone || '',
    emergencyContact: teacher.emergencyContact || '',
    nationality: teacher.nationality || '',
    religion: teacher.religion || '',
    category: teacher.category || '',
    maritalStatus: teacher.maritalStatus || '',
    bloodGroup: teacher.bloodGroup || '',
    aadharNumber: teacher.aadharNumber || '',
    panNumber: teacher.panNumber || '',
    bankAccount: teacher.bankAccount || '',
    ifscCode: teacher.ifscCode || '',
    salary: teacher.salary || '',
    joiningDate: teacher.joiningDate ? teacher.joiningDate.split('T')[0] : ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.put(`/api/admin/teachers/${teacher.id}`, formData);
      onSuccess('Teacher updated successfully');
      onClose();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update teacher');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Edit Teacher</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
        </div>
        
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">Select Subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="History">History</option>
                <option value="Geography">Geography</option>
                <option value="Economics">Economics</option>
                <option value="Political Science">Political Science</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Physical Education">Physical Education</option>
                <option value="Art">Art</option>
                <option value="Music">Music</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
              <select
                value={formData.qualification}
                onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">Select Qualification</option>
                <option value="B.Ed">B.Ed</option>
                <option value="M.Ed">M.Ed</option>
                <option value="B.A">B.A</option>
                <option value="M.A">M.A</option>
                <option value="B.Sc">B.Sc</option>
                <option value="M.Sc">M.Sc</option>
                <option value="B.Com">B.Com</option>
                <option value="M.Com">M.Com</option>
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
              <input
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone</label>
              <input
                type="tel"
                value={formData.alternatePhone}
                onChange={(e) => setFormData({...formData, alternatePhone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
              <input
                type="date"
                value={formData.joiningDate}
                onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
              <input
                type="tel"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
              <select
                value={formData.religion}
                onChange={(e) => setFormData({...formData, religion: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">Select Religion</option>
                <option value="Hindu">Hindu</option>
                <option value="Muslim">Muslim</option>
                <option value="Christian">Christian</option>
                <option value="Sikh">Sikh</option>
                <option value="Buddhist">Buddhist</option>
                <option value="Jain">Jain</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
              <select
                value={formData.maritalStatus}
                onChange={(e) => setFormData({...formData, maritalStatus: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
              <input
                type="text"
                value={formData.aadharNumber}
                onChange={(e) => setFormData({...formData, aadharNumber: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
              <input
                type="text"
                value={formData.panNumber}
                onChange={(e) => setFormData({...formData, panNumber: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account</label>
              <input
                type="text"
                value={formData.bankAccount}
                onChange={(e) => setFormData({...formData, bankAccount: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
              <input
                type="text"
                value={formData.ifscCode}
                onChange={(e) => setFormData({...formData, ifscCode: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows="2"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Updating...' : 'Update Teacher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeacher;
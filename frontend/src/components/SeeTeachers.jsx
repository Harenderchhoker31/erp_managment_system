import { useState, useEffect } from 'react';
import api from '../utils/api';
import AddTeacher from './AddTeacher';
import EditTeacher from './EditTeacher';


const SeeTeachers = ({ onClose, onSuccess, inline = false }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [detailTeacher, setDetailTeacher] = useState(null);
  const [deleteTeacher, setDeleteTeacher] = useState(null);


  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/api/admin/teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Failed to fetch teachers');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/admin/teachers/${deleteTeacher.id}`);
      setTeachers(teachers.filter(t => t.id !== deleteTeacher.id));
      onSuccess('Teacher deleted successfully');
      setDeleteTeacher(null);
    } catch (error) {
      console.error('Failed to delete teacher');
      setDeleteTeacher(null);
    }
  };

  const handleAddSuccess = (msg) => {
    onSuccess(msg);
    setShowAddTeacher(false);
    fetchTeachers();
  };

  const handleEditSuccess = (msg) => {
    onSuccess(msg);
    setEditingTeacher(null);
    fetchTeachers();
  };

  if (inline) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTeachers = teachers.filter(teacher => 
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Teacher Management</h3>
            <p className="text-gray-600 text-sm">Total: {teachers.length} teachers</p>
          </div>
          <button
            onClick={() => setShowAddTeacher(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-medium"
          >
            + Add Teacher
          </button>
        </div>

        <div>
          <input
            type="text"
            placeholder="Search by name, employee ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="bg-white border border-gray-300 rounded overflow-hidden">
          {loading ? (
            <div className="text-center py-8">Loading teachers...</div>
          ) : filteredTeachers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No teachers found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-red-600 text-white">
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Employee ID</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Subject</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Phone</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Experience</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Salary</th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-sm">{teacher.name}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm font-medium">{teacher.employeeId}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{teacher.subject}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{teacher.email}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{teacher.phone}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{teacher.experience} years</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">₹{teacher.salary || 'Not Set'}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => setDetailTeacher(teacher)}
                            className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs"
                          >
                            Detail
                          </button>
                          <button
                            onClick={() => setEditingTeacher(teacher)}
                            className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteTeacher(teacher)}
                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showAddTeacher && (
          <AddTeacher
            onClose={() => setShowAddTeacher(false)}
            onSuccess={handleAddSuccess}
          />
        )}

        {editingTeacher && (
          <EditTeacher
            teacher={editingTeacher}
            onClose={() => setEditingTeacher(null)}
            onSuccess={handleEditSuccess}
          />
        )}

        {detailTeacher && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Teacher Details</h3>
              </div>
              <div className="p-4 space-y-2">
                <p><span className="font-medium">Name:</span> {detailTeacher.name}</p>
                <p><span className="font-medium">Employee ID:</span> {detailTeacher.employeeId}</p>
                <p><span className="font-medium">Subject:</span> {detailTeacher.subject}</p>
                <p><span className="font-medium">Email:</span> {detailTeacher.email}</p>
                <p><span className="font-medium">Phone:</span> {detailTeacher.phone}</p>
                <p><span className="font-medium">Alternate Phone:</span> {detailTeacher.alternatePhone || 'N/A'}</p>
                <p><span className="font-medium">Emergency Contact:</span> {detailTeacher.emergencyContact || 'N/A'}</p>
                <p><span className="font-medium">DOB:</span> {new Date(detailTeacher.dateOfBirth).toLocaleDateString()}</p>
                <p><span className="font-medium">Gender:</span> {detailTeacher.gender}</p>
                <p><span className="font-medium">Address:</span> {detailTeacher.address}</p>
                <p><span className="font-medium">Qualification:</span> {detailTeacher.qualification}</p>
                <p><span className="font-medium">Experience:</span> {detailTeacher.experience} years</p>
                <p><span className="font-medium">Blood Group:</span> {detailTeacher.bloodGroup || 'N/A'}</p>
                <p><span className="font-medium">Nationality:</span> {detailTeacher.nationality || 'N/A'}</p>
                <p><span className="font-medium">Religion:</span> {detailTeacher.religion || 'N/A'}</p>
                <p><span className="font-medium">Category:</span> {detailTeacher.category || 'N/A'}</p>
                <p><span className="font-medium">Marital Status:</span> {detailTeacher.maritalStatus || 'N/A'}</p>
                <p><span className="font-medium">Salary:</span> ₹{detailTeacher.salary || 'Not Set'}</p>
                <p><span className="font-medium">Joining Date:</span> {new Date(detailTeacher.joiningDate).toLocaleDateString()}</p>
              </div>
              <div className="p-4 border-t">
                <button
                  onClick={() => setDetailTeacher(null)}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteTeacher && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-red-600">Confirm Delete</h3>
              </div>
              <div className="p-4">
                <p>Are you sure you want to delete <span className="font-semibold">{deleteTeacher.name}</span>?</p>
                <p className="text-sm text-gray-600 mt-2">This action cannot be undone.</p>
              </div>
              <div className="p-4 border-t flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteTeacher(null)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default SeeTeachers;
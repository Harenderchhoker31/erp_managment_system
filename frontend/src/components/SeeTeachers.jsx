import { useState, useEffect } from 'react';
import axios from 'axios';
import AddTeacher from './AddTeacher';
import EditTeacher from './EditTeacher';

const SeeTeachers = ({ onClose, onSuccess, inline = false }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/api/admin/teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Failed to fetch teachers');
    }
    setLoading(false);
  };

  const handleDelete = async (teacherId, teacherName) => {
    if (window.confirm(`Are you sure you want to delete ${teacherName}? This action cannot be undone.`)) {
      try {
        await axios.delete(`/api/admin/teachers/${teacherId}`);
        setTeachers(teachers.filter(t => t.id !== teacherId));
        onSuccess('Teacher deleted successfully');
      } catch (error) {
        console.error('Failed to delete teacher');
      }
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
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowAddTeacher(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Teacher
          </button>
        </div>

        <div>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No teachers found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Employee ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Subject</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Qualification</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Experience</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Assigned Classes</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{teacher.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{teacher.employeeId}</td>
                      <td className="border border-gray-300 px-4 py-2">{teacher.subject}</td>
                      <td className="border border-gray-300 px-4 py-2">{teacher.qualification}</td>
                      <td className="border border-gray-300 px-4 py-2">{teacher.experience} years</td>
                      <td className="border border-gray-300 px-4 py-2">{teacher.email}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {teacher.teacherClasses && teacher.teacherClasses.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {teacher.teacherClasses.map((tc, index) => (
                              <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                {tc.className}-{tc.section}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">No classes assigned</span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => setEditingTeacher(teacher)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(teacher.id, teacher.name)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
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
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Teachers List</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddTeacher(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Teacher
            </button>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No teachers found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Employee ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Subject</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Qualification</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Experience</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Assigned Classes</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{teacher.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{teacher.employeeId}</td>
                      <td className="border border-gray-300 px-4 py-2">{teacher.subject}</td>
                      <td className="border border-gray-300 px-4 py-2">{teacher.qualification}</td>
                      <td className="border border-gray-300 px-4 py-2">{teacher.experience} years</td>
                      <td className="border border-gray-300 px-4 py-2">{teacher.email}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {teacher.teacherClasses && teacher.teacherClasses.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {teacher.teacherClasses.map((tc, index) => (
                              <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                {tc.className}-{tc.section}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">No classes assigned</span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => setEditingTeacher(teacher)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(teacher.id, teacher.name)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
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
    </div>
  );
};

export default SeeTeachers;
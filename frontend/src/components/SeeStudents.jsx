import { useState, useEffect } from 'react';
import axios from 'axios';
import AddStudent from './AddStudent';
import EditStudent from './EditStudent';

const SeeStudents = ({ onClose, onSuccess, inline = false }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/admin/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students');
    }
    setLoading(false);
  };

  const handleDelete = async (studentId, studentName) => {
    if (window.confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`)) {
      try {
        await axios.delete(`/api/admin/students/${studentId}`);
        setStudents(students.filter(s => s.id !== studentId));
        onSuccess('Student deleted successfully');
      } catch (error) {
        console.error('Failed to delete student');
      }
    }
  };

  const handleAddSuccess = (msg) => {
    onSuccess(msg);
    setShowAddStudent(false);
    fetchStudents();
  };

  const handleEditSuccess = (msg) => {
    onSuccess(msg);
    setEditingStudent(null);
    fetchStudents();
  };

  if (inline) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowAddStudent(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Student
          </button>
        </div>

        <div>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No students found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-2 py-2 text-left text-xs">Name</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-xs">Roll No</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-xs">Class</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-xs">Email</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-xs">DOB</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-xs">Gender</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-xs">Address</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-xs">Blood Group</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-xs">Parent Name</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-xs">Parent Phone</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-xs">Parent Email</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-xs">Admission Date</th>
                    <th className="border border-gray-300 px-2 py-2 text-center text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-2 py-2 text-sm">{student.name}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">{student.rollNo}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">{student.class}-{student.section}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">{student.email}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">{new Date(student.dateOfBirth).toLocaleDateString()}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">{student.gender}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm max-w-32 truncate" title={student.address}>{student.address}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">{student.bloodGroup || 'N/A'}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">{student.parentName}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">{student.parentPhone}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">{student.parentEmail}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">{new Date(student.admissionDate).toLocaleDateString()}</td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <div className="flex justify-center space-x-1">
                          <button
                            onClick={() => setEditingStudent(student)}
                            className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(student.id, student.name)}
                            className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors"
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

        {showAddStudent && (
          <AddStudent
            onClose={() => setShowAddStudent(false)}
            onSuccess={handleAddSuccess}
          />
        )}

        {editingStudent && (
          <EditStudent
            student={editingStudent}
            onClose={() => setEditingStudent(null)}
            onSuccess={handleEditSuccess}
          />
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Students List</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddStudent(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Student
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
          ) : students.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No students found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-2 py-2 text-left text-xs">Name</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-xs">Roll No</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-xs">Class</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-xs">Email</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-xs">DOB</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-xs">Gender</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-xs">Address</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-xs">Blood Group</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-xs">Parent Name</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-xs">Parent Phone</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-xs">Parent Email</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-xs">Admission Date</th>
                    <th className="border border-gray-300 px-2 py-2 text-center text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-2 py-2 text-sm">{student.name}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">{student.rollNo}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">{student.class}-{student.section}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">{student.email}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">{new Date(student.dateOfBirth).toLocaleDateString()}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">{student.gender}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm max-w-32 truncate" title={student.address}>{student.address}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">{student.bloodGroup || 'N/A'}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">{student.parentName}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">{student.parentPhone}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">{student.parentEmail}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">{new Date(student.admissionDate).toLocaleDateString()}</td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <div className="flex justify-center space-x-1">
                          <button
                            onClick={() => setEditingStudent(student)}
                            className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(student.id, student.name)}
                            className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors"
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

      {showAddStudent && (
        <AddStudent
          onClose={() => setShowAddStudent(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      {editingStudent && (
        <EditStudent
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default SeeStudents;
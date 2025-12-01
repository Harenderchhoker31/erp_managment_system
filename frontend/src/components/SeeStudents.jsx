import { useState, useEffect } from 'react';
import axios from 'axios';
import AddStudent from './AddStudent';
import EditStudent from './EditStudent';

const SeeStudents = ({ onClose, onSuccess, inline = false }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [detailStudent, setDetailStudent] = useState(null);
  const [deleteStudent, setDeleteStudent] = useState(null);

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

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/admin/students/${deleteStudent.id}`);
      setStudents(students.filter(s => s.id !== deleteStudent.id));
      onSuccess('Student deleted successfully');
      setDeleteStudent(null);
    } catch (error) {
      console.error('Failed to delete student');
      setDeleteStudent(null);
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
    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState('');

    const filteredStudents = students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = !classFilter || student.class === classFilter;
      return matchesSearch && matchesClass;
    });

    const uniqueClasses = [...new Set(students.map(s => s.class))].sort();

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Student Management</h3>
            <p className="text-gray-600 text-sm">Total: {students.length} students</p>
          </div>
          <button
            onClick={() => setShowAddStudent(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-medium"
          >
            + Add Student
          </button>
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Search by name, roll number, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          >
            <option value="">All Classes</option>
            {uniqueClasses.map(cls => (
              <option key={cls} value={cls}>Class {cls}</option>
            ))}
          </select>
        </div>

        {/* Students Table */}
        <div className="bg-white border border-gray-300 rounded overflow-hidden">
          {loading ? (
            <div className="text-center py-8">Loading students...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No students found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-red-600 text-white">
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Roll No</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Class</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">DOB</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Gender</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Blood</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Category</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Religion</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Transport</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Parent</th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-sm">{student.name}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm font-medium">{student.rollNo}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{student.class}-{student.section}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{student.email}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{new Date(student.dateOfBirth).toLocaleDateString()}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{student.gender}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{student.bloodGroup || 'N/A'}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{student.category || 'N/A'}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{student.religion || 'N/A'}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{student.transportMode || 'N/A'}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        <div>{student.parentName}</div>
                        <div className="text-xs text-gray-500">{student.parentPhone}</div>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => setDetailStudent(student)}
                            className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs"
                          >
                            Detail
                          </button>
                          <button
                            onClick={() => setEditingStudent(student)}
                            className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteStudent(student)}
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

        {detailStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Student Details</h3>
              </div>
              <div className="p-4 space-y-2">
                <p><span className="font-medium">Name:</span> {detailStudent.name}</p>
                <p><span className="font-medium">Roll No:</span> {detailStudent.rollNo}</p>
                <p><span className="font-medium">Class:</span> {detailStudent.class}-{detailStudent.section}</p>
                <p><span className="font-medium">Email:</span> {detailStudent.email}</p>
                <p><span className="font-medium">DOB:</span> {new Date(detailStudent.dateOfBirth).toLocaleDateString()}</p>
                <p><span className="font-medium">Gender:</span> {detailStudent.gender}</p>
                <p><span className="font-medium">Address:</span> {detailStudent.address}</p>
                <p><span className="font-medium">Blood Group:</span> {detailStudent.bloodGroup || 'N/A'}</p>
                <p><span className="font-medium">Category:</span> {detailStudent.category || 'N/A'}</p>
                <p><span className="font-medium">Religion:</span> {detailStudent.religion || 'N/A'}</p>
                <p><span className="font-medium">Nationality:</span> {detailStudent.nationality || 'N/A'}</p>
                <p><span className="font-medium">Transport:</span> {detailStudent.transportMode || 'N/A'}</p>
                <p><span className="font-medium">Previous School:</span> {detailStudent.previousSchool || 'N/A'}</p>
                <p><span className="font-medium">Medical Conditions:</span> {detailStudent.medicalConditions || 'None'}</p>
                <p><span className="font-medium">Father:</span> {detailStudent.fatherName || (detailStudent.parentName ? detailStudent.parentName.split(' / ')[0] : 'N/A')}</p>
                <p><span className="font-medium">Mother:</span> {detailStudent.motherName || (detailStudent.parentName ? detailStudent.parentName.split(' / ')[1] : 'N/A')}</p>
                <p><span className="font-medium">Father Phone:</span> {detailStudent.fatherPhone || detailStudent.parentPhone || 'N/A'}</p>
                <p><span className="font-medium">Father Email:</span> {detailStudent.fatherEmail || detailStudent.parentEmail || 'N/A'}</p>
                <p><span className="font-medium">Mother Phone:</span> {detailStudent.motherPhone || 'N/A'}</p>
                <p><span className="font-medium">Mother Email:</span> {detailStudent.motherEmail || 'N/A'}</p>
                <p><span className="font-medium">Emergency Contact:</span> {detailStudent.emergencyContact || 'N/A'}</p>
              </div>
              <div className="p-4 border-t">
                <button
                  onClick={() => setDetailStudent(null)}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-red-600">Confirm Delete</h3>
              </div>
              <div className="p-4">
                <p>Are you sure you want to delete <span className="font-semibold">{deleteStudent.name}</span>?</p>
                <p className="text-sm text-gray-600 mt-2">This action cannot be undone.</p>
              </div>
              <div className="p-4 border-t flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteStudent(null)}
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
                            onClick={() => setDeleteStudent(student)}
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
import { useState, useEffect } from 'react';
import api from '../../../utils/api';

const ViewClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', section: '' });
  const [deleteClass, setDeleteClass] = useState(null);
  const [detailClass, setDetailClass] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/api/admin/all-classes');
      const sortedClasses = response.data.sort((a, b) => {
        const classOrder = ['Pre-Nursery', 'Nursery', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
        const aIndex = classOrder.indexOf(a.name);
        const bIndex = classOrder.indexOf(b.name);
        
        if (aIndex !== bIndex) {
          return aIndex - bIndex;
        }
        
        // If same class, sort by section
        return a.section.localeCompare(b.section);
      });
      setClasses(sortedClasses);
    } catch (error) {
      console.error('Failed to fetch classes');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Submitting class data:', formData);
    try {
      const response = await api.post('/api/admin/create-class', formData);
      console.log('Class created successfully:', response.data);
      setFormData({ name: '', section: '' });
      setShowAddForm(false);
      setMessage('Class created successfully');
      setTimeout(() => setMessage(''), 3000);
      fetchClasses();
    } catch (error) {
      console.error('Failed to create class:', error);
      setError(error.response?.data?.error || 'Failed to create class');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/admin/classes/${deleteClass.id}`);
      setClasses(classes.filter(c => c.id !== deleteClass.id));
      setDeleteClass(null);
    } catch (error) {
      console.error('Failed to delete class');
      setDeleteClass(null);
    }
  };

  const handleViewDetails = async (cls) => {
    try {
      const response = await api.get(`/api/admin/students/class/${cls.name}/${cls.section}`);
      setClassStudents(response.data);
      setDetailClass(cls);
    } catch (error) {
      console.error('Failed to fetch class students');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Class Management</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Add Class
        </button>
      </div>

      {message && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
          <p className="text-green-700 text-sm">{message}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Class Name</label>
                <select
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, section: '' })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select Class</option>
                  <option value="Pre-Nursery">Pre-Nursery</option>
                  <option value="Nursery">Nursery</option>
                  <option value="1">Class 1</option>
                  <option value="2">Class 2</option>
                  <option value="3">Class 3</option>
                  <option value="4">Class 4</option>
                  <option value="5">Class 5</option>
                  <option value="6">Class 6</option>
                  <option value="7">Class 7</option>
                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Section</label>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select Section</option>
                  {formData.name === '11' || formData.name === '12' ? (
                    <>
                      <option value="Arts-A">Arts - A</option>
                      <option value="Arts-B">Arts - B</option>
                      <option value="Non-Medical-A">Non-Medical - A</option>
                      <option value="Non-Medical-B">Non-Medical - B</option>
                      <option value="Medical-A">Medical - A</option>
                      <option value="Medical-B">Medical - B</option>
                      <option value="Commerce-A">Commerce - A</option>
                      <option value="Commerce-B">Commerce - B</option>
                    </>
                  ) : (
                    <>
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                      <option value="D">Section D</option>
                      <option value="E">Section E</option>
                    </>
                  )}
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg">
                Create Class
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-8">Loading classes...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Class</th>
                <th className="px-4 py-3 text-left">Section</th>
                <th className="px-4 py-3 text-left">Students</th>
                <th className="px-4 py-3 text-left">Class Teacher</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls.id} className="border-t">
                  <td className="px-4 py-3">{cls.name === 'Pre-Nursery' || cls.name === 'Nursery' ? cls.name : `Class ${cls.name}`}</td>
                  <td className="px-4 py-3">{cls.section.includes('-') ? cls.section : `Section ${cls.section}`}</td>
                  <td className="px-4 py-3">{cls.studentCount} students</td>
                  <td className="px-4 py-3">
                    {cls.classTeacher ? (
                      <div>
                        <div className="font-medium">{cls.classTeacher.name}</div>
                        <div className="text-xs text-gray-500">{cls.classTeacher.employeeId}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Not Assigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(cls)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => setDeleteClass(cls)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {deleteClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-red-600">Confirm Delete</h3>
            </div>
            <div className="p-4">
              <p>Are you sure you want to delete <span className="font-semibold">Class {deleteClass.name} - Section {deleteClass.section}</span>?</p>
              <p className="text-sm text-gray-600 mt-2">This action cannot be undone.</p>
            </div>
            <div className="p-4 border-t flex justify-end space-x-3">
              <button
                onClick={() => setDeleteClass(null)}
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

      {detailClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">
                {detailClass.name === 'Pre-Nursery' || detailClass.name === 'Nursery' 
                  ? detailClass.name 
                  : `Class ${detailClass.name}`} - {detailClass.section.includes('-') ? detailClass.section : `Section ${detailClass.section}`}
              </h3>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <p><span className="font-medium">Total Students:</span> {classStudents.length}</p>
                <p><span className="font-medium">Class Teacher:</span> {detailClass.classTeacher ? detailClass.classTeacher.name : 'Not Assigned'}</p>
              </div>
              
              <h4 className="font-semibold mb-3">Students List:</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border px-3 py-2 text-left">Roll No</th>
                      <th className="border px-3 py-2 text-left">Name</th>
                      <th className="border px-3 py-2 text-left">Email</th>
                      <th className="border px-3 py-2 text-left">Parent</th>
                      <th className="border px-3 py-2 text-left">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classStudents.map((student) => (
                      <tr key={student.id}>
                        <td className="border px-3 py-2">{student.rollNo}</td>
                        <td className="border px-3 py-2">{student.name}</td>
                        <td className="border px-3 py-2">{student.email}</td>
                        <td className="border px-3 py-2">{student.parentName}</td>
                        <td className="border px-3 py-2">{student.parentPhone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-4 border-t">
              <button
                onClick={() => setDetailClass(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewClasses;
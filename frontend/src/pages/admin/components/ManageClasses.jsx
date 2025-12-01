import { useState, useEffect } from 'react';
import api from '../../../utils/api';

const ManageClasses = ({ onSuccess }) => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [formData, setFormData] = useState({
    teacherId: '',
    className: '',
    section: '',
    subject: '',
    isClassTeacher: false
  });
  const [availableSections, setAvailableSections] = useState([]);

  useEffect(() => {
    fetchTeachers();
    fetchClasses();
    fetchAssignments();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/api/admin/teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Failed to fetch teachers');
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await api.get('/api/admin/all-classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Failed to fetch classes');
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/api/admin/classes');
      setAssignments(response.data);
    } catch (error) {
      console.error('Failed to fetch assignments');
    }
  };

  const handleClassChange = (e) => {
    const selectedClass = e.target.value;
    setFormData({ ...formData, className: selectedClass, section: '' });

    const sections = classes
      .filter(c => c.name === selectedClass)
      .map(c => c.section)
      .sort();
    setAvailableSections([...new Set(sections)]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/assign-class', formData);
      onSuccess('Teacher assigned to class successfully');
      setFormData({
        teacherId: '',
        className: '',
        section: '',
        subject: '',
        isClassTeacher: false
      });
      setAvailableSections([]);
      fetchAssignments();
    } catch (error) {
      console.error('Failed to assign teacher');
    }
  };

  const uniqueClassNames = [...new Set(classes.map(c => c.name))].sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Assign Teachers to Classes</h3>

      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Teacher</label>
              <select
                value={formData.teacherId}
                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Select Teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} - {teacher.subject}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Class</label>
              <select
                value={formData.className}
                onChange={handleClassChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Select Class</option>
                <option value="Pre-Nursery">Pre-Nursery</option>
                <option value="Nursery">Nursery</option>
                {uniqueClassNames.filter(name => !['Pre-Nursery', 'Nursery'].includes(name)).map((name) => (
                  <option key={name} value={name}>Class {name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Section</label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
                disabled={!formData.className}
              >
                <option value="">Select Section</option>
                {formData.className === '11' || formData.className === '12' ? (
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
                  availableSections.map((section) => (
                    <option key={section} value={section}>Section {section}</option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Subject"
                required
              />
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isClassTeacher"
              checked={formData.isClassTeacher}
              onChange={(e) => setFormData({ ...formData, isClassTeacher: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isClassTeacher" className="text-sm">Class Teacher</label>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Assign Teacher
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h4 className="text-lg font-semibold p-4 border-b">Current Assignments</h4>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Teacher</th>
              <th className="px-4 py-3 text-left">Class</th>
              <th className="px-4 py-3 text-left">Section</th>
              <th className="px-4 py-3 text-left">Subject</th>
              <th className="px-4 py-3 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment.id} className="border-t">
                <td className="px-4 py-3">{assignment.teacher?.name}</td>
                <td className="px-4 py-3">Class {assignment.className}</td>
                <td className="px-4 py-3">Section {assignment.section}</td>
                <td className="px-4 py-3">{assignment.subject}</td>
                <td className="px-4 py-3">
                  {assignment.isClassTeacher ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      Class Teacher
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      Subject Teacher
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageClasses;
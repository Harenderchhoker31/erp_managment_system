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
  const [selectedClass, setSelectedClass] = useState(null);
  const [classTeachers, setClassTeachers] = useState([]);
  const [unpaidCounts, setUnpaidCounts] = useState({});

  useEffect(() => {
    fetchTeachers();
    fetchClasses();
    fetchAssignments();
    fetchUnpaidCounts();
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

  const fetchUnpaidCounts = async () => {
    try {
      const response = await api.get('/api/admin/unpaid-fees-count');
      setUnpaidCounts(response.data);
    } catch (error) {
      console.error('Failed to fetch unpaid counts');
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

  const handleRemoveAssignment = async (assignmentId) => {
    try {
      await api.delete(`/api/admin/teacher-classes/${assignmentId}`);
      fetchAssignments();
      if (selectedClass) {
        const updatedTeachers = classTeachers.filter(t => t.id !== assignmentId);
        setClassTeachers(updatedTeachers);
      }
    } catch (error) {
      console.error('Failed to remove assignment');
    }
  };

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
        <h4 className="text-lg font-semibold p-4 border-b">All Classes</h4>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Class Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Section</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Class Teacher</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Total Teachers</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Unpaid Fees</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {classes.sort((a, b) => {
              const order = ['Pre-Nursery', 'Nursery', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
              const aIndex = order.indexOf(a.name);
              const bIndex = order.indexOf(b.name);
              if (aIndex !== bIndex) return aIndex - bIndex;
              return a.section.localeCompare(b.section);
            }).map((classItem) => {
              const classAssignments = assignments.filter(a => 
                a.className === classItem.name && a.section === classItem.section
              );
              const classTeacher = classAssignments.find(a => a.isClassTeacher);
              
              return (
                <tr key={`${classItem.name}-${classItem.section}`} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {classItem.name === 'Pre-Nursery' || classItem.name === 'Nursery' ? 
                      classItem.name : `Class ${classItem.name}`}
                  </td>
                  <td className="px-4 py-3">{classItem.section}</td>
                  <td className="px-4 py-3">{classTeacher?.teacher?.name || 'Not Assigned'}</td>
                  <td className="px-4 py-3">{classAssignments.length}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                      {unpaidCounts[`${classItem.name}-${classItem.section}`] || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {
                        const classInfo = {
                          className: classItem.name,
                          section: classItem.section,
                          count: classAssignments.length,
                          classTeacher: classTeacher?.teacher?.name || null,
                          teachers: classAssignments
                        };
                        setSelectedClass(classInfo);
                        setClassTeachers(classAssignments);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Teacher Dialog */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">
                Teachers - Class {selectedClass.className} {selectedClass.section}
              </h3>
              <button
                onClick={() => setSelectedClass(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {classTeachers.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{assignment.teacher?.name}</span>
                        <span className="text-sm text-gray-600">({assignment.subject})</span>
                        {assignment.isClassTeacher && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            Class Teacher
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveAssignment(assignment.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageClasses;
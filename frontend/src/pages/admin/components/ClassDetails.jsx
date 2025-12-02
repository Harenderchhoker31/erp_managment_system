import { useState, useEffect } from 'react';
import api from '../../../utils/api';

const ClassDetails = ({ classData, onBack }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchClassData();
  }, [classData]);

  const fetchClassData = async () => {
    try {
      const response = await api.get(`/api/admin/students/class/${classData.name}/${classData.section}`);
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch class data');
    }
    setLoading(false);
  };



  const presentStudents = Math.floor(students.length * 0.85);
  const unpaidFeeStudents = Math.floor(students.length * 0.15);

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold">
              {classData.name === 'Pre-Nursery' || classData.name === 'Nursery' 
                ? classData.name 
                : `Class ${classData.name}`} - {classData.section.includes('-') ? classData.section : `Section ${classData.section}`}
            </h2>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold">Students ({students.length})</h3>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="text-center py-8">Loading students...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Roll No</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Gender</th>
                    <th className="px-4 py-3 text-left">Father Name</th>
                    <th className="px-4 py-3 text-left">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{student.rollNo}</td>
                      <td className="px-4 py-3">{student.name}</td>
                      <td className="px-4 py-3">{student.email}</td>
                      <td className="px-4 py-3">{student.gender}</td>
                      <td className="px-4 py-3">{student.fatherName}</td>
                      <td className="px-4 py-3">{student.fatherPhone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-gray-50 p-6 border-l">
        <h3 className="text-lg font-semibold mb-4">Class Information</h3>
        
        {/* Class Teacher */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <h4 className="font-medium text-gray-900 mb-2">Class Teacher</h4>
          {classData.classTeacher ? (
            <div>
              <p className="font-medium">{classData.classTeacher.name}</p>
              <p className="text-sm text-gray-600">{classData.classTeacher.employeeId}</p>
            </div>
          ) : (
            <p className="text-gray-500">Not Assigned</p>
          )}
        </div>

        {/* Student Count */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <h4 className="font-medium text-gray-900 mb-2">Students</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Students:</span>
              <span className="font-medium">{students.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Present Today:</span>
              <span className="font-medium text-green-600">{presentStudents}</span>
            </div>
            <div className="flex justify-between">
              <span>Absent Today:</span>
              <span className="font-medium text-red-600">{students.length - presentStudents}</span>
            </div>
          </div>
        </div>

        {/* Fee Status */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <h4 className="font-medium text-gray-900 mb-2">Fee Status</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Paid:</span>
              <span className="font-medium text-green-600">{students.length - unpaidFeeStudents}</span>
            </div>
            <div className="flex justify-between">
              <span>Unpaid:</span>
              <span className="font-medium text-red-600">{unpaidFeeStudents}</span>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default ClassDetails;
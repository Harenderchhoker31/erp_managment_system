import { useState, useEffect } from 'react';
import api from '../../../utils/api';

const ClassDetails = ({ classData, onBack }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unpaidCount, setUnpaidCount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());


  useEffect(() => {
    fetchClassData();
  }, [classData]);

  useEffect(() => {
    if (students.length > 0) {
      fetchClassData();
    }
  }, [selectedMonth, selectedYear]);

  const fetchClassData = async () => {
    try {
      const studentsRes = await api.get(`/api/admin/students/class/${classData.name}/${classData.section}?month=${selectedMonth}&year=${selectedYear}`);
      setStudents(studentsRes.data);
      fetchUnpaidCount();
    } catch (error) {
      console.error('Failed to fetch class data');
    }
    setLoading(false);
  };

  const fetchUnpaidCount = async () => {
    try {
      const [studentsRes, feesRes] = await Promise.all([
        api.get(`/api/admin/students/class/${classData.name}/${classData.section}`),
        api.get('/api/admin/fees')
      ]);
      
      const classStudents = studentsRes.data;
      const paidStudentIds = new Set(
        feesRes.data
          .filter(f => f.month === selectedMonth && f.year === selectedYear && f.status === 'PAID')
          .map(f => f.studentId)
      );
      
      const unpaid = classStudents.filter(s => !paidStudentIds.has(s.id)).length;
      setUnpaidCount(unpaid);
    } catch (error) {
      console.error('Failed to fetch unpaid count');
    }
  };



  const presentStudents = students.filter(s => s.todayAttendance === 'PRESENT').length;
  const absentStudents = students.filter(s => s.todayAttendance === 'ABSENT').length;
  const leaveStudents = students.filter(s => s.todayAttendance === 'LEAVE').length;

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
                    <th className="px-4 py-3 text-left">Attendance</th>
                    <th className="px-4 py-3 text-left">Fee Status</th>
                    <th className="px-4 py-3 text-left">Father Name</th>
                    <th className="px-4 py-3 text-left">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const getAttendanceDisplay = (attendance) => {
                      if (!attendance) return '-';
                      switch (attendance) {
                        case 'PRESENT': return 'P';
                        case 'ABSENT': return 'A';
                        case 'LEAVE': return 'L';
                        default: return '-';
                      }
                    };

                    const getAttendanceColor = (attendance) => {
                      switch (attendance) {
                        case 'PRESENT': return 'text-green-600 bg-green-100';
                        case 'ABSENT': return 'text-red-600 bg-red-100';
                        case 'LEAVE': return 'text-blue-600 bg-blue-100';
                        default: return 'text-gray-600 bg-gray-100';
                      }
                    };

                    return (
                      <tr key={student.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{student.rollNo}</td>
                        <td className="px-4 py-3">{student.name}</td>
                        <td className="px-4 py-3">{student.email}</td>
                        <td className="px-4 py-3">{student.gender}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-sm font-medium ${getAttendanceColor(student.todayAttendance)}`}>
                            {getAttendanceDisplay(student.todayAttendance)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-sm font-medium ${
                            student.feeStatus === 'PAID' 
                              ? 'text-green-600 bg-green-100' 
                              : 'text-red-600 bg-red-100'
                          }`}>
                            {student.feeStatus === 'PAID' ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3">{student.fatherName}</td>
                        <td className="px-4 py-3">{student.fatherPhone}</td>
                      </tr>
                    );
                  })}
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
              <span className="font-medium text-red-600">{absentStudents}</span>
            </div>
            <div className="flex justify-between">
              <span>Leave Today:</span>
              <span className="font-medium text-blue-600">{leaveStudents}</span>
            </div>
          </div>
        </div>

        {/* Fee Status */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <h4 className="font-medium text-gray-900 mb-2">Fee Status</h4>
          <select
            value={`${selectedYear}-${String(selectedMonth).padStart(2, '0')}`}
            onChange={(e) => {
              const [year, month] = e.target.value.split('-');
              setSelectedYear(parseInt(year));
              setSelectedMonth(parseInt(month));
            }}
            className="w-full px-2 py-1 border rounded text-sm mb-3"
          >
            {Array.from({ length: 12 }, (_, i) => {
              const month = i + 1;
              const year = selectedYear;
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return (
                <option key={`${year}-${month}`} value={`${year}-${String(month).padStart(2, '0')}`}>
                  {monthNames[month - 1]} {year}
                </option>
              );
            })}
          </select>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Paid:</span>
              <span className="font-medium text-green-600">{students.length - unpaidCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Unpaid:</span>
              <span className="font-medium text-red-600">{unpaidCount}</span>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default ClassDetails;
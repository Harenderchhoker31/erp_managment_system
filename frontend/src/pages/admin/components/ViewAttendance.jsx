import { useState, useEffect } from 'react';
import api from '../../../utils/api';

const ViewAttendance = ({ onSuccess }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  useEffect(() => {
    const filtered = students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [students, searchTerm]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/admin/attendance/${selectedDate}`);
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    }
    setLoading(false);
  };

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

  const counts = filteredStudents.reduce((acc, student) => {
    if (student.attendance === 'PRESENT') acc.present++;
    else if (student.attendance === 'ABSENT') acc.absent++;
    else if (student.attendance === 'LEAVE') acc.leave++;
    return acc;
  }, { present: 0, absent: 0, leave: 0 });

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white border border-gray-300 rounded">
        <h3 className="text-xl font-bold text-gray-900">View Attendance</h3>
        <p className="text-gray-600 text-sm">View student attendance by date</p>
      </div>

      <div className="bg-white border border-gray-300 rounded p-4">
        <div className="flex items-center gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-4 text-sm">
            <span className="text-green-600">Present: {counts.present}</span>
            <span className="text-red-600">Absent: {counts.absent}</span>
            <span className="text-blue-600">Leave: {counts.leave}</span>
            <span className="text-gray-600">Total: {filteredStudents.length}</span>
          </div>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search by name, roll number, or class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-300 rounded overflow-hidden">
        {loading ? (
          <div className="text-center py-8">Loading attendance...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-red-600 text-white">
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Roll No</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Class</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 text-sm">{student.rollNo}</td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">{student.name}</td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">{student.class}-{student.section}</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${getAttendanceColor(student.attendance)}`}>
                        {getAttendanceDisplay(student.attendance)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAttendance;
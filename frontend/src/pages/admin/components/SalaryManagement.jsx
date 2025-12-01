import { useState, useEffect } from 'react';
import api from '../../../utils/api';

const SalaryManagement = ({ onSuccess }) => {
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [salaryData, setSalaryData] = useState({ amount: '', month: '', year: '' });

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/api/admin/teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/salary', {
        teacherId: selectedTeacher,
        ...salaryData
      });
      onSuccess('Salary record created successfully');
      setSalaryData({ amount: '', month: '', year: '' });
      setSelectedTeacher('');
      setShowForm(false);
    } catch (error) {
      console.error('Error creating salary record:', error);
    }
  };

  const updateTeacherSalary = async (teacherId, salary) => {
    try {
      await api.put(`/api/admin/teachers/${teacherId}`, { salary });
      onSuccess('Teacher salary updated successfully');
      fetchTeachers();
    } catch (error) {
      console.error('Error updating salary:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Salary Management</h3>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Process Salary
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} - {teacher.employeeId}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Salary Amount"
              value={salaryData.amount}
              onChange={(e) => setSalaryData({ ...salaryData, amount: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <input
              type="month"
              value={`${salaryData.year}-${salaryData.month}`}
              onChange={(e) => {
                const [year, month] = e.target.value.split('-');
                setSalaryData({ ...salaryData, month, year });
              }}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <div className="flex space-x-3">
              <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg">Process</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Teacher</th>
              <th className="px-4 py-3 text-left">Employee ID</th>
              <th className="px-4 py-3 text-left">Current Salary</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="border-t">
                <td className="px-4 py-3">{teacher.name}</td>
                <td className="px-4 py-3">{teacher.employeeId}</td>
                <td className="px-4 py-3">₹{teacher.salary || 'Not Set'}</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    placeholder="Update salary"
                    className="px-2 py-1 border rounded mr-2 w-24"
                    onBlur={(e) => e.target.value && updateTeacherSalary(teacher.id, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryManagement;
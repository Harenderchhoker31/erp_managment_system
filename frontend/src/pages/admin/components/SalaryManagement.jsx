import { useState, useEffect } from 'react';
import api from '../../../utils/api';

const SalaryManagement = ({ onSuccess }) => {
  const [teachers, setTeachers] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchTeachers();
    fetchSalaries();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/api/admin/teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchSalaries = async () => {
    try {
      const response = await api.get('/api/admin/salaries');
      setSalaries(response.data);
    } catch (error) {
      console.error('Error fetching salaries:', error);
    }
  };



  const markAsPaid = async (salaryId) => {
    try {
      await api.put(`/api/admin/salary/${salaryId}`, {
        status: 'PAID',
        paidDate: new Date().toISOString()
      });
      onSuccess('Salary marked as paid');
      fetchSalaries();
    } catch (error) {
      console.error('Error marking salary as paid:', error);
    }
  };

  const createSalaryRecord = async (teacherId) => {
    try {
      const teacher = teachers.find(t => t.id === teacherId);
      if (!teacher.salary) {
        alert('Teacher salary not set');
        return;
      }

      await api.post('/api/admin/salary', {
        teacherId: teacherId,
        amount: teacher.salary,
        month: selectedMonth.toString(),
        year: selectedYear.toString()
      });
      
      onSuccess('Salary record created');
      fetchSalaries();
    } catch (error) {
      console.error('Error creating salary record:', error);
      alert('Error creating salary record');
    }
  };

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[parseInt(month) - 1];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCurrentMonthSalaries = () => {
    return salaries.filter(s => 
      parseInt(s.month) === selectedMonth && 
      parseInt(s.year) === selectedYear
    );
  };

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isTeacherProcessed = (teacherId) => {
    return getCurrentMonthSalaries().some(s => s.teacherId === teacherId);
  };

  const getTeacherSalaryRecord = (teacherId) => {
    return getCurrentMonthSalaries().find(s => s.teacherId === teacherId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Salary Management</h3>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-lg w-64"
          />
          <select
            value={`${selectedYear}-${String(selectedMonth).padStart(2, '0')}`}
            onChange={(e) => {
              const [year, month] = e.target.value.split('-');
              setSelectedYear(parseInt(year));
              setSelectedMonth(parseInt(month));
            }}
            className="px-3 py-2 border rounded-lg"
          >
            {Array.from({ length: 12 }, (_, i) => {
              const month = i + 1;
              const year = selectedYear;
              return (
                <option key={`${year}-${month}`} value={`${year}-${String(month).padStart(2, '0')}`}>
                  {getMonthName(month)} {year}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Teacher Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Employee ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Monthly Salary</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map((teacher) => {
              const isProcessed = isTeacherProcessed(teacher.id);
              const salaryRecord = getTeacherSalaryRecord(teacher.id);
              
              return (
                <tr key={teacher.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{teacher.name}</td>
                  <td className="px-4 py-3">{teacher.employeeId}</td>
                  <td className="px-4 py-3">₹{teacher.salary?.toLocaleString() || 'Not Set'}</td>
                  <td className="px-4 py-3 text-center">
                    {isProcessed ? (
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(salaryRecord?.status)}`}>
                        {salaryRecord?.status}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">
                        Not Processed
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {!isProcessed ? (
                      <button
                        onClick={() => createSalaryRecord(teacher.id)}
                        disabled={!teacher.salary}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                      >
                        Pay
                      </button>
                    ) : salaryRecord?.status === 'PENDING' ? (
                      <button
                        onClick={() => markAsPaid(salaryRecord.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Mark Paid
                      </button>
                    ) : (
                      <span className="text-green-600 text-sm font-medium">Paid</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryManagement;
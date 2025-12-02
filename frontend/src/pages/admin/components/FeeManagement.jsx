import { useState, useEffect } from 'react';
import api from '../../../utils/api';

const FeeManagement = ({ onSuccess }) => {
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchStudents();
    fetchFees();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/api/admin/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchFees = async () => {
    try {
      const response = await api.get('/api/admin/fees');
      setFees(response.data);
    } catch (error) {
      console.error('Error fetching fees:', error);
    }
  };

  const createFeeRecord = async (studentId, paymentMethod) => {
    try {
      const monthlyFee = 5000; // Default monthly fee amount
      
      await api.post('/api/admin/fees', {
        studentId: studentId,
        amount: monthlyFee,
        dueDate: new Date(selectedYear, selectedMonth - 1, 10).toISOString(),
        description: 'Monthly Fee',
        month: selectedMonth,
        year: selectedYear,
        paymentMethod: paymentMethod
      });
      
      onSuccess('Fee record created');
      fetchFees();
    } catch (error) {
      console.error('Error creating fee record:', error);
      alert('Error creating fee record');
    }
  };

  const markAsPaid = async (feeId, paymentMethod) => {
    try {
      await api.put(`/api/admin/fees/${feeId}`, {
        status: 'PAID',
        paidDate: new Date().toISOString(),
        paymentMethod: paymentMethod
      });
      onSuccess('Fee marked as paid');
      fetchFees();
    } catch (error) {
      console.error('Error marking fee as paid:', error);
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
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCurrentMonthFees = () => {
    return fees.filter(f => 
      parseInt(f.month) === selectedMonth && 
      parseInt(f.year) === selectedYear
    );
  };

  const isStudentProcessed = (studentId) => {
    return getCurrentMonthFees().some(f => f.studentId === studentId);
  };

  const getStudentFeeRecord = (studentId) => {
    return getCurrentMonthFees().find(f => f.studentId === studentId);
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Fee Management</h3>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search students..."
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
              <th className="px-4 py-3 text-left text-sm font-semibold">Student Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Roll No</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Parent Contact</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Payment Method</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => {
              const isProcessed = isStudentProcessed(student.id);
              const feeRecord = getStudentFeeRecord(student.id);
              
              return (
                <tr key={student.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{student.name}</td>
                  <td className="px-4 py-3">{student.rollNo}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      {student.motherPhone && <div>M: {student.motherPhone}</div>}
                      {student.fatherPhone && <div>F: {student.fatherPhone}</div>}
                      {!student.motherPhone && !student.fatherPhone && 'N/A'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {isProcessed ? (
                      <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                        {feeRecord?.paymentMethod}
                      </span>
                    ) : (
                      <div className="flex gap-1">
                        <button
                          onClick={() => createFeeRecord(student.id, 'ONLINE')}
                          className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        >
                          Online
                        </button>
                        <button
                          onClick={() => createFeeRecord(student.id, 'CASH')}
                          className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                        >
                          Cash
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {isProcessed ? (
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(feeRecord?.status)}`}>
                        {feeRecord?.status}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">
                        Not Processed
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {feeRecord?.status === 'PENDING' ? (
                      <button
                        onClick={() => markAsPaid(feeRecord.id, feeRecord.paymentMethod)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                      >
                        Received
                      </button>
                    ) : feeRecord?.status === 'PAID' ? (
                      <span className="text-green-600 text-sm font-medium">Paid</span>
                    ) : (
                      <span className="text-gray-500 text-sm">-</span>
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

export default FeeManagement;
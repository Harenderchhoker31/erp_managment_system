import { useState, useEffect } from 'react';
import api from '../../../utils/api';

const FeeManagement = ({ onSuccess }) => {
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [feeData, setFeeData] = useState({
    studentId: '',
    amount: '',
    dueDate: '',
    description: ''
  });

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

  useEffect(() => {
    fetchStudents();
    fetchFees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/fees', feeData);
      onSuccess('Fee record created successfully');
      setFeeData({ studentId: '', amount: '', dueDate: '', description: '' });
      setShowForm(false);
      fetchFees();
    } catch (error) {
      console.error('Error creating fee record:', error);
    }
  };

  const markAsPaid = async (feeId) => {
    try {
      await api.put(`/api/admin/fees/${feeId}`, { status: 'PAID', paidDate: new Date() });
      onSuccess('Fee marked as paid');
      fetchFees();
    } catch (error) {
      console.error('Error updating fee status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Fee Management</h3>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Add Fee Record
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={feeData.studentId}
              onChange={(e) => setFeeData({ ...feeData, studentId: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} - {student.rollNo}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Fee Amount"
              value={feeData.amount}
              onChange={(e) => setFeeData({ ...feeData, amount: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <input
              type="date"
              value={feeData.dueDate}
              onChange={(e) => setFeeData({ ...feeData, dueDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Description (e.g., Tuition Fee, Exam Fee)"
              value={feeData.description}
              onChange={(e) => setFeeData({ ...feeData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <div className="flex space-x-3">
              <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg">Create</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Due Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee) => (
              <tr key={fee.id} className="border-t">
                <td className="px-4 py-3">{fee.student?.name} - {fee.student?.rollNo}</td>
                <td className="px-4 py-3">₹{fee.amount}</td>
                <td className="px-4 py-3">{new Date(fee.dueDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    fee.status === 'PAID' ? 'bg-green-100 text-green-800' : 
                    fee.status === 'OVERDUE' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {fee.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {fee.status === 'PENDING' && (
                    <button
                      onClick={() => markAsPaid(fee.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                    >
                      Mark Paid
                    </button>
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

export default FeeManagement;
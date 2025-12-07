import { useState, useEffect } from 'react';
import { studentAPI } from '../../../utils/api';

const ViewFees = () => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        try {
            const response = await studentAPI.getFees();
            setFees(response.data);
        } catch (error) {
            console.error('Error fetching fees:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredFees = fees.filter(fee => 
        !statusFilter || fee.status === statusFilter
    );

    const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const paidAmount = fees.filter(f => f.status === 'PAID').reduce((sum, fee) => sum + fee.amount, 0);
    const pendingAmount = totalAmount - paidAmount;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg text-gray-600">Loading fees...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Fee Status</h3>
                    <p className="text-gray-600 text-sm">Track your fee payments and dues</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-600">Total Amount</p>
                        <p className="text-2xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-600">Paid Amount</p>
                        <p className="text-2xl font-bold text-green-600">₹{paidAmount.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                        <p className="text-2xl font-bold text-red-600">₹{pendingAmount.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-300 rounded p-4">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                    <option value="">All Status</option>
                    <option value="PAID">Paid</option>
                    <option value="PENDING">Pending</option>
                    <option value="OVERDUE">Overdue</option>
                </select>
            </div>

            <div className="bg-white border border-gray-300 rounded overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-red-600 text-white">
                                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Description</th>
                                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">Amount</th>
                                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">Due Date</th>
                                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">Status</th>
                                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">Paid Date</th>
                                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">Payment Method</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFees.length > 0 ? (
                                filteredFees.map((fee) => (
                                    <tr key={fee.id} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-3 text-sm font-medium">
                                            {fee.description}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-center text-sm font-bold">
                                            ₹{fee.amount.toLocaleString()}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">
                                            {new Date(fee.dueDate).toLocaleDateString()}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">
                                            <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                                fee.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                                fee.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {fee.status}
                                            </span>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">
                                            {fee.paidDate ? new Date(fee.paidDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">
                                            {fee.paymentMethod || '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                                        No fee records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ViewFees;
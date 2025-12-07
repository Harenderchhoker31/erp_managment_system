import { useState, useEffect } from 'react';
import { studentAPI } from '../../../utils/api';

const ViewFees = () => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
    const [monthFilter, setMonthFilter] = useState('');

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

    const filteredFees = fees.filter(fee => {
        const matchesStatus = !statusFilter || fee.status === statusFilter;
        const matchesYear = fee.year === yearFilter;
        const matchesMonth = !monthFilter || fee.month === parseInt(monthFilter);
        return matchesStatus && matchesYear && matchesMonth;
    });

    const yearlyTotal = 12 * 5000; // 12 months * 5000 per month
    const paidAmount = fees.filter(f => f.status === 'PAID' && f.year === yearFilter).reduce((sum, fee) => sum + fee.amount, 0);
    const pendingAmount = yearlyTotal - paidAmount;

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
                        <p className="text-2xl font-bold text-gray-900">₹{yearlyTotal.toLocaleString()}</p>
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
                    value={yearFilter}
                    onChange={(e) => setYearFilter(parseInt(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                    <option value={2023}>2023</option>
                </select>
            </div>

            <div className="bg-white border border-gray-300 rounded overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-red-600 text-white">
                                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Month</th>
                                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">Amount</th>
                                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">Status</th>
                                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">Paid Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1,2,3,4,5,6,7,8,9,10,11,12].map((month) => {
                                const monthName = new Date(yearFilter, month - 1).toLocaleDateString('en-US', { month: 'long' });
                                const feeRecord = fees.find(f => f.month === month && f.year === yearFilter);
                                const status = feeRecord?.status || 'PENDING';
                                const amount = feeRecord?.amount || 5000;
                                
                                return (
                                    <tr key={month} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-3 text-sm font-medium">
                                            {monthName} {yearFilter}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-center text-sm font-bold">
                                            ₹{amount.toLocaleString()}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">
                                            <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                                status === 'PAID' ? 'bg-green-100 text-green-800' :
                                                status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">
                                            {feeRecord?.paidDate ? new Date(feeRecord.paidDate).toLocaleDateString() : '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ViewFees;
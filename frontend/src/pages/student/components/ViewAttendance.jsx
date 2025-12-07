import { useState, useEffect } from 'react';
import { studentAPI } from '../../../utils/api';

const ViewAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [monthFilter, setMonthFilter] = useState('');

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const response = await studentAPI.getAttendance();
            setAttendance(response.data);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAttendance = attendance.filter(record => {
        if (!monthFilter) return true;
        const recordMonth = new Date(record.date).getMonth();
        return recordMonth === parseInt(monthFilter);
    });

    const stats = {
        total: filteredAttendance.length,
        present: filteredAttendance.filter(a => a.status === 'PRESENT').length,
        absent: filteredAttendance.filter(a => a.status === 'ABSENT').length,
        leave: filteredAttendance.filter(a => a.status === 'LEAVE').length
    };

    const percentage = stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : 0;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg text-gray-600">Loading attendance...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">My Attendance</h3>
                    <p className="text-gray-600 text-sm">Track your daily attendance record</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-600">Overall Percentage</p>
                        <p className={`text-3xl font-bold ${percentage >= 75 ? 'text-green-600' : percentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {percentage}%
                        </p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-600">Present</p>
                        <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-600">Absent</p>
                        <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-600">Leave</p>
                        <p className="text-2xl font-bold text-yellow-600">{stats.leave}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-300 rounded p-4">
                <select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                    <option value="">All Months</option>
                    <option value="0">January</option>
                    <option value="1">February</option>
                    <option value="2">March</option>
                    <option value="3">April</option>
                    <option value="4">May</option>
                    <option value="5">June</option>
                    <option value="6">July</option>
                    <option value="7">August</option>
                    <option value="8">September</option>
                    <option value="9">October</option>
                    <option value="10">November</option>
                    <option value="11">December</option>
                </select>
            </div>

            <div className="bg-white border border-gray-300 rounded overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-red-600 text-white">
                                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Date</th>
                                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">Status</th>
                                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Day</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAttendance.length > 0 ? (
                                filteredAttendance.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-3 text-sm">
                                            {new Date(record.date).toLocaleDateString()}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">
                                            <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                                record.status === 'PRESENT' ? 'bg-green-100 text-green-800' :
                                                record.status === 'ABSENT' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-sm">
                                            {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                                        No attendance records found
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

export default ViewAttendance;
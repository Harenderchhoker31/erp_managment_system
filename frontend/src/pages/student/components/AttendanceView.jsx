import { useState, useEffect } from 'react';
import { studentAPI } from '../../../utils/api';

const AttendanceView = () => {
    const [attendanceData, setAttendanceData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const response = await studentAPI.getAttendance();
            setAttendanceData(response.data);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading attendance...</div>;
    }

    const { records, statistics } = attendanceData || { records: [], statistics: {} };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PRESENT':
                return 'bg-green-100 text-green-800';
            case 'ABSENT':
                return 'bg-red-100 text-red-800';
            case 'LATE':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Attendance</h2>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                        <p className="text-green-600 text-sm font-medium">Attendance Rate</p>
                        <p className="text-3xl font-bold text-green-700 mt-2">{statistics.percentage}%</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-blue-600 text-sm font-medium">Total Days</p>
                        <p className="text-3xl font-bold text-blue-700 mt-2">{statistics.total}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <p className="text-green-600 text-sm font-medium">Present</p>
                        <p className="text-3xl font-bold text-green-700 mt-2">{statistics.present}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <p className="text-red-600 text-sm font-medium">Absent</p>
                        <p className="text-3xl font-bold text-red-700 mt-2">{statistics.absent}</p>
                    </div>
                </div>

                {/* Attendance Records */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {records.length > 0 ? (
                                records.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(record.date).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="px-6 py-8 text-center text-gray-500">
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

export default AttendanceView;

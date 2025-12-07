import { useState, useEffect } from 'react';
import { studentAPI } from '../../../utils/api';

const StudentDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({
        attendance: { percentage: 0 },
        assignments: [],
        fees: { totalPending: 0 }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [profileRes, attendanceRes, assignmentsRes, feesRes] = await Promise.all([
                studentAPI.getProfile(),
                studentAPI.getAttendance(),
                studentAPI.getAssignments(),
                studentAPI.getFees()
            ]);

            setProfile(profileRes.data);
            setStats({
                attendance: attendanceRes.data.statistics,
                assignments: assignmentsRes.data.slice(0, 5),
                fees: feesRes.data.summary
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Attendance</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.attendance.percentage || 0}%</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Assignments</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.assignments.length}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Pending Fees</p>
                        <p className="text-2xl font-bold text-gray-900">₹{stats.fees.totalPending || 0}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Student Profile</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Name: <span className="font-medium text-gray-900">{profile?.name || 'N/A'}</span></p>
                            <p className="text-sm text-gray-600 mt-2">Roll No: <span className="font-medium text-gray-900">{profile?.rollNo || 'N/A'}</span></p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Class: <span className="font-medium text-gray-900">{profile?.class || 'N/A'}-{profile?.section || 'N/A'}</span></p>
                            <p className="text-sm text-gray-600 mt-2">Email: <span className="font-medium text-gray-900">{profile?.email || 'N/A'}</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Recent Assignments</h3>
                {stats.assignments.length > 0 ? (
                    <div className="space-y-3">
                        {stats.assignments.map((assignment) => (
                            <div key={assignment.id} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-medium text-gray-800">{assignment.title}</h4>
                                    <span className={`px-2 py-1 text-xs rounded ${
                                        assignment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                        {assignment.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">Subject: {assignment.subject}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">No assignments yet.</p>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
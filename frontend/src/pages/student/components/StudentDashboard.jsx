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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
                <h2 className="text-3xl font-bold">Welcome back, {profile?.name}! 👋</h2>
                <p className="mt-2 text-indigo-100">Class {profile?.class} - Section {profile?.section}</p>
                <p className="text-indigo-100">Roll No: {profile?.rollNo}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Attendance</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.attendance.percentage}%</p>
                        </div>
                        <div className="text-4xl">📅</div>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">
                        {stats.attendance.present} / {stats.attendance.total} days present
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Assignments</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.assignments.length}</p>
                        </div>
                        <div className="text-4xl">📚</div>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">Pending assignments</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Pending Fees</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats.fees.totalPending}</p>
                        </div>
                        <div className="text-4xl">💰</div>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">{stats.fees.pendingCount} pending payments</p>
                </div>
            </div>

            {/* Recent Assignments */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Assignments</h3>
                {stats.assignments.length > 0 ? (
                    <div className="space-y-3">
                        {stats.assignments.map((assignment) => (
                            <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">{assignment.title}</p>
                                    <p className="text-sm text-gray-600">{assignment.subject}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full ${assignment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {assignment.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No assignments yet</p>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;

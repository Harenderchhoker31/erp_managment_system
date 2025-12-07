import { useState, useEffect } from 'react';
import { studentAPI } from '../../../utils/api';

const StudentDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({
        attendance: 0,
        assignments: 0,
        events: 0,
        notices: 0
    });
    const [recentMarks, setRecentMarks] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [profileRes, attendanceRes, marksRes, assignmentsRes, eventsRes, noticesRes] = await Promise.all([
                studentAPI.getProfile(),
                studentAPI.getAttendance(),
                studentAPI.getMarks(),
                studentAPI.getAssignments(),
                studentAPI.getEvents(),
                studentAPI.getNotices()
            ]);

            setProfile(profileRes.data);
            
            const attendancePercentage = attendanceRes.data.length > 0 
                ? ((attendanceRes.data.filter(a => a.status === 'PRESENT').length / attendanceRes.data.length) * 100).toFixed(1)
                : 0;

            setStats({
                attendance: attendancePercentage,
                assignments: assignmentsRes.data.length,
                events: eventsRes.data.filter(e => new Date(e.date) >= new Date()).length,
                notices: noticesRes.data.length
            });

            setRecentMarks(marksRes.data.slice(0, 5));
            setUpcomingEvents(eventsRes.data.filter(e => new Date(e.date) >= new Date()).slice(0, 3));
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
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {profile?.name}!</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>Roll No: <span className="font-medium">{profile?.rollNo}</span></div>
                    <div>Class: <span className="font-medium">{profile?.class}-{profile?.section}</span></div>
                    <div>Father: <span className="font-medium">{profile?.fatherName}</span></div>
                    <div>Mother: <span className="font-medium">{profile?.motherName}</span></div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <span className="text-green-600 text-xl">📊</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Attendance</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.attendance}%</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <span className="text-blue-600 text-xl">📝</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Assignments</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.assignments}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <span className="text-purple-600 text-xl">🎉</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.events}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <span className="text-yellow-600 text-xl">📢</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Notices</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.notices}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Recent Marks</h3>
                    {recentMarks.length > 0 ? (
                        <div className="space-y-3">
                            {recentMarks.map((mark) => (
                                <div key={mark.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <div>
                                        <p className="font-medium text-gray-900">{mark.subject}</p>
                                        <p className="text-sm text-gray-600">{mark.examType}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">{mark.marks}/{mark.maxMarks}</p>
                                        <p className="text-sm text-gray-600">{((mark.marks/mark.maxMarks)*100).toFixed(1)}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No marks available yet</p>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🎉 Upcoming Events</h3>
                    {upcomingEvents.length > 0 ? (
                        <div className="space-y-3">
                            {upcomingEvents.map((event) => (
                                <div key={event.id} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                    <h4 className="font-medium text-gray-800">{event.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                    <p className="text-xs text-blue-600 mt-2">
                                        {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No upcoming events</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
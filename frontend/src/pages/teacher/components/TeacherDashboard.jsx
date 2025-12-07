import { useState, useEffect } from 'react';
import { teacherAPI } from '../../../utils/api';
import api from '../../../utils/api';

const TeacherDashboard = () => {
    const [classes, setClasses] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [recentNotices, setRecentNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const classesRes = await teacherAPI.getClasses();
            setClasses(classesRes.data || []);
            
            try {
                const eventsRes = await api.get('/api/admin/events');
                const now = new Date();
                const upcoming = (eventsRes.data || [])
                    .filter(event => new Date(event.date) >= now)
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .slice(0, 3);
                setUpcomingEvents(upcoming);
            } catch (eventError) {
                console.error('Error fetching events:', eventError);
                setUpcomingEvents([]);
            }
            
            try {
                const noticesRes = await api.get('/api/admin/notices');
                const recent = (noticesRes.data || [])
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 3);
                setRecentNotices(recent);
            } catch (noticeError) {
                console.error('Error fetching notices:', noticeError);
                setRecentNotices([]);
            }
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
                        <p className="text-sm font-medium text-gray-600">Assigned Classes</p>
                        <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                        <p className="text-2xl font-bold text-gray-900">{upcomingEvents.length}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Recent Notices</p>
                        <p className="text-2xl font-bold text-gray-900">{recentNotices.length}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 My Classes</h3>
                {classes.length > 0 ? (
                    <div className="space-y-3">
                        {classes.map((classItem) => (
                            <div key={classItem.id} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-medium text-gray-800">
                                        Class {classItem.className} - {classItem.section}
                                    </h4>
                                    {classItem.isClassTeacher && (
                                        <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                                            Class Teacher
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600">Subject: {classItem.subject}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">No classes assigned yet.</p>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Upcoming Events</h3>
                    {upcomingEvents.length > 0 ? (
                        <div className="space-y-3">
                            {upcomingEvents.map((event) => (
                                <div key={event.id} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                    <h4 className="font-medium text-gray-800">{event.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                    <p className="text-xs text-blue-600 mt-2">
                                        {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()} • Created by: {event.creator ? (event.creator.role === 'ADMIN' ? 'Principal' : event.creator.name) : 'Administration'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No upcoming events scheduled.</p>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Recent Notices</h3>
                    {recentNotices.length > 0 ? (
                        <div className="space-y-3">
                            {recentNotices.map((notice) => (
                                <div key={notice.id} className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-medium text-gray-800">{notice.title}</h4>
                                        <span className={`px-2 py-1 text-xs rounded ${
                                            notice.type === 'GENERAL' ? 'bg-gray-100 text-gray-800' :
                                            notice.type === 'ATTENDANCE' ? 'bg-yellow-100 text-yellow-800' :
                                            notice.type === 'MARKS' ? 'bg-green-100 text-green-800' :
                                            notice.type === 'EVENT' ? 'bg-blue-100 text-blue-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {notice.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{notice.message}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {new Date(notice.createdAt).toLocaleDateString()} • By: {notice.creator ? (notice.creator.role === 'ADMIN' ? 'Principal' : notice.creator.name) : 'Administration'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No recent notices.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
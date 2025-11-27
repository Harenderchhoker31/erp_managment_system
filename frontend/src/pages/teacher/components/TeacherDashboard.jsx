import { useState, useEffect } from 'react';
import { teacherAPI } from '../../../utils/api';

const TeacherDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [profileRes, classesRes] = await Promise.all([
                teacherAPI.getProfile(),
                teacherAPI.getClasses()
            ]);

            setProfile(profileRes.data);
            setClasses(classesRes.data);
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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-6 text-white">
                <h2 className="text-3xl font-bold">Welcome back, {profile?.name}! 👋</h2>
                <p className="mt-2 text-purple-100">Subject: {profile?.subject}</p>
                <p className="text-purple-100">Employee ID: {profile?.employeeId}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Assigned Classes</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{classes.length}</p>
                        </div>
                        <div className="text-4xl">🏫</div>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">Active class assignments</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Experience</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{profile?.experience} yrs</p>
                        </div>
                        <div className="text-4xl">⭐</div>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">Teaching experience</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Qualification</p>
                            <p className="text-lg font-bold text-gray-900 mt-2">{profile?.qualification}</p>
                        </div>
                        <div className="text-4xl">🎓</div>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">Educational background</p>
                </div>
            </div>

            {/* Assigned Classes */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">My Classes</h3>
                {classes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classes.map((classItem) => (
                            <div key={classItem.id} className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-gray-900">
                                        Class {classItem.className} - {classItem.section}
                                    </h4>
                                    {classItem.isClassTeacher && (
                                        <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                                            Class Teacher
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600">Subject: {classItem.subject}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No classes assigned yet</p>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 hover:shadow-md transition-shadow text-left">
                        <div className="text-3xl mb-2">✅</div>
                        <h4 className="font-semibold text-gray-900">Mark Attendance</h4>
                        <p className="text-sm text-gray-600 mt-1">Record student attendance</p>
                    </button>
                    <button className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md transition-shadow text-left">
                        <div className="text-3xl mb-2">📝</div>
                        <h4 className="font-semibold text-gray-900">Upload Marks</h4>
                        <p className="text-sm text-gray-600 mt-1">Enter exam scores</p>
                    </button>
                    <button className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 hover:shadow-md transition-shadow text-left">
                        <div className="text-3xl mb-2">📚</div>
                        <h4 className="font-semibold text-gray-900">Create Assignment</h4>
                        <p className="text-sm text-gray-600 mt-1">Post homework tasks</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;

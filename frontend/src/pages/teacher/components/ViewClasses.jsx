import { useState, useEffect } from 'react';
import { teacherAPI } from '../../../utils/api';

const ViewClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await teacherAPI.getClasses();
            setClasses(response.data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading classes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">My Classes</h3>
                    <p className="text-gray-600 text-sm">Classes assigned to you</p>
                </div>
            </div>

            <div className="bg-white border border-gray-300 rounded overflow-hidden">
                {classes.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-red-600 text-white">
                                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Class</th>
                                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Section</th>
                                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Subject</th>
                                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classes.map((classItem) => (
                                    <tr key={classItem.id} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-3 text-sm font-medium">{classItem.className}</td>
                                        <td className="border border-gray-300 px-4 py-3 text-sm">{classItem.section}</td>
                                        <td className="border border-gray-300 px-4 py-3 text-sm">{classItem.subject}</td>
                                        <td className="border border-gray-300 px-4 py-3 text-sm">
                                            {classItem.isClassTeacher ? (
                                                <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                                                    Class Teacher
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                                                    Subject Teacher
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No classes assigned yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewClasses;
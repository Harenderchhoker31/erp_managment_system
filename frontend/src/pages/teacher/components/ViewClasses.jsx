import { useState, useEffect } from 'react';
import { teacherAPI } from '../../../utils/api';

const ViewClasses = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [students, setStudents] = useState([]);
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

    const fetchStudents = async (className, section) => {
        setLoading(true);
        try {
            const response = await teacherAPI.getStudents(className, section);
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClassClick = (classItem) => {
        setSelectedClass(classItem);
        fetchStudents(classItem.className, classItem.section);
    };

    if (loading && classes.length === 0) {
        return <div className="text-center py-8">Loading classes...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Classes Grid */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Classes</h2>

                {classes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classes.map((classItem) => (
                            <button
                                key={classItem.id}
                                onClick={() => handleClassClick(classItem)}
                                className={`p-5 rounded-lg border-2 transition-all text-left ${selectedClass?.id === classItem.id
                                        ? 'border-purple-600 bg-purple-50'
                                        : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Class {classItem.className} - {classItem.section}
                                    </h3>
                                    {classItem.isClassTeacher && (
                                        <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                                            Class Teacher
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600">Subject: {classItem.subject}</p>
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">No classes assigned yet</p>
                )}
            </div>

            {/* Students List */}
            {selectedClass && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Students in Class {selectedClass.className} - {selectedClass.section}
                    </h3>

                    {loading ? (
                        <div className="text-center py-8">Loading students...</div>
                    ) : students.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent Phone</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {students.map((student) => (
                                        <tr key={student.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {student.rollNo}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {student.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {student.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {student.parentName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {student.parentPhone}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-8">No students found in this class</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ViewClasses;

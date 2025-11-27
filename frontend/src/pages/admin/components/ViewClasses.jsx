import { useState, useEffect } from 'react';
import { adminAPI } from '../../../utils/api';

const ViewClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedClass, setSelectedClass] = useState(null);
    const [classStudents, setClassStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await adminAPI.getAllClasses();
            setClasses(response.data);
        } catch (err) {
            setError('Failed to fetch classes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleClassClick = async (cls) => {
        setSelectedClass(cls);
        setLoadingStudents(true);
        try {
            const response = await adminAPI.getStudentsByClass(cls.name, cls.section);
            setClassStudents(response.data);
        } catch (err) {
            console.error('Failed to fetch students', err);
        } finally {
            setLoadingStudents(false);
        }
    };

    if (loading) return <div className="p-6 text-center">Loading classes...</div>;
    if (error) return <div className="p-6 text-red-600 text-center">{error}</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Class Management</h3>
                    <p className="text-gray-600 text-sm">Total Classes: {classes.length}</p>
                </div>
            </div>

            {/* Class Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {classes.map((cls) => (
                    <div
                        key={cls.id}
                        onClick={() => handleClassClick(cls)}
                        className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-2xl font-bold text-gray-800">{cls.name}</h4>
                                <p className="text-gray-500 font-medium mt-1">Section: {cls.section}</p>
                            </div>
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">
                                {cls.name.charAt(0)}
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                            <span>Students: {cls.studentCount || 0}</span>
                            <span>Teacher: N/A</span> {/* Placeholder for now */}
                        </div>
                    </div>
                ))}
            </div>

            {/* Students Modal */}
            {selectedClass && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedClass(null)}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Class {selectedClass.name} - Section {selectedClass.section}</h3>
                                <p className="text-gray-500 text-sm mt-1">Total Students: {classStudents.length}</p>
                            </div>
                            <button
                                onClick={() => setSelectedClass(null)}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {loadingStudents ? (
                                <div className="text-center py-8">Loading students...</div>
                            ) : classStudents.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">No students found in this class.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-200 bg-gray-50">
                                                <th className="p-3 font-semibold text-gray-700">Roll No</th>
                                                <th className="p-3 font-semibold text-gray-700">Name</th>
                                                <th className="p-3 font-semibold text-gray-700">Email</th>
                                                <th className="p-3 font-semibold text-gray-700">Parent Name</th>
                                                <th className="p-3 font-semibold text-gray-700">Contact</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {classStudents.map((student) => (
                                                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="p-3 text-gray-900">{student.rollNo}</td>
                                                    <td className="p-3 font-medium text-gray-900">{student.name}</td>
                                                    <td className="p-3 text-gray-600">{student.email}</td>
                                                    <td className="p-3 text-gray-600">{student.parentName}</td>
                                                    <td className="p-3 text-gray-600">{student.phone || student.parentPhone}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewClasses;

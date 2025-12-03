import { useState, useEffect } from 'react';
import { teacherAPI } from '../../../utils/api';

const MarkAttendance = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [students, setStudents] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await teacherAPI.getClasses();
            setClasses(response.data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const fetchStudents = async () => {
        if (!selectedClass || !selectedSection) return;

        setLoading(true);
        try {
            const response = await teacherAPI.getStudents(selectedClass, selectedSection);
            setStudents(response.data);

            // Initialize attendance with PRESENT for all students
            const initialAttendance = {};
            response.data.forEach(student => {
                initialAttendance[student.id] = 'PRESENT';
            });
            setAttendance(initialAttendance);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedClass && selectedSection) {
            fetchStudents();
        }
    }, [selectedClass, selectedSection]);

    const handleAttendanceChange = (studentId, status) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (students.length === 0) {
            setMessage('Please select a class first');
            return;
        }

        setLoading(true);
        try {
            const attendanceRecords = students.map(student => ({
                studentId: student.id,
                status: attendance[student.id]
            }));

            await teacherAPI.markAttendance({
                attendanceRecords,
                date
            });

            setMessage('Attendance marked successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error marking attendance:', error);
            setMessage('Error marking attendance. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const uniqueClasses = [...new Set(classes.map(c => c.className))];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Mark Attendance</h3>
                    <p className="text-gray-600 text-sm">Record student attendance for classes</p>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded ${message.includes('Error') ? 'bg-red-50 border-l-4 border-red-400 text-red-700' : 'bg-green-50 border-l-4 border-green-400 text-green-700'}`}>
                    {message}
                </div>
            )}

            {/* Class Selection */}
            <div className="bg-white border border-gray-300 rounded p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Class & Date</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Choose class...</option>
                            {uniqueClasses.map(className => (
                                <option key={className} value={className}>{className}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Section</label>
                        <select
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Choose section...</option>
                            {classes
                                .filter(c => c.className === selectedClass)
                                .map(c => c.section)
                                .filter((v, i, a) => a.indexOf(v) === i)
                                .map(section => (
                                    <option key={section} value={section}>{section}</option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Students List */}
            {students.length > 0 && (
                <div className="bg-white border border-gray-300 rounded overflow-hidden">
                    <div className="p-4 border-b">
                        <h4 className="text-lg font-semibold text-gray-900">Student Attendance</h4>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-red-600 text-white">
                                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Roll No</th>
                                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Student Name</th>
                                        <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">Present</th>
                                        <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">Absent</th>
                                        <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">Late</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student) => (
                                        <tr key={student.id} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-3 text-sm">{student.rollNo}</td>
                                            <td className="border border-gray-300 px-4 py-3 text-sm font-medium">{student.name}</td>
                                            <td className="border border-gray-300 px-4 py-3 text-center">
                                                <input
                                                    type="radio"
                                                    name={`attendance-${student.id}`}
                                                    checked={attendance[student.id] === 'PRESENT'}
                                                    onChange={() => handleAttendanceChange(student.id, 'PRESENT')}
                                                    className="h-4 w-4 text-green-600"
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-center">
                                                <input
                                                    type="radio"
                                                    name={`attendance-${student.id}`}
                                                    checked={attendance[student.id] === 'ABSENT'}
                                                    onChange={() => handleAttendanceChange(student.id, 'ABSENT')}
                                                    className="h-4 w-4 text-red-600"
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-center">
                                                <input
                                                    type="radio"
                                                    name={`attendance-${student.id}`}
                                                    checked={attendance[student.id] === 'LATE'}
                                                    onChange={() => handleAttendanceChange(student.id, 'LATE')}
                                                    className="h-4 w-4 text-yellow-600"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 border-t">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 font-medium"
                            >
                                {loading ? 'Submitting...' : 'Submit Attendance'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {selectedClass && selectedSection && students.length === 0 && !loading && (
                <div className="bg-white border border-gray-300 rounded p-8 text-center">
                    <p className="text-gray-500">No students found in this class</p>
                </div>
            )}
        </div>
    );
};

export default MarkAttendance;

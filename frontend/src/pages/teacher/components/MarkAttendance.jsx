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
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Mark Attendance</h2>

                {message && (
                    <div className={`mb-4 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                        {message}
                    </div>
                )}

                {/* Class Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Students List */}
                {students.length > 0 && (
                    <form onSubmit={handleSubmit}>
                        <div className="overflow-x-auto mb-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Present</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Absent</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Late</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {students.map((student) => (
                                        <tr key={student.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.rollNo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <input
                                                    type="radio"
                                                    name={`attendance-${student.id}`}
                                                    checked={attendance[student.id] === 'PRESENT'}
                                                    onChange={() => handleAttendanceChange(student.id, 'PRESENT')}
                                                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <input
                                                    type="radio"
                                                    name={`attendance-${student.id}`}
                                                    checked={attendance[student.id] === 'ABSENT'}
                                                    onChange={() => handleAttendanceChange(student.id, 'ABSENT')}
                                                    className="h-4 w-4 text-red-600 focus:ring-red-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <input
                                                    type="radio"
                                                    name={`attendance-${student.id}`}
                                                    checked={attendance[student.id] === 'LATE'}
                                                    onChange={() => handleAttendanceChange(student.id, 'LATE')}
                                                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 font-medium"
                        >
                            {loading ? 'Submitting...' : 'Submit Attendance'}
                        </button>
                    </form>
                )}

                {selectedClass && selectedSection && students.length === 0 && !loading && (
                    <p className="text-center text-gray-500 py-8">No students found in this class</p>
                )}
            </div>
        </div>
    );
};

export default MarkAttendance;

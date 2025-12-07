import { useState, useEffect } from 'react';
import api from '../../../utils/api';

const TrackProgress = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState('');

    useEffect(() => {
        fetchStudentProgress();
    }, []);

    const fetchStudentProgress = async () => {
        try {
            const [studentsRes, marksRes, attendanceRes] = await Promise.all([
                api.get('/api/admin/students'),
                api.get('/api/admin/marks'),
                api.get('/api/admin/attendance')
            ]);

            const studentsData = studentsRes.data.map(student => {
                const studentMarks = marksRes.data.filter(mark => mark.studentId === student.id);
                const studentAttendance = attendanceRes.data.filter(att => att.studentId === student.id);

                const marksByExam = {
                    'Unit Test 1': studentMarks.filter(m => m.examType === 'Unit Test 1'),
                    'Unit Test 2': studentMarks.filter(m => m.examType === 'Unit Test 2'),
                    'Unit Test 3': studentMarks.filter(m => m.examType === 'Unit Test 3'),
                    'Unit Test 4': studentMarks.filter(m => m.examType === 'Unit Test 4'),
                    'Half Yearly': studentMarks.filter(m => m.examType === 'Half Yearly'),
                    'Final Exam': studentMarks.filter(m => m.examType === 'Final Exam')
                };

                const totalPresent = studentAttendance.filter(att => att.status === 'PRESENT').length;
                const totalDays = studentAttendance.length;
                const attendancePercentage = totalDays > 0 ? ((totalPresent / totalDays) * 100).toFixed(1) : 0;

                return {
                    ...student,
                    marks: marksByExam,
                    attendance: {
                        present: totalPresent,
                        total: totalDays,
                        percentage: attendancePercentage
                    }
                };
            });

            setStudents(studentsData);
        } catch (error) {
            console.error('Failed to fetch student progress:', error);
        }
        setLoading(false);
    };

    const getAverageMarks = (marks) => {
        if (!marks || marks.length === 0) return 'N/A';
        const total = marks.reduce((sum, mark) => sum + mark.marks, 0);
        return (total / marks.length).toFixed(1);
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = !classFilter || student.class === classFilter;
        return matchesSearch && matchesClass;
    });

    const uniqueClasses = [...new Set(students.map(s => s.class))].sort();

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Track Student Progress</h3>
                    <p className="text-gray-600 text-sm">Monitor academic performance and attendance</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                    type="text"
                    placeholder="Search by name or roll number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <select
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                    <option value="">All Classes</option>
                    {uniqueClasses.map(cls => (
                        <option key={cls} value={cls}>Class {cls}</option>
                    ))}
                </select>
            </div>

            <div className="bg-white border border-gray-300 rounded overflow-hidden">
                {loading ? (
                    <div className="text-center py-8">Loading progress data...</div>
                ) : filteredStudents.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No students found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="bg-red-600 text-white">
                                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Name</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Roll No</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Class</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center font-semibold">Unit Test 1</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center font-semibold">Unit Test 2</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center font-semibold">Unit Test 3</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center font-semibold">Unit Test 4</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center font-semibold">Half Yearly</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center font-semibold">Final Exam</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center font-semibold">Attendance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-3 py-2">{student.name}</td>
                                        <td className="border border-gray-300 px-3 py-2 font-medium">{student.rollNo}</td>
                                        <td className="border border-gray-300 px-3 py-2">{student.class}-{student.section}</td>
                                        <td className="border border-gray-300 px-3 py-2 text-center">
                                            {getAverageMarks(student.marks['Unit Test 1'])}
                                        </td>
                                        <td className="border border-gray-300 px-3 py-2 text-center">
                                            {getAverageMarks(student.marks['Unit Test 2'])}
                                        </td>
                                        <td className="border border-gray-300 px-3 py-2 text-center">
                                            {getAverageMarks(student.marks['Unit Test 3'])}
                                        </td>
                                        <td className="border border-gray-300 px-3 py-2 text-center">
                                            {getAverageMarks(student.marks['Unit Test 4'])}
                                        </td>
                                        <td className="border border-gray-300 px-3 py-2 text-center">
                                            {getAverageMarks(student.marks['Half Yearly'])}
                                        </td>
                                        <td className="border border-gray-300 px-3 py-2 text-center">
                                            {getAverageMarks(student.marks['Final Exam'])}
                                        </td>
                                        <td className="border border-gray-300 px-3 py-2 text-center">
                                            <span className={`px-2 py-1 text-xs rounded ${
                                                student.attendance.percentage >= 75 ? 'bg-green-100 text-green-800' :
                                                student.attendance.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {student.attendance.percentage}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackProgress;
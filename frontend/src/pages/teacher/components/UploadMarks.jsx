import { useState, useEffect } from 'react';
import { teacherAPI } from '../../../utils/api';

const UploadMarks = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [students, setStudents] = useState([]);
    const [subject, setSubject] = useState('');
    const [examType, setExamType] = useState('');
    const [maxMarks, setMaxMarks] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [marks, setMarks] = useState({});
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

            // Initialize marks
            const initialMarks = {};
            response.data.forEach(student => {
                initialMarks[student.id] = '';
            });
            setMarks(initialMarks);
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

    const handleMarksChange = (studentId, value) => {
        setMarks(prev => ({
            ...prev,
            [studentId]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!subject || !examType || !maxMarks) {
            setMessage('Please fill in all exam details');
            return;
        }

        if (students.length === 0) {
            setMessage('Please select a class first');
            return;
        }

        setLoading(true);
        try {
            const marksRecords = students.map(student => ({
                studentId: student.id,
                subject,
                examType,
                marks: marks[student.id] || 0,
                maxMarks,
                date
            }));

            await teacherAPI.uploadMarks({ marksRecords });

            setMessage('Marks uploaded successfully!');
            setTimeout(() => setMessage(''), 3000);

            // Reset marks
            const resetMarks = {};
            students.forEach(student => {
                resetMarks[student.id] = '';
            });
            setMarks(resetMarks);
        } catch (error) {
            console.error('Error uploading marks:', error);
            setMessage('Error uploading marks. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const uniqueClasses = [...new Set(classes.map(c => c.className))];

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Marks</h2>

                {message && (
                    <div className={`mb-4 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Class and Exam Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                required
                            >
                                <option value="">Choose class...</option>
                                {uniqueClasses.map(className => (
                                    <option key={className} value={className}>{className}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                            <select
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                required
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                placeholder="e.g., Mathematics"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
                            <select
                                value={examType}
                                onChange={(e) => setExamType(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                required
                            >
                                <option value="">Choose exam type...</option>
                                <option value="Unit Test">Unit Test</option>
                                <option value="Mid Term">Mid Term</option>
                                <option value="Final Exam">Final Exam</option>
                                <option value="Quiz">Quiz</option>
                                <option value="Assignment">Assignment</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Max Marks</label>
                            <input
                                type="number"
                                value={maxMarks}
                                onChange={(e) => setMaxMarks(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                placeholder="e.g., 100"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Students Marks Table */}
                    {students.length > 0 && (
                        <>
                            <div className="overflow-x-auto mb-6">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks Obtained</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {students.map((student) => (
                                            <tr key={student.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.rollNo}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={maxMarks}
                                                        value={marks[student.id]}
                                                        onChange={(e) => handleMarksChange(student.id, e.target.value)}
                                                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                                        placeholder="0"
                                                        required
                                                    />
                                                    <span className="ml-2 text-gray-600">/ {maxMarks}</span>
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
                                {loading ? 'Uploading...' : 'Upload Marks'}
                            </button>
                        </>
                    )}

                    {selectedClass && selectedSection && students.length === 0 && !loading && (
                        <p className="text-center text-gray-500 py-8">No students found in this class</p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default UploadMarks;

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
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Upload Marks</h3>
                    <p className="text-gray-600 text-sm">Enter exam marks for students</p>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded ${message.includes('Error') ? 'bg-red-50 border-l-4 border-red-400 text-red-700' : 'bg-green-50 border-l-4 border-green-400 text-green-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Class and Exam Details */}
                <div className="bg-white border border-gray-300 rounded p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Exam Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
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
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
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
                            <select
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                required
                            >
                                <option value="">Select subject...</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Science">Science</option>
                                <option value="English">English</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Social Studies">Social Studies</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Physics">Physics</option>
                                <option value="Chemistry">Chemistry</option>
                                <option value="Biology">Biology</option>
                                <option value="History">History</option>
                                <option value="Geography">Geography</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
                            <select
                                value={examType}
                                onChange={(e) => setExamType(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                required
                            >
                                <option value="">Choose exam type...</option>
                                <option value="Unit Test 1">Unit Test 1</option>
                                <option value="Unit Test 2">Unit Test 2</option>
                                <option value="Unit Test 3">Unit Test 3</option>
                                <option value="Unit Test 4">Unit Test 4</option>
                                <option value="Half Yearly">Half Yearly</option>
                                <option value="Final Exam">Final Exam</option>
                                <option value="Assignment">Assignment</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Max Marks</label>
                            <input
                                type="number"
                                value={maxMarks}
                                onChange={(e) => setMaxMarks(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
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
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Students Marks Table */}
                {students.length > 0 && (
                    <div className="bg-white border border-gray-300 rounded overflow-hidden">
                        <div className="p-4 border-b">
                            <h4 className="text-lg font-semibold text-gray-900">Student Marks</h4>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-red-600 text-white">
                                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Roll No</th>
                                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Student Name</th>
                                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Marks Obtained</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student) => (
                                        <tr key={student.id} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-3 text-sm">{student.rollNo}</td>
                                            <td className="border border-gray-300 px-4 py-3 text-sm font-medium">{student.name}</td>
                                            <td className="border border-gray-300 px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={maxMarks}
                                                        value={marks[student.id]}
                                                        onChange={(e) => handleMarksChange(student.id, e.target.value)}
                                                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                                                        placeholder="0"
                                                        required
                                                    />
                                                    <span className="text-gray-600 text-sm">/ {maxMarks}</span>
                                                </div>
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
                                {loading ? 'Uploading...' : 'Upload Marks'}
                            </button>
                        </div>
                    </div>
                )}

                {selectedClass && selectedSection && students.length === 0 && !loading && (
                    <div className="bg-white border border-gray-300 rounded p-8 text-center">
                        <p className="text-gray-500">No students found in this class</p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default UploadMarks;

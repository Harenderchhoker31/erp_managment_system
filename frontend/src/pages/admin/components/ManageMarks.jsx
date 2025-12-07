import { useState, useEffect } from 'react';
import { adminAPI } from '../../../utils/api';

const ManageMarks = () => {
    const [marks, setMarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('');
    const [examTypeFilter, setExamTypeFilter] = useState('');

    useEffect(() => {
        fetchMarks();
    }, []);

    const fetchMarks = async () => {
        try {
            const response = await adminAPI.getMarks();
            setMarks(response.data);
        } catch (error) {
            console.error('Error fetching marks:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredMarks = marks.filter(mark => {
        const matchesSearch = mark.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            mark.student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = !subjectFilter || mark.subject === subjectFilter;
        const matchesExamType = !examTypeFilter || mark.examType === examTypeFilter;
        
        return matchesSearch && matchesSubject && matchesExamType;
    });

    const uniqueSubjects = [...new Set(marks.map(m => m.subject))];
    const uniqueExamTypes = [...new Set(marks.map(m => m.examType))];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg text-gray-600">Loading marks...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Manage Marks</h3>
                    <p className="text-gray-600 text-sm">View and manage all uploaded marks</p>
                </div>
                <div className="text-sm text-gray-600">
                    Total Records: {filteredMarks.length}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-gray-300 rounded p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search Student</label>
                        <input
                            type="text"
                            placeholder="Search by name or roll number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                        <select
                            value={subjectFilter}
                            onChange={(e) => setSubjectFilter(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        >
                            <option value="">All Subjects</option>
                            {uniqueSubjects.map(subject => (
                                <option key={subject} value={subject}>{subject}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
                        <select
                            value={examTypeFilter}
                            onChange={(e) => setExamTypeFilter(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        >
                            <option value="">All Exam Types</option>
                            {uniqueExamTypes.map(examType => (
                                <option key={examType} value={examType}>{examType}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Marks Table */}
            <div className="bg-white border border-gray-300 rounded overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-red-600 text-white">
                                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Date</th>
                                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Student</th>
                                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Roll No</th>
                                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Class</th>
                                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Subject</th>
                                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Exam Type</th>
                                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">Marks</th>
                                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMarks.length > 0 ? (
                                filteredMarks.map((mark) => (
                                    <tr key={mark.id} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-3 text-sm">
                                            {new Date(mark.date).toLocaleDateString()}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-sm font-medium">
                                            {mark.student.name}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-sm">
                                            {mark.student.rollNo}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-sm">
                                            {mark.student.class}-{mark.student.section}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-sm">
                                            {mark.subject}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-sm">
                                            {mark.examType}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">
                                            <span className="font-medium">{mark.marks}</span>
                                            <span className="text-gray-500">/{mark.maxMarks}</span>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">
                                            <span className={`px-2 py-1 text-xs rounded font-medium ${
                                                (mark.marks / mark.maxMarks) * 100 >= 75 ? 'bg-green-100 text-green-800' :
                                                (mark.marks / mark.maxMarks) * 100 >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                                (mark.marks / mark.maxMarks) * 100 >= 35 ? 'bg-orange-100 text-orange-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {((mark.marks / mark.maxMarks) * 100).toFixed(1)}%
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                                        No marks found matching your criteria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageMarks;
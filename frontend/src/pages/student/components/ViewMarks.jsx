import { useState, useEffect } from 'react';
import { studentAPI } from '../../../utils/api';

const ViewMarks = () => {
    const [marks, setMarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subjectFilter, setSubjectFilter] = useState('');
    const [examFilter, setExamFilter] = useState('');

    useEffect(() => {
        fetchMarks();
    }, []);

    const fetchMarks = async () => {
        try {
            const response = await studentAPI.getMarks();
            setMarks(response.data);
        } catch (error) {
            console.error('Error fetching marks:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredMarks = marks.filter(mark => {
        const matchesSubject = !subjectFilter || mark.subject === subjectFilter;
        const matchesExam = !examFilter || mark.examType === examFilter;
        return matchesSubject && matchesExam;
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
            <div className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">My Marks</h3>
                    <p className="text-gray-600 text-sm">View your exam results and performance</p>
                </div>
            </div>

            <div className="bg-white border border-gray-300 rounded p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                        value={subjectFilter}
                        onChange={(e) => setSubjectFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    >
                        <option value="">All Subjects</option>
                        {uniqueSubjects.map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                        ))}
                    </select>
                    <select
                        value={examFilter}
                        onChange={(e) => setExamFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    >
                        <option value="">All Exam Types</option>
                        {uniqueExamTypes.map(examType => (
                            <option key={examType} value={examType}>{examType}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white border border-gray-300 rounded overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-red-600 text-white">
                                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Date</th>
                                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Subject</th>
                                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Exam Type</th>
                                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">Marks</th>
                                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">Percentage</th>
                                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMarks.length > 0 ? (
                                filteredMarks.map((mark) => {
                                    const percentage = ((mark.marks / mark.maxMarks) * 100).toFixed(1);
                                    const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B+' : percentage >= 60 ? 'B' : percentage >= 50 ? 'C' : percentage >= 35 ? 'D' : 'F';
                                    
                                    return (
                                        <tr key={mark.id} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-3 text-sm">
                                                {new Date(mark.date).toLocaleDateString()}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-sm font-medium">
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
                                                    percentage >= 75 ? 'bg-green-100 text-green-800' :
                                                    percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                                    percentage >= 35 ? 'bg-orange-100 text-orange-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {percentage}%
                                                </span>
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-center text-sm font-bold">
                                                {grade}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                                        No marks found
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

export default ViewMarks;
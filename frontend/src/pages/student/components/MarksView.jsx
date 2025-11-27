import { useState, useEffect } from 'react';
import { studentAPI } from '../../../utils/api';

const MarksView = () => {
    const [marksData, setMarksData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSubject, setSelectedSubject] = useState('all');

    useEffect(() => {
        fetchMarks();
    }, []);

    const fetchMarks = async () => {
        try {
            const response = await studentAPI.getMarks();
            setMarksData(response.data);
        } catch (error) {
            console.error('Error fetching marks:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading marks...</div>;
    }

    const { marks, bySubject } = marksData || { marks: [], bySubject: {} };
    const subjects = Object.keys(bySubject);

    const filteredMarks = selectedSubject === 'all'
        ? marks
        : bySubject[selectedSubject] || [];

    const calculatePercentage = (obtained, total) => {
        return ((obtained / total) * 100).toFixed(2);
    };

    const getGradeColor = (percentage) => {
        if (percentage >= 90) return 'text-green-600';
        if (percentage >= 75) return 'text-blue-600';
        if (percentage >= 60) return 'text-yellow-600';
        if (percentage >= 40) return 'text-orange-600';
        return 'text-red-600';
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">My Marks</h2>

                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="all">All Subjects</option>
                        {subjects.map((subject) => (
                            <option key={subject} value={subject}>{subject}</option>
                        ))}
                    </select>
                </div>

                {/* Marks Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subject
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Exam Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Marks Obtained
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Marks
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Percentage
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredMarks.length > 0 ? (
                                filteredMarks.map((mark) => {
                                    const percentage = calculatePercentage(mark.marks, mark.maxMarks);
                                    return (
                                        <tr key={mark.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {mark.subject}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {mark.examType}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {mark.marks}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {mark.maxMarks}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`text-sm font-semibold ${getGradeColor(percentage)}`}>
                                                    {percentage}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Date(mark.date).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No marks records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Subject-wise Summary */}
                {selectedSubject === 'all' && subjects.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject-wise Performance</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {subjects.map((subject) => {
                                const subjectMarks = bySubject[subject];
                                const totalObtained = subjectMarks.reduce((sum, m) => sum + m.marks, 0);
                                const totalMax = subjectMarks.reduce((sum, m) => sum + m.maxMarks, 0);
                                const avgPercentage = calculatePercentage(totalObtained, totalMax);

                                return (
                                    <div key={subject} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                                        <p className="font-medium text-gray-900">{subject}</p>
                                        <p className={`text-2xl font-bold mt-2 ${getGradeColor(avgPercentage)}`}>
                                            {avgPercentage}%
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {totalObtained} / {totalMax} marks
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarksView;

import { useState, useEffect } from 'react';
import { studentAPI } from '../../../utils/api';

const ViewAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subjectFilter, setSubjectFilter] = useState('');

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const response = await studentAPI.getAssignments();
            setAssignments(response.data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAssignments = assignments.filter(assignment => 
        !subjectFilter || assignment.subject === subjectFilter
    );

    const uniqueSubjects = [...new Set(assignments.map(a => a.subject))];

    const getStatusColor = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'bg-red-100 text-red-800'; // Overdue
        if (diffDays <= 2) return 'bg-yellow-100 text-yellow-800'; // Due soon
        return 'bg-green-100 text-green-800'; // On time
    };

    const getStatusText = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} day(s)`;
        if (diffDays === 0) return 'Due today';
        if (diffDays === 1) return 'Due tomorrow';
        return `Due in ${diffDays} day(s)`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg text-gray-600">Loading assignments...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">My Assignments</h3>
                    <p className="text-gray-600 text-sm">View and track your homework assignments</p>
                </div>
            </div>

            <div className="bg-white border border-gray-300 rounded p-4">
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
            </div>

            <div className="bg-white border border-gray-300 rounded overflow-hidden">
                {filteredAssignments.length > 0 ? (
                    <div className="space-y-4 p-4">
                        {filteredAssignments.map((assignment) => (
                            <div key={assignment.id} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-gray-800 text-lg">{assignment.title}</h4>
                                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(assignment.dueDate)}`}>
                                        {getStatusText(assignment.dueDate)}
                                    </span>
                                </div>
                                <p className="text-gray-700 mb-3">{assignment.description}</p>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex gap-4">
                                        <span className="text-blue-600 font-medium">📚 {assignment.subject}</span>
                                        <span className="text-gray-600">📅 Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                    </div>
                                    <span className="text-gray-500">
                                        Created: {new Date(assignment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No assignments found
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewAssignments;
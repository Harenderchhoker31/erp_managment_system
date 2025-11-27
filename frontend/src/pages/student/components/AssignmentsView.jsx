import { useState, useEffect } from 'react';
import { studentAPI } from '../../../utils/api';

const AssignmentsView = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

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

    if (loading) {
        return <div className="text-center py-8">Loading assignments...</div>;
    }

    const filteredAssignments = filter === 'all'
        ? assignments
        : assignments.filter(a => a.status === filter);

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'SUBMITTED':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'REVIEWED':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const isOverdue = (dueDate) => {
        return new Date(dueDate) < new Date();
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">My Assignments</h2>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('PENDING')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'PENDING'
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter('SUBMITTED')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'SUBMITTED'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Submitted
                        </button>
                    </div>
                </div>

                {/* Assignments List */}
                <div className="space-y-4">
                    {filteredAssignments.length > 0 ? (
                        filteredAssignments.map((assignment) => (
                            <div
                                key={assignment.id}
                                className={`border-l-4 rounded-lg p-5 transition-all hover:shadow-md ${isOverdue(assignment.dueDate) && assignment.status === 'PENDING'
                                        ? 'bg-red-50 border-red-500'
                                        : 'bg-gray-50 border-indigo-500'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(assignment.status)}`}>
                                                {assignment.status}
                                            </span>
                                        </div>

                                        <p className="text-gray-700 mb-3">{assignment.description}</p>

                                        <div className="flex items-center gap-6 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">Subject:</span>
                                                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded">
                                                    {assignment.subject}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">Due Date:</span>
                                                <span className={isOverdue(assignment.dueDate) && assignment.status === 'PENDING' ? 'text-red-600 font-semibold' : ''}>
                                                    {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        {isOverdue(assignment.dueDate) && assignment.status === 'PENDING' && (
                                            <div className="mt-3 flex items-center gap-2 text-red-600 text-sm font-medium">
                                                <span>⚠️</span>
                                                <span>This assignment is overdue!</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg">No assignments found</p>
                            <p className="text-sm mt-2">Check back later for new assignments</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssignmentsView;

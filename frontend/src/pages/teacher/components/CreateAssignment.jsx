import { useState, useEffect } from 'react';
import { teacherAPI } from '../../../utils/api';

const CreateAssignment = () => {
    const [classes, setClasses] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: '',
        className: '',
        section: '',
        dueDate: ''
    });
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchClasses();
        fetchAssignments();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await teacherAPI.getClasses();
            setClasses(response.data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const fetchAssignments = async () => {
        try {
            const response = await teacherAPI.getAssignments();
            setAssignments(response.data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await teacherAPI.createAssignment(formData);
            setMessage('Assignment created successfully!');
            setFormData({
                title: '',
                description: '',
                subject: '',
                className: '',
                section: '',
                dueDate: ''
            });
            fetchAssignments();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error creating assignment:', error);
            setMessage('Error creating assignment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const uniqueClasses = [...new Set(classes.map(c => c.className))];

    return (
        <div className="space-y-6">
            {/* Create Assignment Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Assignment</h2>

                {message && (
                    <div className={`mb-4 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                placeholder="Assignment title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                placeholder="e.g., Mathematics"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Class *</label>
                            <select
                                value={formData.className}
                                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Section *</label>
                            <select
                                value={formData.section}
                                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                required
                            >
                                <option value="">Choose section...</option>
                                {classes
                                    .filter(c => c.className === formData.className)
                                    .map(c => c.section)
                                    .filter((v, i, a) => a.indexOf(v) === i)
                                    .map(section => (
                                        <option key={section} value={section}>{section}</option>
                                    ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                            <input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            rows="4"
                            placeholder="Assignment details and instructions..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 font-medium"
                    >
                        {loading ? 'Creating...' : 'Create Assignment'}
                    </button>
                </form>
            </div>

            {/* My Assignments List */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">My Assignments</h3>

                {assignments.length > 0 ? (
                    <div className="space-y-3">
                        {assignments.map((assignment) => (
                            <div key={assignment.id} className="border-l-4 border-purple-500 bg-purple-50 rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                            <span>📚 {assignment.subject}</span>
                                            <span>🏫 Class {assignment.class} - {assignment.section}</span>
                                            <span>📅 Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">No assignments created yet</p>
                )}
            </div>
        </div>
    );
};

export default CreateAssignment;

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
        <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Create Assignment</h3>
                    <p className="text-gray-600 text-sm">Create assignments for your classes</p>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded ${message.includes('Error') ? 'bg-red-50 border-l-4 border-red-400 text-red-700' : 'bg-green-50 border-l-4 border-green-400 text-green-700'}`}>
                    {message}
                </div>
            )}

            <div className="bg-white border border-gray-300 rounded p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="Assignment title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                            <select
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                required
                            >
                                <option value="">Select subject...</option>
                                {classes
                                    .filter(c => c.className === formData.className && c.section === formData.section)
                                    .map(c => c.subject)
                                    .filter((v, i, a) => a.indexOf(v) === i)
                                    .map(subj => (
                                        <option key={subj} value={subj}>{subj}</option>
                                    ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Class *</label>
                            <select
                                value={formData.className}
                                onChange={(e) => setFormData({ ...formData, className: e.target.value, section: '', subject: '' })}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                required
                            >
                                <option value="">Choose class...</option>
                                {uniqueClasses.map(className => (
                                    <option key={className} value={className}>Class {className}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Section *</label>
                            <select
                                value={formData.section}
                                onChange={(e) => setFormData({ ...formData, section: e.target.value, subject: '' })}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                required
                                disabled={!formData.className}
                            >
                                <option value="">Choose section...</option>
                                {classes
                                    .filter(c => c.className === formData.className)
                                    .map(c => c.section)
                                    .filter((v, i, a) => a.indexOf(v) === i)
                                    .map(section => (
                                        <option key={section} value={section}>Section {section}</option>
                                    ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                            <input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            rows="4"
                            placeholder="Assignment details and instructions..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 font-medium"
                    >
                        {loading ? 'Creating...' : 'Create Assignment'}
                    </button>
                </form>
            </div>

            <div className="bg-white border border-gray-300 rounded overflow-hidden">
                <div className="p-4 border-b">
                    <h4 className="text-lg font-semibold text-gray-900">My Assignments</h4>
                </div>
                <div className="p-4">
                    {assignments.length > 0 ? (
                        <div className="space-y-3">
                            {assignments.map((assignment) => (
                                <div key={assignment.id} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                <span>📚 {assignment.subject}</span>
                                                <span>🏫 Class {assignment.className} - {assignment.section}</span>
                                                <span>📅 Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No assignments created yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateAssignment;
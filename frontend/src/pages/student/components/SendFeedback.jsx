import { useState, useEffect } from 'react';
import { studentAPI } from '../../../utils/api';

const SendFeedback = () => {
    const [teachers, setTeachers] = useState([]);
    const [formData, setFormData] = useState({
        teacherId: '',
        message: '',
        rating: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await studentAPI.getTeachers();
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await studentAPI.sendFeedback(formData);
            setMessage('Feedback sent successfully!');
            setFormData({
                teacherId: '',
                message: '',
                rating: ''
            });
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error sending feedback:', error);
            setMessage('Error sending feedback. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Send Feedback</h3>
                    <p className="text-gray-600 text-sm">Share your thoughts with your teachers</p>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded ${message.includes('Error') ? 'bg-red-50 border-l-4 border-red-400 text-red-700' : 'bg-green-50 border-l-4 border-green-400 text-green-700'}`}>
                    {message}
                </div>
            )}

            <div className="bg-white border border-gray-300 rounded p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Teacher *</label>
                        <select
                            value={formData.teacherId}
                            onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            required
                        >
                            <option value="">Choose a teacher...</option>
                            {teachers.map(teacher => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.name} - {teacher.subject}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating (Optional)</label>
                        <select
                            value={formData.rating}
                            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Select rating...</option>
                            <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                            <option value="4">⭐⭐⭐⭐ Good</option>
                            <option value="3">⭐⭐⭐ Average</option>
                            <option value="2">⭐⭐ Below Average</option>
                            <option value="1">⭐ Poor</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            rows="5"
                            placeholder="Share your feedback, suggestions, or concerns..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 font-medium"
                    >
                        {loading ? 'Sending...' : 'Send Feedback'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SendFeedback;
import { useState, useEffect } from 'react';
import api from '../../../utils/api';

const ParentFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await api.get('/api/teacher/feedback');
            setFeedbacks(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            console.error('Failed to fetch feedbacks');
        }
        setLoading(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Parent Feedback</h3>
                    <p className="text-gray-600 text-sm">View feedback from parents</p>
                </div>
            </div>

            <div className="bg-white border border-gray-300 rounded overflow-hidden">
                {loading ? (
                    <div className="text-center py-8">Loading feedback...</div>
                ) : feedbacks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No feedback received yet</div>
                ) : (
                    <div className="space-y-4 p-4">
                        {feedbacks.map((feedback) => (
                            <div key={feedback.id} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-gray-800">{feedback.sender?.name || 'Anonymous'}</h4>
                                    {feedback.rating && (
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={`text-sm ${
                                                    i < feedback.rating ? 'text-yellow-500' : 'text-gray-300'
                                                }`}>
                                                    *
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <p className="text-gray-700 mb-3">{feedback.message}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(feedback.createdAt).toLocaleDateString()} • {feedback.sender?.email}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParentFeedback;
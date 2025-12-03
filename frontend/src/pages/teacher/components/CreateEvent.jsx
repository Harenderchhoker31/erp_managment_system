import { useState, useEffect } from 'react';
import { teacherAPI } from '../../../utils/api';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: ''
    });
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await teacherAPI.getEvents();
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await teacherAPI.createEvent(formData);
            setMessage('Event created successfully!');
            setFormData({
                title: '',
                description: '',
                date: ''
            });
            fetchEvents();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error creating event:', error);
            setMessage('Error creating event. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Create Event</h3>
                    <p className="text-gray-600 text-sm">Create school events and activities</p>
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="Event title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time *</label>
                            <input
                                type="datetime-local"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                            placeholder="Event description and details..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 font-medium"
                    >
                        {loading ? 'Creating...' : 'Create Event'}
                    </button>
                </form>
            </div>

            <div className="bg-white border border-gray-300 rounded overflow-hidden">
                <div className="p-4 border-b">
                    <h4 className="text-lg font-semibold text-gray-900">My Events</h4>
                </div>
                <div className="p-4">
                    {events.length > 0 ? (
                        <div className="space-y-3">
                            {events.map((event) => (
                                <div key={event.id} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                    <h4 className="font-medium text-gray-800">{event.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                    <p className="text-xs text-blue-600 mt-2">
                                        {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No events created yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;
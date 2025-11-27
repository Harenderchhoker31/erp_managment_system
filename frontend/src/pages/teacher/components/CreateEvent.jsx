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
            setFormData({ title: '', description: '', date: '' });
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
        <div className="space-y-6">
            {/* Create Event Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Event</h2>

                {message && (
                    <div className={`mb-4 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                placeholder="e.g., Annual Sports Day"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Event Date *</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                            placeholder="Event details..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 font-medium"
                    >
                        {loading ? 'Creating...' : 'Create Event'}
                    </button>
                </form>
            </div>

            {/* Events List */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">My Events</h3>

                {events.length > 0 ? (
                    <div className="space-y-3">
                        {events.map((event) => (
                            <div key={event.id} className="border-l-4 border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                            <span>📅</span>
                                            <span>{new Date(event.date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="bg-indigo-600 text-white rounded-lg p-3 text-center min-w-[60px]">
                                            <div className="text-2xl font-bold">{new Date(event.date).getDate()}</div>
                                            <div className="text-xs uppercase">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">No events created yet</p>
                )}
            </div>
        </div>
    );
};

export default CreateEvent;

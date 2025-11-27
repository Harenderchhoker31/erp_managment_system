import { useState, useEffect } from 'react';
import { studentAPI } from '../../../utils/api';

const EventsView = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await studentAPI.getEvents();
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading events...</div>;
    }

    const upcomingEvents = events.filter(e => new Date(e.date) >= new Date());
    const pastEvents = events.filter(e => new Date(e.date) < new Date());

    return (
        <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events 🎉</h2>

                {upcomingEvents.length > 0 ? (
                    <div className="space-y-4">
                        {upcomingEvents.map((event) => (
                            <div
                                key={event.id}
                                className="border-l-4 border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-5 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                                        <p className="text-gray-700 mb-3">{event.description}</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <span className="font-medium">📅</span>
                                            <span>
                                                {new Date(event.date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="bg-indigo-600 text-white rounded-lg p-3 text-center min-w-[60px]">
                                            <div className="text-2xl font-bold">
                                                {new Date(event.date).getDate()}
                                            </div>
                                            <div className="text-xs uppercase">
                                                {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg">No upcoming events</p>
                        <p className="text-sm mt-2">Check back later for new events</p>
                    </div>
                )}
            </div>

            {/* Past Events */}
            {pastEvents.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Past Events</h2>

                    <div className="space-y-3">
                        {pastEvents.map((event) => (
                            <div
                                key={event.id}
                                className="border-l-4 border-gray-300 bg-gray-50 rounded-lg p-4 opacity-75"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-base font-semibold text-gray-800 mb-1">{event.title}</h3>
                                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span>📅</span>
                                            <span>{new Date(event.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventsView;

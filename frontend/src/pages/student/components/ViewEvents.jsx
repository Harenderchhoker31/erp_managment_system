import { useState, useEffect } from 'react';
import { studentAPI } from '../../../utils/api';

const ViewEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('upcoming');

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

    const now = new Date();
    const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        if (filter === 'upcoming') return eventDate >= now;
        if (filter === 'past') return eventDate < now;
        return true;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg text-gray-600">Loading events...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">School Events</h3>
                    <p className="text-gray-600 text-sm">Stay updated with school activities and events</p>
                </div>
            </div>

            <div className="bg-white border border-gray-300 rounded p-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-4 py-2 rounded text-sm font-medium ${
                            filter === 'upcoming' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Upcoming Events
                    </button>
                    <button
                        onClick={() => setFilter('past')}
                        className={`px-4 py-2 rounded text-sm font-medium ${
                            filter === 'past' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Past Events
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded text-sm font-medium ${
                            filter === 'all' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        All Events
                    </button>
                </div>
            </div>

            <div className="bg-white border border-gray-300 rounded overflow-hidden">
                {filteredEvents.length > 0 ? (
                    <div className="space-y-4 p-4">
                        {filteredEvents.map((event) => {
                            const eventDate = new Date(event.date);
                            const isUpcoming = eventDate >= now;
                            
                            return (
                                <div key={event.id} className={`p-4 rounded-lg border-l-4 ${
                                    isUpcoming ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-400'
                                }`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-gray-800 text-lg">{event.title}</h4>
                                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                            isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {isUpcoming ? 'Upcoming' : 'Completed'}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 mb-3">{event.description}</p>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex gap-4">
                                            <span className="text-blue-600 font-medium">
                                                📅 {eventDate.toLocaleDateString()}
                                            </span>
                                            <span className="text-blue-600 font-medium">
                                                🕒 {eventDate.toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <span className="text-gray-500">
                                            By: {event.creator ? (event.creator.role === 'ADMIN' ? 'Principal' : event.creator.name) : 'Administration'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No {filter === 'all' ? '' : filter} events found
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewEvents;
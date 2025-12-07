import { useState, useEffect } from 'react';
import api from '../../../utils/api';

const ViewNotices = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('');

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const response = await api.get('/api/admin/notices');
            setNotices(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            console.error('Failed to fetch notices');
        }
        setLoading(false);
    };

    const filteredNotices = notices.filter(notice => 
        !typeFilter || notice.type === typeFilter
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">School Notices</h3>
                    <p className="text-gray-600 text-sm">View all notices from administration</p>
                </div>
            </div>

            <div className="bg-white border border-gray-300 rounded p-4">
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                    <option value="">All Types</option>
                    <option value="GENERAL">General</option>
                    <option value="ATTENDANCE">Attendance</option>
                    <option value="MARKS">Marks</option>
                    <option value="EVENT">Event</option>
                    <option value="URGENT">Urgent</option>
                </select>
            </div>

            <div className="bg-white border border-gray-300 rounded overflow-hidden">
                {loading ? (
                    <div className="text-center py-8">Loading notices...</div>
                ) : filteredNotices.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No notices found</div>
                ) : (
                    <div className="space-y-4 p-4">
                        {filteredNotices.map((notice) => (
                            <div key={notice.id} className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-gray-800 text-lg">{notice.title}</h4>
                                    <span className={`px-3 py-1 text-xs rounded-full ${
                                        notice.type === 'GENERAL' ? 'bg-gray-100 text-gray-800' :
                                        notice.type === 'ATTENDANCE' ? 'bg-yellow-100 text-yellow-800' :
                                        notice.type === 'MARKS' ? 'bg-green-100 text-green-800' :
                                        notice.type === 'EVENT' ? 'bg-blue-100 text-blue-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {notice.type}
                                    </span>
                                </div>
                                <p className="text-gray-700 mb-3">{notice.message}</p>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>Posted: {new Date(notice.createdAt).toLocaleDateString()}</span>
                                    <span>By: {notice.creator ? (notice.creator.role === 'ADMIN' ? 'Principal' : notice.creator.name) : 'Administration'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewNotices;
import { useState, useEffect } from 'react';
import { studentAPI } from '../../../utils/api';

const ViewNotices = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('');

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const response = await studentAPI.getNotices();
            setNotices(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            console.error('Error fetching notices:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredNotices = notices.filter(notice => 
        !typeFilter || notice.type === typeFilter
    );

    const uniqueTypes = [...new Set(notices.map(n => n.type))];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg text-gray-600">Loading notices...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">School Notices</h3>
                    <p className="text-gray-600 text-sm">Important announcements and updates</p>
                </div>
            </div>

            <div className="bg-white border border-gray-300 rounded p-4">
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                    <option value="">All Types</option>
                    {uniqueTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            <div className="bg-white border border-gray-300 rounded overflow-hidden">
                {filteredNotices.length > 0 ? (
                    <div className="space-y-4 p-4">
                        {filteredNotices.map((notice) => (
                            <div key={notice.id} className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-gray-800 text-lg">{notice.title}</h4>
                                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                        notice.type === 'GENERAL' ? 'bg-gray-100 text-gray-800' :
                                        notice.type === 'URGENT' ? 'bg-red-100 text-red-800' :
                                        notice.type === 'ACADEMIC' ? 'bg-blue-100 text-blue-800' :
                                        notice.type === 'EVENT' ? 'bg-green-100 text-green-800' :
                                        'bg-purple-100 text-purple-800'
                                    }`}>
                                        {notice.type}
                                    </span>
                                </div>
                                <p className="text-gray-700 mb-3">{notice.message}</p>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>Posted: {new Date(notice.createdAt).toLocaleDateString()}</span>
                                    <span>
                                        By: {notice.creator ? (notice.creator.role === 'ADMIN' ? 'Principal' : notice.creator.name) : 'Administration'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No notices found
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewNotices;
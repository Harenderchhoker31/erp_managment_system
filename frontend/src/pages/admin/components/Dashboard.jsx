import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ students: 0, teachers: 0 });
  const [thoughtOfDay, setThoughtOfDay] = useState('Education is the most powerful weapon which you can use to change the world.');
  const [isEditingThought, setIsEditingThought] = useState(false);
  const [tempThought, setTempThought] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [studentsRes, teachersRes] = await Promise.all([
        axios.get('/api/admin/students'),
        axios.get('/api/admin/teachers')
      ]);
      setStats({
        students: studentsRes.data.length,
        teachers: teachersRes.data.length
      });
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const handleEditThought = () => {
    setTempThought(thoughtOfDay);
    setIsEditingThought(true);
  };

  const handleSaveThought = () => {
    setThoughtOfDay(tempThought);
    setIsEditingThought(false);
  };

  const handleCancelEdit = () => {
    setTempThought('');
    setIsEditingThought(false);
  };

  const handleDeleteThought = () => {
    setThoughtOfDay('');
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.students}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">👨🏫</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Teachers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.teachers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Classes</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Thought of the Day */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">💭 Thought of the Day</h3>
          <div className="flex space-x-2">
            {!isEditingThought && (
              <>
                <button
                  onClick={handleEditThought}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteThought}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
        
        {isEditingThought ? (
          <div className="space-y-3">
            <textarea
              value={tempThought}
              onChange={(e) => setTempThought(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows="3"
              placeholder="Enter thought of the day..."
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSaveThought}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg">
            {thoughtOfDay ? (
              <p className="text-gray-700 italic text-center">"{thoughtOfDay}"</p>
            ) : (
              <p className="text-gray-500 text-center">No thought added yet. Click Edit to add one.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
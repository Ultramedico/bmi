import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRssFeed } from '../../store/RssSlice';


const Dashboard = () => {
    const [url, setUrl] = useState('');
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.rss);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!url) return;
      dispatch(fetchRssFeed(url));
    };

  return (
    <div className="dashboard-container bg-gray-100 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">RSS Feed Fetcher</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            RSS Feed URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter RSS feed URL"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            </div>
          )}
          <span className={loading ? 'invisible' : ''}>Fetch Feed</span>
        </button>
      </form>
   
      {/* Add feed display section here */}
    </div>
  );
};

export default Dashboard;
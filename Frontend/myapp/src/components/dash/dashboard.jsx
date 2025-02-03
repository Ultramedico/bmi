import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRssFeed } from '../../store/RssSlice';

import { fetchArticles } from '../../store/articlesSlice';
import Table from '../Table/table';
const Dashboard = () => {
    const [url, setUrl] = useState('');
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.rss);
    const { loading: articlesLoading, data: articles } = useSelector((state) => state.articles);
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!url) return;
      dispatch(fetchRssFeed(url));
    };
    useEffect(() => {
        dispatch(fetchArticles());
      }, [dispatch]);
      const tableHeaders = [
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Summary' }, 
        { key: 'published', label: 'Published Date' },
        { key: 'link', label: 'Source' }
      ];
   

    
  return (
    <div className="dashboard-container bg-gray-100 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">BMI</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-light text-gray-800 mb-6">RSS Feed Fetcher</h1>
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

       {/* Articles Table */}
       <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Latest Articles</h2>
        <Table 
          headers={tableHeaders}
          data={Array.isArray(articles) ? articles : []} 
          loading={articlesLoading}
        />
      </div>
    </div>
  );
};

export default Dashboard;
import React from 'react';
// import './Home.css';

const Home = () => {
  return (
    <div className="home-container bg-blue-50 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to Home Page</h1>
      <p className="text-gray-700 mb-8">This is the landing page of our application</p>
      <a 
        href="/dashboard" 
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go to Dashboard
      </a>
    </div>
  );
};

export default Home;
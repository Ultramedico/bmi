const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  RSS_FEED: `${BASE_URL}/api/fetch_rss`,
  // Other endpoints
  USERS: `${BASE_URL}/api/users`,
  POSTS: `${BASE_URL}/api/posts`,
};


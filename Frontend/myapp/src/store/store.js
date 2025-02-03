import { configureStore } from '@reduxjs/toolkit';
import rssReducer from './RssSlice';
import notificationReducer from './notificationSlice';
import articlesReducer from './articlesSlice';
export default configureStore({
  reducer: {
    notification: notificationReducer,
    rss: rssReducer,
    articles: articlesReducer,
  }
});
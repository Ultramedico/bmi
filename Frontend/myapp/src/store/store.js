import { configureStore } from '@reduxjs/toolkit';
import rssReducer from './RssSlice';
import notificationReducer from './notificationSlice';
export default configureStore({
  reducer: {
    notification: notificationReducer,
    rss: rssReducer,
  
  }
});
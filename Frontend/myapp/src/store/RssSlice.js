import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showSuccessNotification, showErrorNotification } from './notificationSlice';

import { API_ENDPOINTS } from '../utils/endpoints';
export const fetchRssFeed = createAsyncThunk(
  'rss/fetchFeed',
  async (feedUrl, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(API_ENDPOINTS.RSS_FEED, { feed_url: feedUrl });

      // Extract message from API response
      const successMessage = response.data.message || "Feed fetched successfully!";

      console.log("Success Notification Dispatched:", successMessage); // Debugging

      dispatch(showSuccessNotification(successMessage));

      return response.data;
    } catch (error) {
      console.log("Error Notification Dispatched", error.message); // Debugging
      dispatch(showErrorNotification(error.message));
      return rejectWithValue(error.message);
    }
  }
);

const rssSlice = createSlice({
  name: 'rss',
  initialState: {
    loading: false,
    data: null,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRssFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRssFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRssFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default rssSlice.reducer;
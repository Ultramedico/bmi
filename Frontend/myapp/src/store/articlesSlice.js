import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_ENDPOINTS } from '../utils/endpoints';
import { showSuccessNotification, showErrorNotification } from './notificationSlice';

export const fetchArticles = createAsyncThunk(
    'articles/fetchAll',
    async (_, { rejectWithValue, dispatch }) => { // Extract dispatch from thunkAPI
      try {
        const response = await axios.get(API_ENDPOINTS.ARTICLES);
        dispatch(showSuccessNotification("Articles fetched successfully")); 
       
        return response.data;
        
      } catch (error) {
        dispatch(showErrorNotification(error.message));
        return rejectWithValue(error.response?.data || 'Failed to fetch articles');
        
      }
    }
  );
  

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    loading: false,
    data: [],
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default articlesSlice.reducer;
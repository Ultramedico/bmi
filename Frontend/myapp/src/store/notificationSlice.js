import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    showSuccessNotification: (_, action) => ({
      type: 'success',
      message: action.payload
    }),
    showErrorNotification: (_, action) => ({
      type: 'error',
      message: action.payload
    }),
    clearNotification: () => null
  }
});

export const { 
  showSuccessNotification, 
  showErrorNotification, 
  clearNotification 
} = notificationSlice.actions;

export default notificationSlice.reducer;
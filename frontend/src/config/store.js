import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice.js';

//Redux
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;

// redux auth
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('AccesToken') || null,
  isAuthenticated: !!localStorage.getItem('AccessToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('AccesToken', action.payload);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('AccesToken');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

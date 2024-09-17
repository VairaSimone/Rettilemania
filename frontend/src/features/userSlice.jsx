import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      console.log('Azione loginUser:', action.payload);
      state.user = action.payload;
    },
    logoutUser: (state) => {
      console.log('Logout eseguito');
      state.user = null;
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;

export const selectUser = (state) => state.user.user;

export default userSlice.reducer;

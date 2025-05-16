import { createSlice } from '@reduxjs/toolkit';

const storedEmail = localStorage.getItem('email') || '';
const storedUsername = localStorage.getItem('username') || '';
const storedUserId = localStorage.getItem('ID') || ''; 

const initialState = {
  showPassword: false,
  loggedOut: storedUserId ? false : true,
  email: storedEmail,
  username: storedUsername,
  password: '',
  userId: storedUserId,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleShowPassword: (state) => {
      state.showPassword = !state.showPassword;
    },
    setLoggedOut: (state, action) => {
      state.loggedOut = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    resetUser: (state) => {
      state.email = '';
      state.username = '';
      state.password = '';
      state.userId = '';
      state.showPassword = false;
      state.loggedOut = true;
    },
  },
});

export const {
  toggleShowPassword,
  setLoggedOut,
  setEmail,
  setUsername,
  setPassword,
  setUserId, 
  resetUser,
} = appSlice.actions;

export default appSlice.reducer;

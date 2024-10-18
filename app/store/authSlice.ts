import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.isLoading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      // Reset the entire state to initial values
      return initialState;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isLoading = false;
      state.error = null;
      // If authenticated, we assume the token exists, but we don't set it here
      // as we don't have access to it in this action
      if (action.payload) {
        state.token = 'placeholder'; // This will be replaced with the actual token later
      } else {
        state.token = null;
        state.user = null;
      }
    },
    restoreSession: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.isLoading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setAuthenticated, restoreSession } = authSlice.actions;
export default authSlice.reducer;

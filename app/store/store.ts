import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import navigationReducer from './navigationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    navigation: navigationReducer,
    // Add other reducers here as needed
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

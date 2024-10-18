import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavigationState {
  currentPath: string;
}

const initialState: NavigationState = {
  currentPath: '/',
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setCurrentPath: (state, action: PayloadAction<string>) => {
      state.currentPath = action.payload;
    },
  },
});

export const { setCurrentPath } = navigationSlice.actions;
export default navigationSlice.reducer;


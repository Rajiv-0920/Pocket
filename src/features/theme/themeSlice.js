import { createSlice } from '@reduxjs/toolkit';

export const THEME_KEY = 'pocket-theme';

const initialState = {
  appearance: localStorage.getItem(THEME_KEY) || 'light', // light | dark
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.appearance = state.appearance === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, state.appearance);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;

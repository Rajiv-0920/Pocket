import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../features/theme/themeSlice';
import bookmarkReducer from '../features/bookmark/bookmarkSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    bookmark: bookmarkReducer,
  },
});

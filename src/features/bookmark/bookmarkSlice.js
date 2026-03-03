import { nanoid } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'smart-bookmarks-v1';

const initialState = {
  bookmarks: JSON.parse(localStorage.getItem(STORAGE_KEY)) || [],
};

const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState,
  reducers: {
    createBookmark: (state, action) => {
      const bookmark = {
        id: nanoid(),
        createdAt: Date.now(),
        lastVisited: null,
        count: 0,
        ...action.payload,
      };
      state.bookmarks.push(bookmark);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.bookmarks));
    },

    visitBookmark: (state, action) => {
      const id = action.payload;
      const bookmark = state.bookmarks.find((b) => b.id === id);
      if (bookmark) {
        bookmark.lastVisited = Date.now();
        bookmark.visitCount += 1;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.bookmarks));
    },

    deleteBookmark: (state, action) => {
      const { id } = action.payload;
      state.bookmarks = state.bookmarks.filter((b) => b.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.bookmarks));
    },
  },
});

export const { createBookmark, visitBookmark, deleteBookmark } =
  bookmarkSlice.actions;
export default bookmarkSlice.reducer;

export const selectRecentVisits = (state) => {
  return state.bookmark.bookmarks
    .filter((b) => b.lastVisited !== null)
    .sort((a, b) => b.lastVisited - a.lastVisited)
    .slice(0, 5);
};

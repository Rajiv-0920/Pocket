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
        visitCount: 0,
        category: null, // 'Learning' | 'Tool' | 'Other'
        subType: null, // used by 'Other' category, e.g. 'Article'
        domain: null, // used by 'Tool' category, e.g. 'OSINT', 'Web Development'
        mediaType: null, // used by 'Tool' category, e.g. 'Video', 'Code' (optional, independent of domain)
        status: null, // e.g. 'Not Started', 'Unread'
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
    updateStatus: (state, action) => {
      const { id, status } = action.payload;
      const bookmark = state.bookmarks.find((b) => b.id === id);
      if (bookmark) bookmark.status = status;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.bookmarks));
    },
  },
});

export const { createBookmark, visitBookmark, deleteBookmark, updateStatus } =
  bookmarkSlice.actions;
export default bookmarkSlice.reducer;

export const selectRecentVisits = (state) => {
  return state.bookmark.bookmarks
    .filter((b) => b.lastVisited !== null)
    .sort((a, b) => b.lastVisited - a.lastVisited)
    .slice(0, 5);
};

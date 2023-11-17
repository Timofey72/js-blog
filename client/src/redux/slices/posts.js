import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get('post');
  return data;
});

const initialState = {
  posts: [],
  tags: [],
  status: 'loading',
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchPosts.pending]: (state) => {
      state.status = 'loading';
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts = action.payload.posts;
      state.tags = action.payload.lastTags;
      state.status = 'success';
    },
    [fetchPosts.rejected]: (state) => {
      state.status = 'error';
    },
  },
});

export const postsReducer = postsSlice.reducer;

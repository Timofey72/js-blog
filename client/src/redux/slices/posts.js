import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get('post');
  return data;
});

export const fetchRemovePost = createAsyncThunk('auth/fetchRemovePost', async (id) => {
  await axios.delete(`post/${id}`);
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
    // Получение статей
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
    // Удаление статьи
    [fetchRemovePost.pending]: (state, action) => {
      state.posts = state.posts.filter((obj) => obj.id !== action.meta.arg);
    },
  },
});

export const postsReducer = postsSlice.reducer;

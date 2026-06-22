import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  posts: [],
  post: null,
  comments: [],
  reportedPosts: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get all posts
export const getPosts = createAsyncThunk(
  'forum/getPosts',
  async (filters = {}, thunkAPI) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/forum?${params}`);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get post by ID
export const getPostById = createAsyncThunk(
  'forum/getPostById',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/forum/${id}`);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create post
export const createPost = createAsyncThunk(
  'forum/createPost',
  async (postData, thunkAPI) => {
    try {
      const response = await api.post('/forum', postData);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Upvote post
export const upvotePost = createAsyncThunk(
  'forum/upvotePost',
  async (id, thunkAPI) => {
    try {
      const response = await api.post(`/forum/${id}/upvote`);
      return { id, ...response.data };
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Downvote post
export const downvotePost = createAsyncThunk(
  'forum/downvotePost',
  async (id, thunkAPI) => {
    try {
      const response = await api.post(`/forum/${id}/downvote`);
      return { id, ...response.data };
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get comments
export const getComments = createAsyncThunk(
  'forum/getComments',
  async (postId, thunkAPI) => {
    try {
      const response = await api.get(`/forum/${postId}/comments`);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add comment
export const addComment = createAsyncThunk(
  'forum/addComment',
  async ({ postId, content }, thunkAPI) => {
    try {
      const response = await api.post(`/forum/${postId}/comments`, { content });
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = action.payload;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPostById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.post = action.payload;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(upvotePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post._id === action.payload.id);
        if (index !== -1) {
          state.posts[index].upvotes = action.payload.upvotes;
          state.posts[index].downvotes = action.payload.downvotes;
        }
      })
      .addCase(downvotePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post._id === action.payload.id);
        if (index !== -1) {
          state.posts[index].upvotes = action.payload.upvotes;
          state.posts[index].downvotes = action.payload.downvotes;
        }
      })
      .addCase(getComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.comments = action.payload;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
      });
  },
});

export const { reset } = forumSlice.actions;
export default forumSlice.reducer;

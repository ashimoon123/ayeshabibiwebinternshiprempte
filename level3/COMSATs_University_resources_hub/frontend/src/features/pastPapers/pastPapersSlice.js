import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  pastPapers: [],
  pastPaper: null,
  pendingPapers: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get all past papers
export const getPastPapers = createAsyncThunk(
  'pastPapers/getPastPapers',
  async (filters = {}, thunkAPI) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/pastpapers?${params}`);
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

// Get pending past papers
export const getPendingPastPapers = createAsyncThunk(
  'pastPapers/getPendingPastPapers',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/pastpapers/pending');
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

// Upload past paper
export const uploadPastPaper = createAsyncThunk(
  'pastPapers/uploadPastPaper',
  async (paperData, thunkAPI) => {
    try {
      const formData = new FormData();
      for (const key in paperData) {
        formData.append(key, paperData[key]);
      }
      const response = await api.post('/pastpapers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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

// Approve past paper
export const approvePastPaper = createAsyncThunk(
  'pastPapers/approvePastPaper',
  async (id, thunkAPI) => {
    try {
      const response = await api.put(`/pastpapers/${id}/approve`);
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

export const pastPapersSlice = createSlice({
  name: 'pastPapers',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPastPapers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPastPapers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.pastPapers = action.payload;
      })
      .addCase(getPastPapers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPendingPastPapers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPendingPastPapers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.pendingPapers = action.payload;
      })
      .addCase(getPendingPastPapers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(uploadPastPaper.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadPastPaper.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.pastPapers.push(action.payload);
      })
      .addCase(uploadPastPaper.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(approvePastPaper.fulfilled, (state, action) => {
        const index = state.pendingPapers.findIndex(paper => paper._id === action.payload._id);
        if (index !== -1) {
          state.pendingPapers.splice(index, 1);
        }
      });
  },
});

export const { reset } = pastPapersSlice.actions;
export default pastPapersSlice.reducer;

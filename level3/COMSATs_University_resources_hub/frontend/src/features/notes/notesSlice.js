import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  notes: [],
  note: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get all notes
export const getNotes = createAsyncThunk(
  'notes/getNotes',
  async (filters = {}, thunkAPI) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/notes?${params}`);
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

// Get note by ID
export const getNoteById = createAsyncThunk(
  'notes/getNoteById',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/notes/${id}`);
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

// Upload note
export const uploadNote = createAsyncThunk(
  'notes/uploadNote',
  async (noteData, thunkAPI) => {
    try {
      const formData = new FormData();
      for (const key in noteData) {
        formData.append(key, noteData[key]);
      }
      const response = await api.post('/notes', formData, {
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

// Like note
export const likeNote = createAsyncThunk(
  'notes/likeNote',
  async (id, thunkAPI) => {
    try {
      const response = await api.post(`/notes/${id}/like`);
      return { id, likes: response.data.likes };
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

// Rate note
export const rateNote = createAsyncThunk(
  'notes/rateNote',
  async ({ id, rating }, thunkAPI) => {
    try {
      const response = await api.post(`/notes/${id}/rate`, { rating });
      return { id, averageRating: response.data.averageRating, ratings: response.data.ratings };
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

export const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notes = action.payload;
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getNoteById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNoteById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.note = action.payload;
      })
      .addCase(getNoteById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(uploadNote.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notes.push(action.payload);
      })
      .addCase(uploadNote.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(likeNote.fulfilled, (state, action) => {
        const index = state.notes.findIndex(note => note._id === action.payload.id);
        if (index !== -1) {
          state.notes[index].likes = action.payload.likes;
        }
        if (state.note && state.note._id === action.payload.id) {
          state.note.likes = action.payload.likes;
        }
      });
  },
});

export const { reset } = notesSlice.actions;
export default notesSlice.reducer;

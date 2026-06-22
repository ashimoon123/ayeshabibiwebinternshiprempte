import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  lectures: [],
  lecture: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get all lectures
export const getLectures = createAsyncThunk(
  'lectures/getLectures',
  async (filters = {}, thunkAPI) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/lectures?${params}`);
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

// Upload lecture
export const uploadLecture = createAsyncThunk(
  'lectures/uploadLecture',
  async (lectureData, thunkAPI) => {
    try {
      const formData = new FormData();
      for (const key in lectureData) {
        if (lectureData[key] !== undefined) {
          formData.append(key, lectureData[key]);
        }
      }
      const response = await api.post('/lectures', formData, {
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

export const lecturesSlice = createSlice({
  name: 'lectures',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLectures.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLectures.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.lectures = action.payload;
      })
      .addCase(getLectures.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(uploadLecture.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadLecture.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.lectures.push(action.payload);
      })
      .addCase(uploadLecture.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = lecturesSlice.actions;
export default lecturesSlice.reducer;

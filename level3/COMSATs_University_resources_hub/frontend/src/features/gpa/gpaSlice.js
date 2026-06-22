import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  gpaRecords: [],
  calculatedGPA: null,
  gradeConversion: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Calculate GPA
export const calculateGPA = createAsyncThunk(
  'gpa/calculateGPA',
  async (courses, thunkAPI) => {
    try {
      const response = await api.post('/gpa/calculate', { courses });
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

// Save GPA record
export const saveGPARecord = createAsyncThunk(
  'gpa/saveGPARecord',
  async (recordData, thunkAPI) => {
    try {
      const response = await api.post('/gpa', recordData);
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

// Get GPA records
export const getGPARecords = createAsyncThunk(
  'gpa/getGPARecords',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/gpa');
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

// Get grade conversion
export const getGradeConversion = createAsyncThunk(
  'gpa/getGradeConversion',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/gpa/conversion');
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

export const gpaSlice = createSlice({
  name: 'gpa',
  initialState,
  reducers: {
    reset: (state) => {
      state.calculatedGPA = null;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(calculateGPA.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(calculateGPA.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.calculatedGPA = action.payload;
      })
      .addCase(calculateGPA.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(saveGPARecord.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(saveGPARecord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.gpaRecords.push(action.payload);
      })
      .addCase(saveGPARecord.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getGPARecords.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getGPARecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.gpaRecords = action.payload;
      })
      .addCase(getGPARecords.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getGradeConversion.fulfilled, (state, action) => {
        state.gradeConversion = action.payload;
      });
  },
});

export const { reset } = gpaSlice.actions;
export default gpaSlice.reducer;

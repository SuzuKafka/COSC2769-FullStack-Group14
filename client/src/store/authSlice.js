import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch } from '../lib/api';

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await apiFetch('/api/auth/me');
      return user;
    } catch (error) {
      if (error.status === 401) {
        return rejectWithValue({ unauthenticated: true });
      }
      return rejectWithValue({ message: error.message || 'Failed to load session.' });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.status = action.payload ? 'succeeded' : 'idle';
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        if (action.payload?.unauthenticated) {
          state.status = 'unauthenticated';
          state.user = null;
          state.error = null;
          return;
        }
        state.status = 'failed';
        state.error = action.payload?.message || action.error.message;
        state.user = null;
      });
  },
});

export const { setUser, clearAuthError } = authSlice.actions;

export default authSlice.reducer;

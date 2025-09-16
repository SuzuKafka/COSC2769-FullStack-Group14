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

export const uploadProfileImage = createAsyncThunk(
  'auth/uploadProfileImage',
  async (file, { rejectWithValue }) => {
    try {
      if (!file) {
        throw new Error('Select an image to upload.');
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await apiFetch('/api/account/profile-image', {
        method: 'PUT',
        body: formData,
      });

      return response;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to upload profile image.' });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
    profileUploadStatus: 'idle',
    profileUploadError: null,
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
    resetProfileUpload(state) {
      state.profileUploadStatus = 'idle';
      state.profileUploadError = null;
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
      })
      .addCase(uploadProfileImage.pending, (state) => {
        state.profileUploadStatus = 'loading';
        state.profileUploadError = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.profileUploadStatus = 'succeeded';
        state.profileUploadError = null;
        if (state.user) {
          state.user = { ...state.user, profileImagePath: action.payload.profileImagePath };
        }
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.profileUploadStatus = 'failed';
        state.profileUploadError = action.payload?.message || action.error.message;
      });
  },
});

export const { setUser, clearAuthError, resetProfileUpload } = authSlice.actions;

export default authSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch, apiFetchJson } from '../lib/api';

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

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const data = await apiFetchJson('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Login failed.' });
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
      return true;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Logout failed.' });
    }
  }
);

export const fetchHubs = createAsyncThunk(
  'auth/fetchHubs',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiFetch('/api/auth/hubs');
      return data?.hubs || [];
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to load hubs.' });
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: formData,
      });
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Registration failed.' });
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
    loginStatus: 'idle',
    loginError: null,
    registerStatus: 'idle',
    registerError: null,
    hubsStatus: 'idle',
    hubsError: null,
    hubs: [],
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
    clearLoginState(state) {
      state.loginStatus = 'idle';
      state.loginError = null;
    },
    resetRegisterState(state) {
      state.registerStatus = 'idle';
      state.registerError = null;
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
      })
      .addCase(loginUser.pending, (state) => {
        state.loginStatus = 'loading';
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginStatus = 'succeeded';
        state.loginError = null;
        state.user = action.payload;
        state.status = 'succeeded';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = 'failed';
        state.loginError = action.payload?.message || action.error.message;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loginStatus = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = 'unauthenticated';
        state.loginStatus = 'idle';
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loginStatus = 'failed';
        state.loginError = action.payload?.message || action.error.message;
      })
      .addCase(fetchHubs.pending, (state) => {
        state.hubsStatus = 'loading';
        state.hubsError = null;
      })
      .addCase(fetchHubs.fulfilled, (state, action) => {
        state.hubsStatus = 'succeeded';
        state.hubs = action.payload;
      })
      .addCase(fetchHubs.rejected, (state, action) => {
        state.hubsStatus = 'failed';
        state.hubsError = action.payload?.message || action.error.message;
        state.hubs = [];
      })
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = 'loading';
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerStatus = 'succeeded';
        state.registerError = null;
        state.user = action.payload;
        state.status = 'succeeded';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = 'failed';
        state.registerError = action.payload?.message || action.error.message;
      });
  },
});

export const {
  setUser,
  clearAuthError,
  resetProfileUpload,
  clearLoginState,
  resetRegisterState,
} = authSlice.actions;

export default authSlice.reducer;

// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch, apiFetchJson } from '../lib/api';
import { logoutUser } from './authSlice';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const result = await apiFetch('/api/notifications');
      return result.notifications || [];
    } catch (error) {
      if (error.status === 401) {
        return rejectWithValue({ unauthenticated: true });
      }
      return rejectWithValue({ message: error.message || 'Failed to load notifications.' });
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'notifications/markNotificationRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      if (!notificationId) {
        throw new Error('Notification id is required.');
      }
      const result = await apiFetchJson(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        body: JSON.stringify({}),
      });
      return { id: notificationId, notification: result.notification };
    } catch (error) {
      if (error.status === 401) {
        return rejectWithValue({ unauthenticated: true });
      }
      return rejectWithValue({ message: error.message || 'Failed to update notification.' });
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllNotificationsRead',
  async (_, { rejectWithValue }) => {
    try {
      await apiFetchJson('/api/notifications/read-all', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      return true;
    } catch (error) {
      if (error.status === 401) {
        return rejectWithValue({ unauthenticated: true });
      }
      return rejectWithValue({ message: error.message || 'Failed to mark notifications as read.' });
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    unreadCount: 0,
    updateStatus: 'idle',
  },
  reducers: {
    resetNotifications(state) {
      state.items = [];
      state.status = 'idle';
      state.error = null;
      state.unreadCount = 0;
      state.updateStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        // Keep unreadCount aligned with the latest payload so the UI badge is accurate.
        state.unreadCount = action.payload.filter((item) => !item.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        if (action.payload?.unauthenticated) {
          state.items = [];
          state.status = 'idle';
          state.unreadCount = 0;
          state.error = null;
          return;
        }
        state.status = 'failed';
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(markNotificationRead.pending, (state) => {
        state.updateStatus = 'loading';
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const { id } = action.payload;
        state.items = state.items.map((item) =>
          item.id === id || item._id === id ? { ...item, read: true } : item
        );
        state.unreadCount = state.items.filter((item) => !item.read).length;
      })
      .addCase(markNotificationRead.rejected, (state, action) => {
        if (action.payload?.unauthenticated) {
          state.items = [];
          state.status = 'idle';
          state.unreadCount = 0;
          state.updateStatus = 'idle';
          state.error = null;
          return;
        }
        state.updateStatus = 'failed';
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(markAllNotificationsRead.pending, (state) => {
        state.updateStatus = 'loading';
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.updateStatus = 'succeeded';
        state.items = state.items.map((item) => ({ ...item, read: true }));
        state.unreadCount = 0;
      })
      .addCase(markAllNotificationsRead.rejected, (state, action) => {
        if (action.payload?.unauthenticated) {
          state.items = [];
          state.status = 'idle';
          state.unreadCount = 0;
          state.updateStatus = 'idle';
          state.error = null;
          return;
        }
        state.updateStatus = 'failed';
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.items = [];
        state.status = 'idle';
        state.unreadCount = 0;
        state.updateStatus = 'idle';
        state.error = null;
      });
  },
});

export const { resetNotifications } = notificationsSlice.actions;

export default notificationsSlice.reducer;

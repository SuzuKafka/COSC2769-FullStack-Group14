import { createSlice } from '@reduxjs/toolkit';

const createToast = ({ message, variant = 'info' }) => ({
  id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
  message,
  variant,
});

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toasts: [],
  },
  reducers: {
    addToast: {
      reducer(state, action) {
        state.toasts.push(action.payload);
      },
      prepare({ message, variant = 'info' }) {
        return { payload: createToast({ message, variant }) };
      },
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    clearToasts(state) {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearToasts } = uiSlice.actions;

export default uiSlice.reducer;

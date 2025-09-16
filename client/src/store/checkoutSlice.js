import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetchJson } from '../lib/api';

export const checkoutCart = createAsyncThunk(
  'checkout/checkoutCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiFetchJson('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Checkout failed.');
    }
  }
);

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    lastOrder: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCheckout(state) {
      state.lastOrder = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkoutCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(checkoutCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastOrder = action.payload;
        state.error = null;
      })
      .addCase(checkoutCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearCheckout } = checkoutSlice.actions;

export default checkoutSlice.reducer;

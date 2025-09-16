// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch, apiFetchJson } from '../lib/api';
import { checkoutCart } from './checkoutSlice';

const mapCartPayload = (payload) => ({
  items: payload?.items || [],
  totalQty: payload?.totalQty || 0,
  totalPrice: payload?.totalPrice || 0,
});

export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue }) => {
    try {
      const result = await apiFetch('/api/cart');
      return mapCartPayload(result);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load cart.');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, qty = 1 }, { rejectWithValue }) => {
    try {
      if (!productId) {
        throw new Error('productId is required');
      }
      const result = await apiFetchJson('/api/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId, qty }),
      });
      return mapCartPayload(result);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add to cart.');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, qty }, { rejectWithValue }) => {
    try {
      if (!productId) {
        throw new Error('productId is required');
      }
      const result = await apiFetchJson('/api/cart/update', {
        method: 'POST',
        body: JSON.stringify({ productId, qty }),
      });
      return mapCartPayload(result);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update cart item.');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ productId }, { rejectWithValue }) => {
    try {
      if (!productId) {
        throw new Error('productId is required');
      }
      const result = await apiFetchJson('/api/cart/remove', {
        method: 'POST',
        body: JSON.stringify({ productId }),
      });
      return mapCartPayload(result);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove item.');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQty: 0,
    totalPrice: 0,
    status: 'idle',
    error: null,
    lastActionStatus: 'idle',
    lastActionError: null,
  },
  reducers: {
    resetCartState(state) {
      state.lastActionStatus = 'idle';
      state.lastActionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.totalQty = action.payload.totalQty;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(addToCart.pending, (state) => {
        state.lastActionStatus = 'loading';
        state.lastActionError = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.lastActionStatus = 'succeeded';
        state.items = action.payload.items;
        state.totalQty = action.payload.totalQty;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.lastActionStatus = 'failed';
        state.lastActionError = action.payload || action.error.message;
      })
      .addCase(updateCartItem.pending, (state) => {
        state.lastActionStatus = 'loading';
        state.lastActionError = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.lastActionStatus = 'succeeded';
        state.items = action.payload.items;
        state.totalQty = action.payload.totalQty;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.lastActionStatus = 'failed';
        state.lastActionError = action.payload || action.error.message;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.lastActionStatus = 'loading';
        state.lastActionError = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.lastActionStatus = 'succeeded';
        state.items = action.payload.items;
        state.totalQty = action.payload.totalQty;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.lastActionStatus = 'failed';
        state.lastActionError = action.payload || action.error.message;
      })
      .addCase(checkoutCart.pending, (state) => {
        state.lastActionStatus = 'loading';
        state.lastActionError = null;
      })
      .addCase(checkoutCart.fulfilled, (state) => {
        state.lastActionStatus = 'succeeded';
        state.items = [];
        state.totalQty = 0;
        state.totalPrice = 0;
      })
      .addCase(checkoutCart.rejected, (state, action) => {
        state.lastActionStatus = 'failed';
        state.lastActionError = action.payload || action.error.message;
      });
  },
});

export const { resetCartState } = cartSlice.actions;

export default cartSlice.reducer;

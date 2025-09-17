// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch, apiFetchJson } from '../lib/api';

export const fetchShipperOrders = createAsyncThunk(
  'shipper/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiFetch('/api/shipper/orders');
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load shipper orders.');
    }
  }
);

export const updateShipperOrderStatus = createAsyncThunk(
  'shipper/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      if (!orderId) {
        throw new Error('orderId is required.');
      }
      const response = await apiFetchJson(`/api/shipper/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      return { ...response, orderId, status };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update order status.');
    }
  }
);

const shipperSlice = createSlice({
  name: 'shipper',
  initialState: {
    hubId: null,
    orders: [],
    status: 'idle',
    error: null,
    updateStatus: 'idle',
    updateError: null,
    activeOrderId: null,
  },
  reducers: {
    resetShipperState(state) {
      state.status = 'idle';
      state.error = null;
      state.updateStatus = 'idle';
      state.updateError = null;
      state.activeOrderId = null;
      state.orders = [];
      state.hubId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShipperOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchShipperOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.hubId = action.payload?.hubId || null;
        state.orders = action.payload?.orders || [];
      })
      .addCase(fetchShipperOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(updateShipperOrderStatus.pending, (state, action) => {
        state.updateStatus = 'loading';
        state.updateError = null;
        state.activeOrderId = action.meta?.arg?.orderId || null;
      })
      .addCase(updateShipperOrderStatus.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const { status, orderId, order } = action.payload;
        const normalisedOrderId = orderId?.toString() || orderId;
        if (status === 'shipped' && order) {
          state.orders = state.orders.map((existing) => {
            if ((existing._id?.toString() || existing._id) !== normalisedOrderId) {
              return existing;
            }
            return {
              ...existing,
              status,
              shippedAt: order.shippedAt || existing.shippedAt,
              deliveredAt: order.deliveredAt || existing.deliveredAt,
              canceledAt: order.canceledAt || existing.canceledAt,
              assignedShipper: order.assignedShipper || existing.assignedShipper,
            };
          });
        } else {
          // Drop orders that leave the active queue once delivered or canceled.
          state.orders = state.orders.filter(
            (existing) => (existing._id?.toString() || existing._id) !== normalisedOrderId
          );
        }
        state.activeOrderId = null;
      })
      .addCase(updateShipperOrderStatus.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload || action.error.message;
        state.activeOrderId = null;
      });
  },
});

export const { resetShipperState } = shipperSlice.actions;

export default shipperSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch } from '../lib/api';

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (formData, { rejectWithValue }) => {
    try {
      const product = await apiFetch('/api/products', {
        method: 'POST',
        body: formData,
      });
      return product;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create product.');
    }
  }
);

export const fetchMyProducts = createAsyncThunk(
  'products/fetchMyProducts',
  async (_, { rejectWithValue }) => {
    try {
      const result = await apiFetch('/api/products/my-products');
      return result.products || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load products.');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    createStatus: 'idle',
    createError: null,
  },
  reducers: {
    resetCreateState(state) {
      state.createStatus = 'idle';
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.items.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.payload || action.error.message;
      })
      .addCase(fetchMyProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMyProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetCreateState } = productsSlice.actions;

export default productsSlice.reducer;

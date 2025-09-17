// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch, buildQueryString } from '../lib/api';

export const fetchCatalog = createAsyncThunk(
  'catalog/fetchCatalog',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = buildQueryString(params);
      const result = await apiFetch(`/api/catalog/products${queryString}`);
      return {
        products: result.products || [],
        pagination: result.pagination || {
          total: 0,
          page: 1,
          pages: 1,
          limit: 12,
        },
        facets: result.facets || {
          categories: [],
          materials: [],
          badges: [],
        },
        params,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load products.');
    }
  }
);

export const fetchProduct = createAsyncThunk(
  'catalog/fetchProduct',
  async (productId, { rejectWithValue }) => {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }
      const product = await apiFetch(`/api/catalog/products/${productId}`);
      return product;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load product.');
    }
  }
);

const catalogSlice = createSlice({
  name: 'catalog',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    pagination: {
      total: 0,
      page: 1,
      pages: 1,
      limit: 12,
    },
    lastParams: {},
    facets: {
      categories: [],
      materials: [],
      badges: [],
    },
    product: null,
    productStatus: 'idle',
    productError: null,
  },
  reducers: {
    clearProduct(state) {
      state.product = null;
      state.productStatus = 'idle';
      state.productError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalog.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.products;
        state.pagination = action.payload.pagination;
        state.lastParams = action.payload.params || {};
        state.facets = action.payload.facets || {
          categories: [],
          materials: [],
          badges: [],
        };
      })
      .addCase(fetchCatalog.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchProduct.pending, (state) => {
        state.productStatus = 'loading';
        state.productError = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.productStatus = 'succeeded';
        state.product = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.productStatus = 'failed';
        state.productError = action.payload || action.error.message;
      });
  },
});

export const { clearProduct } = catalogSlice.actions;

export default catalogSlice.reducer;

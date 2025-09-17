// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import authReducer from './authSlice';
import catalogReducer from './catalogSlice';
import cartReducer from './cartSlice';
import checkoutReducer from './checkoutSlice';
import shipperReducer from './shipperSlice';
import uiReducer, { addToast } from './uiSlice';
import notificationsReducer from './notificationsSlice';

// Surface API errors centrally so individual slices stay lean.
const errorToastMiddleware = (storeApi) => (next) => (action) => {
  const result = next(action);

  if (action.type?.endsWith('/rejected')) {
    const payload = action.payload;
    if (payload?.unauthenticated) {
      return result;
    }

    let message = null;
    if (typeof payload === 'string') {
      message = payload;
    } else if (payload?.message) {
      message = payload.message;
    } else if (action.error?.message) {
      message = action.error.message;
    }

    if (message) {
      storeApi.dispatch(addToast({ message, variant: 'error' }));
    }
  }

  return result;
};

const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    catalog: catalogReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    shipper: shipperReducer,
    ui: uiReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(errorToastMiddleware),
});

export default store;

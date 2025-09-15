import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import authReducer from './authSlice';
import catalogReducer from './catalogSlice';
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    catalog: catalogReducer,
    cart: cartReducer,
  },
});

export default store;

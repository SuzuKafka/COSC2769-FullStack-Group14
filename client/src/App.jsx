import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/Header';
import RequireAuth from './components/RequireAuth';
import ToastContainer from './components/ToastContainer';
import VendorAddProduct from './pages/VendorAddProduct';
import VendorMyProducts from './pages/VendorMyProducts';
import Browse from './pages/Browse';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import OrderConfirmation from './pages/OrderConfirmation';
import ShipperOrders from './pages/ShipperOrders';
import Account from './pages/Account';
import { fetchCurrentUser } from './store/authSlice';
import { getCart } from './store/cartSlice';

const mainStyle = {
  minHeight: 'calc(100vh - 64px)',
  backgroundColor: '#f8fafc',
};

const pageContainerStyle = {
  padding: '2rem',
};

const Login = () => {
  const location = useLocation();
  const message = location.state?.message;

  return (
    <section style={pageContainerStyle}>
      <h2>Login</h2>
      {message && (
        <p style={{ color: '#1d4ed8' }}>
          {message}
        </p>
      )}
      <p>Authentication UI coming soon. For now, log in using the backend routes.</p>
    </section>
  );
};

const NotFound = () => <Navigate to="/" replace />;

const AppContent = () => {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const cartStatus = useSelector((state) => state.cart.status);

  useEffect(() => {
    if (authStatus === 'idle') {
      dispatch(fetchCurrentUser());
    }
  }, [authStatus, dispatch]);

  useEffect(() => {
    if (cartStatus === 'idle') {
      dispatch(getCart());
    }
  }, [cartStatus, dispatch]);

  return (
    <div>
      <Header />
      <ToastContainer />
      <main style={mainStyle}>
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route element={<RequireAuth allowedRoles={['vendor']} />}>
            <Route path="/vendor/new-product" element={<VendorAddProduct />} />
            <Route path="/vendor/my-products" element={<VendorMyProducts />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={['customer', 'vendor', 'shipper']} />}>
            <Route path="/account" element={<Account />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={['shipper']} />}>
            <Route path="/shipper/orders" element={<ShipperOrders />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;

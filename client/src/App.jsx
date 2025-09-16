// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/Header';
import Footer from './components/Footer';
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
import Forbidden from './pages/Forbidden';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Help from './pages/Help';
import RegisterVendor from './pages/RegisterVendor';
import RegisterCustomer from './pages/RegisterCustomer';
import RegisterShipper from './pages/RegisterShipper';
import { fetchCurrentUser, loginUser, clearLoginState } from './store/authSlice';
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loginStatus, loginError, user } = useSelector((state) => state.auth);
  const message = location.state?.message;
  const redirectPath = location.state?.from?.pathname || '/';

  const [formValues, setFormValues] = useState({ username: '', password: '' });
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(clearLoginState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate, redirectPath]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched(true);
    if (!formValues.username.trim() || !formValues.password.trim()) {
      return;
    }
    await dispatch(loginUser(formValues));
  };

  const disabled = loginStatus === 'loading';
  const showValidation = touched && (!formValues.username.trim() || !formValues.password.trim());

  return (
    <section style={pageContainerStyle}>
      <h2>Login</h2>
      {message && <p style={{ color: '#1d4ed8' }}>{message}</p>}
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: '420px', marginTop: '1.5rem', display: 'grid', gap: '1rem' }}
      >
        <label htmlFor="username" style={{ fontWeight: 600 }}>
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={formValues.username}
          onChange={handleChange}
          placeholder="vendordemo"
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5f5' }}
          disabled={disabled}
          autoComplete="username"
        />
        {showValidation && !formValues.username.trim() && (
          <p style={{ color: '#b91c1c', marginTop: '-0.5rem' }}>Username is required.</p>
        )}

        <label htmlFor="password" style={{ fontWeight: 600 }}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formValues.password}
          onChange={handleChange}
          placeholder="Password123"
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5f5' }}
          disabled={disabled}
          autoComplete="current-password"
        />
        {showValidation && !formValues.password.trim() && (
          <p style={{ color: '#b91c1c', marginTop: '-0.5rem' }}>Password is required.</p>
        )}

        {loginError && (
          <p style={{ color: '#b91c1c', marginTop: '-0.5rem' }}>{loginError}</p>
        )}

        <button
          type="submit"
          style={{
            padding: '0.9rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#2563eb',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          disabled={disabled}
        >
          {disabled ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
      <div style={{ marginTop: '2rem' }}>
        <p style={{ marginBottom: '0.5rem' }}>Need an account?</p>
        <ul style={{ listStyle: 'disc inside', color: '#2563eb' }}>
          <li>
            <Link to="/register/customer">Register as Customer</Link>
          </li>
          <li>
            <Link to="/register/vendor">Register as Vendor</Link>
          </li>
          <li>
            <Link to="/register/shipper">Register as Shipper</Link>
          </li>
        </ul>
      </div>
    </section>
  );
};

// Routes guarded by header/footer and responsible for initial auth/cart hydration.
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
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/help" element={<Help />} />
          <Route path="/register/customer" element={<RegisterCustomer />} />
          <Route path="/register/vendor" element={<RegisterVendor />} />
          <Route path="/register/shipper" element={<RegisterShipper />} />
          <Route path="/forbidden" element={<Forbidden />} />
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
      <Footer />
    </div>
  );
};

const App = () => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <AppContent />
  </BrowserRouter>
);

export default App;

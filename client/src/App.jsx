// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Link,
  Navigate,
} from 'react-router-dom';
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
import Welcome from './pages/Welcome';
import { fetchCurrentUser, loginUser, clearLoginState } from './store/authSlice';
import { getCart } from './store/cartSlice';

const mainStyle = {
  minHeight: 'calc(100vh - 64px)',
  backgroundColor: '#f8fafc',
};

const pageContainerStyle = {
  padding: '2rem',
};

const loginWrapperStyle = {
  minHeight: 'calc(100vh - 64px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
  backgroundColor: '#f1f5f9',
};

const loginCardStyle = {
  width: '100%',
  maxWidth: '420px',
  backgroundColor: '#fff',
  padding: '2.5rem',
  borderRadius: '16px',
  boxShadow: '0 25px 50px rgba(15, 23, 42, 0.15)',
  display: 'grid',
  gap: '1.25rem',
};

const inputWrapperStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
};

const togglePasswordStyle = {
  position: 'absolute',
  right: '0.75rem',
  background: 'transparent',
  border: 'none',
  color: '#2563eb',
  fontWeight: 600,
  cursor: 'pointer',
  padding: 0,
};

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loginStatus, loginError, user } = useSelector((state) => state.auth);
  const message = location.state?.message;
  const fromPath = location.state?.from?.pathname;
  const redirectPath = fromPath || '/';

  const [formValues, setFormValues] = useState({ username: '', password: '' });
  const [touched, setTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(clearLoginState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fallbackPaths = ['/', '/browse'];

    if (user.role === 'vendor') {
      const target = !fromPath || fallbackPaths.includes(fromPath) ? '/vendor/my-products' : redirectPath;
      navigate(target, { replace: true });
      return;
    }

    if (user.role === 'shipper') {
      const target = !fromPath || fallbackPaths.includes(fromPath) ? '/shipper/orders' : redirectPath;
      navigate(target, { replace: true });
      return;
    }

    navigate(redirectPath, { replace: true });
  }, [user, navigate, redirectPath, fromPath]);

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
    <section style={loginWrapperStyle}>
      <form onSubmit={handleSubmit} style={loginCardStyle}>
        <div>
          <h2 style={{ margin: 0 }}>Welcome back</h2>
          {message && <p style={{ color: '#1d4ed8', marginTop: '0.35rem' }}>{message}</p>}
        </div>
        <label htmlFor="username" style={{ fontWeight: 600 }}>
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={formValues.username}
          onChange={handleChange}
          placeholder="Username"
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
        <div style={inputWrapperStyle}>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formValues.password}
            onChange={handleChange}
            placeholder="Password"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #cbd5f5',
              boxSizing: 'border-box',
            }}
            disabled={disabled}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            style={togglePasswordStyle}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
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
        <div style={{ textAlign: 'left' }}>
          <p style={{ marginBottom: '0.5rem' }}>Need an account?</p>
          <ul style={{ listStyle: 'disc inside', color: '#2563eb', margin: 0, paddingLeft: '1rem' }}>
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
      </form>
    </section>
  );
};

// Routes guarded by header/footer and responsible for initial auth/cart hydration.
const HomeRoute = () => {
  const { user, status } = useSelector((state) => state.auth);

  if (status === 'loading' || status === 'idle') {
    return (
      <section style={pageContainerStyle}>
        <p>Loading your experience…</p>
      </section>
    );
  }

  if (user) {
    return <Navigate to="/browse" replace />;
  }

  return <Welcome />;
};

const BrowseRoute = () => {
  const { user, status } = useSelector((state) => state.auth);
  const location = useLocation();

  if (status === 'loading' || status === 'idle') {
    return (
      <section style={pageContainerStyle}>
        <p>Loading your experience…</p>
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Browse />;
};

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
          <Route path="/" element={<HomeRoute />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/browse" element={<BrowseRoute />} />
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

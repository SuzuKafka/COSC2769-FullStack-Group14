import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/Header';
import RequireAuth from './components/RequireAuth';
import VendorAddProduct from './pages/VendorAddProduct';
import VendorMyProducts from './pages/VendorMyProducts';
import { fetchCurrentUser } from './store/authSlice';

const mainStyle = {
  minHeight: 'calc(100vh - 64px)',
  backgroundColor: '#f8fafc',
};

const pageContainerStyle = {
  padding: '2rem',
};

const Home = () => {
  const [message, setMessage] = useState('Loading...');
  const [error, setError] = useState('');
  const location = useLocation();
  const bannerMessage = location.state?.message;

  useEffect(() => {
    fetch('/api/hello')
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const data = await res.json();
        setMessage(data.message || 'No message received');
      })
      .catch((err) => {
        setError('Unable to reach server');
        console.error(err);
      });
  }, []);

  return (
    <section style={pageContainerStyle}>
      {bannerMessage && (
        <div
          style={{
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
          }}
        >
          {bannerMessage}
        </div>
      )}
      <h1>Welcome to the COSC2769 Marketplace</h1>
      <p>Server says: {error ? error : message}</p>
    </section>
  );
};

const Login = () => (
  <section style={pageContainerStyle}>
    <h2>Login</h2>
    <p>Authentication UI coming soon. For now, log in using the backend routes.</p>
  </section>
);

const NotFound = () => <Navigate to="/" replace />;

const AppContent = () => {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (authStatus === 'idle') {
      dispatch(fetchCurrentUser());
    }
  }, [authStatus, dispatch]);

  return (
    <div>
      <Header />
      <main style={mainStyle}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAuth allowedRoles={['vendor']} />}>
            <Route path="/vendor/new-product" element={<VendorAddProduct />} />
            <Route path="/vendor/my-products" element={<VendorMyProducts />} />
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

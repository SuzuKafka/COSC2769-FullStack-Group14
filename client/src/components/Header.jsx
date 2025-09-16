import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/authSlice';

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1rem 2rem',
  backgroundColor: '#1f2933',
  color: '#fff',
};

const navStyle = {
  display: 'flex',
  gap: '1rem',
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
};

const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '20px',
  padding: '0 6px',
  borderRadius: '999px',
  backgroundColor: '#f97316',
  color: '#fff',
  fontSize: '0.75rem',
  marginLeft: '0.4rem',
};

const buttonLinkStyle = {
  ...linkStyle,
  border: '1px solid rgba(255, 255, 255, 0.6)',
  borderRadius: '999px',
  padding: '0.35rem 0.9rem',
};

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const totalQty = useSelector((state) => state.cart.totalQty);
  const loginStatus = useSelector((state) => state.auth.loginStatus);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header style={headerStyle}>
      <Link to="/" style={{ ...linkStyle, fontWeight: 600 }}>COSC2769</Link>
      <nav style={navStyle}>
        <Link to="/" style={linkStyle}>
          Browse
        </Link>
        <Link to="/cart" style={linkStyle}>
          Cart
          {totalQty > 0 && <span style={badgeStyle}>{totalQty}</span>}
        </Link>
        {user?.role === 'vendor' && (
          <>
            <Link to="/vendor/new-product" style={linkStyle}>
              Add Product
            </Link>
            <Link to="/vendor/my-products" style={linkStyle}>
              My Products
            </Link>
          </>
        )}
        {user?.role === 'shipper' && (
          <Link to="/shipper/orders" style={linkStyle}>
            Shipper Orders
          </Link>
        )}
        {user ? (
          <>
            <Link to="/account" style={linkStyle}>
              My Account
            </Link>
            <button
              type="button"
              style={{ ...buttonLinkStyle, background: 'transparent' }}
              onClick={handleLogout}
              disabled={loginStatus === 'loading'}
            >
              {loginStatus === 'loading' ? 'Logging out…' : 'Log Out'}
            </button>
          </>
        ) : (
          <Link to="/login" style={buttonLinkStyle}>
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;

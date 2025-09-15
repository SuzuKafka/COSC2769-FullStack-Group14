import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

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

const Header = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <header style={headerStyle}>
      <Link to="/" style={{ ...linkStyle, fontWeight: 600 }}>COSC2769</Link>
      <nav style={navStyle}>
        <Link to="/" style={linkStyle}>
          Home
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
      </nav>
    </header>
  );
};

export default Header;

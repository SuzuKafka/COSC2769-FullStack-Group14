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

const Header = () => {
  const user = useSelector((state) => state.auth.user);
  const totalQty = useSelector((state) => state.cart.totalQty);

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
      </nav>
    </header>
  );
};

export default Header;

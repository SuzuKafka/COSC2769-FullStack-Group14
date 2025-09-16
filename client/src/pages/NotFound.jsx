import React from 'react';
import { Link } from 'react-router-dom';

const containerStyle = {
  maxWidth: '620px',
  margin: '3rem auto',
  padding: '2.5rem',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
  textAlign: 'center',
};

const buttonStyle = {
  display: 'inline-block',
  marginTop: '2rem',
  padding: '0.75rem 1.5rem',
  borderRadius: '999px',
  backgroundColor: '#2563eb',
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 600,
};

const NotFound = () => (
  <section style={containerStyle}>
    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Page Not Found</h1>
    <p style={{ color: '#475569', marginBottom: '1.5rem' }}>
      The page you are looking for doesn&apos;t exist or may have been moved.
    </p>
    <Link to="/" style={buttonStyle}>
      Return Home
    </Link>
  </section>
);

export default NotFound;

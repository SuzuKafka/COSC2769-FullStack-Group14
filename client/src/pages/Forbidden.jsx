// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

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

const Forbidden = () => {
  const location = useLocation();
  const message = location.state?.message;

  return (
    <section style={containerStyle}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Access Restricted</h1>
      <p style={{ color: '#475569', marginBottom: '1.5rem' }}>
        {message || 'You do not have permission to view this page with your current role.'}
      </p>
      <Link to="/" style={buttonStyle}>
        Back to Home
      </Link>
    </section>
  );
};

export default Forbidden;

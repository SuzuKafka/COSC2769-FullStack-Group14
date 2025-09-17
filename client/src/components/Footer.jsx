// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

import React from 'react';
import { Link } from 'react-router-dom';

const footerStyle = {
  backgroundColor: '#1f2933',
  color: '#e2e8f0',
  padding: '2rem',
};

const footerInnerStyle = {
  maxWidth: '1100px',
  margin: '0 auto',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: '1.5rem',
};

const columnStyle = {
  flex: '1 1 220px',
};

const headingStyle = {
  marginBottom: '0.75rem',
  fontSize: '1rem',
  fontWeight: 600,
  color: '#f8fafc',
};

const linkStyle = {
  color: '#cbd5f5',
  textDecoration: 'none',
  display: 'block',
  marginBottom: '0.5rem',
};

const Footer = () => (
  <footer style={footerStyle}>
    <div style={footerInnerStyle}>
      <section style={columnStyle}>
        <h3 style={headingStyle}>EcoSwap by COSC2769 Group 14</h3>
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          Buy better, waste less — a sustainable marketplace crafted for the Full Stack Development
          project.
        </p>
        <p style={{ marginTop: '0.75rem' }}>© {new Date().getFullYear()} COSC2769 Group 14</p>
      </section>
      <section style={columnStyle}>
        <h3 style={headingStyle}>Join EcoSwap</h3>
        <Link to="/register/customer" style={linkStyle}>
          Register as Customer
        </Link>
        <Link to="/register/vendor" style={linkStyle}>
          Register as Vendor
        </Link>
        <Link to="/register/shipper" style={linkStyle}>
          Register as Shipper
        </Link>
      </section>
      <section style={columnStyle}>
        <h3 style={headingStyle}>Resources</h3>
        <Link to="/about" style={linkStyle}>
          About
        </Link>
        <Link to="/privacy" style={linkStyle}>
          Privacy
        </Link>
        <Link to="/help" style={linkStyle}>
          Help
        </Link>
      </section>
    </div>
  </footer>
);

export default Footer;

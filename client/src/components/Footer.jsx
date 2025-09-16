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
        <h3 style={headingStyle}>About</h3>
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          COSC2769 Group 14 showcases a sample marketplace experience built for the RMIT Full Stack
          Development course.
        </p>
      </section>
      <section style={columnStyle}>
        <h3 style={headingStyle}>Resources</h3>
        <Link to="/" style={linkStyle}>
          Privacy
        </Link>
        <Link to="/" style={linkStyle}>
          Help
        </Link>
      </section>
      <section style={columnStyle}>
        <h3 style={headingStyle}>Credits</h3>
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          UI inspired by Tailwind UI examples (tailwindui.com) and adapted for coursework submission.
        </p>
        <p style={{ marginTop: '0.75rem' }}>© {new Date().getFullYear()} COSC2769 Group 14</p>
      </section>
    </div>
  </footer>
);

export default Footer;

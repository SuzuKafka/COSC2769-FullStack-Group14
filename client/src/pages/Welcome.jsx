// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

const basePageStyle = {
  minHeight: 'calc(100vh - 64px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem 1.5rem',
  backgroundColor: '#eff6ff',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  boxSizing: 'border-box',
};

const cardStyle = {
  maxWidth: '720px',
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.92)',
  borderRadius: '24px',
  padding: '3rem',
  boxShadow: '0 45px 80px rgba(15, 23, 42, 0.15)',
  textAlign: 'center',
  backdropFilter: 'blur(4px)',
};

const logoStyle = {
  width: '72px',
  height: '72px',
  borderRadius: '20px',
  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2.2rem',
  color: '#fff',
  marginBottom: '1.5rem',
};

const titleStyle = {
  fontSize: '2.5rem',
  fontWeight: 700,
  color: '#0f172a',
  marginBottom: '1rem',
};

const mottoStyle = {
  fontSize: '1.1rem',
  color: '#1e293b',
  lineHeight: 1.7,
  marginBottom: '2.5rem',
};

const actionsStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  justifyContent: 'center',
};

const primaryButtonStyle = {
  padding: '0.9rem 2rem',
  borderRadius: '999px',
  border: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  backgroundColor: '#2563eb',
  color: '#fff',
  textDecoration: 'none',
  boxShadow: '0 15px 30px rgba(37, 99, 235, 0.35)',
};

const secondaryButtonStyle = {
  ...primaryButtonStyle,
  backgroundColor: 'rgba(15, 23, 42, 0.08)',
  color: '#0f172a',
  boxShadow: 'none',
};

const featureListStyle = {
  marginTop: '3rem',
  display: 'grid',
  gap: '1.25rem',
  textAlign: 'left',
  color: '#1f2937',
};

const featureItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.85rem',
  fontSize: '1rem',
};

const featureIconStyle = {
  width: '42px',
  height: '42px',
  borderRadius: '14px',
  backgroundColor: 'rgba(37, 99, 235, 0.1)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
  color: '#1d4ed8',
  flexShrink: 0,
};

const partnerPromptStyle = {
  marginTop: '2rem',
  textAlign: 'center',
  color: '#0f172a',
};

const partnerActionsStyle = {
  marginTop: '1rem',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem',
  justifyContent: 'center',
};

const partnerButtonStyle = {
  ...secondaryButtonStyle,
  padding: '0.75rem 1.75rem',
};

const Welcome = () => (
  <PageContent />
);

const PageContent = () => {
  const uploadsBaseUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return '';
    }
    const { origin } = window.location;
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return 'http://localhost:4000';
    }
    return '';
  }, []);

  const backgroundImageUrl = uploadsBaseUrl
    ? `${uploadsBaseUrl}/uploads/background.jpg`
    : '/uploads/background.jpg';

  const pageStyle = {
    ...basePageStyle,
    backgroundImage: `linear-gradient(135deg, rgba(226, 246, 213, 0.75), rgba(219, 234, 254, 0.78)), url(${backgroundImageUrl})`,
  };

  return (
    <section style={pageStyle}>
    <div style={cardStyle}>
      <span style={logoStyle} aria-hidden>
        🌱
      </span>
      <h1 style={titleStyle}>Welcome to EcoSwap</h1>
      <p style={mottoStyle}>
        A sustainable marketplace connecting conscious shoppers with eco-forward makers.
        Swap smarter, ship greener, and support circular commerce in every order.
      </p>
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.75rem', color: '#1e293b' }}>Register as Customer</h2>
      </div>
      <div style={actionsStyle}>
        <Link to="/login" style={primaryButtonStyle}>
          Sign in to continue
        </Link>
        <Link to="/register/customer" style={secondaryButtonStyle}>
          Create a free account
        </Link>
      </div>
      <div style={partnerPromptStyle}>
        <p style={{ margin: 0, fontWeight: 600 }}>Want to partner with EcoSwap?</p>
        <p style={{ margin: '0.35rem 0 0', color: '#475569' }}>
          Join as a vendor or shipper to reach eco-minded customers nationwide.
        </p>
        <div style={partnerActionsStyle}>
          <Link to="/register/vendor" style={partnerButtonStyle}>
            Become a vendor
          </Link>
          <Link to="/register/shipper" style={partnerButtonStyle}>
            Join as shipper
          </Link>
        </div>
      </div>
      <div style={featureListStyle}>
        <div style={featureItemStyle}>
          <span style={featureIconStyle}>♻️</span>
          Discover ethically sourced clothing, home goods, and tech crafted from recycled materials.
        </div>
        <div style={featureItemStyle}>
          <span style={featureIconStyle}>🚚</span>
          Track mindful delivery with smart notifications for every shipment milestone.
        </div>
        <div style={featureItemStyle}>
          <span style={featureIconStyle}>🤝</span>
          Join vendors and shippers championing fair-trade, low-waste, and carbon-neutral practices.
        </div>
      </div>
    </div>
  </section>
  );
};

export default Welcome;

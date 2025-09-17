// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const containerStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '3rem 2rem',
  textAlign: 'center',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '2.5rem 2rem',
  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
};

const buttonStyle = {
  display: 'inline-block',
  marginTop: '2rem',
  padding: '0.75rem 1.5rem',
  backgroundColor: '#2563eb',
  color: '#fff',
  borderRadius: '999px',
  textDecoration: 'none',
  fontWeight: 500,
};

const OrderConfirmation = () => {
  const location = useLocation();
  const lastOrder = useSelector((state) => state.checkout.lastOrder);
  // Prefer the navigation payload but fall back to Redux in case the user reloads the page.
  const order = location.state || lastOrder;

  if (!order) {
    return (
      <section style={containerStyle}>
        <div style={cardStyle}>
          <h1>Order Not Found</h1>
          <p style={{ marginTop: '1rem', color: '#475569' }}>
            We couldn&apos;t find your recent checkout. Please return to browse the catalog.
          </p>
          <Link to="/browse" style={buttonStyle}>
            Back to Browse
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ fontSize: '2rem' }}>Thank you for your order!</h1>
        <p style={{ marginTop: '1rem', color: '#475569' }}>
          Your order has been placed successfully. Our team at <strong>{order.hubName}</strong> will
          prepare your items shortly.
        </p>
        <p style={{ marginTop: '1.5rem', color: '#334155' }}>
          <strong>Order ID:</strong> {order.orderId}
        </p>
        <Link to="/browse" style={buttonStyle}>
          Continue Shopping
        </Link>
      </div>
    </section>
  );
};

export default OrderConfirmation;

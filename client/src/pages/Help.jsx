import React from 'react';

const containerStyle = {
  maxWidth: '960px',
  margin: '0 auto',
  padding: '3rem 2rem',
  lineHeight: 1.7,
  color: '#1f2937',
};

const listStyle = {
  marginLeft: '1.2rem',
};

const Help = () => (
  <section style={containerStyle}>
    <h1 style={{ marginBottom: '1.5rem' }}>Help Centre</h1>
    <p>
      This help page guides you through the demo journeys built for COSC2769 Group 14 Marketplace. Use
      the following checklists to exercise the full feature set with your customer, vendor, and shipper
      accounts.
    </p>
    <h2>Getting Started</h2>
    <ol style={listStyle}>
      <li>Register a new account from the login page (or use seeded credentials if provided).</li>
      <li>Verify your profile image, name, and address on the My Account page.</li>
      <li>Add products as a vendor and test server-side search as a customer.</li>
    </ol>
    <h2>Common Questions</h2>
    <dl>
      <dt style={{ fontWeight: 600 }}>How do I reset my password?</dt>
      <dd>For the demo deployment, contact the course team to request a reset.</dd>
      <dt style={{ fontWeight: 600 }}>Where do orders go after checkout?</dt>
      <dd>
        Orders are assigned randomly to Ho Chi Minh City, Da Nang, or Hanoi distribution hubs. Shippers
        see only orders for the hub they selected during registration.
      </dd>
      <dt style={{ fontWeight: 600 }}>Who built this site?</dt>
      <dd>Ryota Suzuki (s4075375) for COSC2769 – Full Stack Development, Semester 2025B.</dd>
    </dl>
    <h2>Need More Assistance?</h2>
    <p>
      Please contact the teaching staff via Canvas, or refer to RMIT Vietnam&apos;s support channels for
      technical questions about the coursework submission guidelines.
    </p>
  </section>
);

export default Help;

// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

import React from 'react';

const containerStyle = {
  maxWidth: '960px',
  margin: '0 auto',
  padding: '3rem 2rem',
  lineHeight: 1.7,
  color: '#1f2937',
};

const Privacy = () => (
  <section style={containerStyle}>
    <h1 style={{ marginBottom: '1.5rem' }}>Privacy Statement</h1>
    <p>
      EcoSwap respects your personal information. This coursework follows the spirit of the Australian
      Privacy Principles (APPs) under the Privacy Act 1988, including clear handling (APP 1), secure
      storage, and using the data solely for the purpose of account management and order fulfillment.
      For authoritative guidance, consult the Office of the Australian Information Commissioner (OAIC).
    </p>

    <h2>What we collect</h2>
    <ul>
      <li>Account data: username, hashed password, profile photo, and role-specific details.</li>
      <li>Order data: product listings, cart contents, and assigned hubs for delivery.</li>
    </ul>

    <h2>How we use it</h2>
    <ul>
      <li>Authenticate users and enable role-based features (Customer, Vendor, Shipper).</li>
      <li>Process orders and display relevant information in My Account and Shipper dashboards.</li>
    </ul>

    <h2>Storage & Security</h2>
    <p>
      Passwords are hashed before storage; images are stored by filename as permitted in the brief. The
      MongoDB Atlas database is restricted to this educational demo and will be reset at the end of the
      semester.
    </p>

    <h2>Third-party references</h2>
    <p>
      We studied Lazada&apos;s public background to understand logistics flows while designing EcoSwap&apos;s
      multi-role marketplace. Sources: Lazada Group (Product outline) and OAIC (Australian Privacy
      Principles).
    </p>
  </section>
);

export default Privacy;

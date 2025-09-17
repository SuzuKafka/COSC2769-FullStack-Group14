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

// Aggregated support content so markers can verify feature coverage quickly.
const Help = () => (
  <section style={containerStyle}>
    <h1 style={{ marginBottom: '1.5rem' }}>Help Centre</h1>

    <section>
      <h2>Quick Start</h2>
      <ol>
        <li>Create an EcoSwap account (Customer, Vendor, or Shipper).</li>
        <li>Customers: browse products, apply search/price filters, add to cart, and place an order.</li>
        <li>Vendors: add eco-friendly products with images and manage listings via My Products.</li>
        <li>Shippers: review active orders assigned to your hub and update the status.</li>
      </ol>
    </section>

    <section>
      <h2>FAQ</h2>
      <details>
        <summary>Which roles are available?</summary>
        <p>Customer, Vendor, and Shipper — each with dedicated registration and My Account views.</p>
      </details>
      <details>
        <summary>How are orders routed?</summary>
        <p>
          Orders are assigned randomly to one of the seeded distribution hubs (Ho Chi Minh City, Da Nang,
          Hanoi). Shippers registered to that hub can mark orders delivered or canceled.
        </p>
      </details>
      <details>
        <summary>Where can I read about privacy?</summary>
        <p>
          See the <a href="/privacy">Privacy Statement</a>, informed by Australia&apos;s Privacy Act 1988 and the
          Australian Privacy Principles (OAIC).
        </p>
      </details>
      <details>
        <summary>Who built EcoSwap?</summary>
        <p>Group 14 — led by Ryota Suzuki (Student ID s4075375) for COSC2769, Semester 2025B.</p>
      </details>
    </section>
  </section>
);

export default Help;

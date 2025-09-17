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

const About = () => (
  <section style={containerStyle}>
    <h1 style={{ marginBottom: '1.5rem' }}>About EcoSwap (COSC2769 Group 14)</h1>
    <p>
      EcoSwap is the marketplace theme for our COSC2769 Full Stack Development project. Rather than a direct clone of existing platforms, we adapt the multi-role flow—Customers, Vendors, and Shippers—to spotlight sustainable and upcycled products. The platform architecture draws on public references to Lazada&apos;s regional operations (founded 2012 across six Southeast Asian markets, part of Alibaba since 2016) while reimagining the brand around eco-friendly commerce.
      <sup><a href="#ref-lazada">1</a></sup>
    </p>

    <h3>Key Differentiators</h3>
    <ul>
      <li>Eco badges for products (e.g., Upcycled, Organic, Low-waste).</li>
      <li>Optional &ldquo;Carbon Tip&rdquo; display during checkout to encourage green initiatives.</li>
      <li>Read-only vendor impact meter derived from order counts.</li>
    </ul>

    <p>
      EcoSwap supports the full marketplace lifecycle: registration flows for all roles, product publishing, server-side search, cart and checkout, and shipper hub coordination across Ho Chi Minh City, Da Nang, and Hanoi.
    </p>

    <hr style={{ margin: '2.5rem 0' }} />
    <p id="ref-lazada" style={{ fontSize: '0.9rem', color: '#475569' }}>
      <strong>References:</strong> <br />
      1. Lazada Group &ldquo;About Lazada&rdquo; (2024),
      <a
        href="https://www.lazada.com/en/about/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#2563eb' }}
      >
        https://www.lazada.com/en/about/
      </a>
    </p>
  </section>
);

export default About;

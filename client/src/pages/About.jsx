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
    <h1 style={{ marginBottom: '1.5rem' }}>About COSC2769 Group 14 Marketplace</h1>
    <p>
      COSC2769 Group 14 Marketplace is a teaching project inspired by the customer–vendor–shipper
      workflow popular across Southeast Asia&apos;s leading commerce platforms. We focus on providing a
      simple environment where vendors can publish products, customers can discover new items, and
      shippers coordinate delivery through pre-assigned hubs. This project is submitted for RMIT
      University Vietnam&apos;s Full Stack Development course (Semester 2025B) by Ryota Suzuki (Student ID
      s4075375).
    </p>
    <p>
      The logistics narrative that underpins this coursework draws on Lazada Group&apos;s 2030 vision to
      reach 300 million customers across Indonesia, Malaysia, the Philippines, Singapore, Thailand, and
      Vietnam<sup><a href="#ref-lazada">1</a></sup>. From that regional context we designed a minimal feature set that still includes
      key platform capabilities: authenticated sessions, multi-role registration, server-side product
      filtering, and shipper hub assignments. All implementation is original and created solely for
      academic purposes.
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

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
      We collect only the information required to operate the coursework marketplace: an email or
      contact address (when supplied by vendors), profile photographs, and product catalog data. No
      payment details are gathered. All passwords are hashed with bcrypt before storage so that plain
      text credentials are never written to disk. Profile images are stored on the application server and
      referenced via generated file names.
    </p>
    <p>
      Users may download or remove their data by contacting the course team. Because this application is
      built for educational purposes, there is no automated data retention policy beyond the semester in
      which it is assessed. We follow the Australian Privacy Principles statutory guidance on storing
      personal information securely and restricting use to the original purpose of collection<sup><a href="#ref-app">1</a></sup>.
    </p>
    <hr style={{ margin: '2.5rem 0' }} />
    <p id="ref-app" style={{ fontSize: '0.9rem', color: '#475569' }}>
      <strong>References:</strong> <br />
      1. Office of the Australian Information Commissioner, &ldquo;Australian Privacy Principles&rdquo; (2024),
      <a
        href="https://www.oaic.gov.au/privacy/australian-privacy-principles/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#2563eb' }}
      >
        https://www.oaic.gov.au/privacy/australian-privacy-principles/
      </a>
    </p>
  </section>
);

export default Privacy;

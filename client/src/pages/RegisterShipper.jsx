// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchHubs, registerUser, resetRegisterState } from '../store/authSlice';

const usernameRegex = /^[A-Za-z0-9]{8,15}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

const containerStyle = {
  maxWidth: '520px',
  margin: '2rem auto',
  padding: '2.5rem',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
};

const labelStyle = {
  display: 'block',
  fontWeight: 600,
  marginBottom: '0.4rem',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid #cbd5f5',
  boxSizing: 'border-box',
};

const errorStyle = {
  color: '#b91c1c',
  fontSize: '0.85rem',
  marginTop: '0.25rem',
};

const RegisterShipper = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hubs, hubsStatus, registerStatus, registerError } = useSelector((state) => state.auth);
  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    hub: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [touched, setTouched] = useState(false);

  const isSubmitting = registerStatus === 'loading';

  useEffect(() => {
    if (hubsStatus === 'idle') {
      dispatch(fetchHubs());
    }
  }, [dispatch, hubsStatus]);

  useEffect(() => {
    if (registerStatus === 'succeeded') {
      navigate('/shipper/orders', { replace: true });
    }
  }, [registerStatus, navigate]);

  useEffect(() => {
    return () => {
      dispatch(resetRegisterState());
    };
  }, [dispatch]);

  const validationErrors = useMemo(() => {
    const errors = {};
    const { username, password, confirmPassword, licenseNumber, hub } = formValues;
    if (!usernameRegex.test(username.trim())) {
      errors.username = 'Username must be alphanumeric and 8-15 characters.';
    }
    if (!passwordRegex.test(password)) {
      errors.password =
        'Password must be 8-20 characters and include upper, lower, digit, and !@#$%^&*.';
    }
    if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords must match.';
    }
    if (!licenseNumber.trim() || licenseNumber.trim().length < 5) {
      errors.licenseNumber = 'License number must be at least 5 characters.';
    }
    if (!hub) {
      errors.hub = 'Please select a distribution hub.';
    }
    if (!profileImage) {
      errors.profileImage = 'Profile image is required.';
    }
    return errors;
  }, [formValues, profileImage]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    setProfileImage(event.target.files?.[0] || null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched(true);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const formData = new FormData();
    formData.append('role', 'shipper');
    formData.append('username', formValues.username.trim());
    formData.append('password', formValues.password);
    formData.append('confirmPassword', formValues.confirmPassword);
    formData.append('shipperLicenseNumber', formValues.licenseNumber.trim());
    formData.append('shipperHub', formValues.hub);
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    dispatch(registerUser(formData));
  };

  const showErrors = touched || registerStatus === 'failed';

  return (
    <section style={containerStyle}>
      <h1 style={{ marginBottom: '1.5rem' }}>Register as Shipper</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }} encType="multipart/form-data">
        <div>
          <label htmlFor="username" style={labelStyle}>
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={formValues.username}
            onChange={handleChange}
            style={inputStyle}
            placeholder="8-15 letters or digits"
            disabled={isSubmitting}
            autoComplete="username"
          />
          {showErrors && validationErrors.username && <p style={errorStyle}>{validationErrors.username}</p>}
        </div>

        <div>
          <label htmlFor="password" style={labelStyle}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleChange}
            style={inputStyle}
            placeholder="8-20 chars with upper, lower, digit, and !@#$%^&*."
            disabled={isSubmitting}
            autoComplete="new-password"
          />
          {showErrors && validationErrors.password && <p style={errorStyle}>{validationErrors.password}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" style={labelStyle}>
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formValues.confirmPassword}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Re-enter password"
            disabled={isSubmitting}
            autoComplete="new-password"
          />
          {showErrors && validationErrors.confirmPassword && (
            <p style={errorStyle}>{validationErrors.confirmPassword}</p>
          )}
        </div>

        <div>
          <label htmlFor="profileImage" style={labelStyle}>
            Profile Image
          </label>
          <input
            id="profileImage"
            name="profileImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isSubmitting}
            style={inputStyle}
          />
          {showErrors && validationErrors.profileImage && <p style={errorStyle}>{validationErrors.profileImage}</p>}
        </div>

        <div>
          <label htmlFor="licenseNumber" style={labelStyle}>
            License Number
          </label>
          <input
            id="licenseNumber"
            name="licenseNumber"
            type="text"
            value={formValues.licenseNumber}
            onChange={handleChange}
            style={inputStyle}
            placeholder="At least 5 characters"
            disabled={isSubmitting}
          />
          {showErrors && validationErrors.licenseNumber && (
            <p style={errorStyle}>{validationErrors.licenseNumber}</p>
          )}
        </div>

        <div>
          <label htmlFor="hub" style={labelStyle}>
            Assigned Hub
          </label>
          <select
            id="hub"
            name="hub"
            value={formValues.hub}
            onChange={handleChange}
            style={inputStyle}
            disabled={isSubmitting || hubsStatus === 'loading'}
          >
            <option value="">Select hub…</option>
            {hubs.map((hub) => (
              <option key={hub._id} value={hub._id}>
                {hub.name}
              </option>
            ))}
          </select>
          {showErrors && validationErrors.hub && <p style={errorStyle}>{validationErrors.hub}</p>}
          {hubsStatus === 'failed' && <p style={errorStyle}>Failed to load hubs.</p>}
        </div>

        {registerError && <p style={errorStyle}>{registerError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '0.9rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#2563eb',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isSubmitting ? 'Registering…' : 'Create Shipper Account'}
        </button>
      </form>
      <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#475569' }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </section>
  );
};

export default RegisterShipper;

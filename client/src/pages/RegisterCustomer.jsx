import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser, resetRegisterState } from '../store/authSlice';

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

const RegisterCustomer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { registerStatus, registerError } = useSelector((state) => state.auth);
  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
    fullName: '',
    address: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [touched, setTouched] = useState(false);

  const isSubmitting = registerStatus === 'loading';

  useEffect(() => {
    if (registerStatus === 'succeeded') {
      navigate('/browse', { replace: true });
    }
  }, [registerStatus, navigate]);

  useEffect(() => {
    return () => {
      dispatch(resetRegisterState());
    };
  }, [dispatch]);

  const validationErrors = useMemo(() => {
    const errors = {};
    const { username, password, fullName, address } = formValues;
    if (!usernameRegex.test(username.trim())) {
      errors.username = 'Username must be alphanumeric and 8-15 characters.';
    }
    if (!passwordRegex.test(password)) {
      errors.password =
        'Password must be 8-20 characters and include upper, lower, digit, and !@#$%^&*.';
    }
    if (!fullName.trim() || fullName.trim().length < 5) {
      errors.fullName = 'Name must be at least 5 characters.';
    }
    if (!address.trim() || address.trim().length < 5) {
      errors.address = 'Address must be at least 5 characters.';
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
    formData.append('role', 'customer');
    formData.append('username', formValues.username.trim());
    formData.append('password', formValues.password);
    formData.append('customerName', formValues.fullName.trim());
    formData.append('customerAddress', formValues.address.trim());
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    dispatch(registerUser(formData));
  };

  const showErrors = touched || registerStatus === 'failed';

  return (
    <section style={containerStyle}>
      <h1 style={{ marginBottom: '1.5rem' }}>Register as Customer</h1>
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
            placeholder="8-15 characters"
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
            placeholder="Password123"
            disabled={isSubmitting}
            autoComplete="new-password"
          />
          {showErrors && validationErrors.password && <p style={errorStyle}>{validationErrors.password}</p>}
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
          <label htmlFor="fullName" style={labelStyle}>
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formValues.fullName}
            onChange={handleChange}
            style={inputStyle}
            disabled={isSubmitting}
          />
          {showErrors && validationErrors.fullName && <p style={errorStyle}>{validationErrors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="address" style={labelStyle}>
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={formValues.address}
            onChange={handleChange}
            style={inputStyle}
            disabled={isSubmitting}
          />
          {showErrors && validationErrors.address && <p style={errorStyle}>{validationErrors.address}</p>}
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
          {isSubmitting ? 'Registering…' : 'Create Customer Account'}
        </button>
      </form>
    </section>
  );
};

export default RegisterCustomer;

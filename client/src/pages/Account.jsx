// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadProfileImage, resetProfileUpload } from '../store/authSlice';

const containerStyle = {
  maxWidth: '720px',
  margin: '0 auto',
  padding: '2.5rem 2rem',
};

const profileCardStyle = {
  display: 'flex',
  gap: '2rem',
  alignItems: 'flex-start',
  backgroundColor: '#ffffff',
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
};

const imageWrapperStyle = {
  width: '160px',
  height: '160px',
  borderRadius: '16px',
  overflow: 'hidden',
  backgroundColor: '#f8fafc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #e2e8f0',
};

const uploadButtonStyle = {
  marginTop: '1rem',
  padding: '0.6rem 1.2rem',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#2563eb',
  color: '#fff',
  cursor: 'pointer',
};

const Account = () => {
  const dispatch = useDispatch();
  const { user, profileUploadStatus, profileUploadError } = useSelector((state) => state.auth);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const uploadsBaseUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return '';
    }
    const { origin } = window.location;
    if (origin.includes('localhost:3000')) {
      return 'http://localhost:4000';
    }
    return '';
  }, []);

  useEffect(() => {
    dispatch(resetProfileUpload());
    return () => {
      dispatch(resetProfileUpload());
    };
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      return;
    }

    try {
      await dispatch(uploadProfileImage(selectedFile)).unwrap();
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (error) {
      // handled by store + toast
    }
  };

  if (!user) {
    return (
      <section style={containerStyle}>
        <p>Loading account details…</p>
      </section>
    );
  }

  const resolvedProfileImage = useMemo(() => {
    if (!user?.profileImagePath) {
      return null;
    }
    if (/^https?:\/\//i.test(user.profileImagePath)) {
      return user.profileImagePath;
    }
    return `${uploadsBaseUrl}${user.profileImagePath}`;
  }, [uploadsBaseUrl, user?.profileImagePath]);

  const imageSrc = previewUrl || resolvedProfileImage;
  const isUploading = profileUploadStatus === 'loading';

  return (
    <section style={containerStyle}>
      <h1 style={{ marginBottom: '1.5rem' }}>My Account</h1>
      <div style={profileCardStyle}>
        <div>
          <div style={imageWrapperStyle}>
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ color: '#94a3b8' }}>No image</span>
            )}
          </div>
          <form onSubmit={handleUpload} style={{ marginTop: '1.5rem' }}>
            <input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
            <button type="submit" style={uploadButtonStyle} disabled={isUploading || !selectedFile}>
              {isUploading ? 'Uploading…' : 'Upload Image'}
            </button>
          </form>
          {profileUploadError && <p style={{ marginTop: '0.75rem', color: '#b91c1c' }}>{profileUploadError}</p>}
        </div>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: '0.5rem' }}>{user.username}</h2>
          <p style={{ margin: '0 0 1.5rem 0', color: '#475569' }}>Role: {user.role}</p>

          {user.role === 'customer' && user.customerProfile && (
            <section>
              <h3 style={{ marginBottom: '0.5rem' }}>Customer Details</h3>
              <p style={{ color: '#475569' }}>Name: {user.customerProfile.name || 'Not set'}</p>
              <p style={{ color: '#475569' }}>
                Default Address: {user.customerProfile.defaultAddress || 'Not set'}
              </p>
            </section>
          )}

          {user.role === 'vendor' && user.vendorProfile && (
            <section>
              <h3 style={{ marginBottom: '0.5rem' }}>Vendor Details</h3>
              <p style={{ color: '#475569' }}>
                Company: {user.vendorProfile.companyName || 'Not provided'}
              </p>
              <p style={{ color: '#475569' }}>
                Business Address: {user.vendorProfile.businessAddress || 'Not provided'}
              </p>
              <p style={{ color: '#475569' }}>
                Contact Email: {user.vendorProfile.contactEmail || 'Not provided'}
              </p>
            </section>
          )}

          {user.role === 'shipper' && user.shipperProfile && (
            <section>
              <h3 style={{ marginBottom: '0.5rem' }}>Shipper Details</h3>
              <p style={{ color: '#475569' }}>
                License #: {user.shipperProfile.licenseNumber || 'Not provided'}
              </p>
              <p style={{ color: '#475569' }}>
                Hub ID: {user.shipperProfile.hub || 'Not assigned'}
              </p>
            </section>
          )}
        </div>
      </div>
    </section>
  );
};

export default Account;

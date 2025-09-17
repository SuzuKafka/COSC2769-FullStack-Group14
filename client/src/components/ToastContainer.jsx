// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast } from '../store/uiSlice';

const containerStyle = {
  position: 'fixed',
  top: '1rem',
  right: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  zIndex: 1000,
};

const toastStyleBase = {
  minWidth: '260px',
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  color: '#fff',
  boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)',
  fontSize: '0.95rem',
};

const variantMap = {
  info: '#2563eb',
  error: '#dc2626',
  success: '#16a34a',
};

const ToastItem = ({ toast }) => {
  const dispatch = useDispatch();

  // Auto-dismiss toasts after a short delay to keep the UI from stacking indefinitely.
  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, 4000);

    return () => clearTimeout(timeout);
  }, [dispatch, toast.id]);

  return (
    <div style={{ ...toastStyleBase, backgroundColor: variantMap[toast.variant] || variantMap.info }}>
      {toast.message}
    </div>
  );
};

const ToastContainer = () => {
  const toasts = useSelector((state) => state.ui.toasts);

  if (!toasts.length) {
    return null;
  }

  return (
    <div style={containerStyle}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;

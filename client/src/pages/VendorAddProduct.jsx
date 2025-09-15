import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, resetCreateState } from '../store/productsSlice';

const initialFormState = {
  name: '',
  price: '',
  description: '',
};

const formContainerStyle = {
  maxWidth: '540px',
  margin: '2rem auto',
  padding: '2rem',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  backgroundColor: '#fff',
  boxShadow: '0 3px 10px rgba(15, 23, 42, 0.08)',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: 600,
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  marginBottom: '1rem',
  borderRadius: '6px',
  border: '1px solid #cbd5f5',
};

const errorStyle = {
  marginTop: '-0.75rem',
  marginBottom: '1rem',
  color: '#b91c1c',
  fontSize: '0.875rem',
};

const buttonStyle = {
  width: '100%',
  padding: '0.9rem',
  backgroundColor: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 600,
};

const successStyle = {
  marginBottom: '1rem',
  padding: '0.75rem',
  borderRadius: '6px',
  backgroundColor: '#dcfce7',
  color: '#166534',
};

const VendorAddProduct = () => {
  const dispatch = useDispatch();
  const { createStatus, createError } = useSelector((state) => state.products);
  const [formValues, setFormValues] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [touched, setTouched] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [fileInputKey, setFileInputKey] = useState(0);

  useEffect(() => {
    return () => {
      dispatch(resetCreateState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (createStatus === 'succeeded') {
      setSuccessMessage('Product created successfully!');
      setFormValues(initialFormState);
      setImageFile(null);
      setTouched(false);
      setFileInputKey((previous) => previous + 1);
    } else if (createStatus === 'failed' && createError) {
      setSuccessMessage('');
    }
  }, [createStatus, createError]);

  const validationErrors = useMemo(() => {
    const currentErrors = {};
    const trimmedName = formValues.name.trim();
    if (!trimmedName) {
      currentErrors.name = 'Name is required.';
    } else if (trimmedName.length < 10 || trimmedName.length > 20) {
      currentErrors.name = 'Name must be between 10 and 20 characters.';
    }

    const priceNumber = Number.parseFloat(formValues.price);
    if (Number.isNaN(priceNumber) || priceNumber <= 0) {
      currentErrors.price = 'Price must be greater than 0.';
    }

    if (formValues.description.trim().length > 500) {
      currentErrors.description = 'Description must be 500 characters or fewer.';
    }

    if (!imageFile) {
      currentErrors.image = 'Product image is required.';
    }

    return currentErrors;
  }, [formValues, imageFile]);

  const showErrors = touched;
  const isSubmitting = createStatus === 'loading';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched(true);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const formData = new FormData();
    formData.append('name', formValues.name.trim());
    formData.append('price', formValues.price);
    formData.append('description', formValues.description.trim());
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      setSuccessMessage('');
      await dispatch(createProduct(formData)).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section style={formContainerStyle}>
      <h2 style={{ marginBottom: '1.5rem' }}>Add Product</h2>
      {successMessage && <div style={successStyle}>{successMessage}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="name" style={labelStyle}>
          Product Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formValues.name}
          onChange={handleChange}
          style={inputStyle}
          placeholder="Premium Angus Burger"
          required
          disabled={isSubmitting}
        />
        {showErrors && validationErrors.name && <p style={errorStyle}>{validationErrors.name}</p>}

        <label htmlFor="price" style={labelStyle}>
          Price (AUD)
        </label>
        <input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={formValues.price}
          onChange={handleChange}
          style={inputStyle}
          placeholder="129.90"
          required
          disabled={isSubmitting}
        />
        {showErrors && validationErrors.price && <p style={errorStyle}>{validationErrors.price}</p>}

        <label htmlFor="description" style={labelStyle}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows="4"
          value={formValues.description}
          onChange={handleChange}
          style={{ ...inputStyle, resize: 'vertical' }}
          placeholder="Limited time blend."
          disabled={isSubmitting}
        />
        {showErrors && validationErrors.description && <p style={errorStyle}>{validationErrors.description}</p>}

        <label htmlFor="image" style={labelStyle}>
          Product Image
        </label>
        <input
          key={fileInputKey}
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={inputStyle}
          disabled={isSubmitting}
        />
        {showErrors && validationErrors.image && <p style={errorStyle}>{validationErrors.image}</p>}

        {createStatus === 'failed' && createError && (
          <p style={{ ...errorStyle, marginTop: '0.5rem', marginBottom: '1.25rem' }}>{createError}</p>
        )}

        <button type="submit" style={buttonStyle} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Create Product'}
        </button>
      </form>
    </section>
  );
};

export default VendorAddProduct;

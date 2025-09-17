// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, resetCreateState } from '../store/productsSlice';
import {
  CATEGORY_OPTIONS,
  MATERIAL_OPTIONS,
  ECO_BADGE_OPTIONS,
  BADGE_ICON_MAP,
  DEFAULT_BADGE_ICON,
} from '../lib/sustainability';

const initialFormState = {
  name: '',
  price: '',
  description: '',
  category: '',
  materials: [],
  ecoBadges: [],
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

const helperTextStyle = {
  marginTop: '-0.35rem',
  marginBottom: '0.75rem',
  color: '#64748b',
  fontSize: '0.85rem',
};

const optionListStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  marginBottom: '0.75rem',
};

const checkboxOptionStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.4rem 0.6rem',
  borderRadius: '999px',
  border: '1px solid #cbd5f5',
  backgroundColor: '#f8fafc',
  fontSize: '0.85rem',
  cursor: 'pointer',
};

const pillListStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.45rem',
  marginBottom: '1rem',
};

const pillStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3rem',
  padding: '0.35rem 0.6rem',
  borderRadius: '999px',
  backgroundColor: '#e0f2fe',
  color: '#0c4a6e',
  fontSize: '0.85rem',
};

const pillRemoveButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#0f172a',
  cursor: 'pointer',
  fontWeight: 600,
  padding: 0,
  lineHeight: 1,
};

const inlineButtonStyle = {
  padding: '0.45rem 0.75rem',
  borderRadius: '6px',
  border: '1px solid #cbd5f5',
  backgroundColor: '#f1f5f9',
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: 500,
};

const VendorAddProduct = () => {
  const dispatch = useDispatch();
  const { createStatus, createError } = useSelector((state) => state.products);
  const [formValues, setFormValues] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [touched, setTouched] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [fileInputKey, setFileInputKey] = useState(0);
  const [materialInput, setMaterialInput] = useState('');
  const [badgeInput, setBadgeInput] = useState('');

  // Reset submission flags when the vendor navigates away from the form.
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
      setMaterialInput('');
      setBadgeInput('');
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

    if (!formValues.category.trim()) {
      currentErrors.category = 'Category is required.';
    }

    if (!formValues.materials.length) {
      currentErrors.materials = 'Add at least one material.';
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

  const toggleCollectionValue = (value, collection) => {
    if (!value) {
      return collection;
    }
    if (collection.includes(value)) {
      return collection.filter((entry) => entry !== value);
    }
    return [...collection, value];
  };

  const handleMaterialToggle = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }
    setFormValues((previous) => ({
      ...previous,
      materials: toggleCollectionValue(trimmed, previous.materials),
    }));
  };

  const handleBadgeToggle = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }
    setFormValues((previous) => ({
      ...previous,
      ecoBadges: toggleCollectionValue(trimmed, previous.ecoBadges),
    }));
  };

  const handleMaterialRemove = (value) => {
    setFormValues((previous) => ({
      ...previous,
      materials: previous.materials.filter((entry) => entry !== value),
    }));
  };

  const handleBadgeRemove = (value) => {
    setFormValues((previous) => ({
      ...previous,
      ecoBadges: previous.ecoBadges.filter((entry) => entry !== value),
    }));
  };

  const handleMaterialSubmit = () => {
    const trimmed = materialInput.trim();
    if (!trimmed) {
      return;
    }
    setFormValues((previous) => ({
      ...previous,
      materials: previous.materials.includes(trimmed)
        ? previous.materials
        : [...previous.materials, trimmed],
    }));
    setMaterialInput('');
  };

  const handleBadgeSubmit = () => {
    const trimmed = badgeInput.trim();
    if (!trimmed) {
      return;
    }
    setFormValues((previous) => ({
      ...previous,
      ecoBadges: previous.ecoBadges.includes(trimmed)
        ? previous.ecoBadges
        : [...previous.ecoBadges, trimmed],
    }));
    setBadgeInput('');
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
    formData.append('category', formValues.category.trim());
    formValues.materials.forEach((material) => {
      formData.append('materials', material);
    });
    formValues.ecoBadges.forEach((badge) => {
      formData.append('ecoBadges', badge);
    });
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
      {createStatus === 'failed' && createError && (
        <div style={{ ...successStyle, backgroundColor: '#fee2e2', color: '#b91c1c' }}>
          {createError}
        </div>
      )}
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

        <label htmlFor="category" style={labelStyle}>
          Category
        </label>
        <input
          id="category"
          name="category"
          type="text"
          value={formValues.category}
          onChange={handleChange}
          style={inputStyle}
          placeholder="Home & Living"
          list="category-options"
          disabled={isSubmitting}
        />
        <datalist id="category-options">
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
        <p style={helperTextStyle}>Pick from suggestions or type a new category name.</p>
        {showErrors && validationErrors.category && <p style={errorStyle}>{validationErrors.category}</p>}

        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend style={{ ...labelStyle, marginBottom: '0.75rem' }}>Materials</legend>
          <p style={helperTextStyle}>Select relevant materials or add custom entries.</p>
          <div style={optionListStyle}>
            {MATERIAL_OPTIONS.map((option) => {
              const checked = formValues.materials.includes(option);
              return (
                <label key={option} style={checkboxOptionStyle}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleMaterialToggle(option)}
                    disabled={isSubmitting}
                    style={{ margin: 0 }}
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input
              type="text"
              value={materialInput}
              onChange={(event) => setMaterialInput(event.target.value)}
              placeholder="Add another material"
              style={{ ...inputStyle, marginBottom: 0 }}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={handleMaterialSubmit}
              style={inlineButtonStyle}
              disabled={isSubmitting}
            >
              Add
            </button>
          </div>
          {formValues.materials.length > 0 && (
            <div style={pillListStyle}>
              {formValues.materials.map((material) => (
                <span key={material} style={pillStyle}>
                  {material}
                  <button
                    type="button"
                    onClick={() => handleMaterialRemove(material)}
                    style={pillRemoveButtonStyle}
                    aria-label={`Remove ${material}`}
                    disabled={isSubmitting}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          {showErrors && validationErrors.materials && <p style={errorStyle}>{validationErrors.materials}</p>}
        </fieldset>

        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend style={{ ...labelStyle, marginBottom: '0.75rem' }}>Eco Badges</legend>
          <p style={helperTextStyle}>Highlight sustainability badges that apply.</p>
          <div style={optionListStyle}>
            {ECO_BADGE_OPTIONS.map((badge) => {
              const checked = formValues.ecoBadges.includes(badge.value);
              return (
                <label key={badge.value} style={checkboxOptionStyle} title={badge.description}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleBadgeToggle(badge.value)}
                    disabled={isSubmitting}
                    style={{ margin: 0 }}
                  />
                  <span role="img" aria-hidden="true">{badge.icon}</span>
                  <span>{badge.value}</span>
                </label>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input
              type="text"
              value={badgeInput}
              onChange={(event) => setBadgeInput(event.target.value)}
              placeholder="Add another badge"
              style={{ ...inputStyle, marginBottom: 0 }}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={handleBadgeSubmit}
              style={inlineButtonStyle}
              disabled={isSubmitting}
            >
              Add
            </button>
          </div>
          {formValues.ecoBadges.length > 0 && (
            <div style={pillListStyle}>
              {formValues.ecoBadges.map((badge) => (
                <span key={badge} style={{ ...pillStyle, backgroundColor: '#ecfdf5', color: '#047857' }}>
                  <span role="img" aria-hidden="true">{BADGE_ICON_MAP[badge] || DEFAULT_BADGE_ICON}</span>
                  {badge}
                  <button
                    type="button"
                    onClick={() => handleBadgeRemove(badge)}
                    style={pillRemoveButtonStyle}
                    aria-label={`Remove ${badge}`}
                    disabled={isSubmitting}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </fieldset>

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

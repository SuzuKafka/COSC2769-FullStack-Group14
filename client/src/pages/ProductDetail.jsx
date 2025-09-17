// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchProduct, clearProduct } from '../store/catalogSlice';
import { addToCart } from '../store/cartSlice';
import {
  BADGE_ICON_MAP,
  BADGE_DESCRIPTION_MAP,
  DEFAULT_BADGE_ICON,
} from '../lib/sustainability';

const containerStyle = {
  maxWidth: '960px',
  margin: '0 auto',
  padding: '2rem',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '2rem',
};

const imageStyle = {
  width: '100%',
  borderRadius: '12px',
  objectFit: 'cover',
  backgroundColor: '#f3f4f6',
  maxHeight: '420px',
};

const buttonStyle = {
  padding: '0.85rem 1.25rem',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#2563eb',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 600,
};

const detailSectionStyle = {
  marginTop: '1.5rem',
};

const detailHeadingStyle = {
  margin: '0 0 0.75rem',
  fontSize: '1rem',
  fontWeight: 600,
  color: '#0f172a',
};

const detailListStyle = {
  display: 'grid',
  gridTemplateColumns: '140px 1fr',
  rowGap: '0.5rem',
  columnGap: '1rem',
  margin: 0,
};

const detailTermStyle = {
  fontSize: '0.9rem',
  color: '#475569',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const detailDescStyle = {
  margin: 0,
  fontSize: '0.95rem',
  color: '#0f172a',
};

const detailBadgeRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  marginTop: '1rem',
};

const detailBadgeChipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  padding: '0.4rem 0.7rem',
  borderRadius: '999px',
  backgroundColor: '#ecfdf5',
  color: '#047857',
  fontSize: '0.9rem',
  border: '1px solid #bbf7d0',
};

// Shows a single product with configurable quantity and cart integration.
const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, productStatus, productError } = useSelector((state) => state.catalog);
  const { lastActionStatus } = useSelector((state) => state.cart);
  const [quantity, setQuantity] = useState(1);

  const assetBaseUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return '';
    }
    if (import.meta.env.DEV) {
      return 'http://localhost:4000';
    }
    return '';
  }, []);

  const resolveImagePath = (path) => {
    if (!path) {
      return null;
    }
    if (/^https?:\/\//i.test(path)) {
      return path;
    }
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return assetBaseUrl ? `${assetBaseUrl}${normalizedPath}` : normalizedPath;
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
    }

    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, id]);

  const handleQtyChange = (event) => {
    const value = Number.parseInt(event.target.value, 10);
    setQuantity(Number.isNaN(value) || value < 1 ? 1 : value);
  };

  const handleAddToCart = () => {
    if (!product?._id) return;
    dispatch(addToCart({ productId: product._id, qty: quantity }));
  };

  if (productStatus === 'loading' || productStatus === 'idle') {
    return <p style={{ padding: '2rem' }}>Loading product…</p>;
  }

  if (productStatus === 'failed') {
    return (
      <p style={{ padding: '2rem', color: '#b91c1c' }}>
        {productError || 'Unable to load this product.'}
      </p>
    );
  }

  if (!product) {
    return <p style={{ padding: '2rem' }}>Product not found.</p>;
  }

  return (
    <section style={containerStyle}>
      {product.imagePath ? (
        <img src={resolveImagePath(product.imagePath)} alt={product.name} style={imageStyle} />
      ) : (
        <div style={{ ...imageStyle, height: '100%' }} />
      )}
      <div>
        <h1>{product.name}</h1>
        <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>${Number(product.price).toFixed(2)}</p>
        <p style={{ lineHeight: 1.6 }}>{product.description}</p>
        <section style={detailSectionStyle}>
          <h2 style={detailHeadingStyle}>Sustainability Snapshot</h2>
          <dl style={detailListStyle}>
            <dt style={detailTermStyle}>Category</dt>
            <dd style={detailDescStyle}>{product.category || '—'}</dd>
            <dt style={detailTermStyle}>Materials</dt>
            <dd style={detailDescStyle}>
              {product.materials?.length ? product.materials.join(', ') : '—'}
            </dd>
            <dt style={detailTermStyle}>Eco Badges</dt>
            <dd style={detailDescStyle}>
              {product.ecoBadges?.length ? (
                <div style={detailBadgeRowStyle}>
                  {product.ecoBadges.map((badge) => (
                    <span
                      key={`${product._id}-${badge}`}
                      style={detailBadgeChipStyle}
                      title={BADGE_DESCRIPTION_MAP[badge] || ''}
                    >
                      <span role="img" aria-hidden="true">{BADGE_ICON_MAP[badge] || DEFAULT_BADGE_ICON}</span>
                      {badge}
                    </span>
                  ))}
                </div>
              ) : (
                '—'
              )}
            </dd>
          </dl>
        </section>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label htmlFor="quantity">
            Quantity
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={handleQtyChange}
              style={{ marginLeft: '0.75rem', width: '80px', padding: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5f5' }}
            />
          </label>
          <button
            type="button"
            style={buttonStyle}
            onClick={handleAddToCart}
            disabled={lastActionStatus === 'loading'}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;

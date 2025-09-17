// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyProducts } from '../store/productsSlice';
import {
  BADGE_ICON_MAP,
  BADGE_DESCRIPTION_MAP,
  DEFAULT_BADGE_ICON,
} from '../lib/sustainability';

const listStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: '1.5rem',
  padding: '2rem',
};

const cardStyle = {
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  overflow: 'hidden',
  backgroundColor: '#fff',
  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.08)',
};

const imageStyle = {
  width: '100%',
  height: '160px',
  objectFit: 'cover',
  backgroundColor: '#f3f4f6',
};

const contentStyle = {
  padding: '1rem',
};

const metaStyle = {
  margin: '0 0 0.5rem',
  fontSize: '0.85rem',
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const materialsStyle = {
  margin: '0 0 0.75rem',
  fontSize: '0.9rem',
  color: '#475569',
};

const badgeRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.4rem',
  marginTop: '0.75rem',
};

const badgeChipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3rem',
  padding: '0.3rem 0.55rem',
  borderRadius: '999px',
  backgroundColor: '#ecfdf5',
  color: '#047857',
  fontSize: '0.8rem',
  border: '1px solid #bbf7d0',
};

const VendorMyProducts = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMyProducts());
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return <p style={{ padding: '1.5rem' }}>Loading your products...</p>;
  }

  if (status === 'failed') {
    return (
      <p style={{ padding: '1.5rem', color: '#b91c1c' }}>
        {error || 'Unable to load products right now.'}
      </p>
    );
  }

  if (!items.length) {
    return <p style={{ padding: '1.5rem' }}>No products yet. Add your first product to get started.</p>;
  }

  return (
    <section>
      <h2 style={{ padding: '1.5rem', margin: 0 }}>My Products</h2>
      <div style={listStyle}>
        {items.map((product) => (
          <article key={product._id} style={cardStyle}>
            {product.imagePath ? (
              <img
                src={`/public${product.imagePath}`}
                alt={product.name}
                style={imageStyle}
                loading="lazy"
              />
            ) : (
              <div style={imageStyle} />
            )}
            <div style={contentStyle}>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem' }}>{product.name}</h3>
              {product.category && <p style={metaStyle}>{product.category}</p>}
              <p style={{ margin: '0 0 0.75rem', color: '#475569' }}>{product.description}</p>
              {product.materials?.length > 0 && (
                <p style={materialsStyle}>
                  Materials: {product.materials.join(', ')}
                </p>
              )}
              {product.ecoBadges?.length > 0 && (
                <div style={badgeRowStyle}>
                  {product.ecoBadges.map((badge) => (
                    <span
                      key={badge}
                      style={badgeChipStyle}
                      title={BADGE_DESCRIPTION_MAP[badge] || ''}
                    >
                      <span role="img" aria-hidden="true">{BADGE_ICON_MAP[badge] || DEFAULT_BADGE_ICON}</span>
                      {badge}
                    </span>
                  ))}
                </div>
              )}
              <strong style={{ display: 'inline-block', marginTop: '0.85rem' }}>
                ${Number(product.price).toFixed(2)}
              </strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default VendorMyProducts;

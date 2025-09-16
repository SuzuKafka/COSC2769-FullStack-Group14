// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCatalog } from '../store/catalogSlice';
import { addToCart } from '../store/cartSlice';

const containerStyle = {
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
};

const filtersStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1rem',
  marginBottom: '1.5rem',
};

const inputStyle = {
  width: '100%',
  padding: '0.6rem 0.75rem',
  borderRadius: '6px',
  border: '1px solid #cbd5f5',
  boxSizing: 'border-box',
};

const productsGridStyle = {
  display: 'grid',
  gap: '1.5rem',
};

const cardStyle = {
  borderRadius: '10px',
  border: '1px solid #e5e7eb',
  overflow: 'hidden',
  backgroundColor: '#fff',
  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.08)',
  display: 'flex',
  flexDirection: 'column',
};

const imageStyle = {
  width: '100%',
  height: '180px',
  objectFit: 'cover',
  backgroundColor: '#f3f4f6',
};

const cardContentStyle = {
  flex: '1 1 auto',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

const buttonStyle = {
  padding: '0.65rem',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: '#2563eb',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 600,
};

const paginationStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '1rem',
  marginTop: '2rem',
};

// Catalog grid supporting server-side query filters and responsive layout.
const Browse = () => {
  const dispatch = useDispatch();
  const { items, status, error, pagination } = useSelector((state) => state.catalog);
  const { lastActionStatus } = useSelector((state) => state.cart);

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
    return `${assetBaseUrl}/public${path}`;
  };

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const filters = useMemo(
    () => ({
      q: debouncedSearch,
      min: minPrice,
      max: maxPrice,
      sort,
      page,
    }),
    [debouncedSearch, minPrice, maxPrice, sort, page]
  );

  useEffect(() => {
    dispatch(fetchCatalog(filters));
  }, [dispatch, filters]);

  const handleMinChange = (event) => {
    setMinPrice(event.target.value);
    setPage(1);
  };

  const handleMaxChange = (event) => {
    setMaxPrice(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

  const handleAddToCart = (productId) => {
    dispatch(addToCart({ productId, qty: 1 }));
  };

  const canGoPrev = pagination.page > 1;
  const canGoNext = pagination.page < pagination.pages;

  return (
    <section style={containerStyle}>
      <h1 style={{ marginBottom: '1rem' }}>Browse Products</h1>
      <div style={filtersStyle}>
        <input
          type="search"
          placeholder="Search products…"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          style={inputStyle}
        />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Min price"
          value={minPrice}
          onChange={handleMinChange}
          style={inputStyle}
        />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Max price"
          value={maxPrice}
          onChange={handleMaxChange}
          style={inputStyle}
        />
        <select value={sort} onChange={handleSortChange} style={inputStyle}>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {status === 'loading' && <p>Loading products…</p>}
      {status === 'failed' && <p style={{ color: '#b91c1c' }}>{error}</p>}

      {status === 'succeeded' && items.length === 0 && <p>No products found. Try updating your filters.</p>}

      {items.length > 0 && (
        <div className="products-grid" style={productsGridStyle}>
          {items.map((product) => (
            <article key={product._id} style={cardStyle}>
              <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {product.imagePath ? (
                  <img
                    src={resolveImagePath(product.imagePath)}
                    alt={product.name}
                    style={imageStyle}
                    loading="lazy"
                  />
                ) : (
                  <div style={imageStyle} />
                )}
              </Link>
              <div style={cardContentStyle}>
                <Link
                  to={`/product/${product._id}`}
                  style={{ textDecoration: 'none', color: '#111827', fontWeight: 600 }}
                >
                  {product.name}
                </Link>
                <p style={{ margin: 0, fontWeight: 600 }}>${Number(product.price).toFixed(2)}</p>
                <button
                  type="button"
                  style={buttonStyle}
                  onClick={() => handleAddToCart(product._id)}
                  disabled={lastActionStatus === 'loading'}
                >
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {pagination.pages > 1 && (
        <div style={paginationStyle}>
          <button
            type="button"
            onClick={() => canGoPrev && setPage((prev) => Math.max(prev - 1, 1))}
            disabled={!canGoPrev}
            style={{ ...buttonStyle, backgroundColor: canGoPrev ? '#1f2937' : '#9ca3af' }}
          >
            Previous
          </button>
          <span>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            type="button"
            onClick={() => canGoNext && setPage((prev) => prev + 1)}
            disabled={!canGoNext}
            style={{ ...buttonStyle, backgroundColor: canGoNext ? '#1f2937' : '#9ca3af' }}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default Browse;

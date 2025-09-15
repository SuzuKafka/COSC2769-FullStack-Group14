import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchProduct, clearProduct } from '../store/catalogSlice';
import { addToCart } from '../store/cartSlice';

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

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, productStatus, productError } = useSelector((state) => state.catalog);
  const { lastActionStatus } = useSelector((state) => state.cart);
  const [quantity, setQuantity] = useState(1);

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
        <img src={`/public${product.imagePath}`} alt={product.name} style={imageStyle} />
      ) : (
        <div style={{ ...imageStyle, height: '100%' }} />
      )}
      <div>
        <h1>{product.name}</h1>
        <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>${Number(product.price).toFixed(2)}</p>
        <p style={{ lineHeight: 1.6 }}>{product.description}</p>
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

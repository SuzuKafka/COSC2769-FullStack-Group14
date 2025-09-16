import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCart, removeFromCart, updateCartItem } from '../store/cartSlice';
import { checkoutCart } from '../store/checkoutSlice';

const containerStyle = {
  maxWidth: '900px',
  margin: '0 auto',
  padding: '2rem',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle = {
  textAlign: 'left',
  borderBottom: '2px solid #e5e7eb',
  padding: '0.75rem',
};

const tdStyle = {
  padding: '0.75rem',
  borderBottom: '1px solid #e5e7eb',
  verticalAlign: 'middle',
};

const buttonStyle = {
  padding: '0.6rem 0.9rem',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
};

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalQty, totalPrice, status, error, lastActionStatus, lastActionError } = useSelector(
    (state) => state.cart
  );
  const checkoutStatus = useSelector((state) => state.checkout.status);
  const checkoutError = useSelector((state) => state.checkout.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getCart());
    }
  }, [dispatch, status]);

  const handleQtyChange = (productId, value) => {
    const qty = Number.parseInt(value, 10);
    if (Number.isNaN(qty) || qty < 1) {
      return;
    }
    dispatch(updateCartItem({ productId, qty }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart({ productId }));
  };

  const isMutating = lastActionStatus === 'loading';
  const isCheckoutLoading = checkoutStatus === 'loading';

  const handleCheckout = async () => {
    try {
      const order = await dispatch(checkoutCart()).unwrap();
      navigate('/order-confirmation', { state: order });
    } catch (err) {
      // handled via error messaging/toast in state
    }
  };

  return (
    <section style={containerStyle}>
      <h1>Your Cart</h1>

      {status === 'loading' && <p>Loading cart…</p>}
      {status === 'failed' && <p style={{ color: '#b91c1c' }}>{error}</p>}

      {lastActionStatus === 'failed' && lastActionError && (
        <p style={{ color: '#b91c1c' }}>{lastActionError}</p>
      )}

      {checkoutStatus === 'failed' && checkoutError && (
        <p style={{ color: '#b91c1c' }}>{checkoutError}</p>
      )}

      {items.length === 0 && status === 'succeeded' && <p>Your cart is empty.</p>}

      {items.length > 0 && (
        <>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>Price</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Subtotal</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.productId}>
                  <td style={tdStyle}>{item.name}</td>
                  <td style={tdStyle}>${Number(item.price).toFixed(2)}</td>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(event) => handleQtyChange(item.productId, event.target.value)}
                      style={{ width: '80px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #cbd5f5' }}
                      disabled={isMutating}
                    />
                  </td>
                  <td style={tdStyle}>${(Number(item.price) * item.qty).toFixed(2)}</td>
                  <td style={tdStyle}>
                    <button
                      type="button"
                      style={{ ...buttonStyle, backgroundColor: '#ef4444', color: '#fff' }}
                      onClick={() => handleRemove(item.productId)}
                      disabled={isMutating || isCheckoutLoading}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '2rem', textAlign: 'right' }}>
            <p>Total items: <strong>{totalQty}</strong></p>
            <p>Subtotal: <strong>${Number(totalPrice).toFixed(2)}</strong></p>
            <button
              type="button"
              style={{ ...buttonStyle, backgroundColor: '#2563eb', color: '#fff', marginTop: '1rem' }}
              disabled={isMutating || isCheckoutLoading}
              onClick={handleCheckout}
            >
              {isCheckoutLoading ? 'Processing…' : 'Proceed to Checkout'}
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default Cart;

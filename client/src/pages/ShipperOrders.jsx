import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShipperOrders, updateShipperOrderStatus, resetShipperState } from '../store/shipperSlice';

const containerStyle = {
  maxWidth: '960px',
  margin: '0 auto',
  padding: '2rem',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '1.5rem',
  marginBottom: '1.5rem',
  boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)',
  border: '1px solid #e2e8f0',
};

const actionsStyle = {
  display: 'flex',
  gap: '0.75rem',
  marginTop: '1rem',
};

const buttonStyle = {
  padding: '0.6rem 1rem',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 500,
};

const lineItemsStyle = {
  marginTop: '1rem',
  padding: '1rem',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
};

const formatDateTime = (value) => {
  if (!value) {
    return 'Unknown';
  }
  try {
    return new Date(value).toLocaleString();
  } catch (error) {
    return value;
  }
};

const shortenId = (id) => {
  if (!id) {
    return 'N/A';
  }
  return `#${id.slice(-6)}`;
};

const ShipperOrders = () => {
  const dispatch = useDispatch();
  const { orders, hubId, status, error, updateStatus, updateError, activeOrderId } = useSelector(
    (state) => state.shipper
  );
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchShipperOrders());
    }
  }, [dispatch, status]);

  useEffect(() => () => {
    dispatch(resetShipperState());
  }, [dispatch]);

  const handleToggleExpand = (orderId) => {
    setExpandedId((current) => (current === orderId ? null : orderId));
  };

  const handleUpdate = (orderId, nextStatus) => {
    if (updateStatus === 'loading' && activeOrderId === orderId) {
      return;
    }

    if (nextStatus === 'canceled') {
      const confirmed = window.confirm('Mark this order as canceled?');
      if (!confirmed) {
        return;
      }
    }

    dispatch(updateShipperOrderStatus({ orderId, status: nextStatus }));
  };

  const isLoading = status === 'loading';
  const isUpdating = (orderId) => updateStatus === 'loading' && activeOrderId === orderId;

  return (
    <section style={containerStyle}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>Shipper Orders</h1>
        {hubId && <p style={{ color: '#475569' }}>Assigned hub: {hubId}</p>}
      </header>

      {isLoading && <p>Loading orders…</p>}
      {status === 'failed' && error && <p style={{ color: '#b91c1c' }}>{error}</p>}
      {updateStatus === 'failed' && updateError && <p style={{ color: '#b91c1c' }}>{updateError}</p>}

      {!isLoading && orders.length === 0 && status === 'succeeded' && (
        <p>No active orders for your hub right now.</p>
      )}

      {orders.map((order) => {
        const itemCount =
          order.items?.reduce((sum, item) => sum + (item.quantity || item.qty || 0), 0) || 0;
        return (
          <article key={order._id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ marginBottom: '0.25rem' }}>{shortenId(order._id)}</h2>
                <p style={{ color: '#475569', margin: 0 }}>Placed: {formatDateTime(order.createdAt)}</p>
                <p style={{ color: '#475569', margin: 0 }}>Items: {itemCount}</p>
                <p style={{ color: '#475569', margin: 0 }}>Total: ${Number(order.total || 0).toFixed(2)}</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggleExpand(order._id)}
                style={{ ...buttonStyle, backgroundColor: '#f1f5f9', color: '#0f172a' }}
              >
                {expandedId === order._id ? 'Hide Items' : 'View Items'}
              </button>
            </div>

            {expandedId === order._id && order.items && order.items.length > 0 && (
              <div style={lineItemsStyle}>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {order.items.map((item, index) => {
                    const quantity = item.quantity || item.qty || 0;
                    return (
                      <li
                        key={`${order._id}-item-${item.product || index}`}
                        style={{ marginBottom: '0.5rem' }}
                      >
                        <strong>{item.name || item.product}</strong> × {quantity}
                        {item.priceAtPurchase && (
                          <span style={{ marginLeft: '0.5rem', color: '#64748b' }}>
                            @ ${Number(item.priceAtPurchase).toFixed(2)}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div style={actionsStyle}>
              <button
                type="button"
                style={{ ...buttonStyle, backgroundColor: '#16a34a', color: '#fff' }}
                onClick={() => handleUpdate(order._id, 'delivered')}
                disabled={isUpdating(order._id)}
              >
                {isUpdating(order._id) ? 'Updating…' : 'Mark Delivered'}
              </button>
              <button
                type="button"
                style={{ ...buttonStyle, backgroundColor: '#dc2626', color: '#fff' }}
                onClick={() => handleUpdate(order._id, 'canceled')}
                disabled={isUpdating(order._id)}
              >
                {isUpdating(order._id) ? 'Updating…' : 'Mark Canceled'}
              </button>
            </div>
          </article>
        );
      })}
    </section>
  );
};

export default ShipperOrders;

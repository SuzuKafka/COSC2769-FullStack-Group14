// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  resetNotifications,
} from '../store/notificationsSlice';

const buttonBaseStyle = {
  border: '1px solid rgba(248, 250, 252, 0.25)',
  backgroundColor: 'rgba(15, 23, 42, 0.35)',
  color: '#f8fafc',
  borderRadius: '12px',
  padding: '0.45rem 0.65rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  position: 'relative',
  transition: 'background-color 0.2s ease, border 0.2s ease',
};

const badgeStyle = {
  position: 'absolute',
  top: '-0.3rem',
  right: '-0.3rem',
  backgroundColor: '#ef4444',
  color: '#fff',
  minWidth: '1.35rem',
  height: '1.35rem',
  borderRadius: '999px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  fontWeight: 600,
  padding: '0 0.3rem',
};

const panelStyle = {
  position: 'absolute',
  top: 'calc(100% + 0.75rem)',
  right: 0,
  width: '320px',
  maxHeight: '420px',
  backgroundColor: '#0f172a',
  color: '#e2e8f0',
  borderRadius: '16px',
  boxShadow: '0 20px 40px rgba(15, 23, 42, 0.45)',
  border: '1px solid rgba(148, 163, 184, 0.25)',
  overflow: 'hidden',
  zIndex: 40,
};

const panelHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.75rem 1rem',
  borderBottom: '1px solid rgba(148, 163, 184, 0.25)',
};

const itemStyle = {
  padding: '0.75rem 1rem',
  borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
};

const unreadIndicatorStyle = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#38bdf8',
  flexShrink: 0,
};

const footerStyle = {
  padding: '0.75rem 1rem',
  textAlign: 'center',
  backgroundColor: 'rgba(15, 23, 42, 0.85)',
};

const closeButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: '#93c5fd',
  fontWeight: 600,
  cursor: 'pointer',
};

const markAllButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: '#38bdf8',
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer',
};

const NotificationBell = () => {
  const dispatch = useDispatch();
  const { items, unreadCount, status } = useSelector((state) => state.notifications);
  const user = useSelector((state) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Sync notification lifecycle with authentication so stale data disappears after logout.
  useEffect(() => {
    if (user && status === 'idle') {
      dispatch(fetchNotifications());
    }
    if (!user) {
      dispatch(resetNotifications());
      setIsOpen(false);
    }
  }, [user, status, dispatch]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [items]);

  if (!user) {
    return null;
  }

  const handleToggle = () => {
    if (!isOpen && status !== 'loading') {
      dispatch(fetchNotifications());
    }
    setIsOpen((open) => !open);
  };

  const handleMarkRead = (id) => {
    dispatch(markNotificationRead(id));
  };

  const handleMarkAll = () => {
    if (unreadCount > 0) {
      dispatch(markAllNotificationsRead());
    }
  };

  const formatTimestamp = (value) => {
    if (!value) {
      return '';
    }
    try {
      return new Date(value).toLocaleString();
    } catch (error) {
      return value;
    }
  };

  return (
    <div className="notification-bell" ref={containerRef}>
      <button
        type="button"
        style={buttonBaseStyle}
        className="notification-bell__button"
        onClick={handleToggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Notifications"
      >
        <span role="img" aria-hidden="true" style={{ fontSize: '1.2rem' }}>
          🔔
        </span>
        {unreadCount > 0 && (
          <span style={badgeStyle}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>
      {isOpen && (
        <div style={panelStyle} className="notification-bell__panel">
          <div style={panelHeaderStyle}>
            <strong>Notifications</strong>
            <div>
              <button type="button" style={markAllButtonStyle} onClick={handleMarkAll}>
                Mark all as read
              </button>
              <button type="button" style={{ ...closeButtonStyle, marginLeft: '0.75rem' }} onClick={() => setIsOpen(false)}>
                Close
              </button>
            </div>
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {sortedItems.length === 0 && (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#cbd5f5' }}>
                No notifications yet.
              </div>
            )}
            {sortedItems.map((notification) => {
              const isUnread = !notification.read;
              const content = (
                <div style={itemStyle} key={notification.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isUnread && <span style={unreadIndicatorStyle} aria-hidden="true" />}
                    <strong style={{ color: '#f8fafc' }}>{notification.title}</strong>
                  </div>
                  <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.9rem' }}>{notification.message}</p>
                  <small style={{ color: '#94a3b8' }}>{formatTimestamp(notification.createdAt)}</small>
                  <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.35rem' }}>
                    {notification.link && (
                      <Link
                        to={notification.link}
                        style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600 }}
                        onClick={() => setIsOpen(false)}
                      >
                        View
                      </Link>
                    )}
                    {isUnread && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(notification.id)}
                        style={{ ...markAllButtonStyle, color: '#93c5fd' }}
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              );

              return content;
            })}
          </div>
          <div style={footerStyle}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              New alerts appear here when actions happen on your account.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

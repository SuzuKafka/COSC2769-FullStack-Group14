// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/authSlice';

// Responsive navigation bar shown on every page. Collapses to a vertical menu on mobile.
const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const totalQty = useSelector((state) => state.cart.totalQty);
  const loginStatus = useSelector((state) => state.auth.loginStatus);

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  // Build navigation entries based on the current role/session state.
  const navLinks = useMemo(() => {
    const links = [
      { key: 'browse', label: 'Browse', to: '/browse' },
      {
        key: 'cart',
        label: 'Cart',
        to: '/cart',
        badge: totalQty > 0 ? totalQty : null,
      },
    ];

    if (user?.role === 'vendor') {
      links.push(
        { key: 'vendor-new', label: 'Add Product', to: '/vendor/new-product' },
        { key: 'vendor-products', label: 'My Products', to: '/vendor/my-products' },
      );
    }

    if (user?.role === 'shipper') {
      links.push({ key: 'shipper-orders', label: 'Shipper Orders', to: '/shipper/orders' });
    }

    if (user) {
      links.push({ key: 'account', label: 'My Account', to: '/account' });
      links.push({ key: 'logout', label: 'Log Out', type: 'button', variant: 'danger' });
    } else {
      links.push({ key: 'login', label: 'Login', to: '/login', highlight: true });
    }

    return links;
  }, [totalQty, user]);

  const handleToggleMenu = () => {
    setMobileMenuOpen((open) => !open);
  };

  const handleNavAction = (link) => {
    if (link.type === 'button') {
      handleLogout();
    }
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="site-header">
      <div className="site-header__top">
        <Link to="/" className="site-header__brand">
          <span className="site-header__logo" aria-hidden>
            🌱
          </span>
          <span className="site-header__title">EcoSwap</span>
          <small className="site-header__tagline">sustainable goods &amp; upcycles</small>
        </Link>
        <button
          type="button"
          className="site-header__toggle"
          aria-label="Toggle navigation"
          aria-expanded={isMobileMenuOpen}
          onClick={handleToggleMenu}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <nav
        className={`site-header__nav ${
          isMobile ? 'site-header__nav--mobile' : 'site-header__nav--desktop'
        } ${isMobileMenuOpen ? 'site-header__nav--open' : ''}`}
      >
        <ul>
          {navLinks.map((link) => {
            const isActive = link.to && location.pathname.startsWith(link.to);
            if (link.type === 'button') {
              return (
                <li key={link.key}>
                  <button
                    type="button"
                    className={`site-header__link site-header__link--button ${
                      isActive ? 'site-header__link--active' : ''
                    } ${link.variant === 'danger' ? 'site-header__link--danger' : ''}`}
                    onClick={() => handleNavAction(link)}
                    disabled={loginStatus === 'loading'}
                  >
                    {loginStatus === 'loading' ? 'Logging out…' : link.label}
                  </button>
                </li>
              );
            }

            return (
              <li key={link.key}>
                <Link
                  to={link.to}
                  className={`site-header__link ${isActive ? 'site-header__link--active' : ''} ${
                    link.highlight ? 'site-header__link--highlight' : ''
                  }`}
                  onClick={() => handleNavAction(link)}
                >
                  <span>{link.label}</span>
                  {link.badge && <span className="site-header__badge">{link.badge}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

export default Header;

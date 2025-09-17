// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCatalog } from '../store/catalogSlice';
import { addToCart } from '../store/cartSlice';
import {
  BADGE_ICON_MAP,
  BADGE_DESCRIPTION_MAP,
  DEFAULT_BADGE_ICON,
} from '../lib/sustainability';

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

const headerRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '1rem',
  flexWrap: 'wrap',
};

const clearFiltersButtonStyle = {
  padding: '0.5rem 0.85rem',
  borderRadius: '6px',
  border: '1px solid #cbd5f5',
  backgroundColor: '#f8fafc',
  color: '#1d4ed8',
  fontSize: '0.9rem',
  fontWeight: 600,
  cursor: 'pointer',
};

const cardMetaStyle = {
  fontSize: '0.78rem',
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const cardMaterialsStyle = {
  margin: 0,
  color: '#475569',
  fontSize: '0.85rem',
};

const cardBadgeRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.4rem',
};

const cardBadgeChipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  padding: '0.3rem 0.55rem',
  borderRadius: '999px',
  backgroundColor: '#ecfdf5',
  color: '#047857',
  fontSize: '0.78rem',
  border: '1px solid #bbf7d0',
};

const facetRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem',
  marginBottom: '1rem',
};

const dropdownContainerStyle = {
  position: 'relative',
  minWidth: '220px',
};

const dropdownButtonStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  borderRadius: '8px',
  border: '1px solid #cbd5f5',
  padding: '0.65rem 0.75rem',
  backgroundColor: '#f8fafc',
  cursor: 'pointer',
  textAlign: 'left',
};

const dropdownTitleStyle = {
  fontSize: '0.7rem',
  fontWeight: 600,
  color: '#475569',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
};

const dropdownSummaryStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.75rem',
  color: '#0f172a',
  fontWeight: 500,
};

const dropdownCaretStyle = {
  marginLeft: '0.5rem',
  fontSize: '0.75rem',
  color: '#64748b',
};

const dropdownPanelStyle = {
  position: 'absolute',
  top: 'calc(100% + 0.5rem)',
  left: 0,
  zIndex: 20,
  width: '100%',
  maxHeight: '320px',
  overflow: 'hidden',
  borderRadius: '10px',
  border: '1px solid #dbeafe',
  backgroundColor: '#fff',
  boxShadow: '0 12px 24px rgba(15, 23, 42, 0.15)',
  padding: '0.75rem',
  boxSizing: 'border-box',
};

const dropdownSearchStyle = {
  width: '100%',
  padding: '0.5rem 0.6rem',
  borderRadius: '6px',
  border: '1px solid #cbd5f5',
  fontSize: '0.9rem',
  boxSizing: 'border-box',
};

const dropdownOptionsStyle = {
  marginTop: '0.65rem',
  maxHeight: '220px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
};

const optionRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.65rem',
  padding: '0.35rem 0.4rem',
  borderRadius: '6px',
  color: '#0f172a',
};

const optionLabelWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  flex: '1 1 auto',
  minWidth: 0,
};

const optionCountStyle = {
  fontVariantNumeric: 'tabular-nums',
  fontSize: '0.85rem',
  color: '#475569',
};

const badgeRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  marginBottom: '1.5rem',
};

const badgeChipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  borderRadius: '999px',
  border: '1px solid #bbf7d0',
  backgroundColor: '#ecfdf5',
  color: '#047857',
  padding: '0.35rem 0.65rem',
  fontSize: '0.85rem',
  cursor: 'pointer',
};

const badgeRemoveStyle = {
  fontWeight: 600,
  marginLeft: '0.15rem',
};

const clearPillStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  borderRadius: '999px',
  border: '1px solid #fecdd3',
  backgroundColor: '#fff1f2',
  color: '#be123c',
  padding: '0.35rem 0.65rem',
  fontSize: '0.85rem',
  cursor: 'pointer',
};

const highlightMarkStyle = {
  backgroundColor: '#fde68a',
  color: '#92400e',
  padding: '0 0.1rem',
  borderRadius: '4px',
};

const escapeRegExp = (value) => value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

const priceInputPattern = /^\d*(?:\.\d{0,2})?$/;

const highlightMatch = (text, query) => {
  if (!query) {
    return text;
  }

  const safeQuery = escapeRegExp(query);
  if (!safeQuery) {
    return text;
  }

  const regex = new RegExp(`(${safeQuery})`, 'ig');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <mark key={`${part}-${index}`} style={highlightMarkStyle}>
        {part}
      </mark>
    ) : (
      <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
    )
  );
};

const summariseSelection = (title, selected) => {
  if (!selected || selected.length === 0) {
    return `All ${title}`;
  }
  if (selected.length <= 2) {
    return selected.join(', ');
  }
  const displayed = selected.slice(0, 2).join(', ');
  return `${displayed} +${selected.length - 2}`;
};

const toggleSelectionValue = (value, selected) => {
  if (selected.includes(value)) {
    return selected.filter((entry) => entry !== value);
  }
  return [...selected, value];
};

const DropdownFilter = ({
  title,
  options,
  selected,
  onToggle,
  searchValue,
  onSearchChange,
  placeholder,
  renderOptionLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const normalizedQuery = searchValue.trim().toLowerCase();

  const { orderedOptions, matchCount } = useMemo(() => {
    if (!options || options.length === 0) {
      return { orderedOptions: [], matchCount: 0 };
    }

    const sorted = [...options].sort((a, b) => (a.label || a.value).localeCompare(b.label || b.value));

    if (!normalizedQuery) {
      return { orderedOptions: sorted, matchCount: sorted.length };
    }

    const matches = [];
    const rest = [];
    sorted.forEach((option) => {
      const label = (option.label || option.value || '').toLowerCase();
      const index = label.indexOf(normalizedQuery);
      if (index >= 0) {
        matches.push({ option, score: index });
      } else {
        rest.push(option);
      }
    });

    matches.sort((a, b) => {
      if (a.score !== b.score) {
        return a.score - b.score;
      }
      const countDelta = (b.option.count || 0) - (a.option.count || 0);
      if (countDelta !== 0) {
        return countDelta;
      }
      return (a.option.label || a.option.value).localeCompare(b.option.label || b.option.value);
    });

    const restSorted = rest.sort((a, b) => (a.label || a.value).localeCompare(b.label || b.value));

    return {
      orderedOptions: [...matches.map((entry) => entry.option), ...restSorted],
      matchCount: matches.length,
    };
  }, [normalizedQuery, options]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    if (typeof document === 'undefined') {
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

  const summaryText = summariseSelection(title, selected);

  return (
    <div ref={containerRef} style={dropdownContainerStyle}>
      <button
        type="button"
        style={{
          ...dropdownButtonStyle,
          borderColor: selected.length > 0 ? '#2563eb' : '#cbd5f5',
          boxShadow: isOpen ? '0 0 0 3px rgba(37, 99, 235, 0.15)' : 'none',
        }}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span style={dropdownTitleStyle}>{title}</span>
        <span style={dropdownSummaryStyle}>
          <span style={{ flex: '1 1 auto', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {summaryText}
          </span>
          <span style={dropdownCaretStyle}>{isOpen ? '▲' : '▼'}</span>
        </span>
      </button>
      {isOpen && (
        <div style={dropdownPanelStyle}>
          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={placeholder}
            style={dropdownSearchStyle}
            autoFocus
          />
          <div style={dropdownOptionsStyle}>
            {normalizedQuery && matchCount === 0 ? (
              <p style={{ margin: '0.5rem 0', color: '#64748b', fontSize: '0.85rem' }}>
                No matches for “{searchValue}”.
              </p>
            ) : (
              orderedOptions.map((option) => {
                const label = option.label || option.value;
                const isSelected = selected.includes(option.value);
                const count = option.count ?? 0;
                const isDisabled = count === 0 && !isSelected;

                return (
                  <label
                    key={option.value}
                    style={{
                      ...optionRowStyle,
                      backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                      color: isDisabled ? '#94a3b8' : optionRowStyle.color,
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                    }}
                    title={option.description || ''}
                  >
                    <span style={optionLabelWrapperStyle}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggle(option.value)}
                        disabled={isDisabled}
                        style={{ margin: 0 }}
                      />
                      <span
                        style={{
                          flex: '1 1 auto',
                          minWidth: 0,
                          color: isDisabled ? '#94a3b8' : '#1f2937',
                          fontWeight: isSelected ? 600 : 500,
                        }}
                      >
                        {renderOptionLabel
                          ? renderOptionLabel(option, searchValue)
                          : highlightMatch(label, searchValue)}
                      </span>
                    </span>
                    <span
                      style={{
                        ...optionCountStyle,
                        color: isDisabled ? '#cbd5f5' : optionCountStyle.color,
                      }}
                    >
                      ({count})
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Catalog grid supporting server-side query filters and responsive layout.
const Browse = () => {
  const dispatch = useDispatch();
  const { items, status, error, pagination, facets } = useSelector((state) => state.catalog);
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
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [materialSearch, setMaterialSearch] = useState('');
  const [badgeSearch, setBadgeSearch] = useState('');

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
      category: selectedCategories,
      material: selectedMaterials,
      badge: selectedBadges,
    }),
    [debouncedSearch, minPrice, maxPrice, sort, page, selectedCategories, selectedMaterials, selectedBadges]
  );

  useEffect(() => {
    dispatch(fetchCatalog(filters));
  }, [dispatch, filters]);

  const categoryOptions = useMemo(
    () =>
      (facets?.categories || []).map((option) => ({
        ...option,
        label: option.label || option.value,
      })),
    [facets?.categories]
  );

  const materialOptions = useMemo(
    () =>
      (facets?.materials || []).map((option) => ({
        ...option,
        label: option.label || option.value,
      })),
    [facets?.materials]
  );

  const badgeOptions = useMemo(
    () =>
      (facets?.badges || []).map((option) => ({
        ...option,
        label: option.label || option.value,
        icon: BADGE_ICON_MAP[option.value] || DEFAULT_BADGE_ICON,
        description: option.description || BADGE_DESCRIPTION_MAP[option.value] || '',
      })),
    [facets?.badges]
  );

  const selectedBadgeDetails = useMemo(
    () =>
      selectedBadges
        .map((badge) => badgeOptions.find((option) => option.value === badge))
        .filter(Boolean),
    [badgeOptions, selectedBadges]
  );

  const handleMinChange = (event) => {
    const rawValue = event.target.value.trim();
    const sanitized = rawValue === '' ? '' : priceInputPattern.test(rawValue) ? rawValue : null;
    if (sanitized === null) {
      return;
    }
    setMinPrice(sanitized);
    setPage(1);
  };

  const handleMaxChange = (event) => {
    const rawValue = event.target.value.trim();
    const sanitized = rawValue === '' ? '' : priceInputPattern.test(rawValue) ? rawValue : null;
    if (sanitized === null) {
      return;
    }
    setMaxPrice(sanitized);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

  const handleCategoryToggle = (value) => {
    setSelectedCategories((prev) => toggleSelectionValue(value, prev));
    setPage(1);
  };

  const handleMaterialToggle = (value) => {
    setSelectedMaterials((prev) => toggleSelectionValue(value, prev));
    setPage(1);
  };

  const handleBadgeToggle = (value) => {
    setSelectedBadges((prev) => toggleSelectionValue(value, prev));
    setPage(1);
  };

  const handleClearBadges = () => {
    if (selectedBadges.length === 0) {
      return;
    }
    setSelectedBadges([]);
    setPage(1);
  };

  const handleAddToCart = (productId) => {
    dispatch(addToCart({ productId, qty: 1 }));
  };

  const canGoPrev = pagination.page > 1;
  const canGoNext = pagination.page < pagination.pages;

  const hasActiveFilters = useMemo(() => {
    return (
      searchInput.trim() !== '' ||
      debouncedSearch.trim() !== '' ||
      minPrice !== '' ||
      maxPrice !== '' ||
      sort !== 'newest' ||
      selectedCategories.length > 0 ||
      selectedMaterials.length > 0 ||
      selectedBadges.length > 0 ||
      page !== 1
    );
  }, [
    searchInput,
    debouncedSearch,
    minPrice,
    maxPrice,
    sort,
    selectedCategories,
    selectedMaterials,
    selectedBadges,
    page,
  ]);

  const handleClearAll = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setSelectedBadges([]);
    setCategorySearch('');
    setMaterialSearch('');
    setBadgeSearch('');
    setPage(1);
  };

  return (
    <section style={containerStyle}>
      <div style={headerRowStyle}>
        <h1 style={{ margin: 0 }}>Browse Products</h1>
        <button
          type="button"
          onClick={handleClearAll}
          style={{
            ...clearFiltersButtonStyle,
            opacity: hasActiveFilters ? 1 : 0.5,
            cursor: hasActiveFilters ? 'pointer' : 'not-allowed',
          }}
          disabled={!hasActiveFilters}
        >
          Clear all filters
        </button>
      </div>
      <div style={filtersStyle}>
        <input
          type="search"
          placeholder="Search products…"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          inputMode="decimal"
          pattern="\d*(\.\d{0,2})?"
          placeholder="Min price"
          value={minPrice}
          onChange={handleMinChange}
          style={inputStyle}
        />
        <input
          type="text"
          inputMode="decimal"
          pattern="\d*(\.\d{0,2})?"
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

      <div style={facetRowStyle}>
        <DropdownFilter
          title="Categories"
          options={categoryOptions}
          selected={selectedCategories}
          onToggle={handleCategoryToggle}
          searchValue={categorySearch}
          onSearchChange={setCategorySearch}
          placeholder="Search categories…"
        />
        <DropdownFilter
          title="Materials"
          options={materialOptions}
          selected={selectedMaterials}
          onToggle={handleMaterialToggle}
          searchValue={materialSearch}
          onSearchChange={setMaterialSearch}
          placeholder="Search materials…"
        />
        <DropdownFilter
          title="Eco Badges"
          options={badgeOptions}
          selected={selectedBadges}
          onToggle={handleBadgeToggle}
          searchValue={badgeSearch}
          onSearchChange={setBadgeSearch}
          placeholder="Search badges…"
          renderOptionLabel={(option, query) => (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <span role="img" aria-hidden="true" style={{ fontSize: '1rem' }}>
                {option.icon}
              </span>
              <span>{highlightMatch(option.label, query)}</span>
            </span>
          )}
        />
      </div>

      {selectedBadgeDetails.length > 0 && (
        <div style={badgeRowStyle}>
          {selectedBadgeDetails.map((badge) => (
            <button
              type="button"
              key={badge.value}
              onClick={() => handleBadgeToggle(badge.value)}
              style={badgeChipStyle}
              title={badge.description || ''}
              aria-label={`Remove ${badge.label} badge filter`}
            >
              <span role="img" aria-hidden="true">{badge.icon}</span>
              <span>{badge.label}</span>
              <span style={badgeRemoveStyle}>×</span>
            </button>
          ))}
          <button
            type="button"
            onClick={handleClearBadges}
            style={clearPillStyle}
            aria-label="Clear all eco badge filters"
          >
            Clear badges
          </button>
        </div>
      )}

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
                {product.category && <span style={cardMetaStyle}>{product.category}</span>}
                {product.materials?.length > 0 && (
                  <p style={cardMaterialsStyle}>{product.materials.join(' • ')}</p>
                )}
                {product.ecoBadges?.length > 0 && (
                  <div style={cardBadgeRowStyle}>
                    {product.ecoBadges.map((badge) => (
                      <span
                        key={`${product._id}-${badge}`}
                        style={cardBadgeChipStyle}
                        title={BADGE_DESCRIPTION_MAP[badge] || ''}
                      >
                        <span role="img" aria-hidden="true">{BADGE_ICON_MAP[badge] || DEFAULT_BADGE_ICON}</span>
                        <span>{badge}</span>
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginTop: 'auto' }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>${Number(product.price).toFixed(2)}</p>
                  <button
                    type="button"
                    style={{ ...buttonStyle, flexShrink: 0 }}
                    onClick={() => handleAddToCart(product._id)}
                    disabled={lastActionStatus === 'loading'}
                  >
                    Add to Cart
                  </button>
                </div>
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

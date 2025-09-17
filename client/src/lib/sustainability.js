// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

// Shared sustainability metadata for client UI components.
export const CATEGORY_OPTIONS = [
  'Clothing',
  'Electronics',
  'Home & Living',
  'Outdoor',
  'Grocery',
  'Beauty & Personal Care',
  'Office & Stationery',
];

export const MATERIAL_OPTIONS = [
  'Organic cotton',
  'Recycled aluminum',
  'Recycled plastic',
  'Bamboo',
  'Upcycled wood',
  'Organic beans',
  'Hemp',
  'Linen',
];

export const ECO_BADGE_OPTIONS = [
  {
    value: 'Fair-trade',
    icon: '🤝',
    description: 'Certified to provide equitable pay and working conditions.',
  },
  {
    value: 'Low-waste',
    icon: '♻️',
    description: 'Designed to reduce production waste and packaging.',
  },
  {
    value: 'Carbon neutral',
    icon: '🌎',
    description: 'Offsets emissions to achieve net-zero carbon output.',
  },
  {
    value: 'Recycled content',
    icon: '🔁',
    description: 'Made using post-consumer recycled materials.',
  },
  {
    value: 'Plastic-free',
    icon: '🚫',
    description: 'Eliminates virgin plastic across product and packaging.',
  },
];

// Precompute lookup tables so UI components can resolve badge icons instantly.
export const BADGE_ICON_MAP = ECO_BADGE_OPTIONS.reduce((map, badge) => {
  map[badge.value] = badge.icon;
  return map;
}, {});

export const BADGE_DESCRIPTION_MAP = ECO_BADGE_OPTIONS.reduce((map, badge) => {
  map[badge.value] = badge.description;
  return map;
}, {});

export const DEFAULT_BADGE_ICON = '🌿';

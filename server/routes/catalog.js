// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

/**
 * Public catalog routes for browsing products.
 */
const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const asyncWrap = require('../middleware/asyncWrap');

const router = express.Router();

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const BADGE_DESCRIPTIONS = {
  'Fair-trade': 'Certified to provide equitable pay and working conditions.',
  'Low-waste': 'Designed to reduce production waste and packaging.',
  'Carbon neutral': 'Offsets emissions to achieve net-zero carbon output.',
  'Recycled content': 'Made using post-consumer recycled materials.',
};

const SORT_MAP = {
  newest: { createdAt: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
};

const toArray = (value) => {
  if (value === undefined || value === null) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.filter((entry) => typeof entry === 'string' && entry.trim().length > 0).map((entry) => entry.trim());
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    return [value.trim()];
  }
  return [];
};

const sanitizeValues = (values) =>
  values
    .filter((value) => typeof value === 'string' && value.trim().length > 0)
    .map((value) => value.trim());

const buildFacetEntries = (allValues, buckets, enrich = (value) => ({ value })) => {
  const countMap = buckets.reduce((map, entry) => {
    if (entry && entry._id) {
      map.set(entry._id, entry.count || 0);
    }
    return map;
  }, new Map());

  const uniqueValues = Array.from(new Set(allValues));

  return uniqueValues
    .map((value) => ({
      value,
      count: countMap.get(value) || 0,
      ...enrich(value),
    }))
    .sort((a, b) => a.value.localeCompare(b.value));
};

const parseNumber = (value) => {
  if (value === undefined) return undefined;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

router.get(
  '/products',
  asyncWrap(async (req, res) => {
    const {
      q,
      min,
      max,
      page = '1',
      limit = '12',
      sort = 'newest',
    } = req.query;

    const pageNumber = Math.max(Number.parseInt(page, 10) || 1, 1);
    const limitNumber = Math.min(Math.max(Number.parseInt(limit, 10) || 12, 1), 100);

    const selectedCategories = toArray(req.query.category);
    const selectedMaterials = toArray(req.query.material);
    const selectedBadges = toArray(req.query.badge);

    let searchConditions = null;
    if (q && typeof q === 'string' && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      searchConditions = [{ name: regex }, { description: regex }];
    }

    const minPrice = parseNumber(min);
    const maxPrice = parseNumber(max);

    if (min !== undefined && min !== '' && minPrice === undefined) {
      throw createHttpError(400, 'Min price must be a valid number.');
    }

    if (max !== undefined && max !== '' && maxPrice === undefined) {
      throw createHttpError(400, 'Max price must be a valid number.');
    }

    if (minPrice !== undefined && maxPrice !== undefined && maxPrice < minPrice) {
      throw createHttpError(400, 'Max price must be greater than or equal to min price.');
    }

    const priceFilter = {};
    if (minPrice !== undefined) {
      priceFilter.$gte = minPrice;
    }
    if (maxPrice !== undefined) {
      priceFilter.$lte = maxPrice;
    }
    const hasPriceFilter = Object.keys(priceFilter).length > 0;

    const buildMatch = ({ includeCategory = true, includeMaterials = true, includeBadges = true } = {}) => {
      const match = {};

      if (searchConditions) {
        match.$or = searchConditions;
      }

      if (hasPriceFilter) {
        match.price = { ...priceFilter };
      }

      if (includeCategory && selectedCategories.length > 0) {
        match.category = { $in: selectedCategories };
      }

      if (includeMaterials && selectedMaterials.length > 0) {
        match.materials = { $all: selectedMaterials };
      }

      if (includeBadges && selectedBadges.length > 0) {
        match.ecoBadges = { $all: selectedBadges };
      }

      return match;
    };

    const sortOption = SORT_MAP[sort] || SORT_MAP.newest;

    const matchFilters = buildMatch();

    const [
      products,
      total,
      categoryBuckets,
      materialBuckets,
      badgeBuckets,
      categoryValues,
      materialValues,
      badgeValues,
    ] = await Promise.all([
      Product.find(matchFilters)
        .sort(sortOption)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .lean(),
      Product.countDocuments(matchFilters),
      Product.aggregate([
        { $match: buildMatch({ includeCategory: false }) },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
      Product.aggregate([
        { $match: buildMatch({ includeMaterials: false }) },
        { $unwind: { path: '$materials', preserveNullAndEmptyArrays: false } },
        { $group: { _id: '$materials', count: { $sum: 1 } } },
      ]),
      Product.aggregate([
        { $match: buildMatch({ includeBadges: false }) },
        { $unwind: { path: '$ecoBadges', preserveNullAndEmptyArrays: false } },
        { $group: { _id: '$ecoBadges', count: { $sum: 1 } } },
      ]),
      Product.distinct('category'),
      Product.distinct('materials'),
      Product.distinct('ecoBadges'),
    ]);

    const categoriesFacet = buildFacetEntries(sanitizeValues(categoryValues), categoryBuckets, (value) => ({
      label: value,
    }));

    const materialsFacet = buildFacetEntries(sanitizeValues(materialValues), materialBuckets, (value) => ({
      label: value,
    }));

    const badgeFacetValues = sanitizeValues([
      ...badgeValues,
      ...Object.keys(BADGE_DESCRIPTIONS),
    ]);

    const badgesFacet = buildFacetEntries(badgeFacetValues, badgeBuckets, (value) => ({
      label: value,
      description: BADGE_DESCRIPTIONS[value] || '',
    }));

    return res.json({
      products,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber) || 1,
      },
      facets: {
        categories: categoriesFacet,
        materials: materialsFacet,
        badges: badgesFacet,
      },
      appliedFilters: {
        categories: selectedCategories,
        materials: selectedMaterials,
        badges: selectedBadges,
      },
    });
  })
);

router.get(
  '/products/:id',
  asyncWrap(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const product = await Product.findById(id).lean();

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    return res.json(product);
  })
);

module.exports = router;

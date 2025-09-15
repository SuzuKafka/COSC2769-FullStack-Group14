/**
 * Public catalog routes for browsing products.
 */
const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const asyncWrap = require('../middleware/asyncWrap');

const router = express.Router();

const SORT_MAP = {
  newest: { createdAt: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
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

    const filters = {};

    if (q && typeof q === 'string') {
      const regex = new RegExp(q.trim(), 'i');
      filters.$or = [{ name: regex }, { description: regex }];
    }

    const minPrice = parseNumber(min);
    const maxPrice = parseNumber(max);
    if (minPrice !== undefined || maxPrice !== undefined) {
      filters.price = {};
      if (minPrice !== undefined) {
        filters.price.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        filters.price.$lte = maxPrice;
      }
    }

    const sortOption = SORT_MAP[sort] || SORT_MAP.newest;

    const [products, total] = await Promise.all([
      Product.find(filters)
        .sort(sortOption)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .lean(),
      Product.countDocuments(filters),
    ]);

    return res.json({
      products,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber) || 1,
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

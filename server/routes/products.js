/**
 * Vendor product management routes for the COSC2769 project.
 */
const express = require('express');
const path = require('path');
const multer = require('multer');
const Product = require('../models/Product');
const asyncWrap = require('../middleware/asyncWrap');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname || '').toLowerCase();
    cb(null, `${uniqueSuffix}${extension}`);
  },
});

const imageOnly = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith('image/')) {
    return cb(null, true);
  }

  const error = new Error('Only image uploads are allowed.');
  error.status = 400;
  return cb(error);
};

const upload = multer({
  storage,
  fileFilter: imageOnly,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

router.post(
  '/',
  requireRole('vendor'),
  upload.single('image'),
  asyncWrap(async (req, res) => {
    const name = req.body?.name?.trim();
    const description = req.body?.description?.trim() || '';
    const priceValue = Number.parseFloat(req.body?.price);

    if (!name) {
      throw createHttpError(400, 'Product name is required.');
    }

    if (name.length < 10 || name.length > 20) {
      throw createHttpError(400, 'Product name must be between 10 and 20 characters.');
    }

    if (!Number.isFinite(priceValue) || priceValue <= 0) {
      throw createHttpError(400, 'Price must be a number greater than 0.');
    }

    if (description.length > 500) {
      throw createHttpError(400, 'Description must be 500 characters or fewer.');
    }

    if (!req.file) {
      throw createHttpError(400, 'Product image is required.');
    }

    const product = new Product({
      name,
      description,
      price: priceValue,
      imagePath: `/uploads/${req.file.filename}`,
      vendor: req.user.id,
    });

    await product.save();

    return res.status(201).json(product);
  })
);

const listVendorProducts = asyncWrap(async (req, res) => {
  const products = await Product.find({ vendor: req.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return res.json({ products });
});

router.get('/', requireRole('vendor'), listVendorProducts);
router.get('/my-products', requireRole('vendor'), listVendorProducts);

module.exports = router;

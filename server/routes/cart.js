/**
 * Routes handling cart session management and checkout sketch for COSC2769 project.
 */
const express = require('express');
const DistributionHub = require('../models/DistributionHub');
const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncWrap = require('../middleware/asyncWrap');
const { requireLogin } = require('../middleware/auth');

const router = express.Router();

// Ensure the session cart exists for all downstream handlers.
router.use((req, res, next) => {
  if (!Array.isArray(req.session.cart)) {
    req.session.cart = [];
  }
  next();
});

// Temporary helper to view cart contents.
router.get('/', (req, res) => {
  res.json({ cart: req.session.cart });
});

// Temporary sketch endpoint to add items to the cart.
router.post('/items', (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'productId is required.' });
  }

  const parsedQuantity = Number.parseInt(quantity, 10);
  if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
    return res.status(400).json({ error: 'Quantity must be a positive integer.' });
  }

  const existingIndex = req.session.cart.findIndex((item) => item.productId === productId);
  if (existingIndex >= 0) {
    req.session.cart[existingIndex].quantity += parsedQuantity;
  } else {
    req.session.cart.push({ productId, quantity: parsedQuantity });
  }

  return res.status(200).json({ cart: req.session.cart });
});

// Checkout sketch: selects random hub, creates an order, and clears the cart.
router.post(
  '/checkout',
  requireLogin,
  asyncWrap(async (req, res) => {
    const sessionCustomerId = req.session.user?.id;
    const bodyCustomerId = req.body?.customerId;
    const customerId = sessionCustomerId || bodyCustomerId;

    if (!customerId) {
      const err = new Error('Authentication required.');
      err.status = 401;
      throw err;
    }

    if (!Array.isArray(req.session.cart) || req.session.cart.length === 0) {
      const err = new Error('Cart is empty.');
      err.status = 400;
      throw err;
    }

    const hubSample = await DistributionHub.aggregate([{ $sample: { size: 1 } }]);
    if (!hubSample || hubSample.length === 0) {
      const err = new Error('No distribution hubs available.');
      err.status = 500;
      throw err;
    }

    const distributionHub = hubSample[0];

    const productIds = req.session.cart.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    if (products.length !== req.session.cart.length) {
      const err = new Error('One or more products could not be found.');
      err.status = 400;
      throw err;
    }

    const items = req.session.cart.map((item) => {
      const product = products.find((p) => p._id.toString() === item.productId);
      return {
        product: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      };
    });

    const order = new Order({
      customer: customerId,
      items,
      distributionHub: distributionHub._id,
    });

    await order.save();

    req.session.cart = [];

    return res.status(201).json({
      message: 'Order created.',
      orderId: order._id,
      hub: distributionHub,
    });
  })
);

module.exports = router;

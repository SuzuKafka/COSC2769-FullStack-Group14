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

const ensureCartShape = (cart) =>
  Array.isArray(cart)
    ? cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: Number.parseFloat(item.price) || 0,
        qty: Number.parseInt(item.qty ?? item.quantity ?? 0, 10) || 0,
      }))
    : [];

const calculateTotals = (cart) => {
  const items = cart.filter((item) => item.productId && item.qty > 0);
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  return {
    items,
    totalQty,
    totalPrice,
  };
};

// Ensure the session cart exists for all downstream handlers.
router.use((req, res, next) => {
  req.session.cart = ensureCartShape(req.session.cart);
  next();
});

router.get('/', (req, res) => {
  return res.json(calculateTotals(req.session.cart));
});

router.post(
  '/add',
  asyncWrap(async (req, res) => {
    const { productId, qty = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId is required.' });
    }

    const quantity = Number.parseInt(qty, 10);
    if (Number.isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'qty must be a positive integer.' });
    }

    const product = await Product.findById(productId).lean();
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const existingIndex = req.session.cart.findIndex((item) => item.productId === productId);
    if (existingIndex >= 0) {
      req.session.cart[existingIndex].qty += quantity;
      req.session.cart[existingIndex].price = product.price;
      req.session.cart[existingIndex].name = product.name;
    } else {
      req.session.cart.push({
        productId,
        name: product.name,
        price: product.price,
        qty: quantity,
      });
    }

    return res.status(200).json(calculateTotals(req.session.cart));
  })
);

router.post('/remove', (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'productId is required.' });
  }

  req.session.cart = req.session.cart.filter((item) => item.productId !== productId);

  return res.json(calculateTotals(req.session.cart));
});

router.post('/update', (req, res) => {
  const { productId, qty } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'productId is required.' });
  }

  const quantity = Number.parseInt(qty, 10);
  if (Number.isNaN(quantity) || quantity < 1) {
    return res.status(400).json({ error: 'qty must be an integer greater than or equal to 1.' });
  }

  const item = req.session.cart.find((cartItem) => cartItem.productId === productId);
  if (!item) {
    return res.status(404).json({ error: 'Item not found in cart.' });
  }

  item.qty = quantity;

  return res.json(calculateTotals(req.session.cart));
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
        quantity: item.qty,
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

// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

/**
 * Checkout route creates an order from the session cart and assigns a random hub.
 */
const express = require('express');
const mongoose = require('mongoose');
const asyncWrap = require('../middleware/asyncWrap');
const DistributionHub = require('../models/DistributionHub');
const Product = require('../models/Product');
const Order = require('../models/Order');

const router = express.Router();

const normaliseCart = (cart) =>
  Array.isArray(cart)
    ? cart
        .map((item) => ({
          productId: item.productId?.toString(),
          name: item.name,
          price: Number.parseFloat(item.price) || 0,
          qty: Number.parseInt(item.qty ?? item.quantity ?? 0, 10) || 0,
        }))
        .filter((item) => item.productId && item.qty > 0 && item.price >= 0)
    : [];

const pickRandomHub = (hubs) => {
  if (!Array.isArray(hubs) || hubs.length === 0) {
    return null;
  }

  // Uniformly pick one hub so orders spread across the seeded distribution network.
  const index = Math.floor(Math.random() * hubs.length);
  return hubs[index];
};

router.post(
  '/',
  asyncWrap(async (req, res) => {
    const sessionUser = req.session.user;
    const isCustomer = sessionUser?.role === 'customer' && sessionUser?.id;

    if (!isCustomer) {
      const err = new Error('Login as a customer to proceed with checkout.');
      err.status = 401;
      throw err;
    }

    if (!mongoose.Types.ObjectId.isValid(sessionUser.id)) {
      const err = new Error('Invalid customer account.');
      err.status = 400;
      throw err;
    }

    const cartItems = normaliseCart(req.session.cart);
    if (cartItems.length === 0) {
      const err = new Error('Cart is empty.');
      err.status = 400;
      throw err;
    }

    const hasInvalidProductIds = cartItems.some(
      (item) => !mongoose.Types.ObjectId.isValid(item.productId)
    );

    if (hasInvalidProductIds) {
      const err = new Error('Cart contains invalid products.');
      err.status = 400;
      throw err;
    }

    const hubs = await DistributionHub.find().lean();
    const selectedHub = pickRandomHub(hubs);
    if (!selectedHub) {
      const err = new Error('No distribution hubs available.');
      err.status = 503;
      throw err;
    }

    const uniqueProductIds = [...new Set(cartItems.map((item) => item.productId))];
    const productObjectIds = uniqueProductIds.map((id) => new mongoose.Types.ObjectId(id));
    const products = await Product.find({ _id: { $in: productObjectIds } }).lean();
    const productMap = new Map(products.map((product) => [product._id.toString(), product]));

    if (productMap.size !== uniqueProductIds.length) {
      const err = new Error('One or more products in the cart are unavailable.');
      err.status = 400;
      throw err;
    }

    const lineItems = cartItems.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        const err = new Error('One or more products in the cart are unavailable.');
        err.status = 400;
        throw err;
      }

      return {
        productId: product._id.toString(),
        name: product.name,
        price: product.price,
        qty: item.qty,
      };
    });

    const totalPrice = lineItems.reduce((sum, item) => sum + item.price * item.qty, 0);

    const order = await Order.create({
      customer: new mongoose.Types.ObjectId(sessionUser.id),
      distributionHub: selectedHub._id,
      status: 'active',
      items: lineItems.map((item) => ({
        product: new mongoose.Types.ObjectId(item.productId),
        quantity: item.qty,
        priceAtPurchase: item.price,
      })),
      total: totalPrice,
    });

    req.session.cart = [];

    return res.status(201).json({
      ok: true,
      orderId: order._id,
      hubName: selectedHub.name,
    });
  })
);

module.exports = router;

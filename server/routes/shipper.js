// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Ryota Suzuki
 * ID: s4075375
 *
 * Routes for shippers managing hub orders.
 */
const express = require('express');
const mongoose = require('mongoose');
const asyncWrap = require('../middleware/asyncWrap');
const { requireRole } = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');
const { createNotification } = require('../lib/notifications');

const router = express.Router();

const ensureObjectId = (value) =>
  mongoose.Types.ObjectId.isValid(value) ? new mongoose.Types.ObjectId(value) : null;

// Load the hub assigned to the authenticated shipper.
const loadShipperHub = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }

  const user = await User.findById(userId).select('shipperProfile.hub').lean();
  const hubId = user?.shipperProfile?.hub;
  return hubId ? hubId.toString() : null;
};

router.get(
  '/orders',
  requireRole('shipper'),
  asyncWrap(async (req, res) => {
    const hubId = await loadShipperHub(req.user.id);
    if (!hubId) {
      const err = new Error('Shipper is not assigned to a hub.');
      err.status = 400;
      throw err;
    }

    const hubObjectId = ensureObjectId(hubId);

    const orders = await Order.find({
      status: { $in: ['active', 'shipped'] },
      distributionHub: hubObjectId,
    })
      .populate({
        path: 'customer',
        select: 'username profileImagePath customerProfile.name customerProfile.defaultAddress',
      })
      .populate({ path: 'items.product', select: 'name description' })
      .populate({ path: 'distributionHub', select: 'name address' })
      .sort({ createdAt: -1 })
      .lean();

    // Flatten populated refs so the client receives ready-to-render JSON.
    const mappedOrders = orders.map((order) => ({
      ...order,
      customer: order.customer
        ? {
            id: order.customer._id.toString(),
            username: order.customer.username,
            name: order.customer.customerProfile?.name,
            address: order.customer.customerProfile?.defaultAddress,
          }
        : null,
      hub: order.distributionHub
        ? {
            id: order.distributionHub._id.toString(),
            name: order.distributionHub.name,
            address: order.distributionHub.address,
          }
        : null,
      items: order.items?.map((item) => ({
        productId: item.product && item.product._id ? item.product._id.toString() : item.product?.toString(),
        name: item.product?.name || item.name || 'Unknown product',
        description: item.product?.description,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
      })),
    }));

    return res.json({ ok: true, hubId, orders: mappedOrders });
  })
);

router.put(
  '/orders/:id/status',
  requireRole('shipper'),
  asyncWrap(async (req, res) => {
    const { status } = req.body;
    const allowedStatuses = ['shipped', 'delivered', 'canceled'];
    if (!allowedStatuses.includes(status)) {
      const err = new Error('Invalid status.');
      err.status = 400;
      throw err;
    }

    const orderId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      const err = new Error('Invalid order id.');
      err.status = 400;
      throw err;
    }

    const hubId = await loadShipperHub(req.user.id);
    if (!hubId) {
      const err = new Error('Shipper is not assigned to a hub.');
      err.status = 400;
      throw err;
    }

    const hubObjectId = ensureObjectId(hubId);

    const order = await Order.findOne({
      _id: orderId,
      distributionHub: hubObjectId,
      status: { $in: ['active', 'shipped'] },
    });

    if (!order) {
      const err = new Error('Order not found or cannot be updated.');
      err.status = 404;
      throw err;
    }

    const shipperId = ensureObjectId(req.user.id);
    if (!shipperId) {
      const err = new Error('Invalid shipper account.');
      err.status = 400;
      throw err;
    }

    order.status = status;
    order.assignedShipper = shipperId;

    if (status === 'shipped') {
      order.shippedAt = new Date();
      order.canceledAt = undefined;
    } else if (status === 'delivered') {
      order.deliveredAt = new Date();
      order.canceledAt = undefined;
      if (!order.shippedAt) {
        order.shippedAt = new Date();
      }
    } else if (status === 'canceled') {
      order.canceledAt = new Date();
      order.deliveredAt = undefined;
    }

    await order.save();
    const orderIdString = order._id.toString();
    const orderShortId = `#${orderIdString.slice(-6).toUpperCase()}`;

    if (order.customer) {
      let title = null;
      let message = null;
      if (status === 'shipped') {
        title = 'Order shipped';
        message = `Your order ${orderShortId} has been shipped and is on the way.`;
      } else if (status === 'delivered') {
        title = 'Order delivered';
        message = `Your order ${orderShortId} was delivered. Enjoy your items!`;
      }

      if (title && message) {
        await createNotification({
          userId: order.customer,
          title,
          message,
          link: '/account',
          metadata: {
            orderId: orderIdString,
            status,
          },
        });
      }
    }

    return res.json({ ok: true, order: order.toObject() });
  })
);

module.exports = router;

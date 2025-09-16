/**
 * Routes for shippers managing hub orders.
 */
const express = require('express');
const mongoose = require('mongoose');
const asyncWrap = require('../middleware/asyncWrap');
const { requireRole } = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');

const router = express.Router();

const ensureObjectId = (value) =>
  mongoose.Types.ObjectId.isValid(value) ? new mongoose.Types.ObjectId(value) : null;

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
      status: 'active',
      distributionHub: hubObjectId,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ ok: true, hubId, orders });
  })
);

router.put(
  '/orders/:id/status',
  requireRole('shipper'),
  asyncWrap(async (req, res) => {
    const { status } = req.body;
    const allowedStatuses = ['delivered', 'canceled'];
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
      status: 'active',
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

    if (status === 'delivered') {
      order.deliveredAt = new Date();
      order.canceledAt = undefined;
    } else if (status === 'canceled') {
      order.canceledAt = new Date();
      order.deliveredAt = undefined;
    }

    await order.save();

    return res.json({ ok: true });
  })
);

module.exports = router;

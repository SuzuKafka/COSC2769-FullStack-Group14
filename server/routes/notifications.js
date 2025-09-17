// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

/**
 * Notification routes allowing authenticated users to retrieve and manage alerts.
 */
const express = require('express');
const mongoose = require('mongoose');
const asyncWrap = require('../middleware/asyncWrap');
const { requireLogin } = require('../middleware/auth');
const Notification = require('../models/Notification');

const router = express.Router();

const mapNotification = (notification) => ({
  id: notification._id.toString(),
  title: notification.title,
  message: notification.message,
  link: notification.link || null,
  read: Boolean(notification.read),
  createdAt: notification.createdAt,
  metadata: notification.metadata || null,
});

router.get(
  '/',
  requireLogin,
  asyncWrap(async (req, res) => {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.json({ notifications: notifications.map(mapNotification) });
  })
);

router.patch(
  '/:id/read',
  requireLogin,
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error('Invalid notification id.');
      err.status = 400;
      throw err;
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { read: true },
      { new: true }
    ).lean();

    if (!notification) {
      const err = new Error('Notification not found.');
      err.status = 404;
      throw err;
    }

    return res.json({ ok: true, notification: mapNotification(notification) });
  })
);

router.post(
  '/read-all',
  requireLogin,
  asyncWrap(async (req, res) => {
    await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
    return res.json({ ok: true });
  })
);

module.exports = router;

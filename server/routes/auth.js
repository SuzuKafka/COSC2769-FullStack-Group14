/**
 * Routes handling user authentication for the COSC2769 Full Stack project.
 */
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const asyncWrap = require('../middleware/asyncWrap');

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const router = express.Router();

router.post(
  '/register',
  asyncWrap(async (req, res) => {
    const {
      username,
      password,
      role,
      vendorProfile,
      shipperProfile,
      customerProfile,
    } = req.body;

    if (!username || !password || !role) {
      throw createHttpError(400, 'Username, password, and role are required.');
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw createHttpError(409, 'Username already taken.');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userData = {
      username,
      passwordHash,
      role,
    };

    if (role === 'vendor') {
      if (!vendorProfile?.companyName) {
        throw createHttpError(400, 'Vendor requires vendorProfile.companyName.');
      }
      userData.vendorProfile = {
        companyName: vendorProfile.companyName,
        contactEmail: vendorProfile.contactEmail,
      };
    }

    if (role === 'shipper') {
      if (!shipperProfile?.licenseNumber || !shipperProfile?.hub) {
        throw createHttpError(
          400,
          'Shipper requires shipperProfile.licenseNumber and shipperProfile.hub.'
        );
      }
      userData.shipperProfile = {
        licenseNumber: shipperProfile.licenseNumber,
        hub: shipperProfile.hub,
      };
    }

    if (role === 'customer' && customerProfile) {
      userData.customerProfile = {
        defaultAddress: customerProfile.defaultAddress,
      };
    }

    if (req.body.profileImagePath) {
      userData.profileImagePath = req.body.profileImagePath;
    }

    const user = new User(userData);
    await user.save();

    req.session.user = {
      id: user._id.toString(),
      username: user.username,
      role: user.role,
    };

    return res.status(201).json({ id: user._id, username: user.username, role: user.role });
  })
);

router.post(
  '/login',
  asyncWrap(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      throw createHttpError(400, 'Username and password are required.');
    }

    const user = await User.findOne({ username });
    if (!user) {
      throw createHttpError(401, 'Invalid credentials.');
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw createHttpError(401, 'Invalid credentials.');
    }

    req.session.user = {
      id: user._id.toString(),
      username: user.username,
      role: user.role,
    };

    return res.json({ id: user._id, username: user.username, role: user.role });
  })
);

router.get(
  '/me',
  asyncWrap(async (req, res) => {
    if (!req.session.user?.id) {
      throw createHttpError(401, 'Not authenticated.');
    }

    const user = await User.findById(req.session.user.id).select('-passwordHash').lean();
    if (!user) {
      throw createHttpError(401, 'Session invalid.');
    }

    return res.json(user);
  })
);

router.post('/logout', (req, res, next) => {
  if (!req.session) {
    return res.status(204).end();
  }

  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }

    res.clearCookie('connect.sid');
    return res.status(204).end();
  });
});

module.exports = router;

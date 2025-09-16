/**
 * Routes handling user authentication for the COSC2769 Full Stack project.
 */
const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/User');
const DistributionHub = require('../models/DistributionHub');
const asyncWrap = require('../middleware/asyncWrap');

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const router = express.Router();

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

const ensureMinLength = (value, fieldName, min = 5) => {
  if (!value || value.trim().length < min) {
    throw createHttpError(400, `${fieldName} must be at least ${min} characters.`);
  }
  return value.trim();
};

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

    if (!PASSWORD_REGEX.test(password)) {
      throw createHttpError(
        400,
        'Password must be 8-20 characters and include upper, lower, digit, and !@#$%^&*.'
      );
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
      const companyName = ensureMinLength(
        vendorProfile?.companyName,
        'vendorProfile.companyName'
      );
      userData.vendorProfile = {
        companyName,
        contactEmail: vendorProfile.contactEmail,
      };
    }

    if (role === 'shipper') {
      const licenseNumber = ensureMinLength(
        shipperProfile?.licenseNumber,
        'shipperProfile.licenseNumber'
      );

      if (!shipperProfile?.hub) {
        throw createHttpError(
          400,
          'Shipper requires shipperProfile.hub.'
        );
      }
      if (!mongoose.Types.ObjectId.isValid(shipperProfile.hub)) {
        throw createHttpError(400, 'shipperProfile.hub must be a valid id.');
      }

      const hubExists = await DistributionHub.exists({ _id: shipperProfile.hub });
      if (!hubExists) {
        throw createHttpError(400, 'Selected hub does not exist.');
      }
      userData.shipperProfile = {
        licenseNumber,
        hub: shipperProfile.hub,
      };
    }

    if (role === 'customer' && customerProfile) {
      if (customerProfile.defaultAddress) {
        ensureMinLength(customerProfile.defaultAddress, 'customerProfile.defaultAddress');
      }
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

router.get(
  '/hubs',
  asyncWrap(async (req, res) => {
    const hubs = await DistributionHub.find().select('name address').sort({ name: 1 }).lean();
    return res.json({ hubs });
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

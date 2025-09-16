/**
 * Routes handling user authentication for the COSC2769 Full Stack project.
 */
const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
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

const uploadsDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '') || '.jpg';
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${name}${ext}`);
  },
});

const imageOnly = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith('image/')) {
    return cb(null, true);
  }
  const err = createHttpError(400, 'Only image uploads are allowed.');
  return cb(err);
};

const uploadProfileImage = multer({ storage, fileFilter: imageOnly });

const trimValue = (value) => (typeof value === 'string' ? value.trim() : '');

router.post(
  '/register',
  uploadProfileImage.single('profileImage'),
  asyncWrap(async (req, res) => {
    const {
      username,
      password,
      role,
    } = req.body;

    const trimmedUsername = trimValue(username);
    const trimmedRole = trimValue(role).toLowerCase();

    if (!trimmedUsername || !password || !trimmedRole) {
      throw createHttpError(400, 'Username, password, and role are required.');
    }

    if (!/^[a-zA-Z0-9]+$/.test(trimmedUsername) || trimmedUsername.length < 8 || trimmedUsername.length > 15) {
      throw createHttpError(400, 'Username must be alphanumeric and 8-15 characters long.');
    }

    if (!PASSWORD_REGEX.test(password)) {
      throw createHttpError(
        400,
        'Password must be 8-20 characters and include upper, lower, digit, and !@#$%^&*.'
      );
    }

    const existingUser = await User.findOne({ username: trimmedUsername });
    if (existingUser) {
      throw createHttpError(409, 'Username already taken.');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userData = {
      username: trimmedUsername,
      passwordHash,
      role: trimmedRole,
    };

    if (!req.file) {
      throw createHttpError(400, 'Profile image is required.');
    }
    userData.profileImagePath = `/uploads/${req.file.filename}`;

    if (trimmedRole === 'vendor') {
      const companyName = ensureMinLength(req.body.vendorCompanyName, 'vendorProfile.companyName');
      const businessAddress = ensureMinLength(
        req.body.vendorBusinessAddress,
        'vendorProfile.businessAddress'
      );
      const contactEmail = trimValue(req.body.vendorContactEmail);
      userData.vendorProfile = {
        companyName,
        businessAddress,
        contactEmail,
      };
    }

    if (trimmedRole === 'customer') {
      const customerName = ensureMinLength(req.body.customerName, 'customerProfile.name');
      const customerAddress = ensureMinLength(
        req.body.customerAddress,
        'customerProfile.defaultAddress'
      );
      userData.customerProfile = {
        name: customerName,
        defaultAddress: customerAddress,
      };
    }

    if (trimmedRole === 'shipper') {
      const licenseNumber = ensureMinLength(
        req.body.shipperLicenseNumber,
        'shipperProfile.licenseNumber'
      );

      const hubId = trimValue(req.body.shipperHub);
      if (!hubId) {
        throw createHttpError(400, 'Shipper requires shipperProfile.hub.');
      }
      if (!mongoose.Types.ObjectId.isValid(hubId)) {
        throw createHttpError(400, 'shipperProfile.hub must be a valid id.');
      }

      const hubExists = await DistributionHub.exists({ _id: hubId });
      if (!hubExists) {
        throw createHttpError(400, 'Selected hub does not exist.');
      }
      userData.shipperProfile = {
        licenseNumber,
        hub: hubId,
      };
    }

    if (!['vendor', 'customer', 'shipper'].includes(trimmedRole)) {
      throw createHttpError(400, 'Invalid role.');
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

/**
 * Routes handling user authentication for the COSC2769 Full Stack project.
 */
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const {
      username,
      password,
      role,
      vendorProfile,
      shipperProfile,
      customerProfile,
    } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Username, password, and role are required.' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userData = {
      username,
      passwordHash,
      role,
    };

    if (role === 'vendor') {
      if (!vendorProfile?.companyName) {
        return res.status(400).json({ message: 'Vendor requires vendorProfile.companyName.' });
      }
      userData.vendorProfile = {
        companyName: vendorProfile.companyName,
        contactEmail: vendorProfile.contactEmail,
      };
    }

    if (role === 'shipper') {
      if (!shipperProfile?.licenseNumber || !shipperProfile?.hub) {
        return res
          .status(400)
          .json({ message: 'Shipper requires shipperProfile.licenseNumber and shipperProfile.hub.' });
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

    req.session.userId = user._id.toString();
    req.session.role = user.role;

    return res.status(201).json({ id: user._id, username: user.username, role: user.role });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to register user.', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    req.session.userId = user._id.toString();
    req.session.role = user.role;

    return res.json({ id: user._id, username: user.username, role: user.role });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to login.', error: error.message });
  }
});

router.get('/me', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }

    const user = await User.findById(req.session.userId).select('-passwordHash').lean();
    if (!user) {
      return res.status(401).json({ message: 'Session invalid.' });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch user.', error: error.message });
  }
});

router.post('/logout', (req, res) => {
  if (!req.session) {
    return res.status(204).end();
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to logout.' });
    }

    res.clearCookie('connect.sid');
    return res.status(204).end();
  });
});

module.exports = router;

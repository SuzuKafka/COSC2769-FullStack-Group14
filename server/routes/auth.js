/**
 * Routes handling user authentication for the COSC2769 Full Stack project.
 */
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Username, password, and role are required.' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({ username, passwordHash, role });
    await user.save();

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

    return res.json({ id: user._id, username: user.username, role: user.role });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to login.', error: error.message });
  }
});

module.exports = router;

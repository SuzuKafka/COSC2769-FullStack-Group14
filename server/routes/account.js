/**
 * Account routes for retrieving and updating profile information.
 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const asyncWrap = require('../middleware/asyncWrap');
const { requireLogin } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

const uploadsDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    const basename = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${basename}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    const err = new Error('Only image uploads are allowed.');
    err.status = 400;
    return cb(err);
  }
  return cb(null, true);
};

const upload = multer({ storage, fileFilter });

router.get(
  '/me',
  requireLogin,
  asyncWrap(async (req, res) => {
    const user = await User.findById(req.user.id).select('-passwordHash').lean();
    if (!user) {
      const err = new Error('User not found.');
      err.status = 404;
      throw err;
    }

    return res.json(user);
  })
);

router.put(
  '/profile-image',
  requireLogin,
  upload.single('image'),
  asyncWrap(async (req, res) => {
    if (!req.file) {
      const err = new Error('Image file is required.');
      err.status = 400;
      throw err;
    }

    const profileImagePath = `/uploads/${req.file.filename}`;
    const user = await User.findById(req.user.id);

    if (!user) {
      const err = new Error('User not found.');
      err.status = 404;
      throw err;
    }

    user.profileImagePath = profileImagePath;
    await user.save();

    return res.json({ ok: true, profileImagePath });
  })
);

module.exports = router;

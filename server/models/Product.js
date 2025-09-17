// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

const mongoose = require('mongoose');

const { Schema } = mongoose;

// Enforces marketplace-specific validation rules for vendor listings.
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 20,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: (value) => value > 0,
        message: 'Price must be greater than 0.',
      },
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    materials: {
      type: [String],
      default: [],
      set: (materials) =>
        Array.isArray(materials)
          ? materials.map((entry) => entry && entry.trim()).filter(Boolean)
          : [],
    },
    ecoBadges: {
      type: [String],
      default: [],
      set: (badges) =>
        Array.isArray(badges)
          ? badges.map((entry) => entry && entry.trim()).filter(Boolean)
          : [],
    },
    imagePath: {
      type: String,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hub: {
      type: Schema.Types.ObjectId,
      ref: 'DistributionHub',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);

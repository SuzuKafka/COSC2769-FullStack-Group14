// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

/**
 * Mongoose schema for platform users, handling role-specific profiles.
 */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 8,
      maxlength: 15,
      match: [/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric'],
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['customer', 'vendor', 'shipper'],
    },
    profileImagePath: {
      type: String,
    },
    customerProfile: {
      name: {
        type: String,
        trim: true,
      },
      defaultAddress: {
        type: String,
      },
    },
    vendorProfile: {
      companyName: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
      },
      businessAddress: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
      },
      contactEmail: {
        type: String,
        lowercase: true,
        trim: true,
      },
    },
    shipperProfile: {
      licenseNumber: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
      },
      hub: {
        type: Schema.Types.ObjectId,
        ref: 'DistributionHub',
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('validate', function preValidate(next) {
  if (this.role === 'vendor') {
    if (!this.vendorProfile?.companyName) {
      return next(new Error('Vendor profile requires companyName.'));
    }
    if (!this.vendorProfile?.businessAddress) {
      return next(new Error('Vendor profile requires businessAddress.'));
    }
  }

  if (this.role === 'shipper' && !this.shipperProfile?.licenseNumber) {
    return next(new Error('Shipper profile requires licenseNumber.'));
  }

  if (this.role === 'customer') {
    if (!this.customerProfile?.name) {
      return next(new Error('Customer profile requires name.'));
    }
    if (!this.customerProfile?.defaultAddress) {
      return next(new Error('Customer profile requires defaultAddress.'));
    }
  }

  return next();
});

module.exports = mongoose.model('User', userSchema);

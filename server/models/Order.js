// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    priceAtPurchase: {
      type: Number,
      required: true,
      validate: {
        validator: (value) => value > 0,
        message: 'Item price must be greater than 0.',
      },
    },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: 'Order must include at least one item.',
      },
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'shipped', 'delivered', 'canceled'],
      default: 'active',
    },
    distributionHub: {
      type: Schema.Types.ObjectId,
      ref: 'DistributionHub',
    },
    assignedShipper: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    placedAt: {
      type: Date,
      default: Date.now,
    },
    shippedAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    canceledAt: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre('validate', function preValidate(next) {
  if (!this.items || this.items.length === 0) {
    return next(new Error('Order must include at least one item.'));
  }

  this.total = this.items.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  );

  return next();
});

module.exports = mongoose.model('Order', orderSchema);

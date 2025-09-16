// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

#!/usr/bin/env node
/* eslint-disable no-console */
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// Load env from project root if available
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });
dotenv.config();

const DistributionHub = require('../models/DistributionHub');
const User = require('../models/User');
const Product = require('../models/Product');

async function connect() {
  const { MONGODB_URI } = process.env;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI must be set to run the seed script.');
  }
  await mongoose.connect(MONGODB_URI);
}

async function seedHubs() {
  const hubs = [
    {
      name: 'Ho Chi Minh City Hub',
      address: '12 Nguyen Hue, District 1, Ho Chi Minh City',
      contactNumber: '+84 28 1234 5678',
    },
    {
      name: 'Da Nang Logistics Center',
      address: '88 Tran Phu, Hai Chau, Da Nang',
      contactNumber: '+84 236 8765 4321',
    },
    {
      name: 'Hanoi Distribution Hub',
      address: '45 Le Duan, Hoan Kiem, Hanoi',
      contactNumber: '+84 24 2345 6789',
    },
  ];

  await DistributionHub.deleteMany({});
  const created = await DistributionHub.insertMany(hubs);
  return created;
}

async function seedUsers(hubs) {
  await User.deleteMany({});

  const password = await bcrypt.hash('Password123', 10);

  const [vendor, shipper, customer] = await User.insertMany([
    {
      username: 'vendordemo',
      passwordHash: password,
      role: 'vendor',
      vendorProfile: {
        companyName: 'Demo Goods Co.',
        businessAddress: '12 Vendor Plaza, District 1, Ho Chi Minh City',
        contactEmail: 'vendor@example.com',
      },
    },
    {
      username: 'shipperdemo',
      passwordHash: password,
      role: 'shipper',
      shipperProfile: {
        licenseNumber: 'SHIPPER123',
        hub: hubs[0]._id,
      },
    },
    {
      username: 'customerdemo',
      passwordHash: password,
      role: 'customer',
      customerProfile: {
        name: 'Customer Demo',
        defaultAddress: '101 Sample St, District 3, Ho Chi Minh City',
      },
    },
  ]);

  return { vendor, shipper, customer };
}

async function seedProducts(vendor) {
  await Product.deleteMany({});

  const products = [
    {
      name: 'Viet Coffee Beans',
      description: 'Rich and aromatic beans sourced from Vietnam highlands.',
      price: 15.5,
      vendor: vendor._id,
      imagePath: '/uploads/sample-coffee.jpg',
    },
    {
      name: 'Bamboo Weave Basket',
      description: 'Eco-friendly basket made by local artisans.',
      price: 22.0,
      vendor: vendor._id,
      imagePath: '/uploads/sample-basket.jpg',
    },
  ];

  return Product.insertMany(products);
}

async function main() {
  try {
    await connect();
    console.log('Connected to MongoDB');

    const hubs = await seedHubs();
    console.log(`Seeded ${hubs.length} distribution hubs.`);

    const { vendor, shipper, customer } = await seedUsers(hubs);
    console.log('Seeded vendor, shipper, and customer accounts (password: Password123).');

    const products = await seedProducts(vendor);
    console.log(`Seeded ${products.length} products for vendor ${vendor.username}.`);

    console.log('Seed complete.');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

main();

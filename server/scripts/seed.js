#!/usr/bin/env node
// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375
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
      name: 'Organic Cotton Tee',
      description: 'Breathable crewneck tee woven from certified organic cotton.',
      price: 29.5,
      vendor: vendor._id,
      imagePath: '/uploads/sample-tee.jpg',
      category: 'Clothing',
      materials: ['Organic cotton'],
      ecoBadges: ['Fair-trade', 'Low-waste'],
    },
    {
      name: 'Recycled Alu Riser',
      description: 'Ergonomic laptop riser crafted from post-consumer recycled aluminium.',
      price: 54.0,
      vendor: vendor._id,
      imagePath: '/uploads/sample-stand.jpg',
      category: 'Electronics',
      materials: ['Recycled aluminum'],
      ecoBadges: ['Low-waste', 'Carbon neutral'],
    },
    {
      name: 'Bamboo Picnic Set',
      description: 'Cutlery and plates made from fast-growing bamboo and recycled plastics.',
      price: 32.0,
      vendor: vendor._id,
      imagePath: '/uploads/sample-basket.jpg',
      category: 'Home & Living',
      materials: ['Bamboo', 'Recycled plastic'],
      ecoBadges: ['Low-waste'],
    },
    {
      name: 'Upcycled Wood Box',
      description: 'Planter storage box built from reclaimed hardwood offcuts.',
      price: 26.5,
      vendor: vendor._id,
      imagePath: '/uploads/sample-planter.jpg',
      category: 'Outdoor',
      materials: ['Upcycled wood'],
      ecoBadges: ['Recycled content'],
    },
    {
      name: 'Recycled Plastic Bin',
      description: 'Durable storage bin moulded from 100% recycled plastic.',
      price: 18.5,
      vendor: vendor._id,
      imagePath: '/uploads/sample-crate.jpg',
      category: 'Home & Living',
      materials: ['Recycled plastic'],
      ecoBadges: ['Recycled content', 'Low-waste'],
    },
    {
      name: 'Fair Coffee Beans',
      description: 'Shade-grown beans sourced through certified fair-trade cooperatives.',
      price: 17.5,
      vendor: vendor._id,
      imagePath: '/uploads/sample-coffee.jpg',
      category: 'Grocery',
      materials: ['Organic beans'],
      ecoBadges: ['Fair-trade'],
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

// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load the local env first, then fall back to process defaults for CI environments.
dotenv.config({ path: path.join(__dirname, '..', '.env') });

dotenv.config();

async function run() {
  try {
    console.log('Attempting connection to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connection successful.');
  } catch (error) {
    console.error('Connection failed:', error.message);
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

run();

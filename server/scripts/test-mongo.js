const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

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

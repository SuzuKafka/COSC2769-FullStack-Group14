const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRouter = require('./routes/auth');

// Load environment variables
dotenv.config();

const app = express();
const isDevelopment = process.env.NODE_ENV === 'development';

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRouter);

if (isDevelopment) {
  // Temporary seeding utilities accessible only in development.
  const devRouter = require('./routes/dev');
  app.use('/api/dev', devRouter);
}

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Server running' });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

async function startServer() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined.');
    }
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();

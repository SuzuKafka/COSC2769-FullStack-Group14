const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
const authRouter = require('./routes/auth');
const cartRouter = require('./routes/cart');

// Load environment variables
dotenv.config();

const app = express();
const isDevelopment = process.env.NODE_ENV === 'development';
const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET || 'development_secret';
const PORT = process.env.PORT || 4000;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined.');
}

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      httpOnly: true,
      secure: !isDevelopment,
      sameSite: isDevelopment ? 'lax' : 'none',
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);

if (isDevelopment) {
  // Temporary seeding utilities accessible only in development.
  const devRouter = require('./routes/dev');
  app.use('/api/dev', devRouter);
}

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Server running' });
});

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);

  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    status = 400;
    message = err.message;
  } else if (err.code === 11000) {
    status = 409;
    const duplicateField = Object.keys(err.keyValue || {})[0];
    message = duplicateField ? `Duplicate value for ${duplicateField}.` : 'Duplicate key error.';
  }

  res.status(status).json({ error: message });
});

async function startServer() {
  try {
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

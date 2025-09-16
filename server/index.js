const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const authRouter = require('./routes/auth');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');
const productRouter = require('./routes/products');
const catalogRouter = require('./routes/catalog');
const shipperRouter = require('./routes/shipper');
const accountRouter = require('./routes/account');

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

const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

if (!isDevelopment) {
  app.set('trust proxy', 1);
}

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsDir));

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
app.use('/api/checkout', checkoutRouter);
app.use('/api/products', productRouter);
app.use('/api/catalog', catalogRouter);
app.use('/api/shipper', shipperRouter);
app.use('/api/account', accountRouter);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Server running' });
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

const clientBuildPath = path.join(__dirname, 'public', 'client');

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'Not Found' });
    }

    return res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

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

  if (!isDevelopment && status >= 500) {
    message = 'Internal Server Error';
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

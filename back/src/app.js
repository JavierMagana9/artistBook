const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Solo cargar dotenv en desarrollo
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  const path = require('path');
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

console.log('Environment check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL);

// Inicializar la aplicación Express
const app = express();

// Configurar middlewares básicos
const defaultAllowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:4200',
  'https://artist-book.vercel.app'
];

const allowedOrigins = [
  ...defaultAllowedOrigins,
  ...(process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
];

const isAllowedVercelPreview = (origin) => (
  process.env.NODE_ENV === 'production'
  && /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)
);

const corsOptions = {
  origin(origin, callback) {
    // Allow server-to-server requests and local tools that do not send an Origin header.
    if (!origin || allowedOrigins.includes(origin) || isAllowedVercelPreview(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Artist Book API is running' });
});

// Import routes
const userRoutes = require('./routes/users');
const entryRoutes = require('./routes/entries');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/entries', entryRoutes);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

module.exports = app;
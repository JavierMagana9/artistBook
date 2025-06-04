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
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CORS_ORIGIN 
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4200'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
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
/*const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const patientRoutes = require("./routes/patient");
// above for paitent profile new route 
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(compression());

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ ADD THIS (fallback - ensures no CORS block)
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 1000,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts, please try again after 15 minutes.' }
});

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CareCell API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV
  });
});

// API Routes
// above 2 for sceme and donation 
app.use('/api/schemes', require('./routes/schemes'));
//import schemeRoutes from './routes/schemes.js';
//app.use('/api/schemes', schemeRoutes);
app.use("/api/patient", patientRoutes);
//above route for [aitent profile ]

app.use("/api/healthcard", require("./routes/healthcard"));
//above 1 is for health card
app.use('/api/donations', require('./routes/donations'));
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/patient', require('./routes/patient'));
app.use('/api/donors', require('./routes/donors'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/blood-requests', require('./routes/bloodRequests'));
app.use('/api/treatments', require('./routes/treatments'));
//app.use('/api/nutrition', require('./routes/nutrition'));
//app.use('/api/schemes', require('./routes/schemes'));
//app.use('/api/checkin', require('./routes/checkin'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/emergency', require('./routes/emergency'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n🏥 CareCell API Server running on port ${PORT} [${process.env.NODE_ENV}]`);
  console.log(`📡 Health: http://localhost:${PORT}/api/health\n`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

module.exports = app;*/


//new code for deployment 
/*
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const patientRoutes = require("./routes/patient");
// above for paitent profile new route 
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(compression());

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ ADD THIS (fallback - ensures no CORS block)
app.use(cors());

app.use('/api/vitals', require('./routes/vitals'));
app.use('/api/stemcell', require('./routes/stemcell'));
//above 2 are for 

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 1000,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts, please try again after 15 minutes.' }
});

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CareCell API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV
  });
});

// API Routes
// above 2 for sceme and donation 
app.use('/api/schemes', require('./routes/schemes'));
//import schemeRoutes from './routes/schemes.js';
//app.use('/api/schemes', schemeRoutes);
app.use("/api/patient", patientRoutes);
//above route for [aitent profile ]

app.use("/api/healthcard", require("./routes/healthcard"));
//above 1 is for health card
app.use('/api/donations', require('./routes/donations'));
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/patient', require('./routes/patient'));
app.use('/api/donors', require('./routes/donors'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/blood-requests', require('./routes/bloodRequests'));
app.use('/api/treatments', require('./routes/treatments'));
//app.use('/api/nutrition', require('./routes/nutrition'));
//app.use('/api/schemes', require('./routes/schemes'));
//app.use('/api/checkin', require('./routes/checkin'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/emergency', require('./routes/emergency'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n🏥 CareCell API Server running on port ${PORT} [${process.env.NODE_ENV}]`);
  console.log(`📡 Health: http://localhost:${PORT}/api/health\n`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

module.exports = app;
*/


//above code is working with deploymetn

//new changes for testing 

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const patientRoutes = require("./routes/patient");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// =========================
// SECURITY MIDDLEWARE
// =========================
app.use(helmet());
app.use(mongoSanitize());
app.use(compression());

// =========================
// ✅ FIXED CORS (IMPORTANT)
// =========================
const allowedOrigins = [
  'http://localhost:3000',
  'https://comfortable-upliftment-production.up.railway.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman / mobile apps

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// =========================
// ROUTES (NEW)
// =========================
app.use('/api/vitals', require('./routes/vitals'));
app.use('/api/stemcell', require('./routes/stemcell'));

// =========================
// RATE LIMITING
// =========================
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 1000,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Auth limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts, try again later.' }
});

// =========================
// BODY PARSER
// =========================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =========================
// LOGGER
// =========================
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// =========================
// HEALTH CHECK
// =========================
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CareCell API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV
  });
});

// =========================
// API ROUTES
// =========================
//new below 1 api for paitent matches 
app.use('/api/patient-matches', require('./routes/patientMatches'));
app.use('/api/schemes', require('./routes/schemes'));
app.use("/api/patient", patientRoutes);
app.use("/api/healthcard", require("./routes/healthcard"));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/patient', require('./routes/patient'));
app.use('/api/donors', require('./routes/donors'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/blood-requests', require('./routes/bloodRequests'));
app.use('/api/treatments', require('./routes/treatments'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/emergency', require('./routes/emergency'));

// =========================
// 404 HANDLER
// =========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// =========================
// GLOBAL ERROR HANDLER
// =========================
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// =========================
// SERVER START
// =========================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n🏥 CareCell API running on port ${PORT} [${process.env.NODE_ENV}]`);
  console.log(`📡 Health: http://localhost:${PORT}/api/health\n`);
});

// =========================
// UNHANDLED REJECTION
// =========================
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

module.exports = app;








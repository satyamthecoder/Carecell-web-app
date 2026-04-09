const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

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
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
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


app.use("/api/healthcard", require("./routes/healthcard"));
//above 1 is for health card
app.use('/api/donations', require('./routes/donations'));
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
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




//new improved ServerApiVersion.js file


/*const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

const connectDB = require('./config/db');

dotenv.config();

// Connect DB
connectDB();

const app = express();

// ================= SECURITY =================
app.use(helmet());
app.use(mongoSanitize());
app.use(compression());

// ================= CORS =================
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// ================= RATE LIMIT =================
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, slow down.' }
});

app.use('/api/v1', apiLimiter);

// Auth limiter (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts. Try later.' }
});

// ================= BODY PARSER =================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ================= LOGGING =================
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ================= HEALTH =================
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CareCell API running',
    time: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// ================= ROUTES =================
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/donors', require('./routes/donors'));
app.use('/api/hospitals', require('./routes/hospitalRoutes')); // FIXED NAME
app.use('/api/blood-requests', require('./routes/bloodRequests'));
app.use('/api/treatments', require('./routes/treatments'));
app.use('/api/nutrition', require('./routes/nutrition'));
app.use('/api/schemes', require('./routes/schemes'));
app.use('/api/checkin', require('./routes/checkin'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/emergency', require('./routes/emergency'));

// ================= 404 =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`);
});

// ================= UNHANDLED PROMISE =================
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});
//  this code is not proper need to be change only for testing 
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;*/
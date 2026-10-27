const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database (or activate high-availability in-memory mode)
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'HotelPro Hospitality Management Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>HotelPro API</title></head>
      <body style="font-family:sans-serif; background:#0f172a; color:#f8fafc; padding:40px; line-height:1.6;">
        <h1 style="color:#f59e0b;">🏨 HotelPro API is running smoothly</h1>
        <p>Enterprise Hotel Booking & Hospitality Management System</p>
        <ul>
          <li><a style="color:#38bdf8;" href="/api/health">/api/health</a> - System Health</li>
          <li><a style="color:#38bdf8;" href="/api/rooms">/api/rooms</a> - Luxury Room Catalog</li>
        </ul>
      </body>
    </html>
  `);
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🌟 HotelPro Backend Server listening on port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔑 Demo Accounts:`);
  console.log(`   - Admin: admin@hotelpro.com / admin123`);
  console.log(`   - Staff: staff@hotelpro.com / staff123`);
  console.log(`   - Guest: guest@hotelpro.com / guest123`);
  console.log(`====================================================`);
});

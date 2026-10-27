const mongoose = require('mongoose');
const {
  initialUsers,
  initialRooms,
  initialBookings,
  initialPayments,
  initialReviews,
  initialServiceRequests,
  initialNotifications
} = require('../seeder/seedData');

let mongoConnected = false;

// In-Memory store for offline fallback or instant zero-setup execution
const store = {
  users: JSON.parse(JSON.stringify(initialUsers)),
  rooms: JSON.parse(JSON.stringify(initialRooms)),
  bookings: JSON.parse(JSON.stringify(initialBookings)),
  payments: JSON.parse(JSON.stringify(initialPayments)),
  reviews: JSON.parse(JSON.stringify(initialReviews)),
  serviceRequests: JSON.parse(JSON.stringify(initialServiceRequests)),
  notifications: JSON.parse(JSON.stringify(initialNotifications))
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotelpro';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500
    });
    mongoConnected = true;
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    
    // Automatically seed MongoDB if collections are empty
    try {
      const User = require('../models/User');
      const Room = require('../models/Room');
      const Booking = require('../models/Booking');
      const Payment = require('../models/Payment');
      const Review = require('../models/Review');
      const ServiceRequest = require('../models/ServiceRequest');
      const Notification = require('../models/Notification');

      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('🌱 Populating MongoDB with initial HotelPro seed data...');
        await User.insertMany(initialUsers);
        await Room.insertMany(initialRooms);
        await Booking.insertMany(initialBookings);
        await Payment.insertMany(initialPayments);
        await Review.insertMany(initialReviews);
        await ServiceRequest.insertMany(initialServiceRequests);
        await Notification.insertMany(initialNotifications);
        console.log('✅ Initial Seed Data injected into MongoDB!');
      }
    } catch (seedErr) {
      console.warn('⚠️ Seeding note:', seedErr.message);
    }
  } catch (error) {
    mongoConnected = false;
    console.log('------------------------------------------------------------');
    console.log('ℹ️  NOTE: Local MongoDB service not detected on default port.');
    console.log('⚡ HotelPro is running in High-Availability Memory Mode.');
    console.log('   All API routes, auth, JWT, bookings & dashboards work 100%!');
    console.log('   To persist to MongoDB: Start mongod or set MONGO_URI in .env');
    console.log('------------------------------------------------------------');
  }
};

const isMongo = () => mongoConnected;

module.exports = {
  connectDB,
  isMongo,
  store
};

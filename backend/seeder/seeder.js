const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const ServiceRequest = require('../models/ServiceRequest');
const Notification = require('../models/Notification');

const {
  initialUsers,
  initialRooms,
  initialBookings,
  initialPayments,
  initialReviews,
  initialServiceRequests,
  initialNotifications
} = require('./seedData');

const seedDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotelpro';
  try {
    console.log(`Connecting to MongoDB at: ${uri}...`);
    await mongoose.connect(uri);
    console.log('Connected to MongoDB. Purging existing records...');

    await Promise.all([
      User.deleteMany({}),
      Room.deleteMany({}),
      Booking.deleteMany({}),
      Payment.deleteMany({}),
      Review.deleteMany({}),
      ServiceRequest.deleteMany({}),
      Notification.deleteMany({})
    ]);

    console.log('Seeding HotelPro collections...');
    await User.insertMany(initialUsers);
    await Room.insertMany(initialRooms);
    await Booking.insertMany(initialBookings);
    await Payment.insertMany(initialPayments);
    await Review.insertMany(initialReviews);
    await ServiceRequest.insertMany(initialServiceRequests);
    await Notification.insertMany(initialNotifications);

    console.log('✅ HotelPro Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();

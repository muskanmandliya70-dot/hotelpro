const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: 'all'
    },
    role: {
      type: String,
      enum: ['all', 'guest', 'staff', 'admin'],
      default: 'all'
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['booking', 'checkin', 'checkout', 'service', 'payment', 'system'],
      default: 'system'
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Notification', notificationSchema);

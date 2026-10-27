const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true
    },
    guestName: {
      type: String,
      required: true
    },
    guestEmail: {
      type: String,
      required: true
    },
    guestPhone: {
      type: String,
      default: ''
    },
    checkInDate: {
      type: Date,
      required: true
    },
    checkOutDate: {
      type: Date,
      required: true
    },
    nights: {
      type: Number,
      required: true,
      default: 1
    },
    guestsCount: {
      type: Number,
      default: 1
    },
    totalAmount: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'paid'
    },
    paymentMethod: {
      type: String,
      default: 'credit_card'
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'checked_in', 'checked_out', 'cancelled'],
      default: 'confirmed'
    },
    specialRequests: {
      type: String,
      default: ''
    },
    assignedKey: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Booking', bookingSchema);

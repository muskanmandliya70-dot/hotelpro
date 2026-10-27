const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Standard Room', 'Deluxe Room', 'Executive Suite', 'Presidential Suite', 'Family Villa'],
      default: 'Deluxe Room'
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required']
    },
    capacity: {
      type: Number,
      required: true,
      default: 2
    },
    bedType: {
      type: String,
      default: 'King Bed'
    },
    size: {
      type: String,
      default: '450 sq ft'
    },
    floor: {
      type: Number,
      default: 1
    },
    view: {
      type: String,
      default: 'Ocean View'
    },
    amenities: {
      type: [String],
      default: ['High-speed Wi-Fi', 'Smart 4K TV', 'Air Conditioning', 'Mini Bar', 'Espresso Machine']
    },
    images: {
      type: [String],
      default: []
    },
    description: {
      type: String,
      default: 'Experience world-class luxury and tailored hospitality with bespoke comforts.'
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'cleaning', 'maintenance'],
      default: 'available'
    },
    rating: {
      type: Number,
      default: 4.9
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Room', roomSchema);

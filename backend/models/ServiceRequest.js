const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true
    },
    guestName: {
      type: String,
      required: true
    },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: ['Housekeeping', 'Room Service', 'Maintenance', 'Luggage Assistance', 'Wake-up Call', 'Concierge'],
      default: 'Housekeeping'
    },
    description: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled'],
      default: 'pending'
    },
    assignedStaff: {
      type: String,
      default: 'Unassigned'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);

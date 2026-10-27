const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6
    },
    role: {
      type: String,
      enum: ['guest', 'staff', 'admin'],
      default: 'guest'
    },
    phone: {
      type: String,
      default: '+1 (555) 019-2834'
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    },
    department: {
      type: String,
      default: '' // e.g. 'Front Desk', 'Housekeeping', 'Management'
    },
    shift: {
      type: String,
      default: 'Morning'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);

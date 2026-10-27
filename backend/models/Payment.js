const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'razorpay', 'cash'],
      default: 'credit_card'
    },
    transactionId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['success', 'pending', 'refunded', 'failed'],
      default: 'success'
    },
    invoiceNumber: {
      type: String,
      required: true
    },
    cardLast4: {
      type: String,
      default: '4242'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Payment', paymentSchema);

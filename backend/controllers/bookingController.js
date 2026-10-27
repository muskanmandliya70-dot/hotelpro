const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const { isMongo, store } = require('../config/db');

// @desc    Create a new booking & process mock payment
// @route   POST /api/bookings
// @access  Private (Guest / Admin)
const createBooking = async (req, res) => {
  try {
    const {
      roomId,
      checkInDate,
      checkOutDate,
      guestsCount,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
      paymentMethod,
      cardLast4
    } = req.body;

    if (!roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ success: false, message: 'Please provide room and booking dates' });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkOut <= checkIn) {
      return res.status(400).json({ success: false, message: 'Check-out date must be after check-in date' });
    }

    const diffTime = Math.abs(checkOut - checkIn);
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const bookingRef = 'HP-' + Math.floor(10000 + Math.random() * 90000);
    const invoiceNum = 'INV-2026-' + Math.floor(1000 + Math.random() * 9000);
    const txnId = 'TXN-' + Date.now();

    if (isMongo()) {
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ success: false, message: 'Room not found' });
      }

      const totalAmount = room.pricePerNight * nights;

      const booking = await Booking.create({
        bookingReference: bookingRef,
        user: req.user._id,
        room: room._id,
        guestName: guestName || req.user.name,
        guestEmail: guestEmail || req.user.email,
        guestPhone: guestPhone || req.user.phone,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        nights,
        guestsCount: Number(guestsCount) || 1,
        totalAmount,
        paymentStatus: 'paid',
        paymentMethod: paymentMethod || 'credit_card',
        bookingStatus: 'confirmed',
        specialRequests: specialRequests || '',
        assignedKey: 'KEY-ROOM-' + room.roomNumber + '-' + Math.floor(10 + Math.random() * 90)
      });

      // Create Payment record
      const payment = await Payment.create({
        booking: booking._id,
        user: req.user._id,
        amount: totalAmount,
        currency: 'USD',
        paymentMethod: paymentMethod || 'credit_card',
        transactionId: txnId,
        status: 'success',
        invoiceNumber: invoiceNum,
        cardLast4: cardLast4 || '4242'
      });

      // Create Notification
      await Notification.create({
        userId: req.user._id,
        role: 'all',
        title: `Booking Confirmed: ${room.name}`,
        message: `Booking #${bookingRef} is confirmed for ${nights} night(s). Amount: $${totalAmount}`,
        type: 'booking'
      });

      const populated = await Booking.findById(booking._id).populate('room');

      res.status(201).json({
        success: true,
        booking: populated,
        payment
      });
    } else {
      const room = store.rooms.find((r) => String(r._id) === String(roomId));
      if (!room) {
        return res.status(404).json({ success: false, message: 'Room not found' });
      }

      const totalAmount = room.pricePerNight * nights;

      const newBooking = {
        _id: 'bkg_' + Date.now(),
        bookingReference: bookingRef,
        user: req.user._id || req.user.id,
        room: room, // embed room object for easy consumption
        guestName: guestName || req.user.name,
        guestEmail: guestEmail || req.user.email,
        guestPhone: guestPhone || req.user.phone,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        nights,
        guestsCount: Number(guestsCount) || 1,
        totalAmount,
        paymentStatus: 'paid',
        paymentMethod: paymentMethod || 'credit_card',
        bookingStatus: 'confirmed',
        specialRequests: specialRequests || '',
        assignedKey: 'KEY-ROOM-' + room.roomNumber + '-' + Math.floor(10 + Math.random() * 90),
        createdAt: new Date()
      };

      const newPayment = {
        _id: 'pay_' + Date.now(),
        booking: newBooking._id,
        user: req.user._id || req.user.id,
        amount: totalAmount,
        currency: 'USD',
        paymentMethod: paymentMethod || 'credit_card',
        transactionId: txnId,
        status: 'success',
        invoiceNumber: invoiceNum,
        cardLast4: cardLast4 || '4242',
        paidAt: new Date()
      };

      const newNotification = {
        _id: 'notif_' + Date.now(),
        userId: req.user._id || req.user.id,
        role: 'all',
        title: `Booking Confirmed: ${room.name}`,
        message: `Booking #${bookingRef} is confirmed for ${nights} night(s). Amount: $${totalAmount}`,
        type: 'booking',
        isRead: false,
        createdAt: new Date()
      };

      store.bookings.unshift(newBooking);
      store.payments.unshift(newPayment);
      store.notifications.unshift(newNotification);

      res.status(201).json({
        success: true,
        booking: newBooking,
        payment: newPayment
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const userId = String(req.user._id || req.user.id);

    if (isMongo()) {
      const bookings = await Booking.find({ user: req.user._id })
        .populate('room')
        .sort({ createdAt: -1 });
      res.json({ success: true, count: bookings.length, bookings });
    } else {
      const userBookings = store.bookings
        .filter((b) => String(b.user) === userId || String(b.user?._id) === userId)
        .map((b) => {
          let roomObj = b.room;
          if (typeof roomObj === 'string') {
            roomObj = store.rooms.find((r) => String(r._id) === String(roomObj)) || { name: 'Suite' };
          }
          return { ...b, room: roomObj };
        });
      res.json({ success: true, count: userBookings.length, bookings: userBookings });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (Admin & Staff)
// @route   GET /api/bookings
// @access  Private (Staff / Admin)
const getAllBookings = async (req, res) => {
  try {
    if (isMongo()) {
      const bookings = await Booking.find()
        .populate('room')
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 });
      res.json({ success: true, count: bookings.length, bookings });
    } else {
      const all = store.bookings.map((b) => {
        let roomObj = b.room;
        if (typeof roomObj === 'string') {
          roomObj = store.rooms.find((r) => String(r._id) === String(roomObj)) || { name: 'Suite' };
        }
        return { ...b, room: roomObj };
      });
      res.json({ success: true, count: all.length, bookings: all });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status (confirmed, checked_in, checked_out, cancelled)
// @route   PUT /api/bookings/:id/status
// @access  Private (Staff / Admin)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedKey } = req.body;

    if (!['confirmed', 'checked_in', 'checked_out', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid booking status' });
    }

    if (isMongo()) {
      const booking = await Booking.findById(id).populate('room');
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      booking.bookingStatus = status;
      if (assignedKey) booking.assignedKey = assignedKey;
      await booking.save();

      // Update room status accordingly
      if (booking.room) {
        if (status === 'checked_in') {
          await Room.findByIdAndUpdate(booking.room._id, { status: 'occupied' });
        } else if (status === 'checked_out') {
          await Room.findByIdAndUpdate(booking.room._id, { status: 'cleaning' });
        } else if (status === 'cancelled') {
          await Room.findByIdAndUpdate(booking.room._id, { status: 'available' });
        }
      }

      res.json({ success: true, booking });
    } else {
      const bIndex = store.bookings.findIndex((b) => String(b._id) === String(id));
      if (bIndex === -1) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      store.bookings[bIndex].bookingStatus = status;
      if (assignedKey) store.bookings[bIndex].assignedKey = assignedKey;

      const room = store.bookings[bIndex].room;
      const roomId = room?._id || room;
      const rIndex = store.rooms.findIndex((r) => String(r._id) === String(roomId));

      if (rIndex !== -1) {
        if (status === 'checked_in') {
          store.rooms[rIndex].status = 'occupied';
        } else if (status === 'checked_out') {
          store.rooms[rIndex].status = 'cleaning';
        } else if (status === 'cancelled') {
          store.rooms[rIndex].status = 'available';
        }
      }

      res.json({ success: true, booking: store.bookings[bIndex] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongo()) {
      const booking = await Booking.findById(id).populate('room');
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      // Check authorization: user must own booking or be staff/admin
      if (
        req.user.role === 'guest' &&
        String(booking.user) !== String(req.user._id)
      ) {
        return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
      }

      booking.bookingStatus = 'cancelled';
      booking.paymentStatus = 'refunded';
      await booking.save();

      if (booking.room) {
        await Room.findByIdAndUpdate(booking.room._id, { status: 'available' });
      }

      res.json({ success: true, message: 'Booking cancelled and refund initiated successfully', booking });
    } else {
      const bIndex = store.bookings.findIndex((b) => String(b._id) === String(id));
      if (bIndex === -1) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      const booking = store.bookings[bIndex];
      const userId = String(req.user._id || req.user.id);

      if (
        req.user.role === 'guest' &&
        String(booking.user) !== userId &&
        String(booking.user?._id) !== userId
      ) {
        return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
      }

      booking.bookingStatus = 'cancelled';
      booking.paymentStatus = 'refunded';

      const roomId = booking.room?._id || booking.room;
      const rIndex = store.rooms.findIndex((r) => String(r._id) === String(roomId));
      if (rIndex !== -1) {
        store.rooms[rIndex].status = 'available';
      }

      res.json({ success: true, message: 'Booking cancelled and refund initiated successfully', booking });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking
};

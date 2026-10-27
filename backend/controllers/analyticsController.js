const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { isMongo, store } = require('../config/db');

// @desc    Get management & operational metrics
// @route   GET /api/analytics/dashboard
// @access  Private (Staff / Admin)
const getDashboardMetrics = async (req, res) => {
  try {
    if (isMongo()) {
      const totalRooms = await Room.countDocuments();
      const occupiedRooms = await Room.countDocuments({ status: 'occupied' });
      const availableRooms = await Room.countDocuments({ status: 'available' });
      const cleaningRooms = await Room.countDocuments({ status: 'cleaning' });
      const maintenanceRooms = await Room.countDocuments({ status: 'maintenance' });

      const totalBookings = await Booking.countDocuments();
      const activeBookings = await Booking.countDocuments({ bookingStatus: 'checked_in' });
      const confirmedBookings = await Booking.countDocuments({ bookingStatus: 'confirmed' });

      const payments = await Payment.find({ status: 'success' });
      const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

      const totalGuests = await User.countDocuments({ role: 'guest' });
      const totalStaff = await User.countDocuments({ role: 'staff' });

      const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

      res.json({
        success: true,
        metrics: {
          totalRevenue,
          totalBookings,
          activeBookings,
          confirmedBookings,
          totalRooms,
          occupiedRooms,
          availableRooms,
          cleaningRooms,
          maintenanceRooms,
          occupancyRate,
          totalGuests,
          totalStaff
        }
      });
    } else {
      const totalRooms = store.rooms.length;
      const occupiedRooms = store.rooms.filter((r) => r.status === 'occupied').length;
      const availableRooms = store.rooms.filter((r) => r.status === 'available').length;
      const cleaningRooms = store.rooms.filter((r) => r.status === 'cleaning').length;
      const maintenanceRooms = store.rooms.filter((r) => r.status === 'maintenance').length;

      const totalBookings = store.bookings.length;
      const activeBookings = store.bookings.filter((b) => b.bookingStatus === 'checked_in').length;
      const confirmedBookings = store.bookings.filter((b) => b.bookingStatus === 'confirmed').length;

      const totalRevenue = store.payments
        .filter((p) => p.status === 'success')
        .reduce((sum, p) => sum + p.amount, 0);

      const totalGuests = store.users.filter((u) => u.role === 'guest').length;
      const totalStaff = store.users.filter((u) => u.role === 'staff').length;

      const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

      res.json({
        success: true,
        metrics: {
          totalRevenue,
          totalBookings,
          activeBookings,
          confirmedBookings,
          totalRooms,
          occupiedRooms,
          availableRooms,
          cleaningRooms,
          maintenanceRooms,
          occupancyRate,
          totalGuests,
          totalStaff
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardMetrics
};

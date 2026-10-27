const Review = require('../models/Review');
const Room = require('../models/Room');
const { isMongo, store } = require('../config/db');

// @desc    Get reviews (all or by room)
// @route   GET /api/reviews
// @access  Public
const getReviews = async (req, res) => {
  try {
    const { roomId } = req.query;

    if (isMongo()) {
      let query = {};
      if (roomId) query.room = roomId;
      const reviews = await Review.find(query).sort({ createdAt: -1 });
      res.json({ success: true, count: reviews.length, reviews });
    } else {
      let reviews = store.reviews;
      if (roomId) {
        reviews = reviews.filter((r) => String(r.room) === String(roomId));
      }
      res.json({ success: true, count: reviews.length, reviews });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add review for a room
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { roomId, rating, comment } = req.body;

    if (!roomId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide roomId, rating, and comment' });
    }

    if (isMongo()) {
      const room = await Room.findById(roomId);
      if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

      const review = await Review.create({
        room: roomId,
        user: req.user._id,
        guestName: req.user.name,
        rating: Number(rating),
        comment
      });

      // Recalculate room rating
      const allReviews = await Review.find({ room: roomId });
      const avg = (allReviews.reduce((acc, item) => acc + item.rating, 0) / allReviews.length).toFixed(1);
      room.rating = Number(avg);
      await room.save();

      res.status(201).json({ success: true, review });
    } else {
      const room = store.rooms.find((r) => String(r._id) === String(roomId));
      if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

      const newReview = {
        _id: 'rev_' + Date.now(),
        room: roomId,
        user: req.user._id || req.user.id,
        guestName: req.user.name,
        rating: Number(rating),
        comment,
        createdAt: new Date()
      };

      store.reviews.unshift(newReview);

      const roomReviews = store.reviews.filter((r) => String(r.room) === String(roomId));
      const avg = (roomReviews.reduce((acc, item) => acc + item.rating, 0) / roomReviews.length).toFixed(1);
      room.rating = Number(avg);

      res.status(201).json({ success: true, review: newReview });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getReviews,
  createReview
};

const express = require('express');
const router = express.Router();
const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.post('/', protect, authorize('admin'), createRoom);
router.put('/:id', protect, authorize('admin', 'staff'), updateRoom);
router.delete('/:id', protect, authorize('admin'), deleteRoom);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getServiceRequests,
  createServiceRequest,
  updateServiceStatus
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getServiceRequests);
router.post('/', protect, createServiceRequest);
router.put('/:id', protect, authorize('staff', 'admin'), updateServiceStatus);

module.exports = router;

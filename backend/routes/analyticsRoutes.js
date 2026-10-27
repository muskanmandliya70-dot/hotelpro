const express = require('express');
const router = express.Router();
const { getDashboardMetrics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, authorize('staff', 'admin'), getDashboardMetrics);

module.exports = router;

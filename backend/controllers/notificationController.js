const Notification = require('../models/Notification');
const { isMongo, store } = require('../config/db');

// @desc    Get notifications for user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = String(req.user._id || req.user.id);

    if (isMongo()) {
      const notifications = await Notification.find({
        $or: [
          { userId: 'all' },
          { userId },
          { role: 'all' },
          { role }
        ]
      }).sort({ createdAt: -1 });

      res.json({ success: true, count: notifications.length, notifications });
    } else {
      const notifications = store.notifications.filter(
        (n) =>
          n.userId === 'all' ||
          String(n.userId) === userId ||
          n.role === 'all' ||
          n.role === role
      );
      res.json({ success: true, count: notifications.length, notifications });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongo()) {
      await Notification.findByIdAndUpdate(id, { isRead: true });
      res.json({ success: true, message: 'Notification marked as read' });
    } else {
      const notif = store.notifications.find((n) => String(n._id) === String(id));
      if (notif) notif.isRead = true;
      res.json({ success: true, message: 'Notification marked as read' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead
};

const ServiceRequest = require('../models/ServiceRequest');
const { isMongo, store } = require('../config/db');

// @desc    Get all service requests (Staff/Admin) or user requests (Guest)
// @route   GET /api/services
// @access  Private
const getServiceRequests = async (req, res) => {
  try {
    if (isMongo()) {
      let query = {};
      if (req.user.role === 'guest') {
        query.guestId = req.user._id;
      }
      const requests = await ServiceRequest.find(query).sort({ createdAt: -1 });
      res.json({ success: true, count: requests.length, requests });
    } else {
      let requests = store.serviceRequests;
      if (req.user.role === 'guest') {
        const uid = String(req.user._id || req.user.id);
        requests = requests.filter((r) => String(r.guestId) === uid);
      }
      res.json({ success: true, count: requests.length, requests });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new guest service request
// @route   POST /api/services
// @access  Private
const createServiceRequest = async (req, res) => {
  try {
    const { roomNumber, type, description, priority } = req.body;

    if (!roomNumber || !description) {
      return res.status(400).json({ success: false, message: 'Please provide room number and service description' });
    }

    if (isMongo()) {
      const request = await ServiceRequest.create({
        roomNumber,
        guestName: req.user.name,
        guestId: req.user._id,
        type: type || 'Housekeeping',
        description,
        priority: priority || 'medium',
        status: 'pending',
        assignedStaff: 'Elena Rostova'
      });
      res.status(201).json({ success: true, request });
    } else {
      const newRequest = {
        _id: 'srv_' + Date.now(),
        roomNumber,
        guestName: req.user.name,
        guestId: req.user._id || req.user.id,
        type: type || 'Housekeeping',
        description,
        priority: priority || 'medium',
        status: 'pending',
        assignedStaff: 'Elena Rostova',
        createdAt: new Date()
      };
      store.serviceRequests.unshift(newRequest);
      res.status(201).json({ success: true, request: newRequest });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update service request status or assignment
// @route   PUT /api/services/:id
// @access  Private (Staff / Admin)
const updateServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedStaff } = req.body;

    if (isMongo()) {
      const request = await ServiceRequest.findById(id);
      if (!request) {
        return res.status(404).json({ success: false, message: 'Service request not found' });
      }

      if (status) request.status = status;
      if (assignedStaff) request.assignedStaff = assignedStaff;
      await request.save();

      res.json({ success: true, request });
    } else {
      const index = store.serviceRequests.findIndex((s) => String(s._id) === String(id));
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Service request not found' });
      }

      if (status) store.serviceRequests[index].status = status;
      if (assignedStaff) store.serviceRequests[index].assignedStaff = assignedStaff;

      res.json({ success: true, request: store.serviceRequests[index] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getServiceRequests,
  createServiceRequest,
  updateServiceStatus
};

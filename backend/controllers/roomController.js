const Room = require('../models/Room');
const { isMongo, store } = require('../config/db');

// @desc    Get all rooms with search & filter
// @route   GET /api/rooms
// @access  Public
const getAllRooms = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, capacity, status } = req.query;

    if (isMongo()) {
      let query = {};

      if (category && category !== 'All') {
        query.category = category;
      }
      if (status && status !== 'All') {
        query.status = status;
      }
      if (capacity) {
        query.capacity = { $gte: Number(capacity) };
      }
      if (minPrice || maxPrice) {
        query.pricePerNight = {};
        if (minPrice) query.pricePerNight.$gte = Number(minPrice);
        if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { roomNumber: { $regex: search, $options: 'i' } }
        ];
      }

      const rooms = await Room.find(query).sort({ featured: -1, pricePerNight: 1 });
      res.json({ success: true, count: rooms.length, rooms });
    } else {
      let filtered = [...store.rooms];

      if (category && category !== 'All') {
        filtered = filtered.filter((r) => r.category.toLowerCase() === category.toLowerCase());
      }
      if (status && status !== 'All') {
        filtered = filtered.filter((r) => r.status.toLowerCase() === status.toLowerCase());
      }
      if (capacity) {
        filtered = filtered.filter((r) => r.capacity >= Number(capacity));
      }
      if (minPrice) {
        filtered = filtered.filter((r) => r.pricePerNight >= Number(minPrice));
      }
      if (maxPrice) {
        filtered = filtered.filter((r) => r.pricePerNight <= Number(maxPrice));
      }
      if (search) {
        const term = search.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.name.toLowerCase().includes(term) ||
            r.description.toLowerCase().includes(term) ||
            r.roomNumber.toLowerCase().includes(term)
        );
      }

      res.json({ success: true, count: filtered.length, rooms: filtered });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongo()) {
      const room = await Room.findById(id);
      if (!room) {
        return res.status(404).json({ success: false, message: 'Room not found' });
      }
      res.json({ success: true, room });
    } else {
      const room = store.rooms.find((r) => String(r._id) === String(id));
      if (!room) {
        return res.status(404).json({ success: false, message: 'Room not found' });
      }
      res.json({ success: true, room });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private (Admin)
const createRoom = async (req, res) => {
  try {
    const {
      roomNumber,
      name,
      category,
      pricePerNight,
      capacity,
      bedType,
      size,
      floor,
      view,
      amenities,
      images,
      description,
      status,
      featured
    } = req.body;

    if (!roomNumber || !name || !pricePerNight) {
      return res.status(400).json({ success: false, message: 'Please provide roomNumber, name and pricePerNight' });
    }

    const defaultImages = images && images.length > 0 ? images : [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
    ];

    if (isMongo()) {
      const exists = await Room.findOne({ roomNumber });
      if (exists) {
        return res.status(400).json({ success: false, message: 'Room number already exists' });
      }

      const newRoom = await Room.create({
        roomNumber,
        name,
        category: category || 'Deluxe Room',
        pricePerNight: Number(pricePerNight),
        capacity: Number(capacity) || 2,
        bedType: bedType || 'King Bed',
        size: size || '480 sq ft',
        floor: Number(floor) || 1,
        view: view || 'Garden View',
        amenities: amenities || ['High-speed Wi-Fi', 'Smart 4K TV', 'Air Conditioning', 'Mini Bar'],
        images: defaultImages,
        description: description || 'Elegant comfort with superior hospitality.',
        status: status || 'available',
        featured: !!featured
      });

      res.status(201).json({ success: true, room: newRoom });
    } else {
      const exists = store.rooms.find((r) => r.roomNumber === roomNumber);
      if (exists) {
        return res.status(400).json({ success: false, message: 'Room number already exists' });
      }

      const newRoom = {
        _id: 'rm_' + Date.now(),
        roomNumber,
        name,
        category: category || 'Deluxe Room',
        pricePerNight: Number(pricePerNight),
        capacity: Number(capacity) || 2,
        bedType: bedType || 'King Bed',
        size: size || '480 sq ft',
        floor: Number(floor) || 1,
        view: view || 'Garden View',
        amenities: amenities || ['High-speed Wi-Fi', 'Smart 4K TV', 'Air Conditioning', 'Mini Bar'],
        images: defaultImages,
        description: description || 'Elegant comfort with superior hospitality.',
        status: status || 'available',
        rating: 5.0,
        featured: !!featured,
        createdAt: new Date()
      };

      store.rooms.unshift(newRoom);
      res.status(201).json({ success: true, room: newRoom });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update room details or status
// @route   PUT /api/rooms/:id
// @access  Private (Admin / Staff)
const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongo()) {
      const room = await Room.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!room) {
        return res.status(404).json({ success: false, message: 'Room not found' });
      }
      res.json({ success: true, room });
    } else {
      const index = store.rooms.findIndex((r) => String(r._id) === String(id));
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Room not found' });
      }
      store.rooms[index] = { ...store.rooms[index], ...req.body };
      res.json({ success: true, room: store.rooms[index] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Admin)
const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongo()) {
      const room = await Room.findByIdAndDelete(id);
      if (!room) {
        return res.status(404).json({ success: false, message: 'Room not found' });
      }
      res.json({ success: true, message: 'Room deleted successfully' });
    } else {
      const index = store.rooms.findIndex((r) => String(r._id) === String(id));
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Room not found' });
      }
      store.rooms.splice(index, 1);
      res.json({ success: true, message: 'Room deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
};

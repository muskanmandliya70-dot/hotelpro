const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const hashedPasswordAdmin = bcrypt.hashSync('admin123', salt);
const hashedPasswordStaff = bcrypt.hashSync('staff123', salt);
const hashedPasswordGuest = bcrypt.hashSync('guest123', salt);

const initialUsers = [
  {
    _id: '662000000000000000000001',
    name: 'Alexander Wright',
    email: 'admin@hotelpro.com',
    password: hashedPasswordAdmin,
    role: 'admin',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    department: 'General Management',
    shift: 'General'
  },
  {
    _id: '662000000000000000000002',
    name: 'Elena Rostova',
    email: 'staff@hotelpro.com',
    password: hashedPasswordStaff,
    role: 'staff',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    department: 'Front Desk & Guest Services',
    shift: 'Morning'
  },
  {
    _id: '662000000000000000000003',
    name: 'Carlos Rivera',
    email: 'housekeeping@hotelpro.com',
    password: hashedPasswordStaff,
    role: 'staff',
    phone: '+1 (555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    department: 'Housekeeping',
    shift: 'Evening'
  },
  {
    _id: '662000000000000000000004',
    name: 'Sarah Jenkins',
    email: 'guest@hotelpro.com',
    password: hashedPasswordGuest,
    role: 'guest',
    phone: '+1 (555) 987-6543',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    department: '',
    shift: ''
  }
];

const initialRooms = [
  {
    _id: '662000000000000000000101',
    roomNumber: '101',
    name: 'Grand Oceanfront Deluxe Suite',
    category: 'Deluxe Room',
    pricePerNight: 280,
    capacity: 2,
    bedType: 'King Bed',
    size: '520 sq ft',
    floor: 1,
    view: 'Panoramic Ocean View',
    amenities: ['High-speed Wi-Fi', 'Smart 4K TV', 'Private Balcony', 'Mini Bar', 'Espresso Machine', 'Marble Bathroom', 'Rain Shower'],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Immerse yourself in coastal elegance. Features floor-to-ceiling windows looking directly out over the pristine shoreline, a private furnished balcony, and an opulent Italian marble bathroom.',
    status: 'available',
    rating: 4.9,
    featured: true
  },
  {
    _id: '662000000000000000000102',
    roomNumber: '102',
    name: 'Executive Skyline Haven',
    category: 'Executive Suite',
    pricePerNight: 350,
    capacity: 2,
    bedType: 'King Bed',
    size: '640 sq ft',
    floor: 2,
    view: 'Metropolitan City Skyline',
    amenities: ['High-speed Wi-Fi', 'Smart 4K TV', 'Executive Workstation', 'Lounge Area', 'Nespresso Bar', 'Bathtub with View', 'Safe Box'],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Tailored for discerning business travelers and luxury seekers. Offers dedicated high-speed fiber workspace, premium lounge seating, and complimentary evening cocktail hour access.',
    status: 'occupied',
    rating: 4.8,
    featured: true
  },
  {
    _id: '662000000000000000000201',
    roomNumber: '201',
    name: 'Presidential Royal Penthouse',
    category: 'Presidential Suite',
    pricePerNight: 780,
    capacity: 4,
    bedType: 'King Bed',
    size: '1,450 sq ft',
    floor: 4,
    view: '360° Panoramic Coast & City',
    amenities: ['Dedicated 24/7 Butler', 'Private Infinity Plunge Pool', 'Gourmet Kitchenette', 'Dual Walk-in Closets', 'Bose Sound System', 'Jacuzzi'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'The pinnacle of architectural grandeur. Spanning 1,450 square feet with an expansive wrap-around sky terrace, private plunge pool, and dedicated butler service.',
    status: 'available',
    rating: 5.0,
    featured: true
  },
  {
    _id: '662000000000000000000202',
    roomNumber: '202',
    name: 'Tropical Garden Courtyard Room',
    category: 'Standard Room',
    pricePerNight: 165,
    capacity: 2,
    bedType: 'Queen Bed',
    size: '380 sq ft',
    floor: 1,
    view: 'Botanical Garden View',
    amenities: ['High-speed Wi-Fi', 'Smart TV', 'Organic Tea Selection', 'Air Conditioning', 'Plush Bathrobes', 'Walk-in Shower'],
    images: [
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Quiet sanctuary nestled alongside our curated exotic botanical gardens. Features warm organic accents, hypoallergenic bedding, and a peaceful garden patio.',
    status: 'available',
    rating: 4.7,
    featured: false
  },
  {
    _id: '662000000000000000000301',
    roomNumber: '301',
    name: 'Bespoke Family Poolside Villa',
    category: 'Family Villa',
    pricePerNight: 520,
    capacity: 5,
    bedType: 'Double Bed',
    size: '980 sq ft',
    floor: 1,
    view: 'Lagoon Pool & Palm Gardens',
    amenities: ['Direct Pool Access', 'Two Bedrooms', 'Kid Entertainment Center', 'Full Kitchenette', 'Washer & Dryer', 'Private Sun Deck'],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Designed for unforgettable family retreats. Direct walkout access to the heated lagoon pool, dual king/twin suites, and spacious family entertainment area.',
    status: 'cleaning',
    rating: 4.9,
    featured: true
  },
  {
    _id: '662000000000000000000302',
    roomNumber: '302',
    name: 'Classic Heritage Twin Room',
    category: 'Standard Room',
    pricePerNight: 180,
    capacity: 2,
    bedType: 'Twin Beds',
    size: '410 sq ft',
    floor: 2,
    view: 'Courtyard Fountain',
    amenities: ['High-speed Wi-Fi', 'Smart 4K TV', 'Dual Vanity Sinks', 'Work Desk', 'Mini Fridge', 'Safe Box'],
    images: [
      'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Charming two-bed room ideal for friends or colleagues traveling together. Overlooks the historic courtyard and illuminated water fountain.',
    status: 'available',
    rating: 4.6,
    featured: false
  },
  {
    _id: '662000000000000000000401',
    roomNumber: '401',
    name: 'Signature Diamond Sunset Suite',
    category: 'Executive Suite',
    pricePerNight: 410,
    capacity: 3,
    bedType: 'King Bed',
    size: '720 sq ft',
    floor: 3,
    view: 'Sunset Ocean View',
    amenities: ['High-speed Wi-Fi', 'Cocktail Bar Station', 'Jacuzzi Soaking Tub', 'Double Balcony', 'Dyson Haircare', 'Pillow Menu'],
    images: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Bathed in evening golden hour glow. Unmatched sunset ocean vistas, bespoke luxury bath amenities, and an in-suite cocktail bar station.',
    status: 'available',
    rating: 4.9,
    featured: true
  },
  {
    _id: '662000000000000000000402',
    roomNumber: '402',
    name: 'Urban Luxe Premier Room',
    category: 'Deluxe Room',
    pricePerNight: 240,
    capacity: 2,
    bedType: 'Queen Bed',
    size: '460 sq ft',
    floor: 3,
    view: 'City Architecture',
    amenities: ['High-speed Wi-Fi', 'Smart 4K TV', 'Acoustic Soundproofing', 'Ergonomic Desk', 'Rain Shower'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Modern minimalist design paired with acoustic soundproofing for deep restful sleep in the heart of the city.',
    status: 'maintenance',
    rating: 4.8,
    featured: false
  }
];

const initialBookings = [
  {
    _id: '662000000000000000000901',
    bookingReference: 'HP-98421',
    user: '662000000000000000000004',
    room: '662000000000000000000102',
    guestName: 'Sarah Jenkins',
    guestEmail: 'guest@hotelpro.com',
    guestPhone: '+1 (555) 987-6543',
    checkInDate: new Date('2026-10-26T14:00:00Z'),
    checkOutDate: new Date('2026-10-29T11:00:00Z'),
    nights: 3,
    guestsCount: 2,
    totalAmount: 1050,
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    bookingStatus: 'checked_in',
    specialRequests: 'High floor preferred, late check-in at 8 PM.',
    assignedKey: 'KEY-ROOM-102-A',
    createdAt: new Date('2026-10-20T10:15:00Z')
  },
  {
    _id: '662000000000000000000902',
    bookingReference: 'HP-98422',
    user: '662000000000000000000004',
    room: '662000000000000000000101',
    guestName: 'Sarah Jenkins',
    guestEmail: 'guest@hotelpro.com',
    guestPhone: '+1 (555) 987-6543',
    checkInDate: new Date('2026-11-05T14:00:00Z'),
    checkOutDate: new Date('2026-11-08T11:00:00Z'),
    nights: 3,
    guestsCount: 2,
    totalAmount: 840,
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    bookingStatus: 'confirmed',
    specialRequests: 'Honeymoon arrangement with flowers.',
    assignedKey: '',
    createdAt: new Date('2026-10-25T14:30:00Z')
  }
];

const initialPayments = [
  {
    _id: '662000000000000000000801',
    booking: '662000000000000000000901',
    user: '662000000000000000000004',
    amount: 1050,
    currency: 'USD',
    paymentMethod: 'credit_card',
    transactionId: 'TXN-9041289410',
    status: 'success',
    invoiceNumber: 'INV-2026-0081',
    cardLast4: '4242',
    paidAt: new Date('2026-10-20T10:16:00Z')
  },
  {
    _id: '662000000000000000000802',
    booking: '662000000000000000000902',
    user: '662000000000000000000004',
    amount: 840,
    currency: 'USD',
    paymentMethod: 'credit_card',
    transactionId: 'TXN-9041289411',
    status: 'success',
    invoiceNumber: 'INV-2026-0082',
    cardLast4: '8821',
    paidAt: new Date('2026-10-25T14:31:00Z')
  }
];

const initialReviews = [
  {
    _id: '662000000000000000000701',
    room: '662000000000000000000101',
    user: '662000000000000000000004',
    guestName: 'Sarah Jenkins',
    rating: 5,
    comment: 'An exquisite stay! The oceanfront views from room 101 were breathtaking, and the room service was remarkably fast and polite.',
    createdAt: new Date('2026-10-21T18:00:00Z')
  },
  {
    _id: '662000000000000000000702',
    room: '662000000000000000000201',
    user: '662000000000000000000001',
    guestName: 'David Sterling',
    rating: 5,
    comment: 'The Presidential Suite exceeded all expectations. The private pool, butler service, and sunset views are truly five-star.',
    createdAt: new Date('2026-10-22T09:30:00Z')
  }
];

const initialServiceRequests = [
  {
    _id: '662000000000000000000601',
    roomNumber: '102',
    guestName: 'Sarah Jenkins',
    guestId: '662000000000000000000004',
    type: 'Housekeeping',
    description: 'Fresh bath sheets, extra hypoallergenic pillows, and fresh espresso pods.',
    priority: 'medium',
    status: 'in_progress',
    assignedStaff: 'Carlos Rivera',
    createdAt: new Date('2026-10-27T08:00:00Z')
  },
  {
    _id: '662000000000000000000602',
    roomNumber: '101',
    guestName: 'Sarah Jenkins',
    guestId: '662000000000000000000004',
    type: 'Room Service',
    description: 'Bottle of chilled Moët champagne and artisan cheese platter.',
    priority: 'high',
    status: 'completed',
    assignedStaff: 'Elena Rostova',
    createdAt: new Date('2026-10-26T19:20:00Z')
  }
];

const initialNotifications = [
  {
    _id: '662000000000000000000501',
    userId: 'all',
    role: 'all',
    title: 'Welcome to HotelPro Hospitality Portal',
    message: 'Explore luxury stays, manage room reservations, and experience 24/7 concierge.',
    type: 'system',
    isRead: false,
    createdAt: new Date('2026-10-27T06:00:00Z')
  },
  {
    _id: '662000000000000000000502',
    userId: 'all',
    role: 'staff',
    title: 'Guest Check-In Completed for Room 102',
    message: 'Sarah Jenkins checked into Room 102 with Key Card KEY-ROOM-102-A.',
    type: 'checkin',
    isRead: false,
    createdAt: new Date('2026-10-26T14:35:00Z')
  }
];

module.exports = {
  initialUsers,
  initialRooms,
  initialBookings,
  initialPayments,
  initialReviews,
  initialServiceRequests,
  initialNotifications
};

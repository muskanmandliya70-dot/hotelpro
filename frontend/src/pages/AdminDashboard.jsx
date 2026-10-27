import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Room Modal State
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    name: '',
    category: 'Deluxe Room',
    pricePerNight: '',
    capacity: 2,
    bedType: 'King Bed',
    size: '500 sq ft',
    floor: 2,
    view: 'Panoramic Ocean View',
    amenities: 'High-speed Wi-Fi, Smart 4K TV, Mini Bar, Air Conditioning',
    images: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    description: 'Impeccable luxury with handcrafted furnishings and scenic views.'
  });

  // Add Staff Modal State
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff',
    department: 'Front Desk',
    shift: 'Morning'
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [mRes, rRes, uRes, bRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/rooms'),
        api.get('/auth/users'),
        api.get('/bookings')
      ]);

      if (mRes.data.success) setMetrics(mRes.data.metrics);
      if (rRes.data.success) setRooms(rRes.data.rooms);
      if (uRes.data.success) setUsers(uRes.data.users);
      if (bRes.data.success) setBookings(bRes.data.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const amenitiesArr = newRoom.amenities.split(',').map((s) => s.trim());
      const imagesArr = newRoom.images.split(',').map((s) => s.trim());

      const res = await api.post('/rooms', {
        ...newRoom,
        amenities: amenitiesArr,
        images: imagesArr
      });

      if (res.data.success) {
        alert('🎉 New Luxury Suite added to HotelPro catalog!');
        setShowAddRoom(false);
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add room');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to permanently delete this room?')) return;
    try {
      const res = await api.delete(`/rooms/${roomId}`);
      if (res.data.success) {
        setRooms(rooms.filter((r) => r._id !== roomId));
        alert('Room deleted successfully');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', newStaff);
      if (res.data.success) {
        alert(`Staff member ${newStaff.name} created successfully!`);
        setShowAddStaff(false);
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create staff');
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container px-4 px-lg-5">
        {/* Title Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-danger px-3 py-1 text-uppercase fw-bold">ADMINISTRATION CONSOLE</span>
              <span className="text-secondary small">&bull; Real-time Hospitality Intelligence</span>
            </div>
            <h2 className="display-6 fw-bold text-dark mb-0">Executive Management Dashboard</h2>
          </div>
          <div className="mt-3 mt-md-0 d-flex gap-2">
            <button onClick={() => setShowAddRoom(true)} className="btn btn-gold rounded-pill px-3">
              <i className="bi bi-plus-lg me-1"></i> Add Room
            </button>
            <button onClick={() => setShowAddStaff(true)} className="btn btn-outline-dark rounded-pill px-3">
              <i className="bi bi-person-plus-fill me-1"></i> Add Staff
            </button>
          </div>
        </div>

        {/* Analytics KPI Metric Cards */}
        <div className="row g-4 mb-4">
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 rounded-4 shadow-sm p-4 bg-white border-bottom border-warning border-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-secondary small fw-bold text-uppercase">Total Gross Revenue</span>
                <div className="p-2 rounded-circle bg-warning bg-opacity-10 text-warning">
                  <i className="bi bi-cash-stack fs-5"></i>
                </div>
              </div>
              <h3 className="fw-bold text-dark mb-1">${metrics?.totalRevenue || 0}</h3>
              <small className="text-success"><i className="bi bi-arrow-up-right me-1"></i> +18.4% from last month</small>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 rounded-4 shadow-sm p-4 bg-white border-bottom border-primary border-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-secondary small fw-bold text-uppercase">Occupancy Rate</span>
                <div className="p-2 rounded-circle bg-primary bg-opacity-10 text-primary">
                  <i className="bi bi-pie-chart-fill fs-5"></i>
                </div>
              </div>
              <h3 className="fw-bold text-dark mb-1">{metrics?.occupancyRate || 0}%</h3>
              <small className="text-secondary">{metrics?.occupiedRooms || 0} of {metrics?.totalRooms || 0} rooms occupied</small>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 rounded-4 shadow-sm p-4 bg-white border-bottom border-success border-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-secondary small fw-bold text-uppercase">Total Reservations</span>
                <div className="p-2 rounded-circle bg-success bg-opacity-10 text-success">
                  <i className="bi bi-calendar2-check-fill fs-5"></i>
                </div>
              </div>
              <h3 className="fw-bold text-dark mb-1">{metrics?.totalBookings || 0}</h3>
              <small className="text-secondary">{metrics?.activeBookings || 0} currently checked in</small>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 rounded-4 shadow-sm p-4 bg-white border-bottom border-info border-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-secondary small fw-bold text-uppercase">Registered Guests</span>
                <div className="p-2 rounded-circle bg-info bg-opacity-10 text-info">
                  <i className="bi bi-people-fill fs-5"></i>
                </div>
              </div>
              <h3 className="fw-bold text-dark mb-1">{metrics?.totalGuests || 0}</h3>
              <small className="text-secondary">{metrics?.totalStaff || 0} active staff members</small>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="d-flex gap-2 border-bottom mb-4 bg-white p-2 rounded-3 shadow-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`dashboard-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <i className="bi bi-graph-up me-2"></i> Operational Intelligence
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`dashboard-tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
          >
            <i className="bi bi-building me-2"></i> Room Inventory ({rooms.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`dashboard-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          >
            <i className="bi bi-person-lines-fill me-2"></i> Users & Staff Management ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('audits')}
            className={`dashboard-tab-btn ${activeTab === 'audits' ? 'active' : ''}`}
          >
            <i className="bi bi-receipt-cutoff me-2"></i> Financial & Booking Audits
          </button>
        </div>

        {/* Tab 1: Operational Overview */}
        {activeTab === 'overview' && (
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card border-0 rounded-4 shadow-sm p-4 bg-white h-100">
                <h5 className="fw-bold text-dark mb-3">Live Room Status Distribution</h5>
                
                <div className="mb-4">
                  <div className="d-flex justify-content-between small fw-bold mb-1">
                    <span className="text-success">Available Suites</span>
                    <span>{metrics?.availableRooms || 0}</span>
                  </div>
                  <div className="progress" style={{ height: 10 }}>
                    <div className="progress-bar bg-success" style={{ width: `${((metrics?.availableRooms || 0) / (metrics?.totalRooms || 1)) * 100}%` }}></div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between small fw-bold mb-1">
                    <span className="text-danger">Occupied / Checked-In</span>
                    <span>{metrics?.occupiedRooms || 0}</span>
                  </div>
                  <div className="progress" style={{ height: 10 }}>
                    <div className="progress-bar bg-danger" style={{ width: `${((metrics?.occupiedRooms || 0) / (metrics?.totalRooms || 1)) * 100}%` }}></div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between small fw-bold mb-1">
                    <span className="text-warning text-dark">Housekeeping Cleaning</span>
                    <span>{metrics?.cleaningRooms || 0}</span>
                  </div>
                  <div className="progress" style={{ height: 10 }}>
                    <div className="progress-bar bg-warning" style={{ width: `${((metrics?.cleaningRooms || 0) / (metrics?.totalRooms || 1)) * 100}%` }}></div>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="d-flex justify-content-between small fw-bold mb-1">
                    <span className="text-secondary">Maintenance & Repair</span>
                    <span>{metrics?.maintenanceRooms || 0}</span>
                  </div>
                  <div className="progress" style={{ height: 10 }}>
                    <div className="progress-bar bg-secondary" style={{ width: `${((metrics?.maintenanceRooms || 0) / (metrics?.totalRooms || 1)) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card border-0 rounded-4 shadow-sm p-4 bg-white h-100">
                <h5 className="fw-bold text-dark mb-3">HotelPro System Health & Compliance</h5>
                <ul className="list-group list-group-flush small">
                  <li className="list-group-item d-flex justify-content-between align-items-center py-3">
                    <div>
                      <div className="fw-bold">Database Persistence Mode</div>
                      <small className="text-secondary">Mongoose / High-Availability Auto-Sync</small>
                    </div>
                    <span className="badge bg-success">ACTIVE</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center py-3">
                    <div>
                      <div className="fw-bold">JWT Security & Token Expiry</div>
                      <small className="text-secondary">HS256 30-Day Encrypted Session Keys</small>
                    </div>
                    <span className="badge bg-success">SECURE</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center py-3">
                    <div>
                      <div className="fw-bold">Payment Gateway Integration</div>
                      <small className="text-secondary">Simulated PCI-DSS Compliant Terminal</small>
                    </div>
                    <span className="badge bg-success">VERIFIED</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center py-3">
                    <div>
                      <div className="fw-bold">Digital Keycard Dispatch</div>
                      <small className="text-secondary">Automated RFID Key Generation</small>
                    </div>
                    <span className="badge bg-primary">RUNNING</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Room Inventory */}
        {activeTab === 'rooms' && (
          <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-dark mb-0">HotelPro Room Inventory</h5>
              <button onClick={() => setShowAddRoom(true)} className="btn btn-gold btn-sm rounded-pill px-3">
                <i className="bi bi-plus-circle me-1"></i> Create Suite
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light small text-uppercase text-secondary">
                  <tr>
                    <th>Room #</th>
                    <th>Suite Name</th>
                    <th>Category</th>
                    <th>Rate / Night</th>
                    <th>Max Guests</th>
                    <th>Floor & View</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room._id}>
                      <td className="fw-bold text-dark"><code>#{room.roomNumber}</code></td>
                      <td>
                        <div className="fw-bold text-dark">{room.name}</div>
                        <small className="text-secondary">{room.bedType || 'King'}</small>
                      </td>
                      <td><span className="badge bg-light text-dark border">{room.category}</span></td>
                      <td className="fw-bold text-warning">${room.pricePerNight}</td>
                      <td>{room.capacity} Guests</td>
                      <td className="small text-secondary">Floor {room.floor} ({room.view})</td>
                      <td>
                        <span className={`badge ${room.status === 'available' ? 'bg-success' : room.status === 'occupied' ? 'bg-danger' : room.status === 'cleaning' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                          {room.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          onClick={() => handleDeleteRoom(room._id)}
                          className="btn btn-outline-danger btn-sm rounded-pill px-2 py-0"
                          title="Delete Suite"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Users & Staff */}
        {activeTab === 'users' && (
          <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-dark mb-0">Users & Staff Accounts</h5>
              <button onClick={() => setShowAddStaff(true)} className="btn btn-dark btn-sm rounded-pill px-3">
                <i className="bi bi-person-plus me-1"></i> Register New Staff
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light small text-uppercase text-secondary">
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Shift</th>
                    <th>Phone</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id || u.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                            alt={u.name}
                            className="rounded-circle"
                            style={{ width: 32, height: 32, objectFit: 'cover' }}
                          />
                          <div>
                            <div className="fw-bold text-dark">{u.name}</div>
                            <small className="text-secondary">{u.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'bg-danger' : u.role === 'staff' ? 'bg-primary' : 'bg-success'}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="small text-secondary">{u.department || 'N/A'}</td>
                      <td className="small text-secondary">{u.shift || 'N/A'}</td>
                      <td className="small text-secondary">{u.phone || 'N/A'}</td>
                      <td className="small text-secondary">{new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Audits */}
        {activeTab === 'audits' && (
          <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
            <h5 className="fw-bold text-dark mb-3">Financial Transaction & Reservation Audits</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light small text-uppercase text-secondary">
                  <tr>
                    <th>Booking Ref</th>
                    <th>Guest</th>
                    <th>Dates</th>
                    <th>Total Billed</th>
                    <th>Payment Method</th>
                    <th>Booking Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td className="fw-bold"><code>{b.bookingReference}</code></td>
                      <td>{b.guestName}</td>
                      <td className="small text-secondary">
                        {new Date(b.checkInDate).toLocaleDateString()} - {new Date(b.checkOutDate).toLocaleDateString()} ({b.nights}n)
                      </td>
                      <td className="fw-bold text-success">${b.totalAmount}</td>
                      <td><span className="badge bg-light text-dark border">{b.paymentMethod?.replace('_', ' ').toUpperCase()}</span></td>
                      <td>
                        <span className={`badge ${b.bookingStatus === 'checked_in' ? 'bg-success' : b.bookingStatus === 'confirmed' ? 'bg-primary' : 'bg-secondary'}`}>
                          {b.bookingStatus.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Room Modal */}
      {showAddRoom && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow p-3">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-dark">
                  <i className="bi bi-door-open-fill text-warning me-2"></i> Add New Luxury Accommodation
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowAddRoom(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleCreateRoom} className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label small text-secondary fw-semibold">Room Number</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="e.g. 501"
                      value={newRoom.roomNumber}
                      onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-8">
                    <label className="form-label small text-secondary fw-semibold">Suite Name</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="e.g. Royal Horizon Panoramic Villa"
                      value={newRoom.name}
                      onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small text-secondary fw-semibold">Category</label>
                    <select
                      className="form-select rounded-3"
                      value={newRoom.category}
                      onChange={(e) => setNewRoom({ ...newRoom, category: e.target.value })}
                    >
                      <option value="Deluxe Room">Deluxe Room</option>
                      <option value="Executive Suite">Executive Suite</option>
                      <option value="Presidential Suite">Presidential Suite</option>
                      <option value="Standard Room">Standard Room</option>
                      <option value="Family Villa">Family Villa</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small text-secondary fw-semibold">Price per Night ($)</label>
                    <input
                      type="number"
                      className="form-control rounded-3"
                      placeholder="350"
                      value={newRoom.pricePerNight}
                      onChange={(e) => setNewRoom({ ...newRoom, pricePerNight: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small text-secondary fw-semibold">Max Guests</label>
                    <input
                      type="number"
                      className="form-control rounded-3"
                      value={newRoom.capacity}
                      onChange={(e) => setNewRoom({ ...newRoom, capacity: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-secondary fw-semibold">Bed Configuration</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={newRoom.bedType}
                      onChange={(e) => setNewRoom({ ...newRoom, bedType: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-secondary fw-semibold">Terrace / View</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={newRoom.view}
                      onChange={(e) => setNewRoom({ ...newRoom, view: e.target.value })}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small text-secondary fw-semibold">Amenities (Comma separated)</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={newRoom.amenities}
                      onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value })}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small text-secondary fw-semibold">Image URL</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={newRoom.images}
                      onChange={(e) => setNewRoom({ ...newRoom, images: e.target.value })}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small text-secondary fw-semibold">Description</label>
                    <textarea
                      rows="2"
                      className="form-control rounded-3"
                      value={newRoom.description}
                      onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="col-12 text-end">
                    <button type="button" className="btn btn-secondary rounded-pill me-2" onClick={() => setShowAddRoom(false)}>Cancel</button>
                    <button type="submit" className="btn btn-gold rounded-pill px-4">Publish Suite</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddStaff && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow p-3">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-dark">
                  <i className="bi bi-person-badge-fill text-primary me-2"></i> Register New Staff Member
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowAddStaff(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleCreateStaff} className="row g-3">
                  <div className="col-12">
                    <label className="form-label small text-secondary fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={newStaff.name}
                      onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small text-secondary fw-semibold">Staff Email</label>
                    <input
                      type="email"
                      className="form-control rounded-3"
                      value={newStaff.email}
                      onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small text-secondary fw-semibold">Password</label>
                    <input
                      type="password"
                      className="form-control rounded-3"
                      value={newStaff.password}
                      onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-secondary fw-semibold">Department</label>
                    <select
                      className="form-select rounded-3"
                      value={newStaff.department}
                      onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                    >
                      <option value="Front Desk">Front Desk</option>
                      <option value="Housekeeping">Housekeeping</option>
                      <option value="Concierge">Concierge</option>
                      <option value="Culinary & Dining">Culinary & Dining</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-secondary fw-semibold">Shift</label>
                    <select
                      className="form-select rounded-3"
                      value={newStaff.shift}
                      onChange={(e) => setNewStaff({ ...newStaff, shift: e.target.value })}
                    >
                      <option value="Morning">Morning Shift</option>
                      <option value="Evening">Evening Shift</option>
                      <option value="Night">Night Shift</option>
                    </select>
                  </div>
                  <div className="col-12 text-end">
                    <button type="button" className="btn btn-secondary rounded-pill me-2" onClick={() => setShowAddStaff(false)}>Cancel</button>
                    <button type="submit" className="btn btn-dark rounded-pill px-4">Register Staff</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

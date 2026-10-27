import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const StaffDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check-In modal state
  const [selectedBookingForCheckIn, setSelectedBookingForCheckIn] = useState(null);
  const [assignedKeyInput, setAssignedKeyInput] = useState('');

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const [bRes, rRes, sRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/rooms'),
        api.get('/services')
      ]);

      if (bRes.data.success) setBookings(bRes.data.bookings);
      if (rRes.data.success) setRooms(rRes.data.rooms);
      if (sRes.data.success) setServices(sRes.data.requests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCheckIn = (booking) => {
    const roomNum = booking.room?.roomNumber || '101';
    setSelectedBookingForCheckIn(booking);
    setAssignedKeyInput(`KEY-ROOM-${roomNum}-${Math.floor(10 + Math.random() * 90)}`);
  };

  const handleConfirmCheckIn = async () => {
    if (!selectedBookingForCheckIn) return;
    try {
      const res = await api.put(`/bookings/${selectedBookingForCheckIn._id}/status`, {
        status: 'checked_in',
        assignedKey: assignedKeyInput
      });

      if (res.data.success) {
        alert(`✅ Guest ${selectedBookingForCheckIn.guestName} successfully checked in! Key assigned: ${assignedKeyInput}`);
        setSelectedBookingForCheckIn(null);
        fetchStaffData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async (bookingId, guestName) => {
    if (!window.confirm(`Process check-out for ${guestName}? Room will be marked for Cleaning.`)) {
      return;
    }

    try {
      const res = await api.put(`/bookings/${bookingId}/status`, {
        status: 'checked_out'
      });

      if (res.data.success) {
        alert(`✅ Check-out complete for ${guestName}. Room queued for housekeeping.`);
        fetchStaffData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Check-out failed');
    }
  };

  const handleRoomStatusUpdate = async (roomId, newStatus) => {
    try {
      const res = await api.put(`/rooms/${roomId}`, { status: newStatus });
      if (res.data.success) {
        setRooms((prev) =>
          prev.map((r) => (r._id === roomId ? { ...r, status: newStatus } : r))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Room update failed');
    }
  };

  const handleServiceStatusUpdate = async (serviceId, newStatus) => {
    try {
      const res = await api.put(`/services/${serviceId}`, {
        status: newStatus,
        assignedStaff: user.name
      });
      if (res.data.success) {
        setServices((prev) =>
          prev.map((s) => (s._id === serviceId ? { ...s, status: newStatus, assignedStaff: user.name } : s))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Service update failed');
    }
  };

  // Metrics
  const occupiedCount = rooms.filter((r) => r.status === 'occupied').length;
  const availableCount = rooms.filter((r) => r.status === 'available').length;
  const cleaningCount = rooms.filter((r) => r.status === 'cleaning').length;
  const maintenanceCount = rooms.filter((r) => r.status === 'maintenance').length;

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container px-4 px-lg-5">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-primary px-3 py-1 text-uppercase fw-bold">STAFF OPERATIONS PORTAL</span>
              <span className="text-secondary small">&bull; Front Desk & Housekeeping Console</span>
            </div>
            <h2 className="display-6 fw-bold text-dark mb-0">Daily Operational Roster</h2>
          </div>
          <div className="mt-3 mt-md-0 d-flex align-items-center gap-2">
            <span className="text-secondary small">Attendant:</span>
            <span className="badge bg-dark text-white px-3 py-2 fw-semibold">
              <i className="bi bi-person-badge me-1 text-warning"></i> {user.name} ({user.department || 'Operations'})
            </span>
          </div>
        </div>

        {/* Room Status KPI Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-6">
            <div className="card border-0 rounded-4 shadow-sm p-3 bg-white border-start border-success border-4">
              <span className="text-secondary small fw-bold text-uppercase">Available Rooms</span>
              <h3 className="fw-bold text-success mb-0">{availableCount}</h3>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 rounded-4 shadow-sm p-3 bg-white border-start border-danger border-4">
              <span className="text-secondary small fw-bold text-uppercase">Occupied Rooms</span>
              <h3 className="fw-bold text-danger mb-0">{occupiedCount}</h3>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 rounded-4 shadow-sm p-3 bg-white border-start border-warning border-4">
              <span className="text-secondary small fw-bold text-uppercase">In Cleaning</span>
              <h3 className="fw-bold text-warning mb-0">{cleaningCount}</h3>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 rounded-4 shadow-sm p-3 bg-white border-start border-secondary border-4">
              <span className="text-secondary small fw-bold text-uppercase">Maintenance</span>
              <h3 className="fw-bold text-secondary mb-0">{maintenanceCount}</h3>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="d-flex gap-2 border-bottom mb-4 bg-white p-2 rounded-3 shadow-sm">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`dashboard-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          >
            <i className="bi bi-box-arrow-in-right me-2"></i> Check-In & Check-Out Desk ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`dashboard-tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
          >
            <i className="bi bi-door-open-fill me-2"></i> Live Room Inventory ({rooms.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`dashboard-tab-btn ${activeTab === 'services' ? 'active' : ''}`}
          >
            <i className="bi bi-stars me-2"></i> Housekeeping & Requests ({services.length})
          </button>
        </div>

        {/* Tab 1: Bookings / Check-In / Check-Out */}
        {activeTab === 'bookings' && (
          <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
            <h5 className="fw-bold text-dark mb-3">Reservations, Check-Ins & Check-Outs</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light small text-uppercase text-secondary">
                  <tr>
                    <th>Ref #</th>
                    <th>Guest Name</th>
                    <th>Room</th>
                    <th>Stay Dates</th>
                    <th>Status</th>
                    <th>Key Card</th>
                    <th className="text-end">Staff Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => {
                    const room = b.room || {};
                    return (
                      <tr key={b._id}>
                        <td className="fw-bold text-dark"><code>{b.bookingReference}</code></td>
                        <td>
                          <div className="fw-bold text-dark">{b.guestName}</div>
                          <small className="text-secondary">{b.guestEmail}</small>
                        </td>
                        <td>
                          <div className="fw-semibold text-dark">{room.name || 'Room'}</div>
                          <small className="badge bg-light text-dark border">#{room.roomNumber || '101'}</small>
                        </td>
                        <td className="small text-secondary">
                          {new Date(b.checkInDate).toLocaleDateString()} &rarr; {new Date(b.checkOutDate).toLocaleDateString()}
                        </td>
                        <td>
                          <span className={`badge ${b.bookingStatus === 'checked_in' ? 'bg-success' : b.bookingStatus === 'checked_out' ? 'bg-secondary' : b.bookingStatus === 'cancelled' ? 'bg-danger' : 'bg-primary'}`}>
                            {b.bookingStatus.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          {b.assignedKey ? (
                            <span className="badge bg-dark"><code>{b.assignedKey}</code></span>
                          ) : (
                            <span className="text-muted small">Not assigned</span>
                          )}
                        </td>
                        <td className="text-end">
                          {b.bookingStatus === 'confirmed' && (
                            <button
                              onClick={() => handleOpenCheckIn(b)}
                              className="btn btn-success btn-sm rounded-pill px-3 fw-semibold"
                            >
                              <i className="bi bi-box-arrow-in-right me-1"></i> Check In
                            </button>
                          )}
                          {b.bookingStatus === 'checked_in' && (
                            <button
                              onClick={() => handleCheckOut(b._id, b.guestName)}
                              className="btn btn-danger btn-sm rounded-pill px-3 fw-semibold"
                            >
                              <i className="bi bi-box-arrow-right me-1"></i> Check Out
                            </button>
                          )}
                          {(b.bookingStatus === 'checked_out' || b.bookingStatus === 'cancelled') && (
                            <span className="text-muted small">Completed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Live Room Inventory */}
        {activeTab === 'rooms' && (
          <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
            <h5 className="fw-bold text-dark mb-3">Live Room Status Updates</h5>
            <div className="row g-3">
              {rooms.map((room) => (
                <div key={room._id} className="col-md-6 col-lg-4">
                  <div className="p-3 border rounded-3 bg-light d-flex flex-column justify-content-between h-100">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="fw-bold text-dark mb-0">Room #{room.roomNumber}</h6>
                        <small className="text-secondary">{room.name}</small>
                      </div>
                      <span className={`badge ${room.status === 'available' ? 'bg-success' : room.status === 'occupied' ? 'bg-danger' : room.status === 'cleaning' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                        {room.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-secondary small mb-3">
                      Floor {room.floor} &bull; {room.view} &bull; ${room.pricePerNight}/night
                    </p>

                    <div>
                      <label className="form-label text-muted small mb-1 fw-semibold">Quick Status Change:</label>
                      <div className="btn-group w-100 btn-group-sm">
                        <button
                          type="button"
                          onClick={() => handleRoomStatusUpdate(room._id, 'available')}
                          className={`btn ${room.status === 'available' ? 'btn-success' : 'btn-outline-secondary'}`}
                        >
                          Available
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRoomStatusUpdate(room._id, 'occupied')}
                          className={`btn ${room.status === 'occupied' ? 'btn-danger' : 'btn-outline-secondary'}`}
                        >
                          Occupied
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRoomStatusUpdate(room._id, 'cleaning')}
                          className={`btn ${room.status === 'cleaning' ? 'btn-warning' : 'btn-outline-secondary'}`}
                        >
                          Cleaning
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRoomStatusUpdate(room._id, 'maintenance')}
                          className={`btn ${room.status === 'maintenance' ? 'btn-dark' : 'btn-outline-secondary'}`}
                        >
                          Maint.
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Housekeeping & Service Requests */}
        {activeTab === 'services' && (
          <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
            <h5 className="fw-bold text-dark mb-3">Service & Housekeeping Queue</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light small text-uppercase text-secondary">
                  <tr>
                    <th>Room</th>
                    <th>Guest</th>
                    <th>Service Type</th>
                    <th>Description</th>
                    <th>Priority</th>
                    <th>Attendant</th>
                    <th>Status</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((req) => (
                    <tr key={req._id}>
                      <td className="fw-bold text-dark">#{req.roomNumber}</td>
                      <td>{req.guestName}</td>
                      <td><span className="badge bg-light text-dark border">{req.type}</span></td>
                      <td className="small text-secondary" style={{ maxWidth: 280 }}>{req.description}</td>
                      <td>
                        <span className={`badge ${req.priority === 'urgent' ? 'bg-danger' : req.priority === 'high' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>
                          {req.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="small text-secondary">{req.assignedStaff || 'Unassigned'}</td>
                      <td>
                        <span className={`badge ${req.status === 'completed' ? 'bg-success' : req.status === 'in_progress' ? 'bg-primary' : 'bg-secondary'}`}>
                          {req.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="text-end">
                        {req.status === 'pending' && (
                          <button
                            onClick={() => handleServiceStatusUpdate(req._id, 'in_progress')}
                            className="btn btn-primary btn-sm rounded-pill px-3"
                          >
                            Accept Task
                          </button>
                        )}
                        {req.status === 'in_progress' && (
                          <button
                            onClick={() => handleServiceStatusUpdate(req._id, 'completed')}
                            className="btn btn-success btn-sm rounded-pill px-3"
                          >
                            Mark Done
                          </button>
                        )}
                        {req.status === 'completed' && (
                          <span className="text-success small fw-bold"><i className="bi bi-check2-all"></i> Resolved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Check-In Modal */}
      {selectedBookingForCheckIn && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow p-3">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-dark">
                  <i className="bi bi-door-open-fill text-warning me-2"></i> Complete Guest Check-In
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedBookingForCheckIn(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-secondary small">
                  Verify guest identification and assign an encoded digital RFID key card for their suite.
                </p>

                <div className="bg-light p-3 rounded-3 mb-3 small">
                  <p className="mb-1"><strong>Guest:</strong> {selectedBookingForCheckIn.guestName}</p>
                  <p className="mb-1"><strong>Suite:</strong> {selectedBookingForCheckIn.room?.name} (#{selectedBookingForCheckIn.room?.roomNumber})</p>
                  <p className="mb-0"><strong>Duration:</strong> {selectedBookingForCheckIn.nights} Night(s)</p>
                </div>

                <div className="mb-3">
                  <label className="form-label small text-secondary fw-semibold">Encoded RFID Key Card Code</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={assignedKeyInput}
                    onChange={(e) => setAssignedKeyInput(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-secondary rounded-pill px-3"
                  onClick={() => setSelectedBookingForCheckIn(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-gold rounded-pill px-4"
                  onClick={handleConfirmCheckIn}
                >
                  <i className="bi bi-check-lg me-1"></i> Confirm & Hand Over Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;

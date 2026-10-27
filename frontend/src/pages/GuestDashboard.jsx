import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import InvoiceModal from '../components/InvoiceModal';

const GuestDashboard = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Invoice modal state
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState(null);

  // New Service Request form
  const [serviceType, setServiceType] = useState('Housekeeping');
  const [serviceRoomNumber, setServiceRoomNumber] = useState('101');
  const [serviceDescription, setServiceDescription] = useState('');
  const [servicePriority, setServicePriority] = useState('medium');
  const [submittingService, setSubmittingService] = useState(false);

  // Profile update form
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, servicesRes] = await Promise.all([
        api.get('/bookings/my'),
        api.get('/services')
      ]);

      if (bookingsRes.data.success) {
        setBookings(bookingsRes.data.bookings);
        // Pre-fill room number from active booking if available
        if (bookingsRes.data.bookings.length > 0) {
          const rNum = bookingsRes.data.bookings[0].room?.roomNumber;
          if (rNum) setServiceRoomNumber(rNum);
        }
      }

      if (servicesRes.data.success) {
        setServices(servicesRes.data.requests);
      }
    } catch (err) {
      console.error('Failed to load guest data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you wish to cancel this reservation and initiate a full refund?')) {
      return;
    }

    try {
      const res = await api.put(`/bookings/${id}/cancel`);
      if (res.data.success) {
        alert('Booking cancelled and refund processed successfully.');
        fetchDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation failed');
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setSubmittingService(true);
    try {
      const res = await api.post('/services', {
        roomNumber: serviceRoomNumber,
        type: serviceType,
        description: serviceDescription,
        priority: servicePriority
      });

      if (res.data.success) {
        alert('✨ Service request dispatched to HotelPro Concierge desk!');
        setServiceDescription('');
        setServices([res.data.request, ...services]);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to dispatch request');
    } finally {
      setSubmittingService(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.put('/auth/profile', {
        name: profileName,
        phone: profilePhone
      });

      if (res.data.success) {
        updateUser(res.data.user);
        alert('Profile details updated successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container px-4 px-lg-5">
        {/* Welcome Header */}
        <div className="card border-0 rounded-4 shadow-sm p-4 bg-white mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                alt={user?.name}
                className="rounded-circle border border-warning border-2"
                style={{ width: 64, height: 64, objectFit: 'cover' }}
              />
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h3 className="fw-bold text-dark mb-0">{user?.name}</h3>
                  <span className="badge bg-warning text-dark fw-bold">VIP Concierge Tier</span>
                </div>
                <p className="text-secondary small mb-0">
                  <i className="bi bi-envelope me-1"></i> {user?.email} &bull; <i className="bi bi-telephone ms-2 me-1"></i> {user?.phone}
                </p>
              </div>
            </div>

            <div className="d-flex gap-2">
              <Link to="/rooms" className="btn btn-gold rounded-pill px-4">
                <i className="bi bi-plus-circle me-1"></i> Reserve Another Suite
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Nav Tabs */}
        <div className="d-flex gap-2 border-bottom mb-4 bg-white p-2 rounded-3 shadow-sm">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`dashboard-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          >
            <i className="bi bi-calendar2-check me-2"></i> My Reservations ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`dashboard-tab-btn ${activeTab === 'services' ? 'active' : ''}`}
          >
            <i className="bi bi-bell-fill me-2"></i> In-Room Services & Concierge
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`dashboard-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          >
            <i className="bi bi-person-gear me-2"></i> Profile & Preferences
          </button>
        </div>

        {/* Tab 1: Bookings */}
        {activeTab === 'bookings' && (
          <div>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-5 bg-white rounded-4 border p-5">
                <i className="bi bi-calendar-x text-secondary display-4"></i>
                <h4 className="fw-bold text-dark mt-3">No active reservations found</h4>
                <p className="text-secondary">Ready to experience world-class comfort?</p>
                <Link to="/rooms" className="btn btn-gold rounded-pill px-4 mt-2">
                  Browse Available Suites
                </Link>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {bookings.map((booking) => {
                  const room = booking.room || {};
                  const isCheckedIn = booking.bookingStatus === 'checked_in';
                  const isCancelled = booking.bookingStatus === 'cancelled';

                  return (
                    <div key={booking._id} className="card border-0 rounded-4 shadow-sm bg-white overflow-hidden">
                      <div className="row g-0">
                        <div className="col-md-4">
                          <img
                            src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'}
                            alt={room.name || 'Room'}
                            className="w-100 h-100 object-fit-cover"
                            style={{ minHeight: 220, objectFit: 'cover' }}
                          />
                        </div>
                        <div className="col-md-8 p-4 d-flex flex-column justify-content-between">
                          <div>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <span className="badge bg-dark me-2">Ref: {booking.bookingReference}</span>
                                <span className={`badge ${isCancelled ? 'bg-danger' : isCheckedIn ? 'bg-success' : 'bg-primary'}`}>
                                  {booking.bookingStatus.toUpperCase()}
                                </span>
                              </div>
                              <span className="badge bg-success bg-opacity-10 text-success border border-success fw-bold">
                                {booking.paymentStatus.toUpperCase()}
                              </span>
                            </div>

                            <h4 className="fw-bold text-dark mb-1">{room.name || 'Deluxe Suite'}</h4>
                            <p className="text-secondary small mb-3">
                              Room #{room.roomNumber || '101'} &bull; {room.view || 'Scenic View'} &bull; Floor {room.floor || 1}
                            </p>

                            <div className="row g-2 mb-3 bg-light p-3 rounded-3 small text-secondary">
                              <div className="col-sm-4">
                                <span className="d-block fw-semibold text-dark">Check-in</span>
                                <span>{new Date(booking.checkInDate).toLocaleDateString()} (14:00)</span>
                              </div>
                              <div className="col-sm-4">
                                <span className="d-block fw-semibold text-dark">Check-out</span>
                                <span>{new Date(booking.checkOutDate).toLocaleDateString()} (11:00)</span>
                              </div>
                              <div className="col-sm-4">
                                <span className="d-block fw-semibold text-dark">Total Paid</span>
                                <span className="fw-bold text-dark">${booking.totalAmount} ({booking.nights} nights)</span>
                              </div>
                            </div>

                            {booking.assignedKey && (
                              <div className="d-flex align-items-center gap-2 mb-3 p-2 rounded-3 bg-warning bg-opacity-10 border border-warning border-opacity-25 small">
                                <i className="bi bi-key-fill text-warning fs-5"></i>
                                <span><strong>Assigned Digital Key Card:</strong> <code>{booking.assignedKey}</code></span>
                              </div>
                            )}
                          </div>

                          <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top">
                            <button
                              onClick={() => setSelectedBookingForInvoice(booking)}
                              className="btn btn-outline-dark btn-sm rounded-pill px-3"
                            >
                              <i className="bi bi-receipt me-1"></i> View Tax Invoice
                            </button>
                            {!isCancelled && (
                              <button
                                onClick={() => handleCancelBooking(booking._id)}
                                className="btn btn-outline-danger btn-sm rounded-pill px-3"
                              >
                                <i className="bi bi-x-circle me-1"></i> Cancel Reservation
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Services */}
        {activeTab === 'services' && (
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
                <h5 className="fw-bold text-dark mb-3">
                  <i className="bi bi-bell-fill text-warning me-2"></i> Request Hotel Service
                </h5>
                <p className="text-secondary small mb-3">
                  Our 24/7 staff will promptly attend to your room.
                </p>

                <form onSubmit={handleServiceSubmit}>
                  <div className="mb-3">
                    <label className="form-label small text-secondary fw-semibold">Suite Number</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={serviceRoomNumber}
                      onChange={(e) => setServiceRoomNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small text-secondary fw-semibold">Service Type</label>
                    <select
                      className="form-select rounded-3"
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                    >
                      <option value="Housekeeping">Housekeeping & Fresh Linens</option>
                      <option value="Room Service">Fine Dining Room Service</option>
                      <option value="Maintenance">Room Maintenance / AC</option>
                      <option value="Luggage Assistance">Luggage & Bellboy Assistance</option>
                      <option value="Wake-up Call">Personal Wake-up Call</option>
                      <option value="Concierge">Bespoke Concierge / Chauffeur</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small text-secondary fw-semibold">Priority</label>
                    <select
                      className="form-select rounded-3"
                      value={servicePriority}
                      onChange={(e) => setServicePriority(e.target.value)}
                    >
                      <option value="low">Standard</option>
                      <option value="medium">Medium</option>
                      <option value="high">High Priority</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small text-secondary fw-semibold">Specific Request Details</label>
                    <textarea
                      rows="3"
                      className="form-control rounded-3"
                      placeholder="e.g. Please bring two extra down pillows and ice bucket..."
                      value={serviceDescription}
                      onChange={(e) => setServiceDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingService}
                    className="btn btn-gold w-100 rounded-pill py-2 fw-semibold"
                  >
                    {submittingService ? 'Dispatching...' : 'Dispatch Request'}
                  </button>
                </form>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
                <h5 className="fw-bold text-dark mb-3">
                  <i className="bi bi-clock-history text-warning me-2"></i> Service Request Log
                </h5>

                {services.length === 0 ? (
                  <p className="text-secondary text-center my-4">No active service requests.</p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {services.map((req) => (
                      <div key={req._id} className="p-3 border rounded-3 bg-light">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-bold text-dark">
                            <i className="bi bi-door-closed text-warning me-1"></i> Room #{req.roomNumber} &bull; {req.type}
                          </span>
                          <span className={`badge ${req.status === 'completed' ? 'bg-success' : req.status === 'in_progress' ? 'bg-primary' : 'bg-warning text-dark'}`}>
                            {req.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-secondary small mb-2">{req.description}</p>
                        <div className="d-flex justify-content-between align-items-center small text-muted">
                          <span>Attendant: {req.assignedStaff || 'Assigned automatically'}</span>
                          <span>{new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Profile */}
        {activeTab === 'profile' && (
          <div className="card border-0 rounded-4 shadow-sm p-4 bg-white max-w-xl mx-auto" style={{ maxWidth: 600 }}>
            <h5 className="fw-bold text-dark mb-3">Personal Guest Profile</h5>
            <form onSubmit={handleProfileUpdate}>
              <div className="mb-3">
                <label className="form-label small text-secondary fw-semibold">Full Legal Name</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary fw-semibold">Email Address (Read-Only)</label>
                <input
                  type="email"
                  className="form-control rounded-3 bg-light"
                  value={user?.email}
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="form-label small text-secondary fw-semibold">Primary Contact Phone</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="btn btn-gold rounded-pill px-4"
              >
                {savingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedBookingForInvoice && (
        <InvoiceModal
          booking={selectedBookingForInvoice}
          show={!!selectedBookingForInvoice}
          onClose={() => setSelectedBookingForInvoice(null)}
        />
      )}
    </div>
  );
};

export default GuestDashboard;

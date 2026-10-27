import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, location.pathname]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      // Silently catch if not logged in
    }
  };

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark luxury-navbar sticky-top py-3">
      <div className="container-fluid px-lg-5">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <div
            className="d-flex align-items-center justify-content-center rounded-3"
            style={{
              width: 38,
              height: 38,
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              color: '#fff',
              fontSize: '1.2rem',
              boxShadow: '0 4px 10px rgba(217, 119, 6, 0.4)'
            }}
          >
            <i className="bi bi-buildings"></i>
          </div>
          <div>
            <span className="brand-font fw-bold text-white fs-4 tracking-wide">HOTEL</span>
            <span className="brand-font fw-bold fs-4" style={{ color: '#f59e0b' }}>PRO</span>
            <span
              className="d-block text-secondary"
              style={{ fontSize: '0.62rem', letterSpacing: '2px', textTransform: 'uppercase' }}
            >
              Luxury Resorts & Suites
            </span>
          </div>
        </Link>

        <button
          className="navbar-toggler border-secondary"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <Link className={`nav-link px-3 ${location.pathname === '/' ? 'active text-warning fw-semibold' : 'text-light'}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link px-3 ${location.pathname === '/rooms' ? 'active text-warning fw-semibold' : 'text-light'}`} to="/rooms">
                Suites & Rooms
              </Link>
            </li>

            {isAuthenticated && (
              <li className="nav-item">
                <Link className={`nav-link px-3 ${location.pathname === '/dashboard' ? 'active text-warning fw-semibold' : 'text-light'}`} to="/dashboard">
                  <i className="bi bi-calendar2-check me-1"></i> My Bookings
                </Link>
              </li>
            )}

            {(user?.role === 'staff' || user?.role === 'admin') && (
              <li className="nav-item">
                <Link className={`nav-link px-3 ${location.pathname === '/staff' ? 'active text-warning fw-semibold' : 'text-light'}`} to="/staff">
                  <span className="badge bg-primary me-1">Staff</span> Operations
                </Link>
              </li>
            )}

            {user?.role === 'admin' && (
              <li className="nav-item">
                <Link className={`nav-link px-3 ${location.pathname === '/admin' ? 'active text-warning fw-semibold' : 'text-light'}`} to="/admin">
                  <span className="badge bg-danger me-1">Admin</span> Analytics
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {/* Notification Bell */}
            {isAuthenticated && (
              <div className="position-relative">
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="btn btn-dark rounded-circle position-relative border border-secondary text-light p-2"
                  style={{ width: 40, height: 40 }}
                  title="Notifications"
                >
                  <i className="bi bi-bell"></i>
                  {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifs && (
                  <div
                    className="position-absolute end-0 mt-2 bg-dark border border-secondary rounded-3 shadow-lg p-3 text-light"
                    style={{ width: 320, zIndex: 1050, maxHeight: 380, overflowY: 'auto' }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-secondary">
                      <h6 className="mb-0 fw-bold">Notifications</h6>
                      <small className="text-secondary">{unreadCount} new</small>
                    </div>

                    {notifications.length === 0 ? (
                      <p className="text-muted small my-3 text-center">No notifications yet</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          onClick={() => markRead(n._id)}
                          className={`p-2 rounded mb-2 cursor-pointer ${n.isRead ? 'bg-secondary bg-opacity-25' : 'bg-primary bg-opacity-25 border border-primary'}`}
                          style={{ cursor: 'pointer', fontSize: '0.82rem' }}
                        >
                          <div className="fw-semibold text-warning">{n.title}</div>
                          <div className="text-light text-opacity-75">{n.message}</div>
                          <small className="text-secondary" style={{ fontSize: '0.7rem' }}>
                            {new Date(n.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* User profile dropdown or Login button */}
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2 rounded-pill px-3 py-1 border-secondary"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="rounded-circle"
                    style={{ width: 28, height: 28, objectFit: 'cover' }}
                  />
                  <span className="d-none d-sm-inline fw-semibold" style={{ fontSize: '0.88rem' }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <span className={`badge ${user.role === 'admin' ? 'bg-danger' : user.role === 'staff' ? 'bg-primary' : 'bg-success'}`} style={{ fontSize: '0.65rem' }}>
                    {user.role}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark shadow border-secondary mt-2">
                  <li className="px-3 py-2 border-bottom border-secondary">
                    <p className="mb-0 fw-bold text-white">{user.name}</p>
                    <small className="text-secondary">{user.email}</small>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2" to="/dashboard">
                      <i className="bi bi-speedometer2 me-2"></i> Guest Dashboard
                    </Link>
                  </li>
                  {(user.role === 'staff' || user.role === 'admin') && (
                    <li>
                      <Link className="dropdown-item py-2" to="/staff">
                        <i className="bi bi-person-workspace me-2"></i> Staff Portal
                      </Link>
                    </li>
                  )}
                  {user.role === 'admin' && (
                    <li>
                      <Link className="dropdown-item py-2" to="/admin">
                        <i className="bi bi-graph-up-arrow me-2"></i> Admin Analytics
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider border-secondary" /></li>
                  <li>
                    <button
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                      className="dropdown-item text-danger py-2"
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm px-3 rounded-pill">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-gold btn-sm px-3 rounded-pill">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

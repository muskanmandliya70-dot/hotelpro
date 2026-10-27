import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate(redirectPath);
    } else {
      setError(res.message);
    }
  };

  const handleDemo = async (role) => {
    setError('');
    setLoading(true);
    const res = await quickDemoLogin(role);
    setLoading(false);

    if (res.success) {
      if (role === 'admin') navigate('/admin');
      else if (role === 'staff') navigate('/staff');
      else navigate(redirectPath);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card border-0 rounded-4 shadow-lg p-4 p-md-5 bg-white">
              {/* Brand Header */}
              <div className="text-center mb-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-3 mb-2"
                  style={{ width: 48, height: 48, background: '#d97706', color: '#fff', fontSize: '1.4rem' }}
                >
                  <i className="bi bi-buildings"></i>
                </div>
                <h3 className="brand-font fw-bold text-dark mb-1">Sign In to HotelPro</h3>
                <p className="text-secondary small">Access reservations, services, and operations</p>
              </div>

              {/* 1-Click Fast Evaluator Buttons */}
              <div className="bg-light p-3 rounded-3 mb-4 border">
                <span className="d-block text-secondary small fw-bold text-uppercase mb-2 text-center">
                  <i className="bi bi-lightning-charge-fill text-warning me-1"></i> Quick 1-Click Demo Login
                </span>
                <div className="d-flex flex-column gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemo('admin')}
                    className="btn btn-outline-danger btn-sm text-start d-flex justify-content-between align-items-center rounded-3 py-2"
                  >
                    <span><i className="bi bi-shield-lock-fill me-2"></i> Log in as <strong>Admin</strong> (Alexander)</span>
                    <span className="badge bg-danger">Full Control</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemo('staff')}
                    className="btn btn-outline-primary btn-sm text-start d-flex justify-content-between align-items-center rounded-3 py-2"
                  >
                    <span><i className="bi bi-person-workspace me-2"></i> Log in as <strong>Staff</strong> (Elena)</span>
                    <span className="badge bg-primary">Operations</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemo('guest')}
                    className="btn btn-outline-success btn-sm text-start d-flex justify-content-between align-items-center rounded-3 py-2"
                  >
                    <span><i className="bi bi-person-check-fill me-2"></i> Log in as <strong>Guest</strong> (Sarah)</span>
                    <span className="badge bg-success">Bookings</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small rounded-3" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small text-secondary fw-semibold">Email Address</label>
                  <input
                    type="email"
                    className="form-control rounded-3"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small text-secondary fw-semibold">Password</label>
                  <input
                    type="password"
                    className="form-control rounded-3"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-gold btn-lg w-100 rounded-pill py-2 fw-semibold"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>

              <div className="text-center mt-4">
                <span className="text-secondary small">Don't have an account? </span>
                <Link to="/register" className="text-warning text-decoration-none fw-semibold small">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

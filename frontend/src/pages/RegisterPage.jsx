import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'guest'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const res = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: formData.role
    });
    setLoading(false);

    if (res.success) {
      if (formData.role === 'admin') navigate('/admin');
      else if (formData.role === 'staff') navigate('/staff');
      else navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6">
            <div className="card border-0 rounded-4 shadow-lg p-4 p-md-5 bg-white">
              {/* Header */}
              <div className="text-center mb-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-3 mb-2"
                  style={{ width: 48, height: 48, background: '#d97706', color: '#fff', fontSize: '1.4rem' }}
                >
                  <i className="bi bi-buildings"></i>
                </div>
                <h3 className="brand-font fw-bold text-dark mb-1">Create HotelPro Account</h3>
                <p className="text-secondary small">Join our privileged circle of guests & hoteliers</p>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small rounded-3" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-12">
                  <label className="form-label small text-secondary fw-semibold">Full Legal Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control rounded-3"
                    placeholder="e.g. Eleanor Vance"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small text-secondary fw-semibold">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control rounded-3"
                    placeholder="eleanor@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small text-secondary fw-semibold">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control rounded-3"
                    placeholder="+1 (555) 019-2834"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small text-secondary fw-semibold">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control rounded-3"
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small text-secondary fw-semibold">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control rounded-3"
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small text-secondary fw-semibold">Account Purpose / Role</label>
                  <select
                    name="role"
                    className="form-select rounded-3"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="guest">Guest (Booking & Concierge Access)</option>
                    <option value="staff">Staff (Front Desk & Housekeeping Operations)</option>
                  </select>
                </div>

                <div className="col-12 mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-gold btn-lg w-100 rounded-pill py-2 fw-semibold"
                  >
                    {loading ? 'Creating Account...' : 'Complete Registration'}
                  </button>
                </div>
              </form>

              <div className="text-center mt-4">
                <span className="text-secondary small">Already registered with HotelPro? </span>
                <Link to="/login" className="text-warning text-decoration-none fw-semibold small">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

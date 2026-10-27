import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DemoCredentialsBar = () => {
  const { user, quickDemoLogin, logout } = useAuth();
  const navigate = useNavigate();

  const handleDemo = async (role) => {
    const res = await quickDemoLogin(role);
    if (res.success) {
      if (role === 'admin') navigate('/admin');
      else if (role === 'staff') navigate('/staff');
      else navigate('/dashboard');
    }
  };

  return (
    <div className="demo-topbar d-none d-md-block">
      <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-warning text-dark fw-bold px-2 py-1">
            <i className="bi bi-patch-check-fill me-1"></i> EVALUATOR DEMO BAR
          </span>
          <span className="text-secondary">Instant 1-Click Role Switcher:</span>
          <button
            onClick={() => handleDemo('admin')}
            className={`btn btn-xs py-0 px-2 rounded ${user?.role === 'admin' ? 'btn-danger' : 'btn-outline-secondary text-light'}`}
            style={{ fontSize: '0.78rem' }}
          >
            <i className="bi bi-shield-lock me-1"></i> Admin (Alexander)
          </button>
          <button
            onClick={() => handleDemo('staff')}
            className={`btn btn-xs py-0 px-2 rounded ${user?.role === 'staff' ? 'btn-primary' : 'btn-outline-secondary text-light'}`}
            style={{ fontSize: '0.78rem' }}
          >
            <i className="bi bi-person-badge me-1"></i> Staff (Elena)
          </button>
          <button
            onClick={() => handleDemo('guest')}
            className={`btn btn-xs py-0 px-2 rounded ${user?.role === 'guest' ? 'btn-success' : 'btn-outline-secondary text-light'}`}
            style={{ fontSize: '0.78rem' }}
          >
            <i className="bi bi-person-check me-1"></i> Guest (Sarah)
          </button>
        </div>

        <div className="d-flex align-items-center gap-3">
          {user ? (
            <div className="d-flex align-items-center gap-2">
              <span className="text-light" style={{ fontSize: '0.8rem' }}>
                Active: <strong className="text-warning">{user.name}</strong> ({user.role.toUpperCase()})
              </span>
              <button
                onClick={logout}
                className="btn btn-link text-secondary p-0 text-decoration-none"
                style={{ fontSize: '0.78rem' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <span className="text-secondary" style={{ fontSize: '0.78rem' }}>
              Credentials: admin@hotelpro.com / staff@hotelpro.com / guest@hotelpro.com
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoCredentialsBar;

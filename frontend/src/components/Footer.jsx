import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-4 border-top border-secondary mt-auto" style={{ backgroundColor: '#090e17' }}>
      <div className="container px-4 px-lg-5">
        <div className="row g-4 mb-5">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{
                  width: 36,
                  height: 36,
                  background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                  color: '#fff'
                }}
              >
                <i className="bi bi-buildings"></i>
              </div>
              <h4 className="brand-font fw-bold mb-0 text-white">HOTEL<span style={{ color: '#f59e0b' }}>PRO</span></h4>
            </div>
            <p className="text-secondary small pe-lg-4">
              World-class hospitality management and boutique luxury accommodations. Elevating guest journeys through seamless reservations, personalized services, and unmatched comfort.
            </p>
            <div className="d-flex gap-3 text-secondary">
              <a href="#facebook" className="text-secondary hover-gold"><i className="bi bi-facebook fs-5"></i></a>
              <a href="#instagram" className="text-secondary hover-gold"><i className="bi bi-instagram fs-5"></i></a>
              <a href="#twitter" className="text-secondary hover-gold"><i className="bi bi-twitter-x fs-5"></i></a>
              <a href="#linkedin" className="text-secondary hover-gold"><i className="bi bi-linkedin fs-5"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-warning text-uppercase fw-bold mb-3" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>Quick Links</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-secondary">
              <li><Link to="/" className="text-secondary text-decoration-none hover-white">Home</Link></li>
              <li><Link to="/rooms" className="text-secondary text-decoration-none hover-white">Suites & Rooms</Link></li>
              <li><Link to="/dashboard" className="text-secondary text-decoration-none hover-white">Guest Dashboard</Link></li>
              <li><Link to="/staff" className="text-secondary text-decoration-none hover-white">Staff Operations</Link></li>
              <li><Link to="/admin" className="text-secondary text-decoration-none hover-white">Admin Analytics</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 col-6">
            <h6 className="text-warning text-uppercase fw-bold mb-3" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>Accommodations</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-secondary">
              <li>Presidential Royal Penthouse</li>
              <li>Grand Oceanfront Deluxe Suite</li>
              <li>Executive Skyline Haven</li>
              <li>Bespoke Family Poolside Villa</li>
              <li>Classic Heritage Twin Room</li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-warning text-uppercase fw-bold mb-3" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>Concierge & Inquiries</h6>
            <p className="text-secondary small mb-2"><i className="bi bi-geo-alt-fill text-warning me-2"></i> 742 Evergreen Oceanfront Blvd, Marina Bay</p>
            <p className="text-secondary small mb-2"><i className="bi bi-telephone-fill text-warning me-2"></i> +1 (800) 555-HOTEL (4683)</p>
            <p className="text-secondary small mb-3"><i className="bi bi-envelope-fill text-warning me-2"></i> reservations@hotelpro.com</p>
            <span className="badge bg-warning text-dark px-3 py-2 fw-semibold">
              <i className="bi bi-award-fill me-1"></i> Forbes 5-Star Certified 2026
            </span>
          </div>
        </div>

        <div className="border-top border-secondary pt-3 d-flex flex-column flex-md-row justify-content-between align-items-center text-secondary small">
          <p className="mb-2 mb-md-0">
            &copy; {new Date().getFullYear()} HotelPro Hospitality Management System. Developed with MERN Stack.
          </p>
          <div className="d-flex gap-3">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

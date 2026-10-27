import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="py-5 min-vh-75 d-flex align-items-center justify-content-center text-center">
      <div className="p-5">
        <h1 className="display-1 fw-bold text-warning">404</h1>
        <h3 className="fw-bold text-dark">Page Not Found</h3>
        <p className="text-secondary max-w-md mx-auto mb-4">
          The sanctuary or suite view you requested is unavailable or has been relocated.
        </p>
        <Link to="/" className="btn btn-gold rounded-pill px-4">
          Return to Sanctuary Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

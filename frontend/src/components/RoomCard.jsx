import React from 'react';
import { Link } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const isAvailable = room.status === 'available';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return <span className="badge badge-available px-2 py-1"><i className="bi bi-check-circle me-1"></i>Available</span>;
      case 'occupied':
        return <span className="badge badge-occupied px-2 py-1"><i className="bi bi-person-fill me-1"></i>Occupied</span>;
      case 'cleaning':
        return <span className="badge badge-cleaning px-2 py-1"><i className="bi bi-stars me-1"></i>Cleaning</span>;
      case 'maintenance':
        return <span className="badge badge-maintenance px-2 py-1"><i className="bi bi-tools me-1"></i>Maintenance</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const imageSrc =
    room.images && room.images.length > 0
      ? room.images[0]
      : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="card hotel-card h-100 d-flex flex-column">
      <div className="position-relative overflow-hidden" style={{ height: 230 }}>
        <img
          src={imageSrc}
          alt={room.name}
          className="w-100 h-100 object-fit-cover transition-transform"
          style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        />
        <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
          <span className="badge bg-dark bg-opacity-75 text-warning px-2 py-1 border border-warning border-opacity-25" style={{ fontSize: '0.75rem' }}>
            {room.category}
          </span>
        </div>
        <div className="position-absolute top-0 end-0 m-3">
          {getStatusBadge(room.status)}
        </div>
        <div className="position-absolute bottom-0 start-0 w-100 p-2 d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
          <span className="text-white small fw-semibold">
            <i className="bi bi-door-closed me-1 text-warning"></i> Room #{room.roomNumber}
          </span>
          <span className="badge bg-warning text-dark fw-bold">
            <i className="bi bi-star-fill me-1"></i> {room.rating || 4.9}
          </span>
        </div>
      </div>

      <div className="card-body p-4 d-flex flex-column flex-grow-1">
        <h5 className="card-title fw-bold text-dark mb-2 text-truncate" title={room.name}>
          {room.name}
        </h5>
        
        <p className="card-text text-muted small mb-3 flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {room.description}
        </p>

        <div className="d-flex flex-wrap gap-2 mb-3 pb-3 border-bottom">
          <span className="badge bg-light text-secondary border" style={{ fontSize: '0.72rem' }}>
            <i className="bi bi-people me-1"></i> {room.capacity} Guests
          </span>
          <span className="badge bg-light text-secondary border" style={{ fontSize: '0.72rem' }}>
            <i className="bi bi-aspect-ratio me-1"></i> {room.size || '450 sq ft'}
          </span>
          <span className="badge bg-light text-secondary border" style={{ fontSize: '0.72rem' }}>
            <i className="bi bi-eye me-1"></i> {room.view || 'Scenic View'}
          </span>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div>
            <span className="fs-4 fw-bold text-dark">${room.pricePerNight}</span>
            <span className="text-muted small"> / night</span>
          </div>

          <div className="d-flex gap-2">
            <Link to={`/rooms/${room._id}`} className="btn btn-outline-dark btn-sm rounded-pill px-3">
              Details
            </Link>
            {isAvailable ? (
              <Link to={`/book/${room._id}`} className="btn btn-gold btn-sm rounded-pill px-3">
                Book Now
              </Link>
            ) : (
              <button disabled className="btn btn-secondary btn-sm rounded-pill px-3 opacity-50">
                Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;

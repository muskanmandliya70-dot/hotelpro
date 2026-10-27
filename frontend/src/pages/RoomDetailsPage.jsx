import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const RoomDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Booking widget form state
  const [checkIn, setCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
  const [guests, setGuests] = useState(2);

  // Review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchRoomAndReviews = async () => {
      setLoading(true);
      try {
        const roomRes = await api.get(`/rooms/${id}`);
        if (roomRes.data.success) {
          setRoom(roomRes.data.room);
        }

        const reviewRes = await api.get(`/reviews?roomId=${id}`);
        if (reviewRes.data.success) {
          setReviews(reviewRes.data.reviews);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomAndReviews();
  }, [id]);

  // Calculate nights & total
  const nights = Math.max(
    1,
    Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
  );
  const totalCost = room ? room.pricePerNight * nights : 0;

  const handleBookNow = () => {
    navigate(`/book/${room._id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post('/reviews', {
        roomId: room._id,
        rating: newRating,
        comment: newComment
      });

      if (res.data.success) {
        setReviews([res.data.review, ...reviews]);
        setNewComment('');
        // Update room rating
        setRoom((prev) => ({ ...prev, rating: res.data.review.rating }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-50 py-5">
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container py-5 text-center">
        <h3>Room not found</h3>
        <Link to="/rooms" className="btn btn-gold mt-3">Back to Rooms</Link>
      </div>
    );
  }

  const images = room.images && room.images.length > 0 ? room.images : [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
  ];

  return (
    <div className="py-5 bg-light">
      <div className="container px-4 px-lg-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-secondary">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/rooms" className="text-decoration-none text-secondary">Suites</Link></li>
            <li className="breadcrumb-item active text-dark fw-bold" aria-current="page">{room.name}</li>
          </ol>
        </nav>

        {/* Room Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-warning text-dark fw-bold">{room.category}</span>
              <span className="badge bg-dark">Room #{room.roomNumber}</span>
              <span className="badge bg-success bg-opacity-25 text-success border border-success">
                {room.status.toUpperCase()}
              </span>
            </div>
            <h1 className="display-6 fw-bold text-dark">{room.name}</h1>
            <p className="text-secondary mb-0">
              <i className="bi bi-geo-alt-fill text-warning me-1"></i> Floor {room.floor || 1} &bull; {room.view || 'Scenic View'}
            </p>
          </div>

          <div className="mt-3 mt-md-0 text-md-end">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-warning text-dark px-3 py-2 fs-6 fw-bold">
                <i className="bi bi-star-fill me-1"></i> {room.rating || 4.9} / 5.0
              </span>
              <span className="text-secondary small">({reviews.length} reviews)</span>
            </div>
            <div className="mt-2">
              <span className="fs-3 fw-bold text-dark">${room.pricePerNight}</span>
              <span className="text-secondary"> / night</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="row g-3 mb-5">
          <div className="col-lg-8">
            <div className="rounded-4 overflow-hidden shadow-sm" style={{ height: 460 }}>
              <img
                src={images[activeImage] || images[0]}
                alt={room.name}
                className="w-100 h-100 object-fit-cover"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          <div className="col-lg-4 d-flex flex-lg-column gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`rounded-3 overflow-hidden cursor-pointer border-3 ${activeImage === idx ? 'border border-warning shadow' : 'border'}`}
                style={{ height: 140, cursor: 'pointer', flex: '1 1 0' }}
                onClick={() => setActiveImage(idx)}
              >
                <img
                  src={img}
                  alt={`View ${idx + 1}`}
                  className="w-100 h-100 object-fit-cover"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content & Booking Form Row */}
        <div className="row g-5">
          <div className="col-lg-8">
            {/* Overview Specifications */}
            <div className="card border-0 rounded-4 shadow-sm p-4 mb-4 bg-white">
              <h4 className="fw-bold text-dark mb-3">Room Specifications</h4>
              <div className="row g-3 text-center">
                <div className="col-3 border-end">
                  <i className="bi bi-people text-warning fs-3 mb-1 d-block"></i>
                  <span className="small text-secondary d-block">Capacity</span>
                  <strong className="text-dark">{room.capacity} Guests</strong>
                </div>
                <div className="col-3 border-end">
                  <i className="bi bi-moon-stars text-warning fs-3 mb-1 d-block"></i>
                  <span className="small text-secondary d-block">Bed Setup</span>
                  <strong className="text-dark">{room.bedType || 'King Bed'}</strong>
                </div>
                <div className="col-3 border-end">
                  <i className="bi bi-aspect-ratio text-warning fs-3 mb-1 d-block"></i>
                  <span className="small text-secondary d-block">Suite Area</span>
                  <strong className="text-dark">{room.size || '520 sq ft'}</strong>
                </div>
                <div className="col-3">
                  <i className="bi bi-eye text-warning fs-3 mb-1 d-block"></i>
                  <span className="small text-secondary d-block">Terrace View</span>
                  <strong className="text-dark">{room.view || 'Oceanfront'}</strong>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card border-0 rounded-4 shadow-sm p-4 mb-4 bg-white">
              <h4 className="fw-bold text-dark mb-3">About This Accommodation</h4>
              <p className="text-secondary leading-relaxed mb-0" style={{ lineHeight: 1.8 }}>
                {room.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="card border-0 rounded-4 shadow-sm p-4 mb-4 bg-white">
              <h4 className="fw-bold text-dark mb-3">Included Luxury Amenities</h4>
              <div className="row g-3">
                {room.amenities.map((amenity, idx) => (
                  <div key={idx} className="col-md-6 col-12 d-flex align-items-center gap-2">
                    <i className="bi bi-check-circle-fill text-warning fs-5"></i>
                    <span className="text-dark fw-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold text-dark mb-0">Guest Reviews & Ratings</h4>
                <span className="badge bg-warning text-dark px-3 py-2 fw-bold">
                  {reviews.length} Verified Feedback
                </span>
              </div>

              {/* Submit Review Form */}
              <div className="bg-light p-4 rounded-4 mb-4">
                <h6 className="fw-bold text-dark mb-2">Leave a Verified Review</h6>
                <form onSubmit={handleReviewSubmit}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label small text-secondary fw-semibold">Your Rating</label>
                      <select
                        className="form-select rounded-3"
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                      >
                        <option value="5">⭐⭐⭐⭐⭐ 5 Stars - Exceptional</option>
                        <option value="4">⭐⭐⭐⭐ 4 Stars - Very Good</option>
                        <option value="3">⭐⭐⭐ 3 Stars - Average</option>
                        <option value="2">⭐⭐ 2 Stars - Below Average</option>
                        <option value="1">⭐ 1 Star - Poor</option>
                      </select>
                    </div>
                    <div className="col-md-8">
                      <label className="form-label small text-secondary fw-semibold">Share your experience</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        placeholder="Write your honest comments about the stay, amenities..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-12 text-end">
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="btn btn-gold btn-sm rounded-pill px-4"
                      >
                        {submittingReview ? 'Submitting...' : 'Post Review'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Review List */}
              {reviews.length === 0 ? (
                <p className="text-secondary text-center my-3">Be the first guest to review this luxury suite.</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="p-3 border rounded-3 bg-white">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge bg-dark rounded-circle p-2">
                            <i className="bi bi-person-fill text-warning"></i>
                          </span>
                          <span className="fw-bold text-dark">{rev.guestName}</span>
                        </div>
                        <div className="text-warning small">
                          {[...Array(rev.rating)].map((_, i) => (
                            <i key={i} className="bi bi-star-fill me-1"></i>
                          ))}
                        </div>
                      </div>
                      <p className="text-secondary small mb-1 mt-2">{rev.comment}</p>
                      <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                        Stayed in {new Date(rev.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking Widget Sidebar */}
          <div className="col-lg-4">
            <div className="card border-0 rounded-4 shadow-lg p-4 bg-white sticky-top" style={{ top: 100 }}>
              <div className="d-flex justify-content-between align-items-baseline mb-3 pb-3 border-bottom">
                <div>
                  <span className="fs-3 fw-bold text-dark">${room.pricePerNight}</span>
                  <span className="text-secondary small"> / night</span>
                </div>
                <span className="badge bg-warning text-dark fw-bold">Best Price Guaranteed</span>
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary fw-bold text-uppercase">Check-in Date</label>
                <input
                  type="date"
                  className="form-control rounded-3"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary fw-bold text-uppercase">Check-out Date</label>
                <input
                  type="date"
                  className="form-control rounded-3"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small text-secondary fw-bold text-uppercase">Total Guests</label>
                <select
                  className="form-select rounded-3"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                >
                  {[...Array(room.capacity)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} Guest{i > 0 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Calculation breakdown */}
              <div className="bg-light p-3 rounded-3 mb-4 small">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">${room.pricePerNight} &times; {nights} night(s)</span>
                  <span className="fw-semibold text-dark">${totalCost}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">Resort & Service Fee</span>
                  <span className="text-success fw-bold">FREE</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">Hospitality Taxes (12%)</span>
                  <span className="text-secondary">${Math.round(totalCost * 0.12)}</span>
                </div>
                <div className="d-flex justify-content-between border-top pt-2 fw-bold text-dark fs-6">
                  <span>Estimated Total</span>
                  <span className="text-warning">${totalCost + Math.round(totalCost * 0.12)}</span>
                </div>
              </div>

              {room.status === 'available' ? (
                <button
                  onClick={handleBookNow}
                  className="btn btn-gold btn-lg w-100 rounded-pill py-3 fw-bold"
                >
                  <i className="bi bi-shield-check me-2"></i> Reserve This Suite
                </button>
              ) : (
                <button disabled className="btn btn-secondary btn-lg w-100 rounded-pill py-3 opacity-50">
                  Currently {room.status}
                </button>
              )}

              <div className="text-center mt-3 text-secondary" style={{ fontSize: '0.78rem' }}>
                <i className="bi bi-lock-fill text-warning me-1"></i> Instant Confirmation &bull; Zero Hidden Fees
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;

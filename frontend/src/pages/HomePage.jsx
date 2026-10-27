import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import RoomCard from '../components/RoomCard';

const HomePage = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchDates, setSearchDates] = useState({
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    guests: '2',
    category: 'All'
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get('/rooms');
        if (res.data.success) {
          // Take featured rooms or top 3
          const featured = res.data.rooms.filter((r) => r.featured).slice(0, 3);
          setFeaturedRooms(featured.length > 0 ? featured : res.data.rooms.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    navigate(`/rooms?category=${searchDates.category}&capacity=${searchDates.guests}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-wrapper text-center">
        <div className="container px-4">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <span className="badge bg-warning text-dark text-uppercase fw-bold px-3 py-2 mb-3 rounded-pill tracking-wide">
                <i className="bi bi-gem me-1"></i> The Crown Jewel of Modern Hospitality
              </span>
              <h1 className="display-3 fw-bold mb-3 text-white">
                Uncompromising Luxury. <br />
                <span style={{ color: '#f59e0b', fontStyle: 'italic' }}>Effortless Hospitality.</span>
              </h1>
              <p className="lead text-light text-opacity-75 mb-4 mx-auto" style={{ maxWidth: 680 }}>
                Indulge in private oceanfront suites, Michelin-grade culinary experiences, and 24/7 dedicated concierge services crafted exclusively for you.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/rooms" className="btn btn-gold btn-lg rounded-pill px-4">
                  Explore Rooms & Suites
                </Link>
                <a href="#amenities" className="btn btn-outline-light btn-lg rounded-pill px-4">
                  Hotel Amenities
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Reservation Search Bar */}
      <div className="container px-4">
        <div className="hero-search-box">
          <form onSubmit={handleHeroSearch} className="row g-3 align-items-end">
            <div className="col-lg-3 col-md-6">
              <label className="form-label text-secondary small fw-bold text-uppercase">
                <i className="bi bi-calendar-event me-1 text-warning"></i> Check-in Date
              </label>
              <input
                type="date"
                className="form-control form-control-lg border-1 rounded-3 fs-6"
                value={searchDates.checkIn}
                onChange={(e) => setSearchDates({ ...searchDates, checkIn: e.target.value })}
                required
              />
            </div>

            <div className="col-lg-3 col-md-6">
              <label className="form-label text-secondary small fw-bold text-uppercase">
                <i className="bi bi-calendar-check me-1 text-warning"></i> Check-out Date
              </label>
              <input
                type="date"
                className="form-control form-control-lg border-1 rounded-3 fs-6"
                value={searchDates.checkOut}
                onChange={(e) => setSearchDates({ ...searchDates, checkOut: e.target.value })}
                required
              />
            </div>

            <div className="col-lg-2 col-md-6">
              <label className="form-label text-secondary small fw-bold text-uppercase">
                <i className="bi bi-person-fill me-1 text-warning"></i> Guests
              </label>
              <select
                className="form-select form-select-lg border-1 rounded-3 fs-6"
                value={searchDates.guests}
                onChange={(e) => setSearchDates({ ...searchDates, guests: e.target.value })}
              >
                <option value="1">1 Adult</option>
                <option value="2">2 Adults</option>
                <option value="3">3 Guests</option>
                <option value="4">4+ Guests</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-6">
              <label className="form-label text-secondary small fw-bold text-uppercase">
                <i className="bi bi-building me-1 text-warning"></i> Suite Type
              </label>
              <select
                className="form-select form-select-lg border-1 rounded-3 fs-6"
                value={searchDates.category}
                onChange={(e) => setSearchDates({ ...searchDates, category: e.target.value })}
              >
                <option value="All">All Types</option>
                <option value="Deluxe Room">Deluxe</option>
                <option value="Executive Suite">Executive</option>
                <option value="Presidential Suite">Presidential</option>
                <option value="Family Villa">Villa</option>
              </select>
            </div>

            <div className="col-lg-2 col-12">
              <button type="submit" className="btn btn-gold btn-lg w-100 rounded-3 fs-6 py-2">
                <i className="bi bi-search me-1"></i> Check Now
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Trust & Stats Section */}
      <section className="py-5 bg-white border-bottom mt-5">
        <div className="container px-4">
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3">
              <h2 className="fw-bold text-dark mb-1">99.4%</h2>
              <p className="text-secondary small mb-0">Guest Satisfaction Rating</p>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="fw-bold text-dark mb-1">120+</h2>
              <p className="text-secondary small mb-0">Luxury Suites & Villas</p>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="fw-bold text-dark mb-1">24 / 7</h2>
              <p className="text-secondary small mb-0">Personal Butler & Concierge</p>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="fw-bold text-dark mb-1">16</h2>
              <p className="text-secondary small mb-0">International Hospitality Awards</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms Showcase */}
      <section className="py-5 bg-light">
        <div className="container px-4 py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="text-warning text-uppercase fw-bold small tracking-wide">
                EXCLUSIVE COLLECTION
              </span>
              <h2 className="fw-bold text-dark mt-1 mb-0">Featured Suites & Penthouses</h2>
            </div>
            <Link to="/rooms" className="btn btn-outline-dark rounded-pill px-4 mt-3 mt-md-0">
              View All Accommodations <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status"></div>
            </div>
          ) : (
            <div className="row g-4">
              {featuredRooms.map((room) => (
                <div key={room._id} className="col-lg-4 col-md-6">
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Amenities Showcase */}
      <section id="amenities" className="py-5 bg-white">
        <div className="container px-4 py-4">
          <div className="text-center max-w-xl mx-auto mb-5">
            <span className="text-warning text-uppercase fw-bold small tracking-wide">
              RESORT PRIVILEGES
            </span>
            <h2 className="fw-bold text-dark mt-1">World-Class Facilities & Experiences</h2>
            <p className="text-secondary">Every comfort tailored to rejuvenate, inspire, and delight your senses.</p>
          </div>

          <div className="row g-4">
            {[
              { icon: 'bi-water', title: 'Infinity Oceanfront Pool', desc: 'Temperature-controlled heated pools overlooking the horizon with private cabana service.' },
              { icon: 'bi-cup-hot', title: 'Michelin-Starred Dining', desc: 'Five curated fine-dining establishments featuring world-renowned master chefs.' },
              { icon: 'bi-flower1', title: 'Ayurvedic & Wellness Spa', desc: 'Holistic healing therapies, steam saunas, herbal wraps, and restorative massage retreats.' },
              { icon: 'bi-wifi', title: 'Ultra High-Speed Wi-Fi', desc: 'Seamless gigabit fiber internet connection accessible throughout the property.' },
              { icon: 'bi-car-front', title: 'Private Chauffeur Service', desc: 'Complimentary luxury airport transfer and city exploration in our bespoke fleet.' },
              { icon: 'bi-bell-fill', title: '24/7 Digital Concierge', desc: 'Instant room service, housekeeping on demand, and tailor-made excursion bookings.' }
            ].map((item, idx) => (
              <div key={idx} className="col-lg-4 col-md-6">
                <div className="p-4 rounded-4 border bg-light h-100 transition-all hover-shadow">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
                    style={{ width: 50, height: 50, background: '#fef3c7', color: '#d97706', fontSize: '1.4rem' }}
                  >
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <h5 className="fw-bold text-dark mb-2">{item.title}</h5>
                  <p className="text-secondary small mb-0">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-5 bg-dark text-white" style={{ backgroundColor: '#0f172a' }}>
        <div className="container px-4 py-4">
          <div className="text-center mb-5">
            <span className="text-warning text-uppercase fw-bold small tracking-wide">
              GUEST EXPERIENCES
            </span>
            <h2 className="fw-bold text-white mt-1">Praise From Our Discerning Guests</h2>
          </div>

          <div className="row g-4">
            {[
              {
                quote: 'The Presidential Royal Penthouse was sensational. The private pool and sunset terrace offered an unforgettable sanctuary.',
                author: 'David Sterling',
                role: 'Executive Member',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
              },
              {
                quote: 'From arrival to checkout, HotelPro delivered five-star perfection. The digital key card and instant room service were fantastic.',
                author: 'Sarah Jenkins',
                role: 'Verified Guest',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
              },
              {
                quote: 'The staff hospitality is in a league of its own. Elena and Carlos made our anniversary getaway truly memorable.',
                author: 'Marcus & Claire Vance',
                role: 'Holiday Guests',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
              }
            ].map((t, idx) => (
              <div key={idx} className="col-lg-4">
                <div className="p-4 rounded-4 bg-secondary bg-opacity-10 border border-secondary border-opacity-25 h-100 d-flex flex-column justify-content-between">
                  <div className="mb-3">
                    <div className="text-warning mb-2">
                      <i className="bi bi-star-fill me-1"></i>
                      <i className="bi bi-star-fill me-1"></i>
                      <i className="bi bi-star-fill me-1"></i>
                      <i className="bi bi-star-fill me-1"></i>
                      <i className="bi bi-star-fill"></i>
                    </div>
                    <p className="text-light text-opacity-80 fst-italic small">"{t.quote}"</p>
                  </div>
                  <div className="d-flex align-items-center gap-3 border-top border-secondary border-opacity-25 pt-3">
                    <img src={t.avatar} alt={t.author} className="rounded-circle" style={{ width: 44, height: 44, objectFit: 'cover' }} />
                    <div>
                      <h6 className="mb-0 text-white fw-bold">{t.author}</h6>
                      <small className="text-secondary">{t.role}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-warning text-dark text-center" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
        <div className="container px-4 py-4">
          <h2 className="display-6 fw-bold mb-3 text-white">Your Sanctuary of Elegance Awaits</h2>
          <p className="text-white text-opacity-90 lead mb-4 mx-auto" style={{ maxWidth: 600 }}>
            Reserve your suite now and unlock complimentary breakfast, late check-out privileges, and spa resort credits.
          </p>
          <Link to="/rooms" className="btn btn-dark btn-lg rounded-pill px-5 fw-bold shadow">
            Book Your Experience Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

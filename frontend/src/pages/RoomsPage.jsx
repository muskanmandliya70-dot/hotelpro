import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import RoomCard from '../components/RoomCard';
import SearchFilter from '../components/SearchFilter';

const RoomsPage = () => {
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    capacity: searchParams.get('capacity') || '',
    maxPrice: ''
  });

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.category && filters.category !== 'All') queryParams.append('category', filters.category);
      if (filters.capacity) queryParams.append('capacity', filters.capacity);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

      const res = await api.get(`/rooms?${queryParams.toString()}`);
      if (res.data.success) {
        setRooms(res.data.rooms);
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleReset = () => {
    setFilters({
      search: '',
      category: 'All',
      capacity: '',
      maxPrice: ''
    });
    // fetch all rooms
    api.get('/rooms').then((res) => {
      if (res.data.success) setRooms(res.data.rooms);
    });
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container px-4 px-lg-5">
        {/* Page Title */}
        <div className="text-center mb-5">
          <span className="badge bg-warning text-dark text-uppercase fw-bold px-3 py-2 mb-2 rounded-pill tracking-wide">
            EXPLORE OUR SANCTUARY
          </span>
          <h1 className="display-5 fw-bold text-dark">Luxury Rooms & Suites</h1>
          <p className="text-secondary lead mx-auto" style={{ maxWidth: 650 }}>
            Every room at HotelPro is curated with bespoke Italian furnishing, plush bedding, and serene views for your restorative stay.
          </p>
        </div>

        {/* Filter Box */}
        <SearchFilter
          filters={filters}
          setFilters={setFilters}
          onSearch={fetchRooms}
          onReset={handleReset}
        />

        {/* Results Counter */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="text-secondary fw-semibold">
            Showing <strong className="text-dark">{rooms.length}</strong> available accommodations
          </span>
          <div className="d-flex align-items-center gap-2">
            <span className="text-secondary small">Sort by:</span>
            <span className="badge bg-white text-dark border px-3 py-2 fw-semibold">
              Recommended & Rating
            </span>
          </div>
        </div>

        {/* Room Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
            <p className="text-secondary mt-3">Curating available accommodations...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 border p-5">
            <i className="bi bi-search text-secondary display-4"></i>
            <h4 className="fw-bold text-dark mt-3">No suites matched your criteria</h4>
            <p className="text-secondary">Try adjusting your filters or price range to explore more options.</p>
            <button onClick={handleReset} className="btn btn-gold rounded-pill px-4">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {rooms.map((room) => (
              <div key={room._id} className="col-lg-4 col-md-6">
                <RoomCard room={room} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsPage;

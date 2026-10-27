import React from 'react';

const SearchFilter = ({ filters, setFilters, onSearch, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
      <form onSubmit={handleSubmit} className="row g-3 align-items-end">
        <div className="col-lg-3 col-md-6">
          <label className="form-label text-secondary small fw-bold text-uppercase">
            <i className="bi bi-search me-1 text-warning"></i> Search Keyword
          </label>
          <input
            type="text"
            className="form-control rounded-3"
            placeholder="e.g. Ocean, Suite, Penthouse..."
            name="search"
            value={filters.search}
            onChange={handleChange}
          />
        </div>

        <div className="col-lg-3 col-md-6">
          <label className="form-label text-secondary small fw-bold text-uppercase">
            <i className="bi bi-tag me-1 text-warning"></i> Room Category
          </label>
          <select
            className="form-select rounded-3"
            name="category"
            value={filters.category}
            onChange={handleChange}
          >
            <option value="All">All Categories</option>
            <option value="Deluxe Room">Deluxe Room</option>
            <option value="Executive Suite">Executive Suite</option>
            <option value="Presidential Suite">Presidential Suite</option>
            <option value="Standard Room">Standard Room</option>
            <option value="Family Villa">Family Villa</option>
          </select>
        </div>

        <div className="col-lg-2 col-md-4">
          <label className="form-label text-secondary small fw-bold text-uppercase">
            <i className="bi bi-people me-1 text-warning"></i> Min Guests
          </label>
          <select
            className="form-select rounded-3"
            name="capacity"
            value={filters.capacity}
            onChange={handleChange}
          >
            <option value="">Any Capacity</option>
            <option value="1">1+ Guest</option>
            <option value="2">2+ Guests</option>
            <option value="4">4+ Guests</option>
          </select>
        </div>

        <div className="col-lg-2 col-md-4">
          <label className="form-label text-secondary small fw-bold text-uppercase">
            <i className="bi bi-currency-dollar me-1 text-warning"></i> Max Price
          </label>
          <input
            type="number"
            className="form-control rounded-3"
            placeholder="Max $/night"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
          />
        </div>

        <div className="col-lg-2 col-md-4 d-flex gap-2">
          <button type="submit" className="btn btn-gold w-100 rounded-3">
            <i className="bi bi-funnel-fill me-1"></i> Filter
          </button>
          <button
            type="button"
            onClick={onReset}
            className="btn btn-outline-secondary rounded-3"
            title="Reset Filters"
          >
            <i className="bi bi-arrow-counterclockwise"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilter;

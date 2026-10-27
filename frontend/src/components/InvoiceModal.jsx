import React from 'react';

const InvoiceModal = ({ booking, show, onClose }) => {
  if (!show || !booking) return null;

  const room = booking.room || {};
  const nights = booking.nights || 1;
  const subtotal = booking.totalAmount || (room.pricePerNight * nights);
  const tax = Math.round(subtotal * 0.12);
  const totalWithTax = subtotal + tax;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-dark text-white border-0 py-3">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-receipt text-warning fs-4"></i>
              <h5 className="modal-title brand-font text-white mb-0">Booking Tax Invoice & Folio</h5>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body p-4 p-md-5">
            {/* Invoice Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start pb-4 border-bottom mb-4">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-2"
                    style={{ width: 30, height: 30, background: '#d97706', color: '#fff' }}
                  >
                    <i className="bi bi-buildings"></i>
                  </div>
                  <h4 className="brand-font fw-bold text-dark mb-0">HOTEL<span style={{ color: '#d97706' }}>PRO</span></h4>
                </div>
                <p className="text-secondary small mb-1">742 Evergreen Oceanfront Blvd, Marina Bay</p>
                <p className="text-secondary small mb-0">support@hotelpro.com | +1 (800) 555-4683</p>
              </div>

              <div className="mt-3 mt-md-0 text-md-end">
                <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 fw-bold text-uppercase">
                  <i className="bi bi-check2-all me-1"></i> Paid in Full
                </span>
                <p className="fw-bold text-dark mt-2 mb-0">Ref: {booking.bookingReference}</p>
                <p className="text-secondary small mb-0">Date: {new Date(booking.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Guest & Stay Details */}
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <h6 className="text-secondary text-uppercase fw-bold small">Guest Information</h6>
                <p className="fw-bold mb-1 text-dark">{booking.guestName}</p>
                <p className="text-secondary small mb-1"><i className="bi bi-envelope me-1"></i> {booking.guestEmail}</p>
                <p className="text-secondary small mb-0"><i className="bi bi-telephone me-1"></i> {booking.guestPhone || 'N/A'}</p>
              </div>
              <div className="col-md-6 text-md-end">
                <h6 className="text-secondary text-uppercase fw-bold small">Stay Details</h6>
                <p className="fw-semibold mb-1 text-dark">
                  Room: {room.name || 'Deluxe Suite'} (#{room.roomNumber || '101'})
                </p>
                <p className="text-secondary small mb-1">
                  Check-in: {new Date(booking.checkInDate).toLocaleDateString()} (14:00)
                </p>
                <p className="text-secondary small mb-0">
                  Check-out: {new Date(booking.checkOutDate).toLocaleDateString()} (11:00)
                </p>
              </div>
            </div>

            {/* Bill Table */}
            <div className="table-responsive mb-4">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Description</th>
                    <th className="text-center">Nights</th>
                    <th className="text-end">Nightly Rate</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="fw-semibold">{room.name || 'Boutique Room'}</div>
                      <small className="text-secondary">Category: {room.category || 'Luxury'} | Guests: {booking.guestsCount || 1}</small>
                    </td>
                    <td className="text-center">{nights}</td>
                    <td className="text-end">${room.pricePerNight || (subtotal / nights)}</td>
                    <td className="text-end fw-bold">${subtotal}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end text-secondary">State & Hospitality Tax (12%):</td>
                    <td className="text-end">${tax}</td>
                  </tr>
                  <tr className="table-light">
                    <td colSpan="3" className="text-end fw-bold fs-6">Grand Total:</td>
                    <td className="text-end fw-bold text-success fs-5">${totalWithTax}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer notes */}
            <div className="bg-light p-3 rounded-3 small text-secondary">
              <p className="mb-1"><strong>Payment Method:</strong> {booking.paymentMethod?.replace('_', ' ').toUpperCase()} (Processed via Secure PCI-DSS Gateway)</p>
              <p className="mb-0"><strong>Assigned Digital Key:</strong> <span className="badge bg-dark">{booking.assignedKey || 'Provided at Front Desk'}</span></p>
            </div>
          </div>

          <div className="modal-footer bg-light border-0">
            <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-gold rounded-pill px-4" onClick={handlePrint}>
              <i className="bi bi-printer-fill me-1"></i> Print / Save PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;

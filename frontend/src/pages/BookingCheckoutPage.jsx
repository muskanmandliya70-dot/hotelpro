import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import InvoiceModal from '../components/InvoiceModal';

const BookingCheckoutPage = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Dates and guests from URL query or defaults
  const checkIn = searchParams.get('checkIn') || new Date().toISOString().split('T')[0];
  const checkOut = searchParams.get('checkOut') || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
  const guestsCount = Number(searchParams.get('guests')) || 2;

  // Form Fields
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '+1 (555) 019-2834');
  const [specialRequests, setSpecialRequests] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Success state & invoice modal
  const [createdBooking, setCreatedBooking] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/book/' + roomId);
      return;
    }

    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${roomId}`);
        if (res.data.success) {
          setRoom(res.data.room);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId, isAuthenticated]);

  const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));
  const basePrice = room ? room.pricePerNight * nights : 0;
  const discountAmount = Math.round((basePrice * discountPercent) / 100);
  const taxableSubtotal = basePrice - discountAmount;
  const tax = Math.round(taxableSubtotal * 0.12);
  const grandTotal = taxableSubtotal + tax;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (discountCode.trim().toUpperCase() === 'HOTELPRO10' || discountCode.trim().toUpperCase() === 'WELCOME10') {
      setDiscountPercent(10);
      alert('🎉 10% Luxury Welcome Discount applied successfully!');
    } else {
      alert('Invalid promo code. Use HOTELPRO10 for 10% off.');
    }
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const res = await api.post('/bookings', {
        roomId: room._id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guestsCount,
        guestName,
        guestEmail,
        guestPhone,
        specialRequests,
        paymentMethod,
        cardLast4: cardNumber.slice(-4) || '4242'
      });

      if (res.data.success) {
        setCreatedBooking(res.data.booking);
        setShowInvoice(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
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
        <h3>Accommodation unavailable</h3>
        <Link to="/rooms" className="btn btn-gold mt-3">Back to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container px-4 px-lg-5">
        {/* Page Title */}
        <div className="mb-4">
          <span className="badge bg-warning text-dark text-uppercase fw-bold px-3 py-1 mb-2 rounded-pill tracking-wide">
            SECURE RESERVATION CHECKOUT
          </span>
          <h2 className="display-6 fw-bold text-dark">Confirm & Finalize Your Stay</h2>
          <p className="text-secondary small">Protected with 256-bit SSL Banking Grade Encryption</p>
        </div>

        <div className="row g-5">
          {/* Form Column */}
          <div className="col-lg-7">
            <form onSubmit={handleConfirmBooking}>
              {/* Guest Details Card */}
              <div className="card border-0 rounded-4 shadow-sm p-4 bg-white mb-4">
                <h5 className="fw-bold text-dark mb-3">
                  <i className="bi bi-person-circle text-warning me-2"></i> Guest Information
                </h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small text-secondary fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-secondary fw-semibold">Email Address</label>
                    <input
                      type="email"
                      className="form-control rounded-3"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-secondary fw-semibold">Contact Phone</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-secondary fw-semibold">Number of Occupants</label>
                    <input
                      type="number"
                      className="form-control rounded-3"
                      value={guestsCount}
                      readOnly
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small text-secondary fw-semibold">Special Requests (Optional)</label>
                    <textarea
                      rows="2"
                      className="form-control rounded-3"
                      placeholder="e.g. Late flight arrival, allergen-free bedding, flower arrangement in suite..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Payment Processing Card */}
              <div className="card border-0 rounded-4 shadow-sm p-4 bg-white mb-4">
                <h5 className="fw-bold text-dark mb-3">
                  <i className="bi bi-credit-card-2-front text-warning me-2"></i> Payment Method & Verification
                </h5>

                <div className="d-flex gap-2 mb-3">
                  {['credit_card', 'razorpay', 'stripe', 'paypal'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`btn btn-sm rounded-3 px-3 py-2 ${paymentMethod === m ? 'btn-dark' : 'btn-outline-secondary'}`}
                    >
                      {m === 'credit_card' && <><i className="bi bi-credit-card me-1"></i> Credit Card</>}
                      {m === 'razorpay' && <><i className="bi bi-lightning-charge-fill me-1"></i> Razorpay</>}
                      {m === 'stripe' && <><i className="bi bi-stripe me-1"></i> Stripe</>}
                      {m === 'paypal' && <><i className="bi bi-paypal me-1"></i> PayPal</>}
                    </button>
                  ))}
                </div>

                <div className="bg-light p-3 rounded-3 mb-3">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small text-secondary fw-semibold">Card Number (Demo Auto-Filled)</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-secondary fw-semibold">Expiration</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-secondary fw-semibold">CVC / CVV</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2 text-secondary small">
                  <i className="bi bi-patch-check-fill text-success fs-5"></i>
                  <span>Test Mode: No real funds are charged. Instant mock invoice generated.</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className="btn btn-gold btn-lg w-100 rounded-pill py-3 fw-bold shadow"
              >
                {processing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Processing Secure Authorization...
                  </>
                ) : (
                  <>
                    <i className="bi bi-lock-fill me-2"></i> Authorize & Pay ${grandTotal}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Stay Summary Column */}
          <div className="col-lg-5">
            <div className="card border-0 rounded-4 shadow-sm p-4 bg-white sticky-top" style={{ top: 100 }}>
              <h5 className="fw-bold text-dark mb-3">Reservation Folio</h5>

              <div className="d-flex gap-3 pb-3 border-bottom mb-3">
                <img
                  src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=300&q=80'}
                  alt={room.name}
                  className="rounded-3 object-fit-cover"
                  style={{ width: 100, height: 80, objectFit: 'cover' }}
                />
                <div>
                  <span className="badge bg-warning text-dark small">{room.category}</span>
                  <h6 className="fw-bold text-dark mb-1 mt-1">{room.name}</h6>
                  <small className="text-secondary">Room #{room.roomNumber} &bull; {room.view}</small>
                </div>
              </div>

              <div className="row g-2 mb-3 pb-3 border-bottom small text-secondary">
                <div className="col-6">
                  <span className="d-block fw-semibold text-dark">Check-in</span>
                  <span>{new Date(checkIn).toLocaleDateString()} (2:00 PM)</span>
                </div>
                <div className="col-6 text-end">
                  <span className="d-block fw-semibold text-dark">Check-out</span>
                  <span>{new Date(checkOut).toLocaleDateString()} (11:00 AM)</span>
                </div>
                <div className="col-12 mt-2">
                  <span className="badge bg-light text-dark border px-2 py-1">
                    <i className="bi bi-moon-stars me-1 text-warning"></i> Duration: {nights} Night{nights > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="mb-3">
                <label className="form-label small text-secondary fw-semibold">Have a Promotion Code?</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control rounded-start-3"
                    placeholder="Enter HOTELPRO10"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                  />
                  <button onClick={handleApplyPromo} type="button" className="btn btn-outline-dark rounded-end-3">
                    Apply
                  </button>
                </div>
              </div>

              {/* Cost Calculation */}
              <div className="bg-light p-3 rounded-3 small mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">${room.pricePerNight} &times; {nights} night(s)</span>
                  <span className="fw-bold text-dark">${basePrice}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Welcome Discount ({discountPercent}%)</span>
                    <span>-${discountAmount}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">Resort Valet & High-speed Wi-Fi</span>
                  <span className="text-success fw-bold">COMPLIMENTARY</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">Hospitality & Tourism Tax (12%)</span>
                  <span className="text-dark">${tax}</span>
                </div>
                <div className="d-flex justify-content-between border-top pt-2 fw-bold text-dark fs-5">
                  <span>Grand Total</span>
                  <span className="text-warning">${grandTotal}</span>
                </div>
              </div>

              <div className="text-muted small">
                <p className="mb-1"><i className="bi bi-arrow-repeat text-success me-1"></i> Free cancellation up to 48 hours before check-in.</p>
                <p className="mb-0"><i className="bi bi-shield-check text-success me-1"></i> Official HotelPro Best Rate Guarantee.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {createdBooking && (
        <InvoiceModal
          booking={createdBooking}
          show={showInvoice}
          onClose={() => {
            setShowInvoice(false);
            navigate('/dashboard');
          }}
        />
      )}
    </div>
  );
};

export default BookingCheckoutPage;

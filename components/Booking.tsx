'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Booking.module.css';
import { User, Mail, Calendar, Phone, Clock, Users } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { getDefaultTimeSlots60Min } from '@/lib/timeSlotDefaults';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface TimeSlotOption {
  value: string;
  label: string;
  enabled: boolean;
}

interface SlotAvailability {
  booked: number;
  max: number;
  isFull: boolean;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  booking_date: string;
  booking_time: string;
  number_of_guests: number | '';
}

type ModalStep = 'processing' | 'success' | 'error' | null;

const getPricePerPerson = (guests: number): number => {
  if (guests >= 10) return 1199;
  if (guests >= 6) return 1299;
  if (guests >= 4) return 1399;
  return 1499;
};

const getSquadLabel = (guests: number): string => {
  if (guests >= 9) return 'Corporate Operation';
  if (guests >= 5) return 'Bravo Squad';
  return 'Alpha Squad';
};

const emptyForm: FormState = {
  name: '',
  email: '',
  phone: '',
  booking_date: '',
  booking_time: '',
  number_of_guests: '',
};

export default function Booking() {
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [timeSlots, setTimeSlots] = useState<TimeSlotOption[]>([]);
  const [slotAvailability, setSlotAvailability] = useState<Record<string, SlotAvailability>>({});
  const [maxGuestsPerSlot, setMaxGuestsPerSlot] = useState<number>(24);

  const [formError, setFormError] = useState('');
  const [modalStep, setModalStep] = useState<ModalStep>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState<{ bookingId: string; amount: number; email: string } | null>(null);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  // Lock body scroll when pricing popup is open
  useEffect(() => {
    if (pricingOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.cursor = 'auto';
    } else {
      document.body.style.overflow = '';
      document.body.style.cursor = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.cursor = '';
    };
  }, [pricingOpen]);

  const guestsCount = typeof formData.number_of_guests === 'number' ? formData.number_of_guests : 0;
  const pricePerPerson = getPricePerPerson(Math.max(1, guestsCount));
  const totalAmount = pricePerPerson * guestsCount;

  // Scroll-triggered reveal, same as the original design
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 50 },
      {
        scrollTrigger: { trigger: formRef.current, start: 'top 80%' },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      }
    );
  }, []);

  const fetchAvailability = useCallback(async (date: string) => {
    if (!date) {
      setSlotAvailability({});
      return;
    }
    try {
      const res = await fetch(`/api/availability/${date}?duration=60`);
      if (res.ok) {
        const data = await res.json();
        setSlotAvailability(data.availability || {});
        if (data.timeSlots?.length) {
          setTimeSlots(data.timeSlots);
        }
      }
    } catch {
      setSlotAvailability({});
    }
  }, []);

  // Load slot config + Razorpay checkout script on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData((prev) => ({ ...prev, booking_date: prev.booking_date || today }));

    fetch('/api/booking-settings/public')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setTimeSlots(
          Array.isArray(data?.timeSlots60Min) && data.timeSlots60Min.length > 0
            ? data.timeSlots60Min
            : getDefaultTimeSlots60Min()
        );
        if (typeof data?.maxBookingsPerSlot === 'number' && data.maxBookingsPerSlot >= 1) {
          setMaxGuestsPerSlot(data.maxBookingsPerSlot);
        }
      })
      .catch(() => setTimeSlots(getDefaultTimeSlots60Min()));

    fetchAvailability(today);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [fetchAvailability]);

  useEffect(() => {
    if (formData.booking_date) {
      fetchAvailability(formData.booking_date);
    }
  }, [formData.booking_date, fetchAvailability]);

  const handlePayment = async (bookingId: string, amount: number, guests: number) => {
    try {
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId, amount, currency: 'INR' }),
      });
      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKeyId) {
        throw new Error('Payment gateway is not configured. Please contact support.');
      }

      const options = {
        key: razorpayKeyId,
        amount: orderData.amount.toString(),
        currency: orderData.currency,
        name: 'Activerse',
        description: `Booking for ${guests} guest(s) - Access to all game rooms`,
        order_id: orderData.order_id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          booking_id: bookingId,
          number_of_guests: guests.toString(),
          booking_date: formData.booking_date,
          booking_time: formData.booking_time,
        },
        theme: { color: '#f9004d' },
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                booking_id: bookingId,
              }),
            });
            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok) {
              setResult({ bookingId, amount, email: formData.email });
              setModalStep('success');
              setFormData(emptyForm);
              setTimeout(() => setModalStep(null), 6000);
            } else {
              setErrorMessage(
                verifyData.error || `Payment verification failed. Please contact support with your Booking ID: ${bookingId}.`
              );
              setModalStep('error');
            }
          } catch {
            setErrorMessage(`Payment verification error. Please contact support with your Booking ID: ${bookingId}.`);
            setModalStep('error');
          }
        },
        modal: {
          ondismiss: function () {
            setErrorMessage(`Payment was cancelled. Your booking (#${bookingId}) is still pending — complete payment to confirm it.`);
            setModalStep('error');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function () {
        setErrorMessage(`Payment failed. Please try again or contact support with your Booking ID: ${bookingId}.`);
        setModalStep('error');
      });
      rzp.open();
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment initialization failed. Please try again.');
      setModalStep('error');
    }
  };

  const handleInitialize = async () => {
    setFormError('');
    const guests = typeof formData.number_of_guests === 'number' ? formData.number_of_guests : 0;

    if (!formData.name || !formData.email || !formData.phone || !formData.booking_date || !formData.booking_time || guests < 1) {
      setFormError('Please fill in all fields to initialize your booking.');
      return;
    }
    if (guests > maxGuestsPerSlot) {
      setFormError(`Number of guests cannot exceed ${maxGuestsPerSlot}.`);
      return;
    }

    setModalStep('processing');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          booking_date: formData.booking_date,
          booking_time: formData.booking_time,
          slot_duration: 60,
          number_of_guests: guests,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Failed to submit booking. Please try again.');
        setModalStep('error');
        return;
      }
      if (!data.booking?.id) {
        setErrorMessage('Booking created but ID is missing. Please contact support.');
        setModalStep('error');
        return;
      }

      const amount = getPricePerPerson(guests) * guests;
      await handlePayment(data.booking.id, amount, guests);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to submit booking. Please check your connection and try again.');
      setModalStep('error');
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const isProcessing = modalStep === 'processing';

  return (
    <section id="booking" className={styles.bookingSection}>
      <div ref={formRef} className={styles.formWrapper}>
        <h2 className={styles.formTitle}>SECURE ACCESS</h2>
        <p className={styles.formSubtitle}>Select your date, time, and squad size to reserve a wristband.</p>

        <div className={styles.inputGrid}>
          <div className={styles.inputGroup}>
            <User className={styles.inputIcon} size={20} />
            <input
              type="text"
              placeholder="Squad Leader Name"
              className={styles.inputField}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className={styles.inputGroup}>
            <Mail className={styles.inputIcon} size={20} />
            <input
              type="email"
              placeholder="Comms Channel (Email)"
              className={styles.inputField}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className={styles.inputGroup}>
            <Phone className={styles.inputIcon} size={20} />
            <input
              type="tel"
              placeholder="Contact Frequency (Phone)"
              className={styles.inputField}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className={styles.inputGroup}>
            <Calendar className={styles.inputIcon} size={20} />
            <input
              type="date"
              className={styles.inputField}
              min={today}
              value={formData.booking_date}
              onChange={(e) => setFormData({ ...formData, booking_date: e.target.value, booking_time: '' })}
            />
          </div>

          <div className={styles.inputGroup}>
            <Clock className={styles.inputIcon} size={20} />
            <select
              className={styles.inputField}
              value={formData.booking_time}
              onChange={(e) => setFormData({ ...formData, booking_time: e.target.value })}
            >
              <option value="">Select Mission Window</option>
              {timeSlots.map((slot) => {
                const avail = slotAvailability[slot.value];
                const isFull = avail?.isFull ?? false;
                const spotsLeft = avail ? avail.max - avail.booked : null;
                return (
                  <option key={slot.value} value={slot.value} disabled={isFull}>
                    {slot.label}
                    {isFull ? ' — FULL' : spotsLeft !== null ? ` — ${spotsLeft} left` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <Users className={styles.inputIcon} size={20} />
            <input
              type="number"
              min={1}
              max={maxGuestsPerSlot}
              placeholder="Number of Guests"
              className={styles.inputField}
              value={formData.number_of_guests}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setFormData({ ...formData, number_of_guests: '' });
                  return;
                }
                const num = parseInt(value, 10);
                if (!isNaN(num)) {
                  setFormData({ ...formData, number_of_guests: Math.min(maxGuestsPerSlot, Math.max(1, num)) });
                }
              }}
            />
          </div>

          {guestsCount > 0 && (
            <div className={`${styles.inputGroup} ${styles.full}`}>
              <div className={styles.priceBox}>
                <span className={styles.squadLabel}>{getSquadLabel(guestsCount)}</span>
                <div className={styles.priceRow}>
                  <span>₹{pricePerPerson.toLocaleString('en-IN')} / person × {guestsCount}</span>
                  <span className={styles.priceTotal}>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <span className={styles.priceNote}>60-min session · Max {maxGuestsPerSlot} guests · Secured by Razorpay</span>
              </div>
            </div>
          )}

          {formError && (
            <div className={`${styles.inputGroup} ${styles.full}`}>
              <div className={styles.formError}>{formError}</div>
            </div>
          )}

          <div className={`${styles.inputGroup} ${styles.full}`}>
            <div className={styles.couponWrapper}>
              <input
                type="text"
                placeholder="Coupon Code (Optional)"
                className={styles.couponInput}
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              />
              <button type="button" className={styles.couponApplyBtn}>
                APPLY
              </button>
            </div>
          </div>

          <div className={`${styles.inputGroup} ${styles.full}`}>
            <button
              type="button"
              className={styles.viewPricingBtn}
              onClick={() => setPricingOpen(true)}
            >
              VIEW PRICING
            </button>
          </div>

          <div className={`${styles.inputGroup} ${styles.full}`}>
            <button className={styles.submitBtn} onClick={handleInitialize} disabled={isProcessing}>
              {isProcessing ? 'Processing…' : 'Initialize Booking'}
            </button>
          </div>
        </div>
      </div>

      {/* Fancy Booking Modal */}
      {modalStep && (
        <div
          className={styles.modalOverlay}
          onClick={() => !isProcessing && setModalStep(null)}
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {!isProcessing && (
              <button className={styles.closeBtn} onClick={() => setModalStep(null)}>×</button>
            )}
            <div className={styles.modalBody}>
              {modalStep === 'processing' && (
                <div className={styles.modalText}>
                  <h4>STANDBY</h4>
                  <p>Establishing secure connection and processing your booking…</p>
                </div>
              )}

              {modalStep === 'success' && result && (
                <>
                  <div className={styles.modalText}>
                    <h4>ACCESS GRANTED</h4>
                    <p>Your squad is ready. See you in the grid.</p>
                    <p className={styles.modalDetail}>
                      Booking #{result.bookingId} · ₹{result.amount.toLocaleString('en-IN')} paid · Confirmation sent to {result.email}
                    </p>
                  </div>
                  <Image
                    src="/images/booking.jpeg"
                    alt="Booking Confirmed"
                    width={800}
                    height={500}
                    className={styles.modalImage}
                    priority
                  />
                </>
              )}

              {modalStep === 'error' && (
                <div className={styles.modalText}>
                  <h4 className={styles.modalErrorTitle}>ACCESS DENIED</h4>
                  <p>{errorMessage}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pricing Popup Modal */}
      {pricingOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setPricingOpen(false)}
        >
          <div className={styles.pricingModal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeBtnAbsolute}
              onClick={() => setPricingOpen(false)}
              aria-label="Close pricing"
            >
              ×
            </button>

            {/* Content */}
            <div className={styles.pricingRight}>
              <span className={styles.pricingPreTitle}>60-MIN SESSION</span>
              <h3 className={styles.pricingTitle}>SQUAD PRICING</h3>

              <div className={styles.pricingTiers}>
                <div className={styles.pricingTier}>
                  <div className={styles.tierLabel}>Alpha Squad</div>
                  <div className={styles.tierGuests}>1–3 Guests</div>
                  <div className={styles.tierPrice}>₹1,499<span>/person</span></div>
                </div>
                <div className={styles.pricingTier}>
                  <div className={styles.tierLabel}>Alpha Squad</div>
                  <div className={styles.tierGuests}>4–5 Guests</div>
                  <div className={styles.tierPrice}>₹1,399<span>/person</span></div>
                </div>
                <div className={`${styles.pricingTier} ${styles.tierHighlight}`}>
                  <div className={styles.tierBadge}>POPULAR</div>
                  <div className={styles.tierLabel}>Bravo Squad</div>
                  <div className={styles.tierGuests}>6–9 Guests</div>
                  <div className={styles.tierPrice}>₹1,299<span>/person</span></div>
                </div>
                <div className={styles.pricingTier}>
                  <div className={styles.tierLabel}>Corporate Op.</div>
                  <div className={styles.tierGuests}>10+ Guests</div>
                  <div className={styles.tierPrice}>₹1,199<span>/person</span></div>
                </div>
              </div>

              <p className={styles.pricingNote}>
                Prices include access to all game rooms · Secured by Razorpay · Slot duration: 60 min
              </p>

              <button
                className={styles.pricingCloseBtn}
                onClick={() => setPricingOpen(false)}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useBooking } from '@/context/BookingContext';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './page.module.css';

export default function CheckoutPage() {
  const router = useRouter();
  const { bookingData } = useBooking();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+971',
    phone: '',
    promoCode: '',
    specialRequests: ''
  });

  useEffect(() => {
    // If there is no booking data, redirect back home
    if (!bookingData) {
      router.push('/');
    }
  }, [bookingData, router]);

  if (!bookingData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Save the order to our DB
      const orderPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: `${formData.countryCode}${formData.phone}`,
        specialRequests: formData.specialRequests,
        packageTitle: bookingData.packageTitle,
        visitDate: bookingData.visitDate,
        adultsCount: bookingData.adultsCount,
        childrenCount: bookingData.childrenCount,
        totalPrice: bookingData.totalPrice
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to submit order');
      }

      // Save order in local history for Booked Packages view
      try {
        const localBookings = JSON.parse(localStorage.getItem('nasmal_booked_orders') || '[]');
        localBookings.unshift({
          id: 'BKG-' + Date.now().toString(36).toUpperCase(),
          packageTitle: bookingData.packageTitle,
          packageImage: bookingData.packageImage,
          visitDate: bookingData.visitDate,
          adults: bookingData.adultsCount,
          children: bookingData.childrenCount,
          totalPrice: bookingData.totalPrice,
          bookedAt: new Date().toISOString(),
          customerName: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: `${formData.countryCode}${formData.phone}`,
          status: 'Confirmed'
        });
        localStorage.setItem('nasmal_booked_orders', JSON.stringify(localBookings));
      } catch (e) {
        console.warn('Failed to save booking locally', e);
      }

      // 2. Construct WhatsApp message with correct number +971 58 265 9321
      const rawWa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971582659321';
      const cleanDigits = rawWa.replace(/[^0-9]/g, '');
      const targetWa = cleanDigits || '971582659321';

      const message = `*New Booking Request*
*Customer Details:*
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.countryCode}${formData.phone}
Requests: ${formData.specialRequests || 'None'}

*Booking Details:*
Package: ${bookingData.packageTitle}
Date: ${bookingData.visitDate}
Adults: ${bookingData.adultsCount}
Children: ${bookingData.childrenCount}
Total Price: AED ${bookingData.totalPrice.toFixed(2)}`;

      const encodedMessage = encodeURIComponent(message);

      // 3. Redirect to WhatsApp
      window.location.href = `https://wa.me/${targetWa}?text=${encodedMessage}`;
    } catch (error: any) {
      console.error('Error saving order', error);
      alert(error.message || 'There was a problem processing your order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.header}>
        <div className="container">
          <Breadcrumb
            separator=">"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Destination', href: '/destination' },
              ...(bookingData?.packageTitle ? [{ label: bookingData.packageTitle }] : []),
              { label: 'Checkout' },
            ]}
            style={{ marginBottom: '14px' }}
          />
          <h1 className={styles.title}>Secure Checkout</h1>
          <div className={styles.progress}>
            <span>1. Select Package</span>
            <span className={styles.activeStep}>2. Guest Details</span>
            <span>3. Payment</span>
          </div>
        </div>
      </div>

      <div className={`container ${styles.checkoutGrid}`}>
        <div className={styles.mainContent}>
          <form id="checkout-form" onSubmit={handleSubmit} className={styles.formSection}>
            <h2>Lead Guest Details</h2>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>First Name *</label>
                <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} />
              </div>
              <div className={styles.formGroup}>
                <label>Last Name *</label>
                <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Email Address *</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} />
                <span className={styles.helperText}>We'll send your booking confirmation here</span>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Phone Number *</label>
                <div className={styles.phoneInput}>
                  <select name="countryCode" value={formData.countryCode} onChange={handleChange}>
                    <option value="+971">+971 (UAE)</option>
                    <option value="+1">+1 (USA/Canada)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+91">+91 (India)</option>
                    <option value="+968">+968 (Oman)</option>
                  </select>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Special Requests (Optional)</label>
                <textarea name="specialRequests" rows={4} value={formData.specialRequests} onChange={handleChange}></textarea>
              </div>
            </div>
          </form>

          <div className={styles.formSection}>
            <h2>Payment Method</h2>
            <div className={styles.paymentMethods}>
              <label className={styles.paymentOption}>
                <input type="radio" name="payment" defaultChecked />
                <span>Pay securely with WhatsApp</span>
                <div className={styles.paymentIcons}>
                  <span>📱</span>
                </div>
              </label>
            </div>
            <p className={styles.paymentNotice}>
              By clicking "Complete Booking", you will be redirected to WhatsApp to finalize your payment securely with our team.
            </p>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.summaryCard}>
            <h2>Booking Summary</h2>
            
            <div className={styles.packageSummary}>
              <div className={styles.packageImage}>
                <Image 
                  src={bookingData.packageImage} 
                  alt={bookingData.packageTitle} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 30vw" 
                  style={{ objectFit: 'cover' }} 
                  unoptimized={Boolean(bookingData.packageImage && (bookingData.packageImage.startsWith('/api/images') || bookingData.packageImage.startsWith('data:')))}
                />
              </div>
              <div className={styles.packageInfo}>
                <h3>{bookingData.packageTitle}</h3>
                <p>Date: {bookingData.visitDate}</p>
              </div>
            </div>

            <div className={styles.summaryDetails}>
              <div className={styles.summaryRow}>
                <span>{bookingData.adultsCount}x Adult</span>
                <span>AED {(bookingData.adultsCount * bookingData.pricePerAdult).toFixed(2)}</span>
              </div>
              {bookingData.childrenCount > 0 && (
                <div className={styles.summaryRow}>
                  <span>{bookingData.childrenCount}x Child</span>
                  <span>AED {(bookingData.childrenCount * bookingData.pricePerChild).toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className={styles.promoSection}>
              <input type="text" placeholder="Promo Code" />
              <button>Apply</button>
            </div>

            <div className={styles.totalSection}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>AED {bookingData.totalPrice.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Taxes & Fees</span>
                <span>AED 0.00</span>
              </div>
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Total Amount</span>
                <span>AED {bookingData.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" form="checkout-form" className={styles.completeBtn} disabled={loading}>
              {loading ? 'Processing...' : 'Complete Booking'}
            </button>
            <p className={styles.secureBadge}>🔒 Secure Checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
}

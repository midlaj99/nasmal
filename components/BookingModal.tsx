"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';
import styles from './BookingModal.module.css';

interface BookingModalProps {
  packageId: string;
  packageTitle: string;
  packageImage: string;
  pricePerAdult: number;
  pricePerChild?: number;
  childAgeLimit?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({
  packageId,
  packageTitle,
  packageImage,
  pricePerAdult,
  pricePerChild,
  childAgeLimit,
  isOpen,
  onClose
}: BookingModalProps) {
  const router = useRouter();
  const { setBookingData } = useBooking();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [visitDate, setVisitDate] = useState('');

  if (!isOpen) return null;

  // Only enable child ticket if child price was explicitly configured from admin
  const hasChildOption = typeof pricePerChild === 'number' && !isNaN(pricePerChild) && pricePerChild > 0;
  const totalPrice = (adults * pricePerAdult) + (hasChildOption ? children * pricePerChild : 0);

  const handleCheckout = () => {
    setBookingData({
      packageId,
      packageTitle,
      packageImage,
      pricePerAdult,
      pricePerChild: hasChildOption ? pricePerChild : 0,
      adultsCount: adults,
      childrenCount: hasChildOption ? children : 0,
      visitDate: visitDate || new Date().toISOString().split('T')[0], // fallback to today if not selected
      totalPrice
    });
    router.push('/checkout');
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Select your preferences</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.dateSelection}>
            <label>Select Date</label>
            <input 
              type="date" 
              value={visitDate} 
              onChange={(e) => setVisitDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>

          <div className={styles.ticketSelection}>
            <div className={styles.ticketRow}>
              <div>
                <h4>Adult</h4>
                <p className={styles.priceDetail}>AED {pricePerAdult}</p>
              </div>
              <div className={styles.counter}>
                <button onClick={() => setAdults(Math.max(1, adults - 1))} disabled={adults <= 1}>-</button>
                <span>{adults}</span>
                <button onClick={() => setAdults(adults + 1)}>+</button>
              </div>
            </div>

            {hasChildOption && (
              <div className={styles.ticketRow}>
                <div>
                  <h4>Child {childAgeLimit ? `(${childAgeLimit})` : ''}</h4>
                  <p className={styles.priceDetail}>AED {pricePerChild}</p>
                </div>
                <div className={styles.counter}>
                  <button onClick={() => setChildren(Math.max(0, children - 1))} disabled={children <= 0}>-</button>
                  <span>{children}</span>
                  <button onClick={() => setChildren(children + 1)}>+</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <div className={styles.totalSection}>
            <p>Total Price</p>
            <h3>AED {totalPrice.toFixed(2)}</h3>
          </div>
          <button className={styles.checkoutBtn} onClick={handleCheckout}>Checkout</button>
        </div>
      </div>
    </div>
  );
}

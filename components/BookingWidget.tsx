"use client";

import React, { useState } from 'react';
import BookingModal from './BookingModal';
import styles from './BookingWidget.module.css';

interface BookingWidgetProps {
  packageId: string;
  packageTitle: string;
  packageImage: string;
  price: number;
  childPrice?: number;
  childAgeLimit?: string;
}

export default function BookingWidget({
  packageId,
  packageTitle,
  packageImage,
  price,
  childPrice,
  childAgeLimit
}: BookingWidgetProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Only consider child pricing valid if explicitly configured from admin page
  const hasChildOption = typeof childPrice === 'number' && !isNaN(childPrice) && childPrice > 0;

  return (
    <>
      <div className={styles.bookingCard}>
        <h3 className={styles.sectionTitle}>Available options</h3>
        <div className={styles.option}>
          <div className={styles.optionTitle}>Fast Selling Standard Ticket</div>
          <p className={styles.optionDesc}>
            Inclusion: The ticket allows visitors to enter the park and access to all 12 immersive zones.
          </p>
          <div className={styles.optionPrice}>
            AED {price} <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>/ adult</span>
            {hasChildOption && (
              <div style={{ fontSize: '0.85rem', color: '#16a34a', marginTop: '4px', fontWeight: '600' }}>
                AED {childPrice} / child {childAgeLimit ? `(${childAgeLimit})` : ''}
              </div>
            )}
          </div>
        </div>
        <button className={styles.bookButton} onClick={() => setIsModalOpen(true)}>
          Select option
        </button>
      </div>

      <BookingModal
        packageId={packageId}
        packageTitle={packageTitle}
        packageImage={packageImage}
        pricePerAdult={price}
        pricePerChild={hasChildOption ? childPrice : undefined}
        childAgeLimit={childAgeLimit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

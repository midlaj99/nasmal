"use client";

import React, { useState } from 'react';
import BookingModal from './BookingModal';
import styles from './BookingWidget.module.css';

interface BookingWidgetProps {
  packageId: string;
  packageTitle: string;
  packageImage: string;
  price: number;
}

export default function BookingWidget({
  packageId,
  packageTitle,
  packageImage,
  price
}: BookingWidgetProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className={styles.bookingCard}>
        <h3 className={styles.sectionTitle}>Available options</h3>
        <div className={styles.option}>
          <div className={styles.optionTitle}>Fast Selling Standard Ticket</div>
          <p className={styles.optionDesc}>
            Inclusion: The ticket allows visitors to enter the park and access to all 12 immersive zones.
          </p>
          <div className={styles.optionPrice}>AED {price}</div>
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
        pricePerChild={price * 0.8} // Mock child price as 80% of adult
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

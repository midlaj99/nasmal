"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './booked.module.css';

export interface BookedOrder {
  id: string;
  packageTitle: string;
  packageImage?: string;
  visitDate: string;
  adults: number;
  children: number;
  totalPrice: number;
  bookedAt: string;
  customerName?: string;
  phone?: string;
  status: string;
}

export default function BookedPackagesPage() {
  const [bookings, setBookings] = useState<BookedOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nasmal_booked_orders');
      if (stored) {
        setBookings(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse local bookings', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971582659321';

  return (
    <main className={styles.wrapper}>
      <div className={styles.container}>
        <Breadcrumb
          separator=">"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Booked Packages' },
          ]}
        />

        <div className={styles.header}>
          <h1 className={styles.title}>My Booked Packages</h1>
          <p className={styles.subtitle}>
            Your confirmed reservations and tour tickets with Nasmal Tourism.
          </p>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            Loading your bookings...
          </p>
        ) : bookings.length > 0 ? (
          <div className={styles.list}>
            {bookings.map((bkg) => (
              <div key={bkg.id} className={styles.bookingCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.bookingIdGroup}>
                    <span className={styles.bookingId}>{bkg.id}</span>
                    <span className={styles.statusBadge}>{bkg.status || 'Confirmed'}</span>
                  </div>
                  <span className={styles.bookedDate}>
                    Booked on {new Date(bkg.bookedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <img
                    src={bkg.packageImage || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80'}
                    alt={bkg.packageTitle}
                    className={styles.packageImg}
                  />
                  <div className={styles.packageDetails}>
                    <h3 className={styles.packageTitle}>{bkg.packageTitle}</h3>
                    <div className={styles.metaRow}>
                      <div className={styles.metaItem}>
                        <span>📅</span>
                        <span>Date: <strong>{bkg.visitDate}</strong></span>
                      </div>
                      <div className={styles.metaItem}>
                        <span>👥</span>
                        <span>
                          {bkg.adults} Adult{bkg.adults > 1 ? 's' : ''}
                          {bkg.children > 0 ? `, ${bkg.children} Child` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <div>
                    <span className={styles.priceLabel}>Total Amount: </span>
                    <span className={styles.priceValue}>AED {Number(bkg.totalPrice || 0).toFixed(2)}</span>
                  </div>
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi Nasmal Tourism! I have a question regarding my booking: ${bkg.id} (${bkg.packageTitle})`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.supportBtn}
                  >
                    <span>💬 WhatsApp Support</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎫</div>
            <h2>No Booked Packages Yet</h2>
            <p>
              You haven&apos;t completed any package bookings in this browser yet. Ready for an unforgettable UAE adventure?
            </p>
            <div className={styles.btnGroup}>
              <Link href="/activities" className={styles.browseBtn}>
                Explore Activities
              </Link>
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Nasmal Tourism, I would like to inquire about my tour bookings!')}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.waBtn}
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

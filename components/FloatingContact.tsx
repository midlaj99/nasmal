"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import styles from './FloatingContact.module.css';

export default function FloatingContact() {
  const pathname = usePathname();

  // Exclude all admin routes
  if (pathname && (pathname === '/admin' || pathname.startsWith('/admin/'))) {
    return null;
  }

  const phoneNumber = '+971 58 265 9321';
  const cleanPhone = '971582659321';
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Hello Nasmal Tourisms, I would like to inquire about tours and bookings.'
  )}`;
  const callUrl = `tel:+${cleanPhone}`;

  return (
    <aside className={styles.floatingContainer} aria-label="Floating Quick Contact">
      {/* Call Button */}
      <a
        href={callUrl}
        className={`${styles.floatingBtn} ${styles.callBtn}`}
        aria-label={`Call us at ${phoneNumber}`}
      >
        <span className={styles.btnTooltip}>Call: {phoneNumber}</span>
        <svg
          className={styles.btnIcon}
          width="23"
          height="23"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </a>

      {/* WhatsApp Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.floatingBtn} ${styles.whatsappBtn}`}
        aria-label="Chat with us on WhatsApp"
      >
        <span className={styles.btnTooltip}>Chat on WhatsApp</span>
        <svg
          className={styles.btnIcon}
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.477 2 12C2 13.818 2.485 15.525 3.332 17L2.1 21.65L6.87 20.44C8.384 21.42 10.144 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM17.43 15.34C17.21 15.89 16.27 16.38 15.82 16.44C15.42 16.5 14.91 16.52 13.13 15.78C10.78 14.81 9.27 12.44 9.15 12.28C9.03 12.13 8.2 11.03 8.2 9.89C8.2 8.75 8.78 8.2 9.02 7.96C9.22 7.76 9.47 7.71 9.62 7.71C9.77 7.71 9.92 7.71 10.05 7.72C10.19 7.73 10.38 7.68 10.56 8.12C10.75 8.58 11.22 9.74 11.28 9.86C11.34 9.98 11.38 10.11 11.3 10.27C11.22 10.43 11.18 10.52 11.07 10.65C10.95 10.78 10.83 10.93 10.72 11.04C10.6 11.16 10.47 11.29 10.61 11.53C10.75 11.77 11.22 12.54 11.91 13.15C12.8 13.94 13.53 14.19 13.77 14.31C14.01 14.43 14.15 14.41 14.28 14.26C14.42 14.1 14.86 13.58 15.02 13.35C15.17 13.12 15.33 13.15 15.54 13.23C15.76 13.31 16.92 13.88 17.15 14C17.39 14.12 17.54 14.18 17.6 14.28C17.66 14.38 17.66 14.8 17.43 15.34Z"
            fill="currentColor"
          />
        </svg>
      </a>
    </aside>
  );
}

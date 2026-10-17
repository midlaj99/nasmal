"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import PackageCard from '@/components/PackageCard';
import styles from './wishlist.module.css';

function getUserId(): string {
  if (typeof window === 'undefined') return 'guest';
  let uid = localStorage.getItem('nasmal_uid');
  if (!uid) {
    uid = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('nasmal_uid', uid);
  }
  return uid;
}

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = getUserId();
    fetch(`/api/wishlist?userId=${encodeURIComponent(uid)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setItems(data);
        }
      })
      .catch(err => console.error('Failed to load wishlist:', err))
      .finally(() => setLoading(false));

    const handleUpdate = (e: any) => {
      if (e.detail && !e.detail.isSaved) {
        setItems(prev => prev.filter(i => (i.id || i.packageId) !== e.detail.id));
      }
    };
    window.addEventListener('nasmal_wishlist_updated', handleUpdate);
    return () => window.removeEventListener('nasmal_wishlist_updated', handleUpdate);
  }, []);

  return (
    <main className={styles.wrapper}>
      <div className={styles.container}>
        <Breadcrumb
          separator=">"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Wishlist' },
          ]}
        />

        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <span className={styles.eyebrow}>MY COLLECTION</span>
              <h1 className={styles.title}>Saved Wishlist</h1>
            </div>
            {!loading && items.length > 0 && (
              <span className={styles.countBadge}>
                {items.length} {items.length === 1 ? 'Experience' : 'Experiences'}
              </span>
            )}
          </div>
          <p className={styles.subtitle}>
            Experiences and tours you’ve bookmarked for your trip across Dubai & the UAE.
          </p>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Loading your saved experiences...</p>
          </div>
        ) : items.length > 0 ? (
          <div className={styles.grid}>
            {items.map(pkg => (
              <div key={pkg.id} className={styles.cardWrapper}>
                <PackageCard {...pkg} />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.iconCircle}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h2>Your wishlist is currently empty</h2>
            <p>
              Explore top-rated desert safaris, yacht cruises, city tours, and iconic attractions to save your favorites for later!
            </p>
            <div className={styles.emptyActions}>
              <Link href="/activities" className={styles.browseBtn}>
                <span>Browse All Activities</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/destinations" className={styles.secondaryBtn}>
                <span>Explore Destinations</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

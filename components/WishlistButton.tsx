"use client";

import React, { useState, useEffect } from 'react';
import styles from './WishlistButton.module.css';

interface WishlistButtonProps {
  packageId: string;
  packageTitle: string;
}

// Generate or retrieve persistent customer ID across sessions
function getPersistentUserId(): string {
  if (typeof window === 'undefined') return 'guest';
  let uid = localStorage.getItem('nasmal_uid');
  if (!uid) {
    uid = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('nasmal_uid', uid);
  }
  return uid;
}

export default function WishlistButton({ packageId, packageTitle }: WishlistButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const userId = getPersistentUserId();
    if (!userId || !packageId) return;

    // Check wishlist status from database
    fetch(`/api/wishlist?userId=${encodeURIComponent(userId)}&packageId=${encodeURIComponent(packageId)}`)
      .then(res => res.json())
      .then(data => {
        if (data.isWishlisted !== undefined) {
          setIsSaved(data.isWishlisted);
        }
      })
      .catch(err => console.error('Failed to check wishlist status:', err));
  }, [packageId]);

  const toggleWishlist = async () => {
    if (loading) return;
    setLoading(true);
    setStatusMessage('');
    const userId = getPersistentUserId();

    try {
      if (isSaved) {
        // Remove from database
        const res = await fetch(
          `/api/wishlist?userId=${encodeURIComponent(userId)}&packageId=${encodeURIComponent(packageId)}`,
          { method: 'DELETE' }
        );
        const data = await res.json();
        if (data.success || !data.isWishlisted) {
          setIsSaved(false);
          setStatusMessage('Removed from your wishlist');
        }
      } else {
        // Add to database
        const res = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, packageId })
        });
        const data = await res.json();
        if (data.success || data.isWishlisted) {
          setIsSaved(true);
          setStatusMessage('Saved to your wishlist for later booking!');
        }
      }
    } catch (err) {
      console.error('Error updating wishlist:', err);
      setStatusMessage('Could not update wishlist. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMessage(''), 3500);
    }
  };

  return (
    <div className={styles.wishlistSection}>
      <button
        type="button"
        onClick={toggleWishlist}
        disabled={loading}
        className={`${styles.wishlistBtn} ${isSaved ? styles.saved : ''}`}
        title={isSaved ? 'Remove from wishlist' : 'Save for later booking'}
        aria-label="Wishlist"
      >
        <span className={styles.heartIcon}>
          {isSaved ? '❤️' : '🤍'}
        </span>
        <span className={styles.btnText}>
          {loading ? 'Updating...' : isSaved ? 'Saved in Wishlist' : 'Save for Later Booking'}
        </span>
      </button>

      {statusMessage && (
        <div className={styles.toastMessage}>
          {statusMessage}
        </div>
      )}
    </div>
  );
}

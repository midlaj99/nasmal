'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getHighResImageUrl } from '@/lib/imageHelper';
import styles from './PackageCard.module.css';

interface PackageProps {
  id: string;
  title: string;
  image: string;
  price: string;
  originalPrice?: string;
  rating: string;
  reviewsCount: number;
}

// User ID generator / retriever for persistent customer wishlist
function getUserId(): string {
  if (typeof window === 'undefined') return 'guest';
  let uid = localStorage.getItem('nasmal_uid');
  if (!uid) {
    uid = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('nasmal_uid', uid);
  }
  return uid;
}

// Shared cache across all PackageCards on the page to avoid duplicate requests
let cachedWishlistIds: Set<string> | null = null;
let pendingFetch: Promise<Set<string>> | null = null;

async function loadUserWishlist(uid: string): Promise<Set<string>> {
  if (cachedWishlistIds) return cachedWishlistIds;
  if (pendingFetch) return pendingFetch;

  pendingFetch = fetch(`/api/wishlist?userId=${encodeURIComponent(uid)}`)
    .then(r => r.json())
    .then(data => {
      const set = new Set<string>();
      if (Array.isArray(data)) {
        data.forEach(item => {
          const id = item.id || item.packageId;
          if (id) set.add(String(id));
        });
      }
      cachedWishlistIds = set;
      return set;
    })
    .catch(() => new Set<string>());

  return pendingFetch;
}

export default function PackageCard({ id, title, image, price, originalPrice, rating, reviewsCount }: PackageProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const uid = getUserId();
    loadUserWishlist(uid).then(set => {
      if (set.has(String(id))) {
        setIsSaved(true);
      }
    });

    const handleWishlistUpdate = (e: any) => {
      if (e.detail?.id === id) {
        setIsSaved(e.detail.isSaved);
      }
    };

    window.addEventListener('nasmal_wishlist_updated', handleWishlistUpdate);
    return () => window.removeEventListener('nasmal_wishlist_updated', handleWishlistUpdate);
  }, [id]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isUpdating) return;
    setIsUpdating(true);

    const nextState = !isSaved;
    setIsSaved(nextState);

    // Update shared cache
    if (cachedWishlistIds) {
      if (nextState) cachedWishlistIds.add(String(id));
      else cachedWishlistIds.delete(String(id));
    }

    // Broadcast event to other components
    window.dispatchEvent(
      new CustomEvent('nasmal_wishlist_updated', {
        detail: { id, isSaved: nextState }
      })
    );

    const uid = getUserId();
    try {
      if (nextState) {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: uid, packageId: id })
        });
      } else {
        await fetch(`/api/wishlist?userId=${encodeURIComponent(uid)}&packageId=${encodeURIComponent(id)}`, {
          method: 'DELETE'
        });
      }
    } catch (err) {
      console.error('Failed to update wishlist:', err);
      // Revert if failed
      setIsSaved(!nextState);
    } finally {
      setIsUpdating(false);
    }
  };

  const safeImage = (image && (image.startsWith('http') || image.startsWith('/'))) ? image : '/hero-bg.jpg';
  const highResImage = getHighResImageUrl(safeImage, 'card');

  return (
    <Link href={`/packages/${id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image 
          src={highResImage} 
          alt={title} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
          className={styles.image} 
          unoptimized={Boolean(highResImage && (highResImage.startsWith('/api/images') || highResImage.startsWith('data:')))}
        />
        
        {/* Wishlist Love Heart Button */}
        <button
          type="button"
          className={`${styles.favButton} ${isSaved ? styles.favButtonActive : ''}`}
          onClick={toggleWishlist}
          title={isSaved ? "Remove from Wishlist" : "Save to Wishlist"}
          aria-label={isSaved ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill={isSaved ? "#e11d48" : "none"} 
            stroke={isSaved ? "#e11d48" : "currentColor"} 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.ratingBox}>
          <span className={styles.star}>★</span>
          <span className={styles.rating}>{rating}</span>
          <span className={styles.reviews}>({reviewsCount} Reviews)</span>
        </div>
        <div className={styles.priceBox}>
          <span className={styles.from}>From</span>
          <div className={styles.prices}>
            {originalPrice && <span className={styles.originalPrice}>AED {originalPrice}</span>}
            <span className={styles.price}>AED {price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

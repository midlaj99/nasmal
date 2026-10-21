"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getHighResImageUrl } from '@/lib/imageHelper';
import styles from './AutoCarousel.module.css';

interface Deal {
  id: string;
  title: string;
  image: string;
  price?: string;
  originalPrice?: string;
  rating?: string;
  reviewsCount?: number;
}

export default function AutoCarousel({ deals = [] }: { deals: Deal[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setItemsPerView(1);
      } else if (window.innerWidth <= 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (deals.length <= itemsPerView) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const step = 1;
        const maxIndex = deals.length - itemsPerView;
        if (prev >= maxIndex) return 0;
        return prev + step;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [deals.length, itemsPerView]);

  if (deals.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 16px', color: '#64748b' }}>
        <p style={{ fontSize: '1.05rem', margin: 0 }}>Special best deals will be featured here soon!</p>
      </div>
    );
  }

  return (
    <div className={styles.carouselWrapper}>
      <div
        className={styles.carouselTrack}
        style={{
          width: `${(deals.length / itemsPerView) * 100}%`,
          transform: `translateX(-${(currentIndex / deals.length) * 100}%)`,
        }}
      >
        {deals.map(deal => {
          const safeImage = (deal.image && (deal.image.startsWith('http') || deal.image.startsWith('/'))) 
            ? deal.image 
            : '/hero-bg.jpg';
          const highResImage = getHighResImageUrl(safeImage, 'card');

          return (
            <div key={deal.id} className={styles.carouselItem}>
              <div className={styles.offerCard}>
                <Image
                  src={highResImage}
                  alt={deal.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={styles.offerImage}
                  unoptimized={Boolean(highResImage && (highResImage.startsWith('/api/images') || highResImage.startsWith('data:')))}
                />
                <div className={styles.offerOverlay}>
                  <h3 className={styles.offerTitle}>{deal.title}</h3>
                  <Link href={`/packages/${deal.id}`} className={styles.bookNowBtn}>
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {deals.length > itemsPerView && (
        <div className={styles.dots}>
          {Array.from({ length: Math.ceil(deals.length / itemsPerView) }).map((_, idx) => (
            <div
              key={idx}
              className={`${styles.dot} ${currentIndex === idx * itemsPerView ? styles.activeDot : ''}`}
              onClick={() => setCurrentIndex(idx * itemsPerView)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

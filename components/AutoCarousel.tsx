"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

export default function AutoCarousel({ deals }: { deals: Deal[] }) {
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
    
    // Initial check
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const step = itemsPerView;
        const maxIndex = deals.length - itemsPerView;
        if (prev >= maxIndex) return 0;
        return prev + step;
      });
    }, 4000); // auto scroll every 4 seconds
    
    return () => clearInterval(interval);
  }, [deals.length, itemsPerView]);

  return (
    <div className={styles.carouselWrapper}>
      <div 
        className={styles.carouselTrack}
        style={{ 
          width: `${(deals.length / itemsPerView) * 100}%`,
          transform: `translateX(-${(currentIndex / deals.length) * 100}%)` 
        }}
      >
        {deals.map(deal => (
          <div key={deal.id} className={styles.carouselItem}>
            <div className={styles.offerCard}>
              <Image src={deal.image} alt={deal.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className={styles.offerImage} />
              <div className={styles.offerOverlay}>
                <h3 className={styles.offerTitle}>{deal.title}</h3>
                <Link href="#" className={styles.bookNowBtn}>Book Now</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.dots}>
        {Array.from({ length: Math.ceil(deals.length / itemsPerView) }).map((_, idx) => (
          <div 
            key={idx} 
            className={`${styles.dot} ${currentIndex === idx * itemsPerView ? styles.activeDot : ''}`}
            onClick={() => setCurrentIndex(idx * itemsPerView)}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import HeroSearchBar from './HeroSearchBar';
import { getHighResImageUrl } from '@/lib/imageHelper';
import styles from './Hero.module.css';

export interface HeroDestination {
  name: string;
  image: string;
}

interface HeroProps {
  destinations?: Array<{
    id?: string;
    title?: string;
    name?: string;
    image?: string;
  }>;
}

const DEFAULT_HERO_DESTINATIONS: HeroDestination[] = [
  { name: 'Dubai', image: '/hero-bg.jpg' }
];

export default function Hero({ destinations: propDestinations }: HeroProps) {
  // Format initial destinations from server prop
  const formatDestinations = (list: any[]): HeroDestination[] => {
    return list
      .filter(d => Boolean(d && (d.title || d.name) && d.image))
      .map(d => ({
        name: d.title || d.name || '',
        image: d.image || '/hero-bg.jpg',
      }));
  };

  const [destList, setDestList] = useState<HeroDestination[]>(() => {
    if (propDestinations && propDestinations.length > 0) {
      const formatted = formatDestinations(propDestinations);
      if (formatted.length > 0) return formatted;
    }
    return DEFAULT_HERO_DESTINATIONS;
  });

  const [activeIndex, setActiveIndex] = useState(0);

  // Sync with live database via API on client
  useEffect(() => {
    fetch('/api/destinations')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch destinations');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const valid = formatDestinations(data);
          if (valid.length > 0) {
            setDestList(valid);
          }
        }
      })
      .catch(err => console.error('Error loading destinations for hero:', err));
  }, []);

  // Auto-cycle through destinations every 5 seconds
  useEffect(() => {
    if (destList.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex(current => (current + 1) % destList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [destList.length]);

  // Ensure activeIndex is within bounds if destination list size changes
  useEffect(() => {
    if (activeIndex >= destList.length && destList.length > 0) {
      setActiveIndex(0);
    }
  }, [destList.length, activeIndex]);

  const activeBgList = destList.length > 0 ? destList : DEFAULT_HERO_DESTINATIONS;
  const currentDest = activeBgList[activeIndex] || DEFAULT_HERO_DESTINATIONS[0];

  return (
    <section className={styles.hero}>
      {activeBgList.map((dest, idx) => {
        const enhancedImage = getHighResImageUrl(dest.image, 'hero');
        const bgUrl = enhancedImage.startsWith('http') || enhancedImage.startsWith('data:')
          ? enhancedImage
          : encodeURI(enhancedImage);

        return (
          <div 
            key={`${dest.name}-${idx}`}
            className={`${styles.bgImage} ${idx === activeIndex ? styles.activeBg : ''}`}
            style={{ backgroundImage: `url("${bgUrl}")` }}
          />
        );
      })}
      <div className={styles.overlay}></div>
      
      <div className="container">
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Travel that shapes you in <br />
            <span key={currentDest.name} className={styles.animatedText}>
              {currentDest.name}
            </span>
          </h1>
          <p className={styles.subtitle}>Book activities, tours and experiences</p>
          
          <HeroSearchBar 
            placeholder={`Search for destinations in ${currentDest.name}...`} 
            align="center" 
          />
        </div>
      </div>
    </section>
  );
}

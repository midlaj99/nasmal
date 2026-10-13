"use client";

import { useState, useEffect } from 'react';
import HeroSearchBar from './HeroSearchBar';
import styles from './Hero.module.css';

const destinations = [
  { name: 'Dubai', image: '/hero-bg.jpg' },
  { name: 'Abu Dhabi', image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=1600&q=80' },
  { name: 'Sharjah', image: '/sharjah.jpg' }
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % destinations.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.hero}>
      {destinations.map((dest, idx) => (
        <div 
          key={dest.name}
          className={`${styles.bgImage} ${idx === activeIndex ? styles.activeBg : ''}`}
          style={{ backgroundImage: `url(${dest.image})` }}
        />
      ))}
      <div className={styles.overlay}></div>
      
      <div className="container">
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Travel that shapes you in <br />
            <span key={activeIndex} className={styles.animatedText}>
              {destinations[activeIndex].name}
            </span>
          </h1>
          <p className={styles.subtitle}>Book activities, tours and experiences</p>
          
          <HeroSearchBar 
            placeholder={`Search for destinations in ${destinations[activeIndex].name}...`} 
            align="center" 
          />
        </div>
      </div>
    </section>
  );
}

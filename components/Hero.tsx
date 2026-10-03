"use client";

import { useState, useEffect } from 'react';
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
          
          <div className={styles.searchBar}>
            <input 
              type="text" 
              placeholder={`Search for destinations in ${destinations[activeIndex].name}...`} 
              className={styles.searchInput}
            />
            <button className={styles.searchBtn} aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

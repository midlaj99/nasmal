import React from 'react';
import styles from './WhyChooseNasmal.module.css';

const features = [
  {
    id: 'price',
    title: 'Best Price Guarantee',
    description: 'Explore top-rated activities at the best prices, from popular tours to hidden gems.',
    bgColor: '#e0f2fe',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L4 5.5V11.5C4 16.5 7.4 21.1 12 22.3C16.6 21.1 20 16.5 20 11.5V5.5L12 2Z" fill="#0284c7" fillOpacity="0.18" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 12L11 14L15 10" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 'support',
    title: '24/7 Live Chat Support',
    description: 'Get immediate assistance anytime with our 24/7 live chat, ensuring instant help.',
    bgColor: '#ede9fe',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0725 19.9997 12.485 20C10.85 20 9.25 19.55 7.85 18.7L3 20L4.35 15.3C3.47 13.9 3 12.25 3 10.5C3 5.8 7.03 2 12 2C16.97 2 21 5.8 21 10.5V11.5Z" fill="#7c3aed" fillOpacity="0.18" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="8.5" cy="11.5" r="1.5" fill="#7c3aed"/>
        <circle cx="12" cy="11.5" r="1.5" fill="#7c3aed"/>
        <circle cx="15.5" cy="11.5" r="1.5" fill="#7c3aed"/>
      </svg>
    )
  },
  {
    id: 'transaction',
    title: 'Easy Online Transaction',
    description: 'Simplify your bookings. Earn and redeem miles effortlessly with every transaction.',
    bgColor: '#e0f2fe',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="5" width="20" height="14" rx="3" fill="#0284c7" fillOpacity="0.18" stroke="#0284c7" strokeWidth="2"/>
        <line x1="2" y1="10" x2="22" y2="10" stroke="#0284c7" strokeWidth="2"/>
        <circle cx="6" cy="14.5" r="1.5" fill="#0284c7"/>
        <line x1="10" y1="14.5" x2="14" y2="14.5" stroke="#0284c7" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'reviews',
    title: 'Guest Reviews & Ratings',
    description: 'Explore top-rated activities with confidence through verified reviews and high ratings.',
    bgColor: '#fef3c7',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.5L14.9 8.4L21.4 9.3L16.7 13.9L17.8 20.4L12 17.3L6.2 20.4L7.3 13.9L2.6 9.3L9.1 8.4L12 2.5Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
];

export default function WhyChooseNasmal() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>WHY CHOOSE NASMAL TOURS?</span>
          <h2 className={styles.title}>Why Nasmal Tourism?</h2>
          <div className={styles.accentBar}></div>
        </div>

        <div className={styles.grid}>
          {features.map((item) => (
            <div key={item.id} className={styles.card}>
              <div 
                className={styles.iconWrapper} 
                style={{ backgroundColor: item.bgColor }}
              >
                {item.icon}
              </div>
              <div className={styles.content}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

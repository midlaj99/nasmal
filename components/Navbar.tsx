"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowSearch(true);
      } else {
        setShowSearch(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <div className={styles.leftSection}>
          <Link href="/" className={styles.logo}>
            <Image src="/logo.png" alt="Nasmal Tourisms" width={140} height={48} className={styles.logoImg} />
          </Link>
          
          {showSearch && (
            <div className={`${styles.searchBar} ${isMobileSearchOpen ? styles.mobileSearchOpen : ''}`}>
              <span className={styles.searchIcon} onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input type="text" placeholder="Search destinations, tours, activities..." />
            </div>
          )}
        </div>

        <button className={styles.mobileMenuBtn} onClick={toggleMobileMenu} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>

        <div className={`${styles.navLinks} ${isMobileMenuOpen ? styles.navLinksOpen : ''}`}>
          <div className={styles.dropdown}>
            <span>AED</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </div>
          
          <div className={styles.dropdown}>
            <span>English</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </div>
          
          <Link href="/help" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Help Center</Link>
          
          <div className={styles.authGroup}>
            <Link href="/login" className={styles.loginBtn} onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
            <Link href="/signup" className={styles.signupBtn} onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

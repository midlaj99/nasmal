"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';
import WishlistButton from '@/components/WishlistButton';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './PackageDetailClient.module.css';

interface PackageDetailClientProps {
  packageData: {
    id: string;
    title: string;
    destination: string;
    image: string;
    images?: string[];
    price: string;
    rating: string;
    reviewsCount: number;
    tags?: string[];
    description: string;
    highlights?: string[];
    quickFacts?: string[];
    inclusions?: string[];
    childPrice?: string;
    childAgeLimit?: string;
  };
}

export default function PackageDetailClient({ packageData }: PackageDetailClientProps) {
  const router = useRouter();
  const { setBookingData } = useBooking();

  const [activeTab, setActiveTab] = useState<'overview' | 'highlights' | 'inclusions' | 'important' | 'reviews'>('overview');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [adults, setAdults] = useState<number>(1);
  const [showGuestDropdown, setShowGuestDropdown] = useState<boolean>(false);
  const [activePhotoModal, setActivePhotoModal] = useState<boolean>(false);
  const [reviewIndex, setReviewIndex] = useState<number>(0);
  
  // Mobile Gallery Carousel State
  const [mobileGalleryIndex, setMobileGalleryIndex] = useState<number>(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const displayImages = (packageData.images && packageData.images.length > 0)
    ? packageData.images
    : [packageData.image];

  // Auto-move images every 5s
  useEffect(() => {
    if (displayImages.length <= 1) return;
    const interval = setInterval(() => {
      setMobileGalleryIndex((prev) => (prev + 1) % displayImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [displayImages.length]);

  const handleMobileTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleMobileTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleMobileTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    const swipeThreshold = 40; // minimum distance in px

    if (diff > swipeThreshold) {
      // Swiped left -> Next image
      setMobileGalleryIndex((prev) => (prev + 1) % displayImages.length);
    } else if (diff < -swipeThreshold) {
      // Swiped right -> Previous image
      setMobileGalleryIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const prevMobileImage = () => {
    setMobileGalleryIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const nextMobileImage = () => {
    setMobileGalleryIndex((prev) => (prev + 1) % displayImages.length);
  };

  const mainImage = displayImages[0] || packageData.image;
  const sideImage1 = displayImages[1] || displayImages[0] || packageData.image;
  const sideImage2 = displayImages[2] || displayImages[0] || packageData.image;

  const priceNum = parseFloat(packageData.price) || 150;
  const reviewsCount = packageData.reviewsCount || 24;
  const ratingNum = packageData.rating || '5.0';

  // Sample or real reviews
  const reviewsList = [
    {
      id: '1',
      name: 'Mohamed Farouk',
      tag: 'Solo',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
      rating: 5,
      comment: 'Very well done. Seamless booking experience and great support!',
      date: '12 Mar 2025'
    },
    {
      id: '2',
      name: 'Jinwoo Park',
      tag: 'Family',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
      rating: 5,
      comment: 'Really enjoyed it. Perfect for kids, teens, and families. Highly recommended!',
      date: '5 Mar 2025'
    },
    {
      id: '3',
      name: 'Sarah Jenkins',
      tag: 'Couple',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
      rating: 5,
      comment: 'Unforgettable experience! Sunset view was breathtaking and hospitality was top notch.',
      date: '28 Feb 2025'
    }
  ];

  // Highlights fallback
  const highlights = (packageData.highlights && packageData.highlights.length > 0)
    ? packageData.highlights
    : [
        'Dune bashing in a 4x4 vehicle',
        'Camel ride and sandboarding',
        'Traditional Bedouin camp with BBQ dinner',
        'Live entertainment (belly dance & tanoura show)',
        'Stunning sunset views in the desert'
      ];

  // Inclusions fallback
  const inclusions = (packageData.inclusions && packageData.inclusions.length > 0)
    ? packageData.inclusions
    : [
        'Hotel pick-up and drop-off (selected areas)',
        'Sandboarding',
        'Dune bashing (30-45 minutes)',
        'BBQ dinner with soft drinks',
        'Camel ride (short ride)',
        'Live entertainment show'
      ];

  const handleBookNow = () => {
    setBookingData({
      packageId: packageData.id,
      packageTitle: packageData.title,
      packageImage: mainImage,
      pricePerAdult: priceNum,
      pricePerChild: 0,
      adultsCount: adults,
      childrenCount: 0,
      visitDate: selectedDate || new Date().toISOString().split('T')[0],
      totalPrice: adults * priceNum
    });
    router.push('/checkout');
  };

  const handleTabChange = (tab: 'overview' | 'highlights' | 'inclusions' | 'important' | 'reviews') => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        separator=">"
        items={[
          { label: 'Home', href: '/' },
          { label: 'Destination', href: '/destination' },
          ...(packageData.destination ? [{ label: packageData.destination, href: `/destination/${packageData.destination.toLowerCase().replace(/\s+/g, '-')}` }] : []),
          { label: packageData.title },
        ]}
      />

      {/* Main Heading & Title Header */}
      <div className={styles.headerTitleSection}>
        <h1 className={styles.mainHeading}>{packageData.title.toUpperCase()}</h1>
        <div className={styles.headerMeta}>
          <div className={styles.ratingBox}>
            <span className={styles.starIcon}>★</span>
            <span className={styles.ratingNumber}>{ratingNum}</span>
            <span className={styles.reviewsCount}>({reviewsCount} Reviews)</span>
          </div>
          <span className={styles.metaDivider}>|</span>
          <div className={styles.priceMeta}>
            <span className={styles.fromText}>from</span>
            <span className={styles.priceAmount}>AED {priceNum}</span>
          </div>
        </div>
      </div>

      {/* Desktop Gallery Grid */}
      <div className={`${styles.galleryGrid} ${styles.desktopGallery}`}>
        <div className={styles.mainGalleryCol}>
          <div className={styles.mainImageWrapper}>
            <Image
              src={mainImage}
              alt={packageData.title}
              fill
              sizes="(max-width: 900px) 100vw, 66vw"
              className={styles.galleryImg}
              priority
            />
          </div>
        </div>

        <div className={styles.sideGalleryCol}>
          <div className={styles.sideImageTop}>
            <Image
              src={sideImage1}
              alt={`${packageData.title} side photo 1`}
              fill
              sizes="(max-width: 900px) 100vw, 33vw"
              className={styles.galleryImg}
            />
          </div>
          <div className={styles.sideImageBottom}>
            <Image
              src={sideImage2}
              alt={`${packageData.title} side photo 2`}
              fill
              sizes="(max-width: 900px) 100vw, 33vw"
              className={styles.galleryImg}
            />
            <button 
              className={styles.viewAllPhotosBtn} 
              onClick={() => setActivePhotoModal(true)}
              type="button"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>View all photos ({displayImages.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Auto/Manual Scrollable Carousel */}
      <div 
        className={styles.mobileGalleryCarousel}
        onTouchStart={handleMobileTouchStart}
        onTouchMove={handleMobileTouchMove}
        onTouchEnd={handleMobileTouchEnd}
      >
        <div 
          className={styles.mobileCarouselTrack}
          style={{ transform: `translateX(-${mobileGalleryIndex * 100}%)` }}
        >
          {displayImages.map((img, idx) => (
            <div key={idx} className={styles.mobileCarouselSlide}>
              <Image
                src={img}
                alt={`${packageData.title} photo ${idx + 1}`}
                fill
                sizes="100vw"
                className={styles.mobileSlideImg}
                priority={idx === 0}
              />
            </div>
          ))}
        </div>

        {/* View All Photos button on Mobile */}
        <button 
          className={styles.mobileViewPhotosBtn} 
          onClick={() => setActivePhotoModal(true)}
          type="button"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span>{mobileGalleryIndex + 1}/{displayImages.length}</span>
        </button>

        {/* Manual Left/Right Arrows for Mobile */}
        {displayImages.length > 1 && (
          <>
            <button 
              className={`${styles.mobileArrowBtn} ${styles.mobileArrowPrev}`} 
              onClick={prevMobileImage}
              aria-label="Previous Image"
              type="button"
            >
              &#8249;
            </button>
            <button 
              className={`${styles.mobileArrowBtn} ${styles.mobileArrowNext}`} 
              onClick={nextMobileImage}
              aria-label="Next Image"
              type="button"
            >
              &#8250;
            </button>

            {/* Navigation Dots */}
            <div className={styles.mobileCarouselDots}>
              {displayImages.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  className={`${styles.mobileDot} ${dotIdx === mobileGalleryIndex ? styles.mobileDotActive : ''}`}
                  onClick={() => setMobileGalleryIndex(dotIdx)}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                  type="button"
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Main Content Layout with 2 Columns */}
      <div className={styles.layoutContainer}>
        {/* Left Column: Navigation Tabs & Cards */}
        <div className={styles.leftColumn}>
          {/* Navigation Pill Tabs */}
          <div className={styles.tabNavbar}>
            <button
              className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.tabBtnActive : ''}`}
              onClick={() => handleTabChange('overview')}
              type="button"
            >
              Overview
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'highlights' ? styles.tabBtnActive : ''}`}
              onClick={() => handleTabChange('highlights')}
              type="button"
            >
              Highlights
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'inclusions' ? styles.tabBtnActive : ''}`}
              onClick={() => handleTabChange('inclusions')}
              type="button"
            >
              Inclusions
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'important' ? styles.tabBtnActive : ''}`}
              onClick={() => handleTabChange('important')}
              type="button"
            >
              Important Information
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.tabBtnActive : ''}`}
              onClick={() => handleTabChange('reviews')}
              type="button"
            >
              Reviews
            </button>
          </div>

          {/* 1. Overview Card - shown when 'overview' is active */}
          {activeTab === 'overview' && (
            <div id="overview" className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerIconCircle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0093d0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h2 className={styles.cardTitle}>Overview</h2>
              </div>
              
              <p className={styles.overviewText}>
                {packageData.description && packageData.description.length > 20
                  ? packageData.description
                  : `Experience the thrill of the UAE desert with our ${packageData.title} package. Enjoy exciting dune bashing, camel rides, sandboarding, and a traditional Bedouin camp experience. Perfect for adventure seekers, families, and anyone looking to explore the natural beauty and rich culture of the Arabian desert.`}
              </p>

              {/* Feature Icons Row */}
              <div className={styles.featureIconsRow}>
                <div className={styles.featurePill}>
                  <div className={styles.featureIconBubble}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0093d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="11" rx="2" />
                      <circle cx="7" cy="18" r="2" />
                      <circle cx="17" cy="18" r="2" />
                      <path d="M5 7l2-4h10l2 4" />
                    </svg>
                  </div>
                  <div className={styles.featurePillTitle}>Dune Bashing</div>
                  <div className={styles.featurePillSubtitle}>Thrilling 4x4 ride</div>
                </div>

                <div className={styles.featurePill}>
                  <div className={styles.featureIconBubble}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0093d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 13c1-2 2-3 4-3 2 0 3 2 5 2 2 0 3-3 5-3 2 0 3 2 4 4" />
                      <circle cx="6" cy="7" r="2" />
                      <path d="M4 17h16" />
                    </svg>
                  </div>
                  <div className={styles.featurePillTitle}>Camel Ride</div>
                  <div className={styles.featurePillSubtitle}>Experience tradition</div>
                </div>

                <div className={styles.featurePill}>
                  <div className={styles.featureIconBubble}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0093d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2l8 18H4l8-18z" />
                      <path d="M12 11v9" />
                    </svg>
                  </div>
                  <div className={styles.featurePillTitle}>Desert Camp</div>
                  <div className={styles.featurePillSubtitle}>Food & entertainment</div>
                </div>

                <div className={styles.featurePill}>
                  <div className={styles.featureIconBubble}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0093d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                    </svg>
                  </div>
                  <div className={styles.featurePillTitle}>Sunset Views</div>
                  <div className={styles.featurePillSubtitle}>Unforgettable moments</div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Highlights Card - shown in Overview OR when Highlights is clicked */}
          {(activeTab === 'overview' || activeTab === 'highlights') && (
            <div id="highlights" className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerIconCircle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0093d0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <h2 className={styles.cardTitle}>Highlights</h2>
              </div>
              
              <ul className={styles.checkmarkList}>
                {highlights.map((item, idx) => (
                  <li key={idx} className={styles.checkItem}>
                    <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0093d0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 3. Inclusions Card - shown in Overview OR when Inclusions is clicked */}
          {(activeTab === 'overview' || activeTab === 'inclusions') && (
            <div id="inclusions" className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerIconCircle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0093d0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <h2 className={styles.cardTitle}>Inclusions</h2>
              </div>

              <div className={styles.inclusionsGrid}>
                {inclusions.map((item, idx) => (
                  <div key={idx} className={styles.checkItem}>
                    <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0093d0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Important Information Card - shown in Overview OR when Important Information is clicked */}
          {(activeTab === 'overview' || activeTab === 'important') && (
            <div id="important" className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerIconCircle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0093d0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
                <h2 className={styles.cardTitle}>Important Information</h2>
              </div>

              <div className={styles.infoBoxesGrid}>
                <div className={styles.infoBox}>
                  <div className={styles.infoBoxHeader}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0093d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className={styles.infoBoxLabel}>Duration</span>
                  </div>
                  <div className={styles.infoBoxVal}>6 – 7 hours</div>
                </div>

                <div className={styles.infoBox}>
                  <div className={styles.infoBoxHeader}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0093d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className={styles.infoBoxLabel}>Pickup Time</span>
                  </div>
                  <div className={styles.infoBoxVal}>3:00 PM – 4:00 PM</div>
                  <div className={styles.infoBoxSub}>(varies by location)</div>
                </div>

                <div className={styles.infoBox}>
                  <div className={styles.infoBoxHeader}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0093d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    <span className={styles.infoBoxLabel}>Languages</span>
                  </div>
                  <div className={styles.infoBoxVal}>English, Arabic</div>
                </div>

                <div className={styles.infoBox}>
                  <div className={styles.infoBoxHeader}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0093d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className={styles.infoBoxLabel}>Suitability</span>
                  </div>
                  <div className={styles.infoBoxVal}>All ages</div>
                  <div className={styles.infoBoxSub}>(under 5 free)</div>
                </div>
              </div>
            </div>
          )}

          {/* 5. Customer Reviews Card - shown in Overview OR when Reviews is clicked */}
          {(activeTab === 'overview' || activeTab === 'reviews') && (
            <div id="reviews" className={styles.contentCard}>
              <div className={styles.reviewsCardHeader}>
                <div className={styles.cardHeaderLeft}>
                  <div className={styles.headerIconCircle}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0093d0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <h2 className={styles.cardTitle}>Customer Reviews</h2>
                </div>
                <button className={styles.viewAllReviewsLink} type="button">
                  View all reviews &rsaquo;
                </button>
              </div>

              <div className={styles.overallRatingBadge}>
                <span className={styles.ratingStar}>★</span>
                <span className={styles.ratingScore}>{ratingNum}</span>
                <span className={styles.reviewsTotal}>({reviewsCount} Reviews)</span>
              </div>

              <div className={styles.reviewsCarouselContainer}>
                <button
                  className={styles.carouselArrowBtn}
                  onClick={() => setReviewIndex(prev => (prev === 0 ? reviewsList.length - 2 : prev - 1))}
                  aria-label="Previous review"
                  type="button"
                >
                  &lsaquo;
                </button>

                <div className={styles.reviewCardsRow}>
                  {reviewsList.slice(reviewIndex, reviewIndex + 2).map((rev) => (
                    <div key={rev.id} className={styles.reviewCardItem}>
                      <div className={styles.reviewerTop}>
                        <div className={styles.reviewerAvatarWrapper}>
                          <Image
                            src={rev.avatar}
                            alt={rev.name}
                            fill
                            sizes="40px"
                            className={styles.reviewerAvatar}
                          />
                        </div>
                        <div className={styles.reviewerInfo}>
                          <div className={styles.reviewerName}>{rev.name} <span className={styles.reviewerTag}>({rev.tag})</span></div>
                          <div className={styles.reviewStars}>
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <span key={i} className={styles.starYellow}>★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className={styles.reviewComment}>"{rev.comment}"</p>
                      <div className={styles.reviewDate}>{rev.date}</div>
                    </div>
                  ))}
                </div>

                <button
                  className={styles.carouselArrowBtn}
                  onClick={() => setReviewIndex(prev => (prev >= reviewsList.length - 2 ? 0 : prev + 1))}
                  aria-label="Next review"
                  type="button"
                >
                  &rsaquo;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Booking Widget Sidebar */}
        <div className={styles.rightSidebar}>
          <div className={styles.stickyWidgetCard}>
            {/* Popular Badge */}
            <div className={styles.badgePopular}>Popular</div>

            {/* Price Header */}
            <div className={styles.widgetPriceHeader}>
              <span className={styles.widgetFromText}>From</span>
              <div className={styles.widgetMainPrice}>
                <span className={styles.widgetCurrency}>AED {priceNum}</span>
                <span className={styles.widgetPerUnit}>/ adult</span>
              </div>
            </div>

            {/* Select Date Input */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Select date</span>
              </label>
              <div className={styles.dateInputWrapper}>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className={styles.customDateInput}
                  placeholder="Choose your preferred date"
                />
              </div>
            </div>

            {/* Guests Selector */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Guests</span>
              </label>
              <div className={styles.selectWrapper}>
                <select
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value, 10))}
                  className={styles.customSelect}
                >
                  <option value={1}>1 Adult</option>
                  <option value={2}>2 Adults</option>
                  <option value={3}>3 Adults</option>
                  <option value={4}>4 Adults</option>
                  <option value={5}>5 Adults</option>
                  <option value={6}>6+ Adults</option>
                </select>
                <div className={styles.selectChevron}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Package Option Radio Card */}
            <div className={styles.packageOptionContainer}>
              <div className={styles.optionHeaderLabel}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0093d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M7 15h0M2 9.5a2.5 2.5 0 0 1 0 5M22 9.5a2.5 2.5 0 0 0 0 5" />
                </svg>
                <span>Package option</span>
              </div>
              <div className={styles.optionSelectionBox}>
                <div className={styles.optionRadioRow}>
                  <div className={styles.customRadioOuter}>
                    <div className={styles.customRadioInner} />
                  </div>
                  <div className={styles.optionDetail}>
                    <div className={styles.optionName}>Standard {packageData.title}</div>
                    <div className={styles.optionDescription}>
                      Dune bashing, camel ride, camp, BBQ dinner and entertainment.
                    </div>
                    <div className={styles.optionItemPrice}>
                      AED {priceNum} <span className={styles.optionPerUnit}>/ adult</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Badges */}
            <div className={styles.availabilityTags}>
              <div className={styles.availTag}>
                <span className={styles.greenDot} />
                <span>Instant confirmation</span>
              </div>
              <span className={styles.availSep}>•</span>
              <div className={styles.availTag}>
                <span>Limited availability</span>
              </div>
            </div>

            {/* Check Availability / Book Button */}
            <button
              onClick={handleBookNow}
              className={styles.checkAvailabilityBtn}
              type="button"
            >
              <span>Check availability</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Add to Wishlist Button */}
            <div className={styles.wishlistWrapper}>
              <WishlistButton
                packageId={packageData.id}
                packageTitle={packageData.title}
              />
            </div>

            {/* Trust Badges */}
            <div className={styles.trustBadgesList}>
              <div className={styles.trustItem}>
                <div className={styles.trustIconCircle}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0093d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className={styles.trustTexts}>
                  <div className={styles.trustTitle}>Secure booking</div>
                  <div className={styles.trustSub}>Your data is safe</div>
                </div>
              </div>

              <div className={styles.trustItem}>
                <div className={styles.trustIconCircle}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0093d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                  </svg>
                </div>
                <div className={styles.trustTexts}>
                  <div className={styles.trustTitle}>24/7 support</div>
                  <div className={styles.trustSub}>We're here to help</div>
                </div>
              </div>

              <div className={styles.trustItem}>
                <div className={styles.trustIconCircle}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0093d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <div className={styles.trustTexts}>
                  <div className={styles.trustTitle}>Best price guarantee</div>
                  <div className={styles.trustSub}>Find it cheaper? We'll match it</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Photo Modal */}
      {activePhotoModal && (
        <div className={styles.photoModalOverlay} onClick={() => setActivePhotoModal(false)}>
          <div className={styles.photoModalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.photoModalHeader}>
              <h3>{packageData.title} Photos ({displayImages.length})</h3>
              <button 
                className={styles.closeModalBtn} 
                onClick={() => setActivePhotoModal(false)}
                type="button"
              >
                &times;
              </button>
            </div>
            <div className={styles.photoModalGrid}>
              {displayImages.map((img, idx) => (
                <div key={idx} className={styles.photoModalItem}>
                  <Image src={img} alt={`Photo ${idx + 1}`} fill sizes="400px" style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

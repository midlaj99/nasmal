"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';
import WishlistButton from '@/components/WishlistButton';
import Breadcrumb from '@/components/Breadcrumb';
import { isEmbedVideo, isInstagramUrl, getEmbedUrl, getOptimizedVideoUrl, getVideoThumbnail } from '@/lib/videoHelper';
import styles from './PackageDetailClient.module.css';

export interface PackageOption {
  id: string;
  title: string;
  badge?: string;
  inclusions?: string[];
  moreDetails?: string;
  price?: string;
  childPrice?: string;
  isAvailable?: boolean;
}

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
    hasOptions?: boolean;
    optionsSectionTitle?: string;
    options?: PackageOption[];
    video?: string;
  };
}

// Helper to bypass Next.js internal image proxy for fast direct browser loading
const isLocalDbImage = (url?: string) =>
  typeof url === 'string' && (url.startsWith('/api/images') || url.startsWith('data:'));

function getHighlightIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes('car') || t.includes('4x4') || t.includes('dune') || t.includes('drive') || t.includes('transfer') || t.includes('bashing')) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="11" rx="2" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
        <path d="M5 7l2-4h10l2 4" />
      </svg>
    );
  }
  if (t.includes('camel') || t.includes('desert') || t.includes('sand') || t.includes('safari') || t.includes('wildlife')) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 13c1-2 2-3 4-3 2 0 3 2 5 2 2 0 3-3 5-3 2 0 3 2 4 4" />
        <circle cx="6" cy="7" r="2" />
        <path d="M4 17h16" />
      </svg>
    );
  }
  if (t.includes('camp') || t.includes('bbq') || t.includes('dinner') || t.includes('food') || t.includes('drink') || t.includes('meal')) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l8 18H4l8-18z" />
        <path d="M12 11v9" />
      </svg>
    );
  }
  if (t.includes('view') || t.includes('sunset') || t.includes('sunrise') || t.includes('sky') || t.includes('burj')) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
      </svg>
    );
  }
  if (t.includes('ticket') || t.includes('entry') || t.includes('pass') || t.includes('vip')) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// Smart icon selector for dynamic Quick Facts from Admin
function getFactIcon(label: string) {
  const l = label.toLowerCase();
  if (l.includes('duration') || l.includes('time') || l.includes('hour')) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );
  }
  if (l.includes('confirm') || l.includes('ticket') || l.includes('voucher') || l.includes('booking')) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    );
  }
  if (l.includes('lang') || l.includes('guide') || l.includes('audio')) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    );
  }
  if (l.includes('age') || l.includes('suit') || l.includes('child') || l.includes('family') || l.includes('people')) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }
  if (l.includes('pickup') || l.includes('transfer') || l.includes('drop') || l.includes('transport') || l.includes('car')) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    );
  }
  if (l.includes('cancel') || l.includes('refund')) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function getOptionBadgeIcon(badge: string) {
  const b = badge.toLowerCase();
  if (b.includes('prime') || b.includes('hour') || b.includes('time') || b.includes('sunrise') || b.includes('morning')) return '⏰';
  if (b.includes('vip') || b.includes('pass') || b.includes('exclusive') || b.includes('royal')) return '👑';
  if (b.includes('instant') || b.includes('confirm') || b.includes('fast') || b.includes('quick')) return '⚡';
  if (b.includes('popular') || b.includes('trend') || b.includes('hot')) return '⭐';
  if (b.includes('value') || b.includes('best') || b.includes('deal') || b.includes('saver')) return '🔥';
  return '🏷️';
}

export default function PackageDetailClient({ packageData }: PackageDetailClientProps) {
  const router = useRouter();
  const { setBookingData } = useBooking();

  const [activeTab, setActiveTab] = useState<'overview' | 'options' | 'highlights' | 'inclusions' | 'important' | 'video'>('overview');
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  // Guest counts
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);

  const [activePhotoModal, setActivePhotoModal] = useState<boolean>(false);

  // Available options from admin
  const availableOptions: PackageOption[] = ((packageData.hasOptions || (packageData.options && packageData.options.length > 0)) && packageData.options && packageData.options.length > 0)
    ? packageData.options
    : [];

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(() => {
    if (availableOptions.length > 0) {
      const firstAvail = availableOptions.find(o => o.isAvailable !== false);
      return firstAvail ? firstAvail.id : availableOptions[0].id;
    }
    return null;
  });

  const [expandedOptionIds, setExpandedOptionIds] = useState<Record<string, boolean>>({});

  const toggleOptionDetails = (id: string) => {
    setExpandedOptionIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const selectedOption = availableOptions.find(o => o.id === selectedOptionId) || null;

  // Universal Gallery Carousel State (Runs on ANY device with images + tour video)
  const [galleryIndex, setGalleryIndex] = useState<number>(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const fallbackCover = (packageData.image && (packageData.image.startsWith('http') || packageData.image.startsWith('/')))
    ? packageData.image
    : '/hero-bg.jpg';

  const validImages = (packageData.images && packageData.images.length > 0)
    ? packageData.images.filter(img => typeof img === 'string' && (img.startsWith('http') || img.startsWith('/')))
    : [fallbackCover];

  const rawImages = validImages.length > 0 ? validImages : [fallbackCover];
  const displayImages = rawImages;

  // Combine cover image, tour video (if added), and gallery images into one carousel
  const mediaItems: Array<{ type: 'image' | 'video'; url: string; poster?: string }> = [];
  if (rawImages.length > 0) {
    mediaItems.push({ type: 'image', url: rawImages[0] });
  }
  if (packageData.video) {
    const videoPoster = getVideoThumbnail(packageData.video) || rawImages[0] || packageData.image;
    mediaItems.push({
      type: 'video',
      url: packageData.video,
      poster: videoPoster
    });
  }
  for (let i = 1; i < rawImages.length; i++) {
    mediaItems.push({ type: 'image', url: rawImages[i] });
  }
  if (mediaItems.length === 0) {
    mediaItems.push({ type: 'image', url: packageData.image });
  }

  // Play/pause video when navigating carousel slides
  useEffect(() => {
    const currentItem = mediaItems[galleryIndex];
    if (currentItem?.type === 'video') {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [galleryIndex, mediaItems]);

  // Auto-move carousel: gives 25s for video slide, 6s for image slides
  useEffect(() => {
    if (mediaItems.length <= 1) return;

    const currentItem = mediaItems[galleryIndex];
    const duration = currentItem?.type === 'video' ? 25000 : 6000;

    const timer = setTimeout(() => {
      setGalleryIndex((prev) => (prev + 1) % mediaItems.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [galleryIndex, mediaItems.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    const swipeThreshold = 40;

    if (diff > swipeThreshold) {
      setGalleryIndex((prev) => (prev + 1) % mediaItems.length);
    } else if (diff < -swipeThreshold) {
      setGalleryIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const prevMedia = () => {
    setGalleryIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  const nextMedia = () => {
    setGalleryIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const mainImage = rawImages[0] || packageData.image;
  const sideImage1 = rawImages[1] || rawImages[0] || packageData.image;
  const sideImage2 = rawImages[2] || rawImages[0] || packageData.image;

  const baseAdultPrice = parseFloat(packageData.price) || 150;
  const reviewsCount = packageData.reviewsCount || 24;
  const ratingNum = packageData.rating || '5.0';

  // Check if admin added child age / price in admin portal
  const hasChildConfig = Boolean(
    (packageData.childAgeLimit && packageData.childAgeLimit.trim().length > 0) ||
    (packageData.childPrice && String(packageData.childPrice).trim().length > 0 && parseFloat(packageData.childPrice) >= 0) ||
    (selectedOption && selectedOption.childPrice && parseFloat(selectedOption.childPrice) >= 0)
  );

  const baseChildPrice = packageData.childPrice ? (parseFloat(packageData.childPrice) || 0) : 0;

  // Active prices based on selected option (or base package price)
  const priceNum = (selectedOption && selectedOption.price && parseFloat(selectedOption.price) > 0)
    ? parseFloat(selectedOption.price)
    : baseAdultPrice;

  const childPriceNum = (selectedOption && selectedOption.childPrice && parseFloat(selectedOption.childPrice) >= 0)
    ? parseFloat(selectedOption.childPrice)
    : baseChildPrice;

  // Dynamic Total Price Calculation
  const totalPrice = (adults * priceNum) + (children * childPriceNum);

  // Dynamic Highlights from Admin
  const highlights = (packageData.highlights && packageData.highlights.length > 0)
    ? packageData.highlights
    : [
        'Dune bashing in a 4x4 vehicle',
        'Camel ride and sandboarding',
        'Traditional Bedouin camp with BBQ dinner',
        'Live entertainment (belly dance & tanoura show)',
        'Stunning sunset views in the desert'
      ];

  // Dynamic Inclusions from Admin
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
    const bookingTitle = selectedOption
      ? `${packageData.title} (${selectedOption.title})`
      : packageData.title;

    setBookingData({
      packageId: packageData.id,
      packageTitle: bookingTitle,
      packageImage: mainImage,
      pricePerAdult: priceNum,
      pricePerChild: childPriceNum,
      adultsCount: adults,
      childrenCount: children,
      visitDate: selectedDate || new Date().toISOString().split('T')[0],
      totalPrice: totalPrice,
    });
    router.push('/checkout');
  };

  const handleTabChange = (tab: 'overview' | 'options' | 'highlights' | 'inclusions' | 'important' | 'video') => {
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
          </div>
          <span className={styles.metaDivider}>|</span>
          <div className={styles.priceMeta}>
            <span className={styles.fromText}>from</span>
            <span className={styles.priceAmount}>AED {priceNum}</span>
          </div>
        </div>
      </div>

      {/* Universal Media Carousel (Images + Tour Video in same position) */}
      <div className={styles.carouselContainer}>
        <div 
          className={styles.carouselWrapper}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation Arrows for desktop/tablet */}
          {mediaItems.length > 1 && (
            <>
              <button
                type="button"
                className={`${styles.carouselArrowBtn} ${styles.carouselArrowPrev}`}
                onClick={(e) => {
                  e.stopPropagation();
                  prevMedia();
                }}
                aria-label="Previous photo or video"
              >
                ‹
              </button>
              <button
                type="button"
                className={`${styles.carouselArrowBtn} ${styles.carouselArrowNext}`}
                onClick={(e) => {
                  e.stopPropagation();
                  nextMedia();
                }}
                aria-label="Next photo or video"
              >
                ›
              </button>
            </>
          )}

          <div 
            className={styles.carouselTrack}
            style={{ transform: `translateX(-${galleryIndex * 100}%)` }}
          >
            {mediaItems.map((item, idx) => (
              <div key={idx} className={styles.carouselSlide}>
                {item.type === 'image' ? (
                  <Image
                    src={item.url}
                    alt={`${packageData.title} photo ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                    className={styles.slideImg}
                    priority={idx === 0}
                    unoptimized={isLocalDbImage(item.url)}
                  />
                ) : isEmbedVideo(item.url) ? (
                  <div className={styles.carouselVideoContainer}>
                    <div className={styles.carouselVideoBadge}>
                      <span className={styles.videoPlayDot} />
                      <span>Tour Video</span>
                    </div>
                    <iframe
                      src={galleryIndex === idx ? getEmbedUrl(item.url) : ''}
                      title={`${packageData.title} video preview`}
                      className={styles.carouselIframe}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className={styles.carouselVideoContainer}>
                    <div className={styles.carouselVideoBadge}>
                      <span className={styles.videoPlayDot} />
                      <span>Tour Video</span>
                    </div>
                    <video
                      ref={videoRef}
                      src={getOptimizedVideoUrl(item.url)}
                      poster={item.poster}
                      preload="metadata"
                      autoPlay={galleryIndex === idx}
                      muted
                      loop
                      playsInline
                      controls
                      className={styles.carouselNativeVideo}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Thumbnail Strip (Interactive for any device) */}
        {mediaItems.length > 1 && (
          <div className={styles.thumbnailStrip}>
            {mediaItems.map((item, idx) => {
              const isActive = idx === galleryIndex;
              if (item.type === 'video') {
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`${styles.thumbBtn} ${styles.thumbBtnVideo} ${isActive ? styles.thumbBtnActive : ''}`}
                    onClick={() => setGalleryIndex(idx)}
                    aria-label="Play Tour Video"
                  >
                    <Image
                      src={item.poster || packageData.image}
                      alt="Tour video thumbnail"
                      fill
                      sizes="120px"
                      className={styles.thumbImg}
                      unoptimized={isLocalDbImage(item.poster || packageData.image)}
                    />
                    <div className={styles.thumbVideoOverlay}>
                      <div className={styles.thumbPlayIcon}>▶</div>
                      <span className={styles.thumbVideoText}>VIDEO</span>
                    </div>
                  </button>
                );
              }
              return (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.thumbBtn} ${isActive ? styles.thumbBtnActive : ''}`}
                  onClick={() => setGalleryIndex(idx)}
                  aria-label={`Show photo ${idx + 1}`}
                >
                  <Image
                    src={item.url}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    sizes="120px"
                    className={styles.thumbImg}
                    unoptimized={isLocalDbImage(item.url)}
                  />
                </button>
              );
            })}
          </div>
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
            {packageData.video && (
              <button
                className={`${styles.tabBtn} ${activeTab === 'video' ? styles.tabBtnActive : ''}`}
                onClick={() => handleTabChange('video')}
                type="button"
              >
                🎬 Tour Video
              </button>
            )}
            {availableOptions.length > 0 && (
              <button
                className={`${styles.tabBtn} ${activeTab === 'options' ? styles.tabBtnActive : ''}`}
                onClick={() => handleTabChange('options')}
                type="button"
              >
                {packageData.optionsSectionTitle || 'Available Options'}
              </button>
            )}
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
          </div>

          {/* Sub-Category / Available Options Section (Decided from Admin Page) */}
          {/* Displayed directly ABOVE the overview section */}
          {availableOptions.length > 0 && (activeTab === 'overview' || activeTab === 'options') && (
            <div id="available-options" className={styles.optionsSection}>
              <div className={styles.optionsSectionHeader}>
                <div className={styles.optionsTitleArea}>
                  <h2 className={styles.optionsSectionTitle}>
                    {packageData.optionsSectionTitle || 'Available Options'}
                  </h2>
                  <span className={styles.optionsCountBadge}>
                    {availableOptions.length} {availableOptions.length === 1 ? 'Option' : 'Options'}
                  </span>
                </div>
                <p className={styles.optionsSectionSub}>
                  Select your preferred package option below to view inclusions, details, and current rates.
                </p>
              </div>

              <div className={styles.optionsCardsList}>
                {availableOptions.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isExpanded = !!expandedOptionIds[opt.id];
                  const isAvailable = opt.isAvailable !== false;
                  const optAdultPrice = (opt.price && parseFloat(opt.price) > 0) ? parseFloat(opt.price) : baseAdultPrice;
                  const optChildPrice = (opt.childPrice && parseFloat(opt.childPrice) >= 0) ? parseFloat(opt.childPrice) : baseChildPrice;

                  return (
                    <div
                      key={opt.id}
                      className={`${styles.optCard} ${isSelected ? styles.optCardSelected : ''} ${!isAvailable ? styles.optCardUnavailable : ''}`}
                      onClick={() => {
                        if (isAvailable) setSelectedOptionId(opt.id);
                      }}
                    >
                      {/* Top-left Badge (e.g. 🔥 Best Value, ⏰ Prime Hours, 👑 VIP Pass) */}
                      {opt.badge && (
                        <div className={styles.optBadge}>
                          <span className={styles.optBadgeIcon}>{getOptionBadgeIcon(opt.badge)}</span>
                          <span>{opt.badge}</span>
                        </div>
                      )}

                      {/* Gray Card Header with Title */}
                      <div className={opt.badge ? styles.optCardHeader : styles.optCardHeaderNoBadge}>
                        <h3 className={styles.optCardTitle}>{opt.title}</h3>
                      </div>

                      {/* White Card Body with Inclusions */}
                      <div className={styles.optCardBody}>
                        <div className={styles.optInclusionHeader}>Inclusion:</div>
                        <ul className={styles.optInclusionsList}>
                          {opt.inclusions && opt.inclusions.length > 0 ? (
                            opt.inclusions.map((inc, i) => (
                              <li key={i}>{inc}</li>
                            ))
                          ) : (
                            <li>Admission ticket and standard tour access</li>
                          )}
                        </ul>

                        {/* Collapsible Details */}
                        {opt.moreDetails && (
                          <div className={styles.optDetailsAccordion}>
                            <button
                              type="button"
                              className={styles.optDetailsToggleBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleOptionDetails(opt.id);
                              }}
                              aria-expanded={isExpanded}
                            >
                              <span>{isExpanded ? 'Less details' : 'More details'}</span>
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`${styles.optChevron} ${isExpanded ? styles.optChevronOpen : ''}`}
                              >
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </button>

                            {isExpanded && (
                              <div className={styles.optExpandedContent}>
                                {opt.moreDetails.split('\n').map((para, pI) => (
                                  <p key={pI}>{para}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Bottom Card Footer */}
                      <div className={styles.optCardFooter}>
                        {!isAvailable ? (
                          <span className={styles.optNotAvailableText}>Not Available</span>
                        ) : (
                          <div className={styles.optFooterRow}>
                            <div className={styles.optPriceCol}>
                              <div className={styles.optPriceMain}>
                                <span className={styles.optAed}>AED</span>{' '}
                                <span className={styles.optPriceAmount}>{optAdultPrice}</span>{' '}
                                <span className={styles.optPerUnit}>/ adult</span>
                              </div>
                              {optChildPrice > 0 && (
                                <div className={styles.optChildPriceSub}>
                                  AED {optChildPrice} / child
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              className={`${styles.optSelectBtn} ${isSelected ? styles.optSelectBtnActive : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOptionId(opt.id);
                              }}
                            >
                              {isSelected ? '✓ Selected' : 'Select'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 1. Overview Card - DYNAMIC FROM ADMIN */}
          {activeTab === 'overview' && (
            <div id="overview" className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerIconCircle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h2 className={styles.cardTitle}>Overview</h2>
              </div>
              
              {/* Dynamic Description from Admin Page */}
              <div className={styles.overviewText}>
                {packageData.description ? (
                  packageData.description.split('\n').map((paragraph, pIdx) => (
                    <p key={pIdx} style={{ margin: pIdx > 0 ? '12px 0 0 0' : 0 }}>
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p style={{ margin: 0 }}>
                    Experience the best tours and attractions in UAE with our {packageData.title} package.
                  </p>
                )}
              </div>

              {/* Dynamic Highlights Pills from Admin Page */}
              {highlights.length > 0 && (
                <div className={styles.featureIconsRow} style={{ marginTop: '24px' }}>
                  {highlights.map((item, idx) => {
                    let title = item;
                    let subtitle = 'Included with tour';
                    if (item.includes(' - ')) {
                      const parts = item.split(' - ');
                      title = parts[0].trim();
                      subtitle = parts.slice(1).join(' - ').trim();
                    } else if (item.includes(': ')) {
                      const parts = item.split(': ');
                      title = parts[0].trim();
                      subtitle = parts.slice(1).join(': ').trim();
                    } else if (item.includes('–')) {
                      const parts = item.split('–');
                      title = parts[0].trim();
                      subtitle = parts.slice(1).join('–').trim();
                    }

                    return (
                      <div key={idx} className={styles.featurePill}>
                        <div className={styles.featureIconBubble}>
                          {getHighlightIcon(title)}
                        </div>
                        <div className={styles.featurePillTitle}>{title}</div>
                        <div className={styles.featurePillSubtitle}>{subtitle}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 2. Highlights Card - DYNAMIC FROM ADMIN */}
          {(activeTab === 'overview' || activeTab === 'highlights') && (
            <div id="highlights" className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerIconCircle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <h2 className={styles.cardTitle}>Highlights</h2>
              </div>
              
              <ul className={styles.checkmarkList}>
                {highlights.map((item, idx) => (
                  <li key={idx} className={styles.checkItem}>
                    <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 3. Inclusions Card - DYNAMIC FROM ADMIN */}
          {(activeTab === 'overview' || activeTab === 'inclusions') && (
            <div id="inclusions" className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerIconCircle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
                    <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Important Information Card */}
          {(activeTab === 'overview' || activeTab === 'important') && (
            <div id="important" className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerIconCircle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
                <h2 className={styles.cardTitle}>Important Information</h2>
              </div>

              {/* Dynamic Quick Facts from Admin */}
              {(() => {
                const rawFacts: unknown = packageData.quickFacts;
                let factsList: string[] = [];
                if (Array.isArray(rawFacts)) {
                  factsList = rawFacts.map(item => String(item).trim()).filter(Boolean);
                } else if (typeof rawFacts === 'string' && rawFacts.trim().length > 0) {
                  factsList = rawFacts.split('\n').map((s: string) => s.trim()).filter(Boolean);
                }

                if (factsList.length === 0) {
                  return (
                    <div className={styles.infoBoxesGrid}>
                      <div className={styles.infoBox}>
                        <div className={styles.infoBoxHeader}>
                          {getFactIcon('Destination')}
                          <span className={styles.infoBoxLabel}>Destination</span>
                        </div>
                        <div className={styles.infoBoxVal}>{packageData.destination || 'UAE'}</div>
                      </div>
                      <div className={styles.infoBox}>
                        <div className={styles.infoBoxHeader}>
                          {getFactIcon('Confirmation')}
                          <span className={styles.infoBoxLabel}>Confirmation</span>
                        </div>
                        <div className={styles.infoBoxVal}>Instant WhatsApp Ticket</div>
                      </div>
                      {hasChildConfig && (
                        <div className={styles.infoBox}>
                          <div className={styles.infoBoxHeader}>
                            {getFactIcon('Suitability')}
                            <span className={styles.infoBoxLabel}>Child Age Limit</span>
                          </div>
                          <div className={styles.infoBoxVal}>{packageData.childAgeLimit || 'All ages welcome'}</div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div className={styles.infoBoxesGrid}>
                    {factsList.map((fact: string, idx: number) => {
                      const separator: string | null = fact.includes(':') ? ':' : fact.includes('-') ? '-' : null;
                      const parts = separator ? fact.split(separator) : null;
                      const label = parts ? parts[0].trim() : 'Quick Fact';
                      const val = parts ? parts.slice(1).join(separator || '').trim() : fact.trim();
                      const icon = getFactIcon(label);

                      return (
                        <div key={idx} className={styles.infoBox}>
                          <div className={styles.infoBoxHeader}>
                            {icon}
                            <span className={styles.infoBoxLabel}>{label}</span>
                          </div>
                          <div className={styles.infoBoxVal}>{val}</div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* 5. Tour Video Section (YouTube or Instagram Embed) */}
          {packageData.video && (activeTab === 'overview' || activeTab === 'video') && (
            <div id="tour-video" className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerIconCircle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <h2 className={styles.cardTitle}>Tour Video & Preview</h2>
              </div>

              {isEmbedVideo(packageData.video) ? (
                isInstagramUrl(packageData.video) ? (
                  <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '10px 0' }}>
                    <div style={{ width: '100%', maxWidth: '460px', height: '580px', borderRadius: '14px', overflow: 'hidden', background: '#000' }}>
                      <iframe
                        src={getEmbedUrl(packageData.video)}
                        title={`${packageData.title} Instagram Video`}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ) : (
                  <div className={styles.videoFrameWrapper}>
                    <iframe
                      src={getEmbedUrl(packageData.video)}
                      title={`${packageData.title} Tour Video`}
                      className={styles.videoIframe}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                )
              ) : (
                <div className={styles.videoPlayerWrapper}>
                  <video
                    src={getOptimizedVideoUrl(packageData.video)}
                    controls
                    playsInline
                    preload="metadata"
                    className={styles.nativeVideo}
                  />
                </div>
              )}
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

            {/* Adults Count Selector - Stepper & Custom Input (Removed 6+ restriction) */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Adults (Age 12+)</span>
                <span className={styles.guestPriceTag}>AED {priceNum} / person</span>
              </label>
              <div className={styles.stepperContainer}>
                <button
                  type="button"
                  className={styles.stepperBtn}
                  onClick={() => setAdults(prev => Math.max(1, prev - 1))}
                  aria-label="Decrease adults"
                  disabled={adults <= 1}
                >
                  –
                </button>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={adults}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setAdults(isNaN(val) || val < 1 ? 1 : val);
                  }}
                  className={styles.stepperInput}
                  aria-label="Adult count"
                />
                <button
                  type="button"
                  className={styles.stepperBtn}
                  onClick={() => setAdults(prev => prev + 1)}
                  aria-label="Increase adults"
                >
                  +
                </button>
              </div>
            </div>

            {/* Child Count Selector (ONLY rendered if admin added child age / price in admin portal) */}
            {hasChildConfig && (
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M6 21v-2a6 6 0 0 1 12 0v2" />
                  </svg>
                  <span>Children {packageData.childAgeLimit ? `(${packageData.childAgeLimit})` : ''}</span>
                  <span className={styles.guestPriceTag}>
                    {childPriceNum > 0 ? `AED ${childPriceNum} / child` : 'Free'}
                  </span>
                </label>
                <div className={styles.stepperContainer}>
                  <button
                    type="button"
                    className={styles.stepperBtn}
                    onClick={() => setChildren(prev => Math.max(0, prev - 1))}
                    aria-label="Decrease children"
                    disabled={children <= 0}
                  >
                    –
                  </button>
                  <input
                    type="number"
                    min="0"
                    max="999"
                    value={children}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setChildren(isNaN(val) || val < 0 ? 0 : val);
                    }}
                    className={styles.stepperInput}
                    aria-label="Child count"
                  />
                  <button
                    type="button"
                    className={styles.stepperBtn}
                    onClick={() => setChildren(prev => prev + 1)}
                    aria-label="Increase children"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Package Option Radio Card - DYNAMIC FROM ADMIN / SELECTED OPTION */}
            <div className={styles.packageOptionContainer}>
              <div className={styles.optionHeaderLabel}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    <div className={styles.optionName}>
                      {selectedOption ? selectedOption.title : `Standard ${packageData.title}`}
                    </div>
                    {/* Dynamic Inclusions from Selected Option or Admin Page */}
                    <div className={styles.optionDescription}>
                      {selectedOption && selectedOption.inclusions && selectedOption.inclusions.length > 0
                        ? selectedOption.inclusions.join(', ')
                        : (inclusions.length > 0
                            ? inclusions.join(', ')
                            : (packageData.description || 'Full tour experience included.'))}
                    </div>
                    <div className={styles.optionItemPrice}>
                      AED {priceNum} <span className={styles.optionPerUnit}>/ adult</span>
                      {hasChildConfig && childPriceNum > 0 && (
                        <span className={styles.optionPerUnitChild}> • AED {childPriceNum} / child</span>
                      )}
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

            {/* Live Total Calculated Price Display */}
            <div className={styles.calculatedPriceRow}>
              <span className={styles.totalPriceLabel}>
                Total ({adults} Adult{adults > 1 ? 's' : ''}{children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}):
              </span>
              <span className={styles.totalPriceVal}>AED {totalPrice.toFixed(2)}</span>
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  <Image 
                    src={img} 
                    alt={`Photo ${idx + 1}`} 
                    fill 
                    sizes="300px" 
                    style={{ objectFit: 'cover' }}
                    unoptimized={isLocalDbImage(img)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

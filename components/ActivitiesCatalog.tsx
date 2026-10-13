'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './ActivitiesCatalog.module.css';

export interface PackageItem {
  id: string;
  title: string;
  destination?: string;
  image: string;
  images?: string[];
  price: string;
  originalPrice?: string;
  rating: string;
  reviewsCount: number;
  suitableFor?: string[];
  category?: string;
  badge?: string;
  duration?: string;
  activityType?: string;
}

interface ActivitiesCatalogProps {
  initialPackages: PackageItem[];
  destinationName?: string;
  initialSearch?: string;
}

// Traveller Type filters
const TRAVELLER_TYPES = [
  { id: 'attractions', label: 'Attractions', icon: '🏛️' },
  { id: 'families', label: 'Families', icon: '👨‍👩‍👧‍👦' },
  { id: 'couple', label: 'Couple', icon: '💑' },
  { id: 'food', label: 'Food & Drinks', icon: '🍹' },
  { id: 'culture', label: 'Culture', icon: '🕌' },
  { id: 'nature', label: 'Nature', icon: '🌲' },
];

export default function ActivitiesCatalog({ initialPackages, destinationName, initialSearch }: ActivitiesCatalogProps) {
  // ONLY dynamic packages from admin database
  const combinedPackages = useMemo(() => {
    return initialPackages || [];
  }, [initialPackages]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');

  React.useEffect(() => {
    if (initialSearch !== undefined) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);
  const [selectedDestination, setSelectedDestination] = useState(
    destinationName && destinationName !== 'All Destinations' ? destinationName : 'all'
  );
  const [selectedDate, setSelectedDate] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [selectedCategories, setSelectedCategories] = useState<{ [key: string]: boolean }>({
    tours: true,
    attractions: true,
    experiences: true
  });
  const [selectedTravellerType, setSelectedTravellerType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // Dynamic destination options from database packages + UAE defaults
  const availableDestinations = useMemo(() => {
    const list = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Fujairah', 'Ras Al Khaimah'];
    (initialPackages || []).forEach(p => {
      if (p.destination && !list.some(d => d.toLowerCase() === p.destination?.toLowerCase())) {
        list.push(p.destination);
      }
    });
    return list;
  }, [initialPackages]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDestination('all');
    setSelectedDate('');
    setMaxPrice(1000);
    setSelectedCategories({ tours: true, attractions: true, experiences: true });
    setSelectedTravellerType('all');
    setSortBy('recommended');
  };

  // Filter & Sort Logic
  const filteredList = useMemo(() => {
    return combinedPackages
      .filter(pkg => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = pkg.title.toLowerCase().includes(q);
          const matchesDest = pkg.destination?.toLowerCase().includes(q);
          const matchesType = pkg.activityType?.toLowerCase().includes(q);
          const matchesCategory = pkg.category?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDest && !matchesType && !matchesCategory) return false;
        }

        // Destination dropdown
        if (selectedDestination !== 'all') {
          if (pkg.destination?.toLowerCase() !== selectedDestination.toLowerCase()) {
            return false;
          }
        }

        // Max price filter
        const priceNum = parseFloat(pkg.price) || 0;
        if (priceNum > maxPrice) {
          return false;
        }

        // Traveller type pill
        if (selectedTravellerType && selectedTravellerType !== 'all') {
          if (pkg.suitableFor && pkg.suitableFor.length > 0) {
            const matches = pkg.suitableFor.some(
              s => s.toLowerCase() === selectedTravellerType.toLowerCase()
            );
            if (!matches) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        const ratingA = parseFloat(a.rating) || 0;
        const ratingB = parseFloat(b.rating) || 0;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'popular') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
        return ratingB - ratingA; // recommended
      });
  }, [combinedPackages, searchQuery, selectedDestination, maxPrice, selectedTravellerType, sortBy]);

  return (
    <div className={styles.activitiesWrapper}>
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        separator=">"
        items={[
          { label: 'Home', href: '/' },
          ...(destinationName && destinationName.toLowerCase() !== 'all destinations'
            ? [
                { label: 'Destination', href: '/destination' },
                { label: destinationName },
              ]
            : [{ label: 'Activities' }]),
        ]}
      />

      <div className={styles.layout}>
        {/* ========================================= */}
        {/* LEFT SIDEBAR FILTERS */}
        {/* ========================================= */}
        <aside className={styles.sidebar}>
          {/* Search Inputs Box */}
          <div className={styles.searchBoxCard}>
            {/* Search Activities */}
            <div className={styles.searchField}>
              <span className={styles.fieldIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search activities"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={styles.fieldInput}
              />
            </div>

            {/* Destination Dropdown */}
            <div className={styles.searchField}>
              <span className={styles.fieldIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <select
                value={selectedDestination}
                onChange={e => setSelectedDestination(e.target.value)}
                className={styles.fieldSelect}
              >
                <option value="all">All destinations</option>
                {availableDestinations.map(dest => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>
            </div>

            {/* Choose Dates */}
            <div className={styles.searchField}>
              <span className={styles.fieldIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </span>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className={styles.fieldInput}
                placeholder="Choose dates"
              />
            </div>
          </div>

          {/* Price Range */}
          <div className={styles.filterSection}>
            <div className={styles.sectionHeaderTitle}>Price range</div>
            <input
              type="range"
              min={0}
              max={1000}
              step={50}
              value={maxPrice}
              onChange={e => setMaxPrice(parseInt(e.target.value, 10))}
              className={styles.rangeSlider}
            />
            <div className={styles.priceRangeLabels}>
              <span>AED 0</span>
              <span>AED {maxPrice === 1000 ? '1,000+' : maxPrice}</span>
            </div>
          </div>

          {/* Category */}
          <div className={styles.filterSection}>
            <div className={styles.sectionHeaderTitle}>Category</div>
            <div className={styles.checkboxList}>
              <label className={styles.checkboxItem}>
                <div
                  className={`${styles.checkboxSquare} ${selectedCategories.tours ? styles.checkboxActive : ''}`}
                  onClick={() => setSelectedCategories(p => ({ ...p, tours: !p.tours }))}
                >
                  {selectedCategories.tours && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className={styles.itemLabel}>🏛️ Tours</span>
              </label>

              <label className={styles.checkboxItem}>
                <div
                  className={`${styles.checkboxSquare} ${selectedCategories.attractions ? styles.checkboxActive : ''}`}
                  onClick={() => setSelectedCategories(p => ({ ...p, attractions: !p.attractions }))}
                >
                  {selectedCategories.attractions && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className={styles.itemLabel}>🎡 Attractions</span>
              </label>

              <label className={styles.checkboxItem}>
                <div
                  className={`${styles.checkboxSquare} ${selectedCategories.experiences ? styles.checkboxActive : ''}`}
                  onClick={() => setSelectedCategories(p => ({ ...p, experiences: !p.experiences }))}
                >
                  {selectedCategories.experiences && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className={styles.itemLabel}>✨ Experiences</span>
              </label>
            </div>
          </div>

          {/* Traveller Type 3x2 Grid */}
          <div className={styles.filterSection}>
            <div className={styles.sectionHeaderTitle}>Traveller type</div>
            <div className={styles.travellerGrid}>
              {TRAVELLER_TYPES.map(item => (
                <div
                  key={item.id}
                  className={`${styles.travellerCard} ${selectedTravellerType === item.id ? styles.travellerCardActive : ''}`}
                  onClick={() => setSelectedTravellerType(prev => prev === item.id ? 'all' : item.id)}
                >
                  <div className={styles.travellerIcon}>{item.icon}</div>
                  <div className={styles.travellerName}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sort By Radio */}
          <div className={styles.filterSection}>
            <div className={styles.sectionHeaderTitle}>Sort by</div>
            <div className={styles.radioList}>
              {[
                { id: 'recommended', label: 'Recommended' },
                { id: 'price-asc', label: 'Price: Low to High' },
                { id: 'price-desc', label: 'Price: High to Low' },
                { id: 'popular', label: 'Most popular' }
              ].map(opt => (
                <div
                  key={opt.id}
                  className={styles.radioItem}
                  onClick={() => setSortBy(opt.id)}
                >
                  <div className={`${styles.radioCircle} ${sortBy === opt.id ? styles.radioCircleActive : ''}`}>
                    {sortBy === opt.id && <div className={styles.radioDot} />}
                  </div>
                  <span>{opt.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Clear All Filters */}
          <div>
            <button
              onClick={handleClearFilters}
              className={styles.clearFiltersBtn}
              type="button"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              <span>Clear all filters</span>
            </button>
          </div>
        </aside>

        {/* ========================================= */}
        {/* RIGHT MAIN CONTENT AREA */}
        {/* ========================================= */}
        <main className={styles.mainContent}>
          {/* Header titles */}
          <div className={styles.mainHeader}>
            <h1 className={styles.pageTitle}>Activities for every kind of trip</h1>
            <p className={styles.pageSubtitle}>Discover unforgettable experiences across the UAE.</p>

            {/* Badges count & dropdown */}
            <div className={styles.headerTopRow}>
              <div className={styles.countBadge}>
                {filteredList.length} experiences
              </div>

              <div className={styles.sortDropdownWrapper}>
                <span className={styles.sortLabel}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className={styles.sortSelect}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="popular">Most popular</option>
                </select>
              </div>
            </div>

            {/* Horizontal Filter Pills */}
            <div className={styles.pillsScrollRow}>
              {TRAVELLER_TYPES.map(pill => (
                <button
                  key={pill.id}
                  type="button"
                  className={`${styles.pillBtn} ${selectedTravellerType === pill.id ? styles.pillBtnActive : ''}`}
                  onClick={() => setSelectedTravellerType(prev => prev === pill.id ? 'all' : pill.id)}
                >
                  <span>{pill.icon}</span>
                  <span>{pill.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Cards */}
          <div className={styles.packagesGrid}>
            {filteredList.slice(0, visibleCount).map((pkg) => {
              const isFav = wishlist.has(pkg.id);
              return (
                <Link
                  key={pkg.id}
                  href={`/packages/${pkg.id}`}
                  className={styles.activityCard}
                >
                  {/* Card Image */}
                  <div className={styles.cardImgWrapper}>
                    <Image
                      src={pkg.image || '/hero-bg.jpg'}
                      alt={pkg.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={styles.cardImg}
                    />

                    {/* Top Left Badge */}
                    {pkg.badge && (
                      <div className={styles.cardBadge}>
                        <span>👑</span>
                        <span>{pkg.badge}</span>
                      </div>
                    )}

                    {/* Favorite Heart Button */}
                    <button
                      className={`${styles.favButton} ${isFav ? styles.favButtonActive : ''}`}
                      onClick={(e) => toggleWishlist(pkg.id, e)}
                      aria-label="Add to wishlist"
                      type="button"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>

                  {/* Card Content Body */}
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{pkg.title}</h3>

                    {/* Rating Row */}
                    <div className={styles.cardRatingRow}>
                      <span className={styles.cardStar}>★</span>
                      <span className={styles.cardScore}>{pkg.rating || '5.0'}</span>
                      <span className={styles.cardReviews}>({pkg.reviewsCount || 24} Reviews)</span>
                    </div>

                    {/* Meta Specs (Duration & Category) */}
                    <div className={styles.cardSpecsRow}>
                      <div className={styles.specItem}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>{pkg.duration || '4 Hours'}</span>
                      </div>
                      <div className={styles.specItem}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                          <line x1="7" y1="7" x2="7.01" y2="7" />
                        </svg>
                        <span>{pkg.activityType || pkg.destination || 'Activity'}</span>
                      </div>
                    </div>

                    {/* Pricing Footer */}
                    <div className={styles.cardFooter}>
                      <div className={styles.fromPriceBlock}>
                        <span className={styles.fromText}>From</span>
                        <span className={styles.priceNumber}>AED {pkg.price}</span>
                        <span className={styles.perUnit}>/ adult</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}

            {filteredList.length === 0 && (
              <div className={styles.emptyState}>
                <div style={{ fontSize: '36px' }}>🔍</div>
                <div className={styles.emptyTitle}>No matching activities found</div>
                <p className={styles.emptyText}>
                  Try clearing some filters or searching with a different destination keyword.
                </p>
                <button
                  onClick={handleClearFilters}
                  className={styles.clearFiltersBtn}
                  style={{ marginTop: '10px' }}
                  type="button"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {filteredList.length > visibleCount && (
            <div className={styles.loadMoreWrapper}>
              <button
                className={styles.loadMoreBtn}
                onClick={() => setVisibleCount(prev => prev + 6)}
                type="button"
              >
                <span>Load more experiences</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

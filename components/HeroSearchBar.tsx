"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './HeroSearchBar.module.css';

interface HeroSearchBarProps {
  placeholder?: string;
  defaultLocation?: string;
  align?: 'center' | 'left';
}

export default function HeroSearchBar({
  placeholder = 'Search destinations, tours, activities...',
  defaultLocation,
  align = 'left'
}: HeroSearchBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/destinations')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setDestinations(d); })
      .catch(() => {});

    fetch('/api/packages')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setPackages(d); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setIsSuggestionsOpen(false);
    
    let url = `/activities?search=${encodeURIComponent(query)}`;
    if (defaultLocation) {
      url += `&location=${encodeURIComponent(defaultLocation)}`;
    }
    router.push(url);
  };

  const handleSelectPackage = (pkgId: string) => {
    setIsSuggestionsOpen(false);
    router.push(`/packages/${pkgId}`);
  };

  const handleSelectDestination = (slug: string) => {
    setIsSuggestionsOpen(false);
    router.push(`/destinations/${slug}`);
  };

  const formatTitle = (text?: string) => {
    if (!text) return '';
    return text
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  const trimmedQuery = searchQuery.trim().toLowerCase();

  const matchingDestinations = trimmedQuery.length > 0
    ? destinations.filter(dest => {
        const title = (dest.title || dest.name || dest.id || '').toLowerCase();
        return title.includes(trimmedQuery);
      }).slice(0, 3)
    : [];

  const matchingPackages = trimmedQuery.length > 0
    ? packages.filter(pkg => {
        const title = (pkg.title || '').toLowerCase();
        const dest = (pkg.destination || '').toLowerCase();
        return title.includes(trimmedQuery) || dest.includes(trimmedQuery);
      }).slice(0, 5)
    : [];

  const hasSuggestions = matchingDestinations.length > 0 || matchingPackages.length > 0;

  return (
    <div 
      ref={containerRef} 
      className={`${styles.searchWrapper} ${align === 'center' ? styles.searchWrapperCenter : styles.searchWrapperLeft}`}
    >
      <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSuggestionsOpen(true);
          }}
          onFocus={() => {
            if (searchQuery.trim().length > 0) {
              setIsSuggestionsOpen(true);
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
          className={styles.searchInput}
        />
        {searchQuery && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => {
              setSearchQuery('');
              setIsSuggestionsOpen(false);
            }}
            aria-label="Clear search"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
        <button type="submit" className={styles.searchBtn} aria-label="Search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {isSuggestionsOpen && trimmedQuery.length > 0 && (
        <div className={styles.suggestionsDropdown}>
          {hasSuggestions ? (
            <>
              {matchingDestinations.length > 0 && (
                <div className={styles.suggestionsGroup}>
                  <div className={styles.suggestionsGroupTitle}>Destinations</div>
                  {matchingDestinations.map(dest => {
                    const title = formatTitle(dest.title || dest.name || dest.id);
                    const targetSlug = dest.id || encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'));
                    return (
                      <div 
                        key={dest.id || title} 
                        className={styles.suggestionItem}
                        onClick={() => handleSelectDestination(targetSlug)}
                      >
                        <div className={styles.destIconBubble}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                        </div>
                        <div className={styles.suggestionTextWrapper}>
                          <span className={styles.suggestionTitle}>{title}</span>
                          <span className={styles.suggestionSub}>Explore Destination</span>
                        </div>
                        <span className={styles.suggestionArrow}>&rarr;</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {matchingPackages.length > 0 && (
                <div className={styles.suggestionsGroup}>
                  <div className={styles.suggestionsGroupTitle}>Activities & Packages</div>
                  {matchingPackages.map(pkg => (
                    <div 
                      key={pkg.id} 
                      className={styles.suggestionItem}
                      onClick={() => handleSelectPackage(pkg.id)}
                    >
                      <img 
                        src={pkg.image || (pkg.images && pkg.images[0]) || '/hero-bg.jpg'} 
                        alt={pkg.title} 
                        className={styles.packageThumb}
                      />
                      <div className={styles.suggestionTextWrapper}>
                        <span className={styles.suggestionTitle}>{pkg.title}</span>
                        <span className={styles.suggestionSub}>
                          {pkg.destination ? `${pkg.destination} • ` : ''}
                          {pkg.price ? `AED ${pkg.price}` : 'Featured'}
                        </span>
                      </div>
                      <span className={styles.suggestionArrow}>&rarr;</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className={styles.noSuggestions}>
              No direct matches found.
            </div>
          )}

          {/* Action Row */}
          <div 
            className={styles.suggestionFooter}
            onClick={() => handleSearchSubmit()}
          >
            <div className={styles.footerSearchText}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>Search all for &ldquo;<strong>{searchQuery}</strong>&rdquo;</span>
            </div>
            <span className={styles.suggestionArrow}>&rarr;</span>
          </div>
        </div>
      )}
    </div>
  );
}

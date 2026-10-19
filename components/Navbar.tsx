"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

interface DestinationItem {
  id?: string;
  title?: string;
  name?: string;
  image?: string;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isActivityPage = pathname === '/activities' || pathname.startsWith('/activities/') || pathname === '/activity' || pathname.startsWith('/activity/');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isDestDropdownOpen, setIsDestDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Search state & live suggestions
  const [searchQuery, setSearchQuery] = useState('');
  const [isDesktopSuggestionsOpen, setIsDesktopSuggestionsOpen] = useState(false);
  const [isMobileSuggestionsOpen, setIsMobileSuggestionsOpen] = useState(false);
  const [packagesList, setPackagesList] = useState<any[]>([]);

  const [destinations, setDestinations] = useState<DestinationItem[]>([
    { id: 'dubai', title: 'Dubai' },
    { id: 'abu-dhabi', title: 'Abu Dhabi' },
    { id: 'sharjah', title: 'Sharjah' },
    { id: 'ras-al', title: 'Ras Al Khaimah' },
  ]);

  const destDropdownRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchDrawerRef = useRef<HTMLDivElement>(null);
  const mobileSearchBtnRef = useRef<HTMLButtonElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    fetch('/api/destinations')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setDestinations(data);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch package catalog for search suggestions
  useEffect(() => {
    fetch('/api/packages')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPackagesList(data);
        }
      })
      .catch(() => {});
  }, []);

  // Check if current user is admin
  useEffect(() => {
    fetch('/api/admin/me')
      .then(res => res.json())
      .then(data => {
        setIsAdmin(Boolean(data && data.authenticated));
      })
      .catch(() => {
        setIsAdmin(false);
      });
  }, [pathname]);

  // Close dropdowns & suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (destDropdownRef.current && !destDropdownRef.current.contains(target)) {
        setIsDestDropdownOpen(false);
      }
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(target)) {
        setIsDesktopSuggestionsOpen(false);
      }
      if (
        isMobileSearchOpen &&
        mobileSearchDrawerRef.current &&
        !mobileSearchDrawerRef.current.contains(target) &&
        mobileSearchBtnRef.current &&
        !mobileSearchBtnRef.current.contains(target)
      ) {
        setIsMobileSearchOpen(false);
        setIsMobileSuggestionsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileSearchOpen]);

  // Focus input automatically when mobile search expands
  useEffect(() => {
    if (isMobileSearchOpen && mobileInputRef.current) {
      const timer = setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isMobileSearchOpen]);

  // Close open menus and suggestions on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
    setIsDestDropdownOpen(false);
    setIsDesktopSuggestionsOpen(false);
    setIsMobileSuggestionsOpen(false);
  }, [pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => {
      if (!prev) {
        setIsMobileSearchOpen(false);
        setIsMobileSuggestionsOpen(false);
      }
      return !prev;
    });
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(prev => {
      if (!prev) {
        setIsMobileMenuOpen(false);
      } else {
        setIsMobileSuggestionsOpen(false);
      }
      return !prev;
    });
  };

  const handleDestClick = (e: React.MouseEvent) => {
    // In mobile view (<= 900px), toggle on click
    if (typeof window !== 'undefined' && window.innerWidth <= 900) {
      e.preventDefault();
      setIsDestDropdownOpen(prev => !prev);
    }
  };

  const closeAllMenus = () => {
    setIsDestDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
    setIsDesktopSuggestionsOpen(false);
    setIsMobileSuggestionsOpen(false);
  };

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    closeAllMenus();
    const footerEl = document.getElementById('footer');
    if (footerEl) {
      e.preventDefault();
      footerEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatTitle = (text?: string) => {
    if (!text) return '';
    return text
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  // Search Submission
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    closeAllMenus();
    router.push(`/activities?search=${encodeURIComponent(query)}`);
  };

  const handleSelectPackage = (pkgId: string) => {
    closeAllMenus();
    router.push(`/packages/${pkgId}`);
  };

  const handleSelectDestination = (slug: string) => {
    closeAllMenus();
    router.push(`/destinations/${slug}`);
  };

  // Filter dynamic suggestions
  const trimmedQuery = searchQuery.trim().toLowerCase();

  const matchingDestinations = trimmedQuery.length > 0
    ? destinations.filter(dest => {
        const title = (dest.title || dest.name || dest.id || '').toLowerCase();
        return title.includes(trimmedQuery);
      }).slice(0, 3)
    : [];

  const matchingPackages = trimmedQuery.length > 0
    ? packagesList.filter(pkg => {
        const title = (pkg.title || '').toLowerCase();
        const dest = (pkg.destination || '').toLowerCase();
        return title.includes(trimmedQuery) || dest.includes(trimmedQuery);
      }).slice(0, 5)
    : [];

  const hasSuggestions = matchingDestinations.length > 0 || matchingPackages.length > 0;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Left Section: Brand Logo */}
        <div className={styles.leftSection}>
          <Link href="/" className={styles.logo} onClick={closeAllMenus}>
            <Image src="/logo.png" alt="Nasmal Tourisms" width={220} height={75} className={styles.logoImg} priority />
          </Link>
        </div>

        {/* Center Section: Desktop Search Bar (Hidden on Activity Page and Mobile) */}
        {!isActivityPage && showSearch && (
          <div className={styles.centerSection} ref={desktopSearchRef}>
            <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
              <button 
                type="submit" 
                className={styles.searchIconBtn} 
                aria-label="Search"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
              <input 
                type="text" 
                name="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDesktopSuggestionsOpen(true);
                }}
                onFocus={() => {
                  if (searchQuery.trim().length > 0) {
                    setIsDesktopSuggestionsOpen(true);
                  }
                }}
                placeholder="Search destinations, tours, activities..." 
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearSearchBtn}
                  onClick={() => {
                    setSearchQuery('');
                    setIsDesktopSuggestionsOpen(false);
                  }}
                  aria-label="Clear search"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </form>

            {/* Desktop Live Suggestions Dropdown */}
            {isDesktopSuggestionsOpen && trimmedQuery.length > 0 && (
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

                {/* Bottom View All Link */}
                <div 
                  className={styles.suggestionFooter}
                  onClick={() => handleSearchSubmit()}
                >
                  <div className={styles.footerSearchText}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <span>Search all activities for &ldquo;<strong>{searchQuery}</strong>&rdquo;</span>
                  </div>
                  <span className={styles.suggestionArrow}>&rarr;</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right Section: Mobile Controls & Nav Links */}
        <div className={styles.rightSection}>
          {/* Mobile Actions: Search Icon Button + Hamburger Toggle */}
          <div className={styles.mobileNavWrapper}>
            {!isActivityPage && (
              <button 
                ref={mobileSearchBtnRef}
                type="button" 
                className={`${styles.mobileSearchIconBtn} ${isMobileSearchOpen ? styles.mobileSearchIconActive : ''}`} 
                onClick={toggleMobileSearch}
                aria-label={isMobileSearchOpen ? "Close search" : "Open search"}
                title="Search"
              >
                {isMobileSearchOpen ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                )}
              </button>
            )}

            <button className={styles.mobileMenuBtn} onClick={toggleMobileMenu} aria-label="Toggle menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isMobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>

          <div className={`${styles.navLinks} ${isMobileMenuOpen ? styles.navLinksOpen : ''}`}>
            {/* Home button to return to landing page */}
            <Link 
              href="/" 
              className={`${styles.link} ${pathname === '/' ? styles.activeLink : ''}`} 
              onClick={closeAllMenus}
            >
              Home
            </Link>

            {/* Destinations with Dropdown */}
            <div 
              className={styles.dropdownContainer}
              ref={destDropdownRef}
              onMouseEnter={() => {
                if (typeof window !== 'undefined' && window.innerWidth > 900) {
                  setIsDestDropdownOpen(true);
                }
              }}
              onMouseLeave={() => {
                if (typeof window !== 'undefined' && window.innerWidth > 900) {
                  setIsDestDropdownOpen(false);
                }
              }}
            >
              <button 
                type="button"
                className={styles.dropdownTrigger}
                onClick={handleDestClick}
                aria-expanded={isDestDropdownOpen}
              >
                <span>Destinations</span>
                <svg 
                  className={`${styles.chevron} ${isDestDropdownOpen ? styles.chevronOpen : ''}`} 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              <div className={`${styles.destDropdownMenu} ${isDestDropdownOpen ? `${styles.destDropdownOpenDesktop} ${styles.destDropdownOpenMobile}` : ''}`}>
                {destinations.map(dest => {
                  const title = formatTitle(dest.title || dest.name || dest.id);
                  const targetSlug = dest.id || encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'));
                  return (
                    <Link
                      key={dest.id || title}
                      href={`/destinations/${targetSlug}`}
                      className={styles.destItem}
                      onClick={closeAllMenus}
                    >
                      <span>{title}</span>
                      <span className={styles.destArrow}>&rarr;</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <Link 
              href="/activities" 
              className={`${styles.link} ${pathname.startsWith('/activities') ? styles.activeLink : ''}`} 
              onClick={closeAllMenus}
            >
              Activities
            </Link>

            <Link 
              href="/contact" 
              className={`${styles.link} ${pathname === '/contact' ? styles.activeLink : ''}`} 
              onClick={closeAllMenus}
            >
              Contact
            </Link>
            
            <div className={styles.actionGroup}>
              <Link href="/wishlist" className={styles.wishlistNavBtn} onClick={closeAllMenus} title="My Wishlist">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={styles.navBtnIcon}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span>Wishlist</span>
              </Link>
              {isAdmin && (
                <Link href="/booked-packages" className={styles.bookedNavBtn} onClick={closeAllMenus} title="Booked Packages">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={styles.navBtnIcon}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <path d="M9 16l2 2 4-4" />
                  </svg>
                  <span>Booked Packages</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Expandable Search Drawer (Positioned under navbar, NEVER covers the navbar) */}
      {!isActivityPage && (
        <div 
          ref={mobileSearchDrawerRef} 
          className={`${styles.mobileSearchDrawer} ${isMobileSearchOpen ? styles.mobileSearchDrawerOpen : ''}`}
        >
          <form onSubmit={handleSearchSubmit} className={styles.mobileSearchForm}>
            <div className={styles.mobileSearchInputWrapper}>
              <svg className={styles.mobileInputSearchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                ref={mobileInputRef}
                type="text" 
                name="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsMobileSuggestionsOpen(true);
                }}
                onFocus={() => {
                  if (searchQuery.trim().length > 0) {
                    setIsMobileSuggestionsOpen(true);
                  }
                }}
                placeholder="Search destinations, tours, activities..." 
                autoComplete="off"
                className={styles.mobileSearchInput}
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearSearchBtn}
                  onClick={() => {
                    setSearchQuery('');
                    setIsMobileSuggestionsOpen(false);
                  }}
                  aria-label="Clear search"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
              <button type="submit" className={styles.mobileSearchSubmitBtn}>
                Search
              </button>
            </div>

            {/* Mobile Live Suggestions Dropdown */}
            {isMobileSuggestionsOpen && trimmedQuery.length > 0 && (
              <div className={styles.mobileSuggestionsDropdown}>
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
          </form>
        </div>
      )}
    </nav>
  );
}

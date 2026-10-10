'use client';

import { useState } from 'react';
import PackageCard from './PackageCard';
import styles from './ActivitiesFilter.module.css';

interface Package {
  id: string;
  title: string;
  image: string;
  price: string;
  rating: string;
  reviewsCount: number;
  suitableFor?: string[];
}

interface ActivitiesFilterProps {
  packages: Package[];
  destinationName: string;
}

const TABS = [
  { id: 'attractions', label: 'Attractions', icon: '🏛️' },
  { id: 'families', label: 'Families With Kids', icon: '👨‍👩‍👧‍👦' },
  { id: 'couple', label: 'Couple', icon: '💑' },
  { id: 'food', label: 'Food Drinks', icon: '🍹' },
  { id: 'culture', label: 'Culture & Heritage', icon: '🕌' },
  { id: 'nature', label: 'Nature & Wildlife', icon: '🌲' },
];

export default function ActivitiesFilter({ packages, destinationName }: ActivitiesFilterProps) {
  const [activeTab, setActiveTab] = useState<string | null>('couple');

  const filteredPackages = packages.filter(pkg => {
    if (!activeTab) return true;
    const tabObj = TABS.find(t => t.id === activeTab);
    if (!tabObj) return true;
    
    if (pkg.suitableFor && pkg.suitableFor.length > 0) {
      return pkg.suitableFor.some(s => 
        s.toLowerCase() === tabObj.label.toLowerCase() || 
        s.toLowerCase() === tabObj.id.toLowerCase()
      );
    }
    return true;
  });

  return (
    <div className={styles.container}>
      {/* Sidebar Filter */}
      <div className={styles.sidebar}>
        <div className={styles.filterBox}>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>🔍</span>
            <input type="text" placeholder="search for activ" className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>📍</span>
            <input type="text" placeholder="search location" defaultValue={destinationName} className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>📅</span>
            <input type="text" placeholder="add dates" className={styles.input} />
          </div>
        </div>

        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Price range</h3>
          <div className={styles.sliderTrack}>
            <div className={styles.sliderThumb}></div>
          </div>
          <div className={styles.priceLabels}>
            <span>AED 0</span>
            <span>AED 1000+</span>
          </div>
        </div>

        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Category</h3>
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" className={styles.checkbox} />
              Travel
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" className={styles.checkbox} />
              Tour
            </label>
          </div>
        </div>

        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Sort by</h3>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input type="radio" name="sort" className={styles.radio} defaultChecked />
              Recommended
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="sort" className={styles.radio} />
              Price: Low to High
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="sort" className={styles.radio} />
              Price: High to Low
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="sort" className={styles.radio} />
              Popularity Score: High to Low
            </label>
          </div>
        </div>

        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Others</h3>
        </div>
      </div>

      {/* Main Area */}
      <div className={styles.mainArea}>
        <div className={styles.header}>
          <h2 className={styles.title}>{filteredPackages.length} activities for you</h2>
          <p className={styles.subtitle}>Traveller & Activity types Select one or more</p>
          
          <div className={styles.tabsScroll}>
            {TABS.map(tab => (
              <div 
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(activeTab === tab.id ? null : tab.id)}
              >
                <div className={styles.tabIcon}>{tab.icon}</div>
                <span className={styles.tabLabel}>{tab.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {filteredPackages.map(pkg => (
            <PackageCard key={pkg.id} {...pkg} />
          ))}
          {filteredPackages.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#64748b' }}>
              No activities found matching this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

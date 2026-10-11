"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PackageCard from './PackageCard';
import styles from './DestinationTickets.module.css';

interface Ticket {
  id: string;
  destination: string;
  title: string;
  image: string;
  price: string;
  originalPrice?: string;
  rating: string;
  reviewsCount: number;
}

interface DestinationTicketsProps {
  destinations: string[];
  tickets: Ticket[];
}

export default function DestinationTickets({ destinations = [], tickets = [] }: DestinationTicketsProps) {
  const [activeDestination, setActiveDestination] = useState(destinations[0] || 'Dubai');

  useEffect(() => {
    if (destinations.length > 0 && (!activeDestination || !destinations.includes(activeDestination))) {
      setActiveDestination(destinations[0]);
    }
  }, [destinations, activeDestination]);

  const filteredTickets = tickets.filter(
    t => t.destination && t.destination.toLowerCase() === (activeDestination || '').toLowerCase()
  );

  if (destinations.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabsContainer}>
        {destinations.map(dest => (
          <button
            key={dest}
            className={`${styles.tab} ${activeDestination === dest ? styles.activeTab : ''}`}
            onClick={() => setActiveDestination(dest)}
          >
            {dest}
          </button>
        ))}
      </div>

      {filteredTickets.length > 0 ? (
        <div className={styles.grid}>
          {filteredTickets.map(ticket => (
            <PackageCard key={ticket.id} {...ticket} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '48px 16px', color: '#64748b' }}>
          <p style={{ fontSize: '1.1rem', margin: 0 }}>
            No packages added for {activeDestination} yet.
          </p>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '6px' }}>
            Check back soon or explore our other exciting destinations!
          </p>
        </div>
      )}

      {activeDestination && (
        <div className={styles.viewMoreContainer}>
          <Link
            href={`/destinations/${activeDestination.toLowerCase().replace(/\s+/g, '-')}`}
            className={styles.viewMoreBtn}
          >
            View full activity in {activeDestination}
          </Link>
        </div>
      )}
    </div>
  );
}

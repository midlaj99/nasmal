"use client";

import { useState } from 'react';
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

export default function DestinationTickets({ destinations, tickets }: DestinationTicketsProps) {
  const [activeDestination, setActiveDestination] = useState(destinations[0]);

  const filteredTickets = tickets.filter(t => t.destination === activeDestination);

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

      <div className={styles.grid}>
        {filteredTickets.map(ticket => (
          <PackageCard key={ticket.id} {...ticket} />
        ))}
      </div>
      
      <div className={styles.viewMoreContainer}>
        <Link 
          href={`/destinations/${activeDestination.toLowerCase().replace(/\s+/g, '-')}`}
          className={styles.viewMoreBtn}
        >
          View full activity in {activeDestination}
        </Link>
      </div>
    </div>
  );
}

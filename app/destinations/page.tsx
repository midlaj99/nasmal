import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import HeroSearchBar from '@/components/HeroSearchBar';
import WhyChooseNasmal from '@/components/WhyChooseNasmal';
import { getDestinations } from '@/lib/db';
import styles from './destinations.module.css';

export const dynamic = 'force-dynamic';

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <main className={styles.pageWrapper}>
      {/* ================= HERO SECTION ================= */}
      <div className={styles.hero}>
        <Image
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80"
          alt="UAE Destinations"
          fill
          sizes="100vw"
          className={styles.heroImage}
          priority
        />
        <div className={styles.heroOverlay} />

        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            {/* Top Breadcrumb Navigation */}
            <div className={styles.breadcrumbWrapper}>
              <Breadcrumb
                variant="dark"
                separator=">"
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Destination' },
                ]}
              />
            </div>
            
            <span className={styles.eyebrow}>DREAM • EXPLORE • DISCOVER</span>
            <h1 className={styles.heroTitle}>
              Explore <span className={styles.highlightText}>UAE Destinations</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Discover the best tours, activities, and attractions across the Emirates!
            </p>
            
            {/* Functional Search Bar with Live Suggestions */}
            <HeroSearchBar 
              placeholder="Search for destinations in UAE..." 
              align="left" 
            />
          </div>
        </div>

        {/* Single fluid pure white wave divider */}
        <div className={styles.waveDivider}>
          <svg 
            viewBox="0 0 1440 90" 
            preserveAspectRatio="none" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={styles.waveSvg}
          >
            <path 
              d="M0,40 C320,75 580,15 880,48 C1140,75 1320,32 1440,38 L1440,90 L0,90 Z" 
              fill="#ffffff" 
            />
          </svg>
        </div>
      </div>

      {/* ================= WHY NASMAL TOURISM SECTION ================= */}
      <WhyChooseNasmal />

      {/* ================= ALL DESTINATIONS GRID ================= */}
      <section id="all-destinations" className={styles.destinationsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>TOP HOTSPOTS</span>
            <h2 className={styles.sectionTitle}>Featured Emirates & Destinations</h2>
            <p className={styles.sectionDesc}>
              Select your favorite destination below to view curated sightseeing excursions, desert safaris, and luxury experiences.
            </p>
          </div>

          <div className={styles.grid}>
            {destinations.map(dest => {
              const destSlug = dest.id || dest.title.toLowerCase().replace(/\s+/g, '-');
              return (
                <Link key={dest.id} href={`/destination/${destSlug}`} className={styles.destCard}>
                  <Image
                    src={dest.image || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80'}
                    alt={dest.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.cardImg}
                  />
                  <div className={styles.cardOverlay}>
                    <span className={styles.cardBadge}>Explore</span>
                    <h3 className={styles.cardTitle}>{dest.title}</h3>
                    <span className={styles.cardTours}>
                      {dest.toursCount || 0} Tours & Activities &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import PackageCard from '@/components/PackageCard';
import Breadcrumb from '@/components/Breadcrumb';
import HeroSearchBar from '@/components/HeroSearchBar';
import WhyChooseNasmal from '@/components/WhyChooseNasmal';
import styles from './page.module.css';
import { getPackagesByDestination, getDestinationById } from '@/lib/db';

export const revalidate = 30;

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const decodedSlug = decodeURIComponent(slug);
  
  // Fetch real destination from database with fallback fuzzy matching
  const destination = await getDestinationById(decodedSlug);
  
  const name = destination?.title || decodedSlug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  // High resolution imagery per destination
  let image = destination?.image;
  if (!image || image === '/hero-bg.jpg') {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('dubai')) {
      image = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=2400&q=85';
    } else if (lowerName.includes('sharjah')) {
      image = '/sharjah.jpg';
    } else if (lowerName.includes('abu dhabi')) {
      image = 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=2400&q=85';
    } else {
      image = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=2400&q=85';
    }
  } else if (image.includes('images.unsplash.com')) {
    image = image.replace(/w=\d+/, 'w=2400').replace(/q=\d+/, 'q=85');
  }

  const packages = await getPackagesByDestination(name);

  return (
    <main className={styles.pageWrapper}>
      {/* ================= HERO SECTION ================= */}
      <div className={styles.hero}>
        {/* Ambient atmospheric backdrop: fills screen with authentic blurred tones of the image */}
        <div className={styles.ambientBackdrop}>
          <Image 
            src={image} 
            alt="" 
            fill 
            sizes="100vw"
            className={styles.ambientImage}
            priority
            unoptimized={Boolean(image && (image.startsWith('/api/images') || image.startsWith('data:')))}
          />
        </div>

        {/* Crisp unzoomed focal hero image */}
        <div className={styles.focalImageWrapper}>
          <Image 
            src={image} 
            alt={name} 
            fill 
            sizes="(max-width: 991px) 100vw, 65vw"
            className={styles.focalImage}
            priority
            unoptimized={Boolean(image && (image.startsWith('/api/images') || image.startsWith('data:')))}
          />
        </div>
        
        {/* Soft evening gradient overlay */}
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
                  { label: 'Destination', href: '/destination' },
                  { label: name },
                ]}
              />
            </div>

            <span className={styles.eyebrow}>DREAM • EXPLORE • DISCOVER</span>
            <h1 className={styles.title}>
              Explore <span className={styles.highlightText}>{name}</span>
            </h1>
            <p className={styles.subtitle}>
              Discover the best tours, activities, and attractions in {name}!
            </p>
            
            {/* Functional Search Bar with Live Suggestions */}
            <HeroSearchBar 
              placeholder={`Search for destinations in ${name}...`} 
              defaultLocation={slug}
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

      {/* ================= ALL ACTIVITIES SECTION ================= */}
      <section id="activities" className={styles.activitiesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>All Activities In {name}</h2>
            <Link 
              href={`/activities?location=${slug}`} 
              className={styles.filterBtn}
            >
              <span>View All with Filters</span>
              <span>&rarr;</span>
            </Link>
          </div>
          
          {packages.length > 0 ? (
            <div className={styles.grid}>
              {packages.map(pkg => (
                <PackageCard key={pkg.id} {...pkg} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>✨</div>
              <h3>No activities listed for {name} yet</h3>
              <p>We are continuously curating breathtaking experiences in this destination. Check all UAE activities or contact us for tailor-made itineraries!</p>
              <Link href="/activities" className={styles.emptyAction}>
                Explore All Activities
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ================= WHY NASMAL TOURISM SECTION ================= */}
      <WhyChooseNasmal />
    </main>
  );
}

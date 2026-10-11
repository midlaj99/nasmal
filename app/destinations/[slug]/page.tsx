import Image from 'next/image';
import Link from 'next/link';
import PackageCard from '@/components/PackageCard';
import styles from './page.module.css';
import { getPackagesByDestination, getDestinationById } from '@/lib/db';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const decodedSlug = decodeURIComponent(slug);
  
  // Fetch real destination from database
  const destination = await getDestinationById(decodedSlug);
  const name = destination?.title || decodedSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const image = destination?.image || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80';

  const packages = await getPackagesByDestination(name);

  return (
    <main>
      <div className={styles.hero}>
        <Image 
          src={image} 
          alt={name} 
          fill 
          sizes="100vw"
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Explore {name}</h1>
          <p className={styles.subtitle}>Discover the best tours, activities, and attractions in {name}.</p>
        </div>
      </div>

      <section className={styles.section} style={{ backgroundColor: '#f9f9f9', padding: '60px 0' }}>
        <div className="container">
          <h2 className={styles.sectionHeading} style={{ textAlign: 'center', marginBottom: '40px' }}>Why Nasmal Tourism?</h2>
          <div className={styles.featuresList} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🛡️</div>
              <div className={styles.featureContent}>
                <h4>Best Price Guarantee</h4>
                <p>Explore top-rated activities at the best prices, from popular tours to hidden gems.</p>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>💬</div>
              <div className={styles.featureContent}>
                <h4>24/7 Live Chat Support</h4>
                <p>Get immediate assistance anytime with our 24/7 live chat, ensuring instant help.</p>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>💳</div>
              <div className={styles.featureContent}>
                <h4>Easy Online Transaction</h4>
                <p>Simplify your bookings. Earn and redeem miles effortlessly with every transaction.</p>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>⭐</div>
              <div className={styles.featureContent}>
                <h4>Guest Reviews & Ratings</h4>
                <p>Explore top-rated activities with confidence through verified reviews and high ratings.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="section-title" style={{ margin: 0 }}>All Activities In {name}</h2>
            <Link href={`/activities?location=${slug}`} style={{ background: '#e00b3e', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold' }}>View All with Filters</Link>
          </div>
          
          {packages.length > 0 ? (
            <div className={styles.grid}>
              {packages.map(pkg => (
                <PackageCard key={pkg.id} {...pkg} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
              <p>No activities added for {name} yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

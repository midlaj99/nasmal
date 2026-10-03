import Image from 'next/image';
import Link from 'next/link';
import PackageCard from '@/components/PackageCard';
import ActivitiesFilter from '@/components/ActivitiesFilter';
import styles from './page.module.css';
import { getPackagesByDestination } from '@/lib/db';

// Mock data for the destination
const getDestinationData = (slug: string) => {
  const decodedSlug = decodeURIComponent(slug);
  const name = decodedSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  let image = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80';
  if (slug === 'abu-dhabi') {
    image = 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=1600&q=80';
  } else if (slug === 'sharjah') {
    image = '/sharjah.jpg';
  }

  const categories = [
    'Attractions', 'Families With Kids', 'Couple', 'Food Drinks', 
    'Culture & Heritage', 'Nature & Wildlife', 'Day Trips', 'Explore All'
  ];

  const highlights = [
    { type: "What's new", title: "Big Bus Day Pass With Inside Burj Al Arab", link: "#", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&q=80" },
    { type: "Promotion", title: "Dubai Miracle Garden", link: "#", image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&q=80" },
    { type: "Nasmal's pick", title: "AYA Universe", link: "/packages/aya-universe", image: "/hero-bg.jpg" }
  ];

  return { name, image, categories, highlights };
};

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { name, image, categories, highlights } = getDestinationData(resolvedParams.slug);
  const packages = await getPackagesByDestination(resolvedParams.slug);

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

      <section className={styles.section} style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="container">
          <div className={styles.highlightsGrid}>
            {highlights.map((item, idx) => (
              <a href={item.link} key={idx} className={styles.highlightCard}>
                <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className={styles.highlightImage} />
                <div className={styles.highlightOverlay}></div>
                <div className={styles.highlightContent}>
                  <span className={styles.highlightType}>{item.type}</span>
                  <h3 className={styles.highlightTitle}>{item.title}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

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
            <Link href={`/activities?location=${resolvedParams.slug}`} style={{ background: 'var(--primary-color)', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold' }}>View All with Filters</Link>
          </div>
          
          <div className={styles.grid}>
            {packages.map(pkg => (
              <PackageCard key={pkg.id} {...pkg} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

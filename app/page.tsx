import Hero from '@/components/Hero';
import PackageCard from '@/components/PackageCard';
import DestinationCard from '@/components/DestinationCard';
import AutoCarousel from '@/components/AutoCarousel';
import DestinationTickets from '@/components/DestinationTickets';
import styles from './page.module.css';
import { getPackages, getDestinations } from '@/lib/db';

export const revalidate = 15;

export default async function Home() {
  let allPackages: any[] = [];
  let destinations: any[] = [];

  try {
    const [packagesRes, destinationsRes] = await Promise.all([
      getPackages(),
      getDestinations()
    ]);
    allPackages = packagesRes || [];
    destinations = destinationsRes || [];
  } catch (e) {
    console.error('Home page data fetch error:', e);
  }

  // ONLY dynamic packages from admin database
  const popularPackages = allPackages.filter(p => p.isPopular);
  const bestDeals = allPackages.filter(p => p.isBestDeal);
  const bestPlacesDubai = allPackages.filter(p => p.destination?.toLowerCase() === 'dubai');
  const destinationList = destinations.map(d => d.title);

  return (
    <main className={styles.main}>
      <Hero destinations={destinations} />
      
      {/* Popular Packages */}
      {popularPackages.length > 0 && (
        <section className={styles.section}>
          <div className="container">
            <h2 className="section-title">Popular Dubai Packages</h2>
            
            <div className={styles.grid}>
              {popularPackages.map(pkg => (
                <PackageCard key={pkg.id} {...pkg} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Explore Destinations - Completely Dynamic */}
      <section className={`${styles.section} ${styles.altSection}`}>
        <div className="container">
          <h2 className="section-title">Explore Destinations</h2>
          
          <div className={styles.grid}>
            {destinations.map(dest => (
              <DestinationCard key={dest.id || dest.title} {...dest} />
            ))}
          </div>
        </div>
      </section>

      {/* The Best Part of Dubai - Dynamically from Database */}
      {bestPlacesDubai.length > 0 && (
        <section className={styles.section}>
          <div className="container">
            <h2 className="section-title">The Best Part of Dubai</h2>
            
            <div className={styles.grid}>
              {bestPlacesDubai.map(place => (
                <PackageCard key={place.id} {...place} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Deals For You - Dynamic from DB */}
      {bestDeals.length > 0 && (
        <section className={`${styles.section} ${styles.altSection}`}>
          <div className="container">
            <h2 className="section-title">Best Deals For You</h2>
            <AutoCarousel deals={bestDeals} />
          </div>
        </section>
      )}

      {/* Choose your fav place - Completely Dynamic Destinations and Packages from DB */}
      <section className={styles.section}>
        <div className="container">
          <h2 className="section-title">Choose your fav place</h2>
          <DestinationTickets 
            destinations={destinationList} 
            tickets={allPackages} 
          />
        </div>
      </section>

    </main>
  );
}

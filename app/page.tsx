import Hero from '@/components/Hero';
import PackageCard from '@/components/PackageCard';
import DestinationCard from '@/components/DestinationCard';
import AutoCarousel from '@/components/AutoCarousel';
import DestinationTickets from '@/components/DestinationTickets';
import ReviewsMarquee from '@/components/ReviewsMarquee';
import styles from './page.module.css';
import { getPackages, getDestinations } from '@/lib/db';

export const revalidate = 15;

const reviewsData = [
  { id: 'r1', name: 'Sarah Jenkins', location: 'London, UK', rating: 5, comment: 'Absolutely incredible experience! The booking process was seamless and our tour guide in Dubai was extremely knowledgeable.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80' },
  { id: 'r2', name: 'Michael Chen', location: 'Toronto, Canada', rating: 5, comment: 'Best travel agency I have ever used. They planned our Abu Dhabi trip perfectly, including the Ferrari World tickets.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80' },
  { id: 'r3', name: 'Elena Rodriguez', location: 'Madrid, Spain', rating: 4, comment: 'Very professional service. The desert safari was the highlight of our vacation. Highly recommend Nasmal Tourisms!', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80' },
  { id: 'r4', name: 'James Wilson', location: 'Sydney, Australia', rating: 5, comment: 'Top-tier customer support. We had to change our itinerary last minute and they handled it without any extra stress.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80' },
  { id: 'r5', name: 'Aisha Patel', location: 'Mumbai, India', rating: 5, comment: 'Loved every second of our UAE trip. The hotel recommendations and activity packages were spot on and very affordable.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&q=80' },
];

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
      <Hero />
      
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

      {/* What Our Customers Say */}
      <section className={`${styles.section} ${styles.altSection}`}>
        <div className="container" style={{ maxWidth: '100%', overflow: 'hidden' }}>
          <h2 className="section-title">What Our Customers Say</h2>
          <ReviewsMarquee reviews={reviewsData} />
        </div>
      </section>
    </main>
  );
}

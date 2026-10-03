import Hero from '@/components/Hero';
// import Features from '@/components/Features';
import PackageCard from '@/components/PackageCard';
import DestinationCard from '@/components/DestinationCard';
import AutoCarousel from '@/components/AutoCarousel';
import DestinationTickets from '@/components/DestinationTickets';
import ReviewsMarquee from '@/components/ReviewsMarquee';
import styles from './page.module.css';
import { getPackages, getDestinations } from '@/lib/db';

const reviewsData = [
  { id: 'r1', name: 'Sarah Jenkins', location: 'London, UK', rating: 5, comment: 'Absolutely incredible experience! The booking process was seamless and our tour guide in Dubai was extremely knowledgeable.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80' },
  { id: 'r2', name: 'Michael Chen', location: 'Toronto, Canada', rating: 5, comment: 'Best travel agency I have ever used. They planned our Abu Dhabi trip perfectly, including the Ferrari World tickets.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80' },
  { id: 'r3', name: 'Elena Rodriguez', location: 'Madrid, Spain', rating: 4, comment: 'Very professional service. The desert safari was the highlight of our vacation. Highly recommend Nasmal Tourisms!', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80' },
  { id: 'r4', name: 'James Wilson', location: 'Sydney, Australia', rating: 5, comment: 'Top-tier customer support. We had to change our itinerary last minute and they handled it without any extra stress.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80' },
  { id: 'r5', name: 'Aisha Patel', location: 'Mumbai, India', rating: 5, comment: 'Loved every second of our UAE trip. The hotel recommendations and activity packages were spot on and very affordable.', avatar: '/hero-bg.jpg' },
];

const destinationList = ['Dubai', 'Abu Dhabi', 'Sharjah'];

const destinationTicketsData = [
  { id: 'dt1', destination: 'Dubai', title: 'Burj Khalifa Tickets', image: 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800&q=80', price: '150', rating: '4.8', reviewsCount: 1200 },
  { id: 'dt2', destination: 'Dubai', title: 'Desert Safari', image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80', price: '200', rating: '4.9', reviewsCount: 3400 },
  { id: 'dt3', destination: 'Dubai', title: 'Dubai Mall Aquarium', image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80', price: '120', rating: '4.7', reviewsCount: 890 },
  { id: 'dt4', destination: 'Dubai', title: 'Marina Dhow Cruise', image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80', price: '180', rating: '4.6', reviewsCount: 450 },
  
  { id: 'dt5', destination: 'Abu Dhabi', title: 'Ferrari World Ticket', image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&q=80', price: '295', rating: '4.8', reviewsCount: 2100 },
  { id: 'dt6', destination: 'Abu Dhabi', title: 'Louvre Abu Dhabi', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80', price: '63', rating: '4.9', reviewsCount: 1500 },
  { id: 'dt7', destination: 'Abu Dhabi', title: 'Sheikh Zayed Mosque Tour', image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&q=80', price: '150', rating: '4.9', reviewsCount: 4200 },
  { id: 'dt8', destination: 'Abu Dhabi', title: 'Warner Bros World', image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&q=80', price: '310', rating: '4.7', reviewsCount: 980 },
  
  { id: 'dt9', destination: 'Sharjah', title: 'Sharjah Aquarium', image: '/sharjah.jpg', price: '25', rating: '4.5', reviewsCount: 300 },
  { id: 'dt10', destination: 'Sharjah', title: 'Al Noor Island', image: '/sharjah.jpg', price: '45', rating: '4.6', reviewsCount: 450 },
  { id: 'dt11', destination: 'Sharjah', title: 'Sharjah Desert Park', image: '/sharjah.jpg', price: '15', rating: '4.4', reviewsCount: 890 },
  { id: 'dt12', destination: 'Sharjah', title: 'Rain Room Ticket', image: '/sharjah.jpg', price: '25', rating: '4.7', reviewsCount: 600 },
];

const bestDeals = [
  {
    id: 'd1',
    title: 'Global Village Entry Ticket',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
    price: '25',
    originalPrice: '30',
    rating: '4.5',
    reviewsCount: 890
  },
  {
    id: 'd2',
    title: 'Dubai Frame Admission',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80',
    price: '50',
    originalPrice: '65',
    rating: '4.6',
    reviewsCount: 1200
  },
  {
    id: 'd3',
    title: 'Miracle Garden Tickets',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80',
    price: '95',
    originalPrice: '110',
    rating: '4.8',
    reviewsCount: 3400
  },
  {
    id: 'd4',
    title: 'Museum of the Future',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    price: '149',
    rating: '4.9',
    reviewsCount: 5200
  },
  {
    id: 'd5',
    title: 'Atlantis Aquaventure Waterpark',
    image: '/hero-bg.jpg',
    price: '299',
    originalPrice: '350',
    rating: '4.7',
    reviewsCount: 2800
  },
  {
    id: 'd6',
    title: 'Ski Dubai Snow Classic',
    image: '/sharjah.jpg',
    price: '250',
    originalPrice: '290',
    rating: '4.6',
    reviewsCount: 1550
  }
];

// Dynamically fetched

const bestPlacesDubai = [
  {
    id: 'p1',
    title: 'Burj Khalifa At The Top',
    image: 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800&q=80',
    price: '150',
    rating: '4.8',
    reviewsCount: 3200
  },
  {
    id: 'p2',
    title: 'Palm Jumeirah Experience',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    price: '120',
    rating: '4.6',
    reviewsCount: 1850
  },
  {
    id: 'p3',
    title: 'Dubai Marina Luxury Cruise',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80',
    price: '200',
    rating: '4.9',
    reviewsCount: 4500
  },
  {
    id: 'p4',
    title: 'The Dubai Mall Aquarium',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80',
    price: '199',
    originalPrice: '250',
    rating: '4.7',
    reviewsCount: 2100
  }
];

// Dynamically fetched

export default async function Home() {
  const allPackages = await getPackages();
  const popularPackages = allPackages.filter(p => p.isPopular);
  const dynamicBestDeals = allPackages.filter(p => p.isBestDeal);
  const finalBestDeals = [...bestDeals, ...dynamicBestDeals];
  const destinations = await getDestinations();

  return (
    <main className={styles.main}>
      <Hero />
      {/* <Features /> */}
      
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

      <section className={`${styles.section} ${styles.altSection}`}>
        <div className="container">
          <h2 className="section-title">Explore Destinations</h2>
          
          <div className={styles.grid}>
            {destinations.map(dest => (
              <DestinationCard key={dest.title} {...dest} />
            ))}
          </div>
        </div>
      </section>

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

      <section className={`${styles.section} ${styles.altSection}`}>
        <div className="container">
          <h2 className="section-title">Best Deals For You</h2>
          <AutoCarousel deals={finalBestDeals} />
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <h2 className="section-title">Choose your fav place</h2>
          <DestinationTickets destinations={destinationList} tickets={destinationTicketsData} />
        </div>
      </section>

      <section className={`${styles.section} ${styles.altSection}`}>
        <div className="container" style={{ maxWidth: '100%', overflow: 'hidden' }}>
          <h2 className="section-title">What Our Customers Say</h2>
          <ReviewsMarquee reviews={reviewsData} />
        </div>
      </section>
    </main>
  );
}

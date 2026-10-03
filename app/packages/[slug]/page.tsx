import Image from 'next/image';
import Link from 'next/link';
import PackageCard from '@/components/PackageCard';
import BookingWidget from '@/components/BookingWidget';
import styles from './page.module.css';
import { getPackageById } from '@/lib/db';
import { notFound } from 'next/navigation';

// Mock function to generate data based on slug/id
const getPackageData = (slug: string) => {
  const name = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return {
    title: name || 'AYA Universe',
    destination: 'Dubai',
    price: '99.00',
    rating: '4.2',
    reviewsCount: 12,
    tags: ['Mobile Tickets', 'Official Reseller', 'Summer Offer', 'Instant Confirmation', 'Family Friendly', 'Bestseller'],
    images: [
      '/hero-bg.jpg', // main
      '/sharjah.jpg',
      '/hero-bg.jpg'
    ],
    description: `Don't miss Dubai's viral immersive sensation! AYA is an out-of-this-world experience that transports guests to a beautiful and mysterious star in a distant galaxy. Wander through 12 gorgeous worlds that reveal infinite star fields, reverse waterfalls, glittering gardens, and rare cosmic spectacles.\n\nExplore, connect, and create with friends and family on an unforgettable journey and discover AYA's secrets for yourself!`,
    highlights: [
      'Each of AYA’s 12 worlds explores a different cosmic spectacle of impossible beauty.',
      'Spark life across the universe in the Source.',
      'Dance with light across infinite dimensions in Harmonia.',
      'Float and travel through the hearts of stars in Drift.',
      'Witness a cosmic storm in a glittering garden in Flora.',
      'Command infinite waves of color in Tides.',
      'Transport to another dimension in Luna.',
      'Home to the largest immersive ball pit in Dubai, offering fun for all ages.',
      'Infinity mirror rooms.'
    ],
    quickFacts: [
      '2 hour average visit. Stay as long as you want!',
      '12 Immersive Worlds across 40,000 square feet',
      'Infinite dreams, secrets, and memories.',
      'Hours of stunning visual content.'
    ],
    inclusions: [
      'Entry to AYA Universe',
      'Parking'
    ],
    reviews: [
      { id: '1', author: 'Mohamed Farouk', type: 'Solo', text: 'Very well done Could use more seating or rest zones in between', rating: 4 },
      { id: '2', author: 'Jinwoo Park', type: 'Solo', text: 'Really enjoyed it Perfect for kids teens and anyone who loves lights', rating: 5 },
      { id: '3', author: 'Sana Patel', type: 'Solo', text: 'Such a cool place Every room had a different vibe and mood Luna and Tides were my favorites', rating: 5 },
      { id: '4', author: 'Osama Mahra', type: 'Solo', text: 'What a beautiful universe Great experience for just AED99', rating: 4 }
    ],
    recommended: [
      {
        id: 'rec-1',
        title: 'Dubai Aquarium Underwater Zoo',
        image: '/sharjah.jpg',
        price: '199',
        rating: '5.0',
        reviewsCount: 345
      },
      {
        id: 'rec-2',
        title: 'The Green Planet Dubai',
        image: '/sharjah.jpg',
        price: '135',
        rating: '4.5',
        reviewsCount: 210
      },
      {
        id: 'rec-3',
        title: 'Inside Burj Al Arab Tour',
        image: 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800&q=80',
        price: '249',
        rating: '3.5',
        reviewsCount: 89
      }
    ]
  };
};

export default async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const data = await getPackageById(resolvedParams.slug);

  if (!data) {
    notFound();
  }

  // Hardcode missing review and recommended fields for UI completeness
  const reviewsData = [
    { id: '1', author: 'Mohamed Farouk', type: 'Solo', text: 'Very well done Could use more seating or rest zones in between', rating: 4 },
    { id: '2', author: 'Jinwoo Park', type: 'Solo', text: 'Really enjoyed it Perfect for kids teens and anyone who loves lights', rating: 5 }
  ];
  const recommendedData = [
    {
      id: 'rec-1',
      title: 'Dubai Aquarium Underwater Zoo',
      image: '/sharjah.jpg',
      price: '199',
      rating: '5.0',
      reviewsCount: 345
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/">Home</Link> / <Link href={`/destinations/${data.destination.toLowerCase()}`}>{data.destination}</Link> / {data.title}
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>{data.title}</h1>
        <div className={styles.meta}>
          <div className={styles.price}>from AED {data.price}</div>
          <div className={styles.rating}>
            <span>★</span> {data.rating} 
            <a href="#reviews" className={styles.reviewsLink}>[{data.reviewsCount} Reviews]</a>
          </div>
          <div className={styles.tags}>
            {data.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.gallery}>
        <div className={styles.mainImage}>
          <Image src={data.images[0]} alt={data.title} fill sizes="(max-width: 768px) 100vw, 66vw" className={styles.image} priority />
        </div>
        <div className={styles.sideImages}>
          <div className={styles.sideImage}>
            <Image src={data.images[1]} alt={data.title} fill sizes="(max-width: 768px) 100vw, 33vw" className={styles.image} />
          </div>
          <div className={styles.sideImage}>
            <Image src={data.images[2]} alt={data.title} fill sizes="(max-width: 768px) 100vw, 33vw" className={styles.image} />
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mainContent}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Description</h2>
            {data.description.split('\n\n').map((para, idx) => (
              <p key={idx} className={styles.text} style={{ marginBottom: '12px' }}>{para}</p>
            ))}
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Highlights</h2>
            <ul className={styles.list}>
              {data.highlights.map((highlight, idx) => (
                <li key={idx}>{highlight}</li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Quick Facts</h2>
            <ul className={styles.list}>
              {data.quickFacts.map((fact, idx) => (
                <li key={idx}>{fact}</li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Inclusions</h2>
            <ul className={styles.list}>
              {data.inclusions.map((inc, idx) => (
                <li key={idx}>{inc}</li>
              ))}
            </ul>
          </section>

          <section id="reviews" className={styles.section}>
            <h2 className={styles.sectionTitle}>Customer Reviews</h2>
            <div style={{ marginBottom: '20px', fontWeight: 'bold' }}>
              <span style={{ color: '#ffb400' }}>★</span> {data.rating} ({data.reviewsCount} Reviews)
            </div>
            <div className={styles.reviewsList}>
              {reviewsData.map(review => (
                <div key={review.id} className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewAuthor}>{review.author} ({review.type})</span>
                    <span className={styles.reviewRating}>
                      {Array(review.rating).fill('★').join('')}
                      {Array(5 - review.rating).fill('☆').join('')}
                    </span>
                  </div>
                  <p className={styles.reviewText}>{review.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>You might also like</h2>
            <div className={styles.recommendedGrid}>
              {recommendedData.map(pkg => (
                <PackageCard key={pkg.id} {...pkg} />
              ))}
            </div>
          </section>
        </div>


        <div className={styles.sidebar}>
          <BookingWidget 
            packageId={data.title.toLowerCase().replace(/\s+/g, '-')}
            packageTitle={data.title}
            packageImage={data.images[0]}
            price={parseFloat(data.price)}
          />

          <div className={styles.section}>
            <h3 className={styles.sectionTitle} style={{ fontSize: '20px' }}>Why Nasmal Tourisms?</h3>
            <div className={styles.featuresList}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🛡️</div>
                <div className={styles.featureContent}>
                  <h4>Best Price Guarantee</h4>
                  <p>Explore top-rated activities at the best prices.</p>
                </div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>💬</div>
                <div className={styles.featureContent}>
                  <h4>24/7 Live Chat Support</h4>
                  <p>Get immediate assistance anytime.</p>
                </div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>💳</div>
                <div className={styles.featureContent}>
                  <h4>Easy Online Transaction</h4>
                  <p>Simplify your bookings securely.</p>
                </div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>⭐</div>
                <div className={styles.featureContent}>
                  <h4>Guest Reviews & Ratings</h4>
                  <p>Explore trusted experiences with confidence.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

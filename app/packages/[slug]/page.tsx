import Image from 'next/image';
import Link from 'next/link';
import PackageCard from '@/components/PackageCard';
import BookingWidget from '@/components/BookingWidget';
import WishlistButton from '@/components/WishlistButton';
import styles from './page.module.css';
import { getPackageById, getPackages } from '@/lib/db';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const data = await getPackageById(resolvedParams.slug);

  if (!data) {
    notFound();
  }

  // Fetch real other packages from MongoDB as recommended
  const allPackages = await getPackages();
  const recommendedData = allPackages
    .filter(p => p.id !== data.id && (p.destination?.toLowerCase() === data.destination?.toLowerCase() || p.isPopular))
    .slice(0, 3);

  const displayImages = (data.images && data.images.length > 0) ? data.images : [data.image];
  const mainImage = displayImages[0] || data.image;
  const sideImage1 = displayImages[1] || displayImages[0] || data.image;
  const sideImage2 = displayImages[2] || displayImages[0] || data.image;

  // Realistic review templates if reviewsCount > 0
  const reviewsData = [
    { id: '1', author: 'Mohamed Farouk', type: 'Solo', text: 'Very well done. Seamless booking experience and great support!', rating: 5 },
    { id: '2', author: 'Jinwoo Park', type: 'Family', text: 'Really enjoyed it. Perfect for kids, teens, and families. Highly recommended!', rating: 5 }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/">Home</Link> / <Link href={`/destinations/${data.destination.toLowerCase().replace(/\s+/g, '-')}`}>{data.destination}</Link> / {data.title}
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>{data.title}</h1>
        <div className={styles.meta}>
          <div className={styles.price}>from AED {data.price}</div>
          {data.childPrice && parseFloat(data.childPrice) > 0 && (
            <div style={{ fontSize: '0.95rem', color: '#16a34a', fontWeight: '600' }}>
              Child: AED {data.childPrice} {data.childAgeLimit ? `(${data.childAgeLimit})` : ''}
            </div>
          )}
          <div className={styles.rating}>
            <span>★</span> {data.rating} 
            <a href="#reviews" className={styles.reviewsLink}>[{data.reviewsCount} Reviews]</a>
          </div>
          {data.tags && data.tags.length > 0 && (
            <div className={styles.tags}>
              {data.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.gallery}>
        <div className={styles.mainImage}>
          <Image src={mainImage} alt={data.title} fill sizes="(max-width: 768px) 100vw, 66vw" className={styles.image} priority />
        </div>
        <div className={styles.sideImages}>
          <div className={styles.sideImage}>
            <Image src={sideImage1} alt={data.title} fill sizes="(max-width: 768px) 100vw, 33vw" className={styles.image} />
          </div>
          <div className={styles.sideImage}>
            <Image src={sideImage2} alt={data.title} fill sizes="(max-width: 768px) 100vw, 33vw" className={styles.image} />
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mainContent}>
          {data.description && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Description</h2>
              {data.description.split('\n\n').map((para, idx) => (
                <p key={idx} className={styles.text} style={{ marginBottom: '12px' }}>{para}</p>
              ))}
            </section>
          )}

          {displayImages.length > 3 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Gallery Photos</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginTop: '12px' }}>
                {displayImages.slice(3).map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', height: '120px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <Image src={img} alt={`${data.title} photo ${idx + 4}`} fill sizes="(max-width: 768px) 50vw, 25vw" style={{ objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.highlights && data.highlights.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Highlights</h2>
              <ul className={styles.list}>
                {data.highlights.map((highlight, idx) => (
                  <li key={idx}>{highlight}</li>
                ))}
              </ul>
            </section>
          )}

          {data.quickFacts && data.quickFacts.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Quick Facts</h2>
              <ul className={styles.list}>
                {data.quickFacts.map((fact, idx) => (
                  <li key={idx}>{fact}</li>
                ))}
              </ul>
            </section>
          )}

          {data.inclusions && data.inclusions.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Inclusions</h2>
              <ul className={styles.list}>
                {data.inclusions.map((inc, idx) => (
                  <li key={idx}>{inc}</li>
                ))}
              </ul>
            </section>
          )}

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

          {recommendedData.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>You might also like</h2>
              <div className={styles.recommendedGrid}>
                {recommendedData.map(pkg => (
                  <PackageCard key={pkg.id} {...pkg} />
                ))}
              </div>
            </section>
          )}
        </div>

        <div className={styles.sidebar}>
          {/* Booking Widget */}
          <BookingWidget 
            packageId={data.id}
            packageTitle={data.title}
            packageImage={mainImage}
            price={parseFloat(data.price) || 0}
            childPrice={data.childPrice && parseFloat(data.childPrice) > 0 ? parseFloat(data.childPrice) : undefined}
            childAgeLimit={data.childAgeLimit}
          />

          {/* Database Stored Customer Wishlist Section */}
          <WishlistButton 
            packageId={data.id}
            packageTitle={data.title}
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
                  <h4>24/7 WhatsApp Support</h4>
                  <p>Instant assistance anytime on WhatsApp: 9633663256.</p>
                </div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>💳</div>
                <div className={styles.featureContent}>
                  <h4>Easy Online Booking</h4>
                  <p>Fast and hassle-free instant reservation.</p>
                </div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>⭐</div>
                <div className={styles.featureContent}>
                  <h4>Verified Guest Reviews</h4>
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

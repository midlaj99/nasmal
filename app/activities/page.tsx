import Link from 'next/link';
import ActivitiesFilter from '@/components/ActivitiesFilter';
import styles from './page.module.css';

const packages = [
  { id: 'aya-universe', title: 'AYA Universe', image: '/hero-bg.jpg', price: '99', rating: '4.5', reviewsCount: 12 },
  { id: 'miracle-garden', title: 'Dubai Miracle Garden', image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80', price: '85', rating: '5.0', reviewsCount: 340 },
  { id: 'img-worlds', title: 'IMG Worlds of Adventure Dubai', image: '/sharjah.jpg', price: '255', rating: '5.0', reviewsCount: 215 },
  { id: 'global-village', title: 'Global Village Dubai', image: '/hero-bg.jpg', price: '25', rating: '4.5', reviewsCount: 560 },
  { id: 'legoland', title: 'Legoland Dubai Waterpark', image: '/sharjah.jpg', price: '295', rating: '4.5', reviewsCount: 180 },
  { id: 'butterfly-garden', title: 'Dubai Butterfly Garden', image: '/hero-bg.jpg', price: '30', rating: '4.5', reviewsCount: 120 },
  { id: 'safari-park', title: 'Dubai Safari Park', image: '/sharjah.jpg', price: '50', rating: '4.5', reviewsCount: 430 },
  { id: 'aquaventure', title: 'Atlantis Aquaventure Waterpark', image: '/sharjah.jpg', price: '399', rating: '5.0', reviewsCount: 890 }
];

export default async function ActivitiesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams;
  const location = typeof resolvedSearchParams.location === 'string' ? resolvedSearchParams.location : 'Dubai';
  
  const formattedLocation = location.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link> / <Link href={`/destinations/${location}`}>{formattedLocation}</Link> / Activities
        </div>
        
        <ActivitiesFilter packages={packages} destinationName={formattedLocation} />
      </div>
    </main>
  );
}

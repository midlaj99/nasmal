import Image from 'next/image';
import Link from 'next/link';
import { getHighResImageUrl } from '@/lib/imageHelper';
import styles from './DestinationCard.module.css';

interface DestinationProps {
  title: string;
  image: string;
  toursCount: number;
}

export default function DestinationCard({ title, image, toursCount }: DestinationProps) {
  const safeImage = image?.startsWith('http') || image?.startsWith('/') ? image : '/hero-bg.jpg';
  const highResImage = getHighResImageUrl(safeImage, 'card');

  return (
    <Link href={`/destinations/${title.toLowerCase().replace(/\s+/g, '-')}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image 
          src={highResImage} 
          alt={title} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
          className={styles.image} 
          unoptimized={Boolean(highResImage && (highResImage.startsWith('/api/images') || highResImage.startsWith('data:')))}
        />
        <div className={styles.overlay}></div>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.tours}>{toursCount} Tours & Activities</span>
      </div>
    </Link>
  );
}

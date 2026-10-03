import Image from 'next/image';
import Link from 'next/link';
import styles from './PackageCard.module.css';

interface PackageProps {
  id: string;
  title: string;
  image: string;
  price: string;
  originalPrice?: string;
  rating: string;
  reviewsCount: number;
}

export default function PackageCard({ id, title, image, price, originalPrice, rating, reviewsCount }: PackageProps) {
  return (
    <Link href={`/packages/${id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className={styles.image} />
        {/* <div className={styles.badge}>Best Seller</div> */}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.ratingBox}>
          <span className={styles.star}>★</span>
          <span className={styles.rating}>{rating}</span>
          <span className={styles.reviews}>({reviewsCount} Reviews)</span>
        </div>
        <div className={styles.priceBox}>
          <span className={styles.from}>From</span>
          <div className={styles.prices}>
            {originalPrice && <span className={styles.originalPrice}>AED {originalPrice}</span>}
            <span className={styles.price}>AED {price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

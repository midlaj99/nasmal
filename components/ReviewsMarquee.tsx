import Image from 'next/image';
import styles from './ReviewsMarquee.module.css';

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
}

export default function ReviewsMarquee({ reviews }: { reviews: Review[] }) {
  // We duplicate the reviews array to create a seamless infinite loop
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeTrack}>
        {duplicatedReviews.map((review, idx) => (
          <div key={`${review.id}-${idx}`} className={styles.reviewCard}>
            <div className={styles.stars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < review.rating ? styles.starFilled : styles.starEmpty}>★</span>
              ))}
            </div>
            
            <p className={styles.comment}>"{review.comment}"</p>
            
            <div className={styles.author}>
              <div className={styles.avatarWrapper}>
                <Image src={review.avatar} alt={review.name} fill sizes="100px" className={styles.avatar} />
              </div>
              <div className={styles.authorInfo}>
                <h4 className={styles.name}>{review.name}</h4>
                <span className={styles.location}>{review.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

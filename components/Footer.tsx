import Image from 'next/image';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer id="footer" className={styles.footer}>
      <div className={`container ${styles.footerTop}`}>
        
        {/* Brand & Address */}
        <div className={styles.column}>
          <Link href="/" className={styles.logoWrapper}>
            <Image src="/logo-brand.png" alt="Nasmal Tourisms" width={180} height={60} className={styles.logo} />
          </Link>
          <p className={styles.description}>
            Experience the best of the UAE with Nasmal Tourisms. We provide premium packages, destination tours, and unforgettable experiences for travelers worldwide.
          </p>
          <div className={styles.contactItem}>
            <strong>Office Address:</strong>
            <p>123 Sheikh Zayed Road, <br/>Downtown Dubai, United Arab Emirates</p>
          </div>
        </div>

        {/* Site Links */}
        <div className={styles.column}>
          <h3 className={styles.title}>Site Links</h3>
          <ul className={styles.linkList}>
            <li><Link href="/" className={styles.link}>Home</Link></li>
            <li><Link href="#" className={styles.link}>Explore Destinations</Link></li>
            <li><Link href="#" className={styles.link}>Popular Packages</Link></li>
            <li><Link href="#" className={styles.link}>About Us</Link></li>
            <li><Link href="#" className={styles.link}>Contact Us</Link></li>
            <li><Link href="#" className={styles.link}>Help Center</Link></li>
          </ul>
        </div>

        {/* Enquiry & Office Timings */}
        <div className={styles.column}>
          <h3 className={styles.title}>Enquiry & Support</h3>
          <div className={styles.contactItem}>
            <strong>Email Us:</strong>
            <p><a href="mailto:info@nasmaltourism.com" className={styles.link}>info@nasmaltourism.com</a></p>
          </div>
          <div className={styles.contactItem}>
            <strong>Call Us:</strong>
            <p><a href="tel:+971501234567" className={styles.link}>+971 50 123 4567</a></p>
          </div>
          <div className={styles.contactItem}>
            <strong>Office Timings:</strong>
            <p>Monday - Saturday: 9:00 AM - 6:00 PM<br/>Sunday: Closed</p>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className={styles.footerBottom}>
        <div className={`container ${styles.bottomContainer}`}>
          <p className={styles.copyright}>&copy; {new Date().getFullYear()} Nasmal Tourisms. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <Link href="#" className={styles.legalLink}>Terms & Conditions</Link>
            <Link href="#" className={styles.legalLink}>Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

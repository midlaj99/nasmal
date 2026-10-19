import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer id="footer" className={styles.footer}>
      <div className={`container ${styles.footerTop}`}>
        
        {/* Brand & Address */}
        <div className={styles.column}>
          <h3 className={styles.title}>Nasmal Tourisms</h3>
          <p className={styles.description}>
            Experience the best of the UAE with Nasmal Tourisms. We provide premium packages, destination tours, and unforgettable experiences for travelers worldwide.
          </p>
          <div className={styles.contactItem}>
            <strong>Office Address:</strong>
            <p>
              Building Name/No 3170233 AL MANKHOOL - 401<br/>
              Bur Dubai, Dubai<br/>
              UAE
            </p>
          </div>
        </div>

        {/* Site Links */}
        <div className={styles.column}>
          <h3 className={styles.title}>Site Links</h3>
          <ul className={styles.linkList}>
            <li><Link href="/" className={styles.link}>Home</Link></li>
            <li><Link href="/destinations" className={styles.link}>Destinations</Link></li>
            <li><Link href="/activities" className={styles.link}>All Activities</Link></li>
            <li><Link href="/booked-packages" className={styles.link}>Booked Packages</Link></li>
            <li><Link href="/wishlist" className={styles.link}>My Wishlist</Link></li>
            <li><Link href="/contact" className={styles.link}>Contact Us</Link></li>
          </ul>
        </div>

        {/* Terms and Conditions & Privacy Policy */}
        <div className={styles.column}>
          <h3 className={styles.title}>Legal</h3>
          <ul className={styles.linkList}>
            <li><Link href="/terms-and-conditions" className={styles.link}>Terms & Conditions</Link></li>
            <li><Link href="/privacy-policy" className={styles.link}>Privacy Policy</Link></li>
            <li><Link href="/privacy-policy#cookies" className={styles.link}>Cookie Policy</Link></li>
          </ul>
        </div>

        {/* Enquiry & Office Timings */}
        <div className={styles.column}>
          <h3 className={styles.title}>Enquiry & Support</h3>
          <div className={styles.contactItem}>
            <strong>Email:</strong>
            <p><a href="mailto:Nasmaltourism@gmail.com" className={styles.link}>Nasmaltourism@gmail.com</a></p>
          </div>
          <div className={styles.contactItem}>
            <strong>Contact / Call:</strong>
            <p><a href="tel:+971582659321" className={styles.link}>+971 582659321</a></p>
          </div>
          {/* <div className={styles.contactItem}>
            <strong>WhatsApp:</strong>
            <p><a href="https://wa.me/971582659321" target="_blank" rel="noopener noreferrer" className={styles.link}>+971 582659321</a></p>
          </div>
          <div className={styles.contactItem}>
            <strong>Instagram:</strong>
            <p><a href="http://instagram.com/Tours_in_dubai" target="_blank" rel="noopener noreferrer" className={styles.link}>@Tours_in_dubai</a></p>
          </div> */}
          <div className={styles.contactItem}>
            <strong>Office Timings:</strong>
            <p>9:00 AM - 9:00 PM<br/>Monday to Sunday</p>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className={styles.footerBottom}>
        <div className={`container ${styles.bottomContainer}`}>
          <p className={styles.copyright}>&copy; 2026 Nasmal Tourisms. All rights reserved.</p>
          <div className={styles.socialIcons}>
            <a 
              href="https://wa.me/971582659321" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="WhatsApp" 
              className={`${styles.socialIcon} ${styles.whatsappIcon}`}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.073.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.392-10.416c-5.514 0-10 4.486-10 10 0 1.846.505 3.578 1.385 5.071l-1.424 5.201 5.347-1.403c1.436.819 3.09 1.283 4.692 1.283 5.514 0 10-4.486 10-10s-4.486-10-10-10z"/>
              </svg>
            </a>
            <a 
              href="http://instagram.com/Tours_in_dubai" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram" 
              className={`${styles.socialIcon} ${styles.instagramIcon}`}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

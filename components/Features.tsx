// import styles from './Features.module.css';

// const features = [
//   {
//     title: 'Best Price Guarantee',
//     desc: 'Discover the Top Attractions at unbeatable Prices.',
//     icon: <><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>
//   },
//   {
//     title: '24/7 Live Chat Support',
//     desc: 'Get instant support with our round-the-clock customer service.',
//     icon: <><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></>
//   },
//   {
//     title: 'Exploring Made Easy',
//     desc: 'Book last minute, skip lines & get free cancellation for easier exploring.',
//     icon: <><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><path d="M12 18h.01" /></>
//   },
//   {
//     title: 'Secure Online Transaction',
//     desc: 'Shop securely with our advanced online Protection.',
//     icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></>
//   },
//   {
//     title: 'Reviews & Ratings',
//     desc: 'Explore experiences through trusted guest reviews.',
//     icon: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>
//   }
// ];

// export default function Features() {
//   return (
//     <div className={styles.featuresWrapper}>
//       <div className={`container ${styles.featuresContainer}`}>
//         {features.map((feat, idx) => (
//           <div key={idx} className={styles.featureItem}>
//             <div className={styles.iconBox}>
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 {feat.icon}
//               </svg>
//             </div>
//             <div className={styles.textContent}>
//               <h4 className={styles.title}>{feat.title}</h4>
//               <p className={styles.desc}>{feat.desc}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

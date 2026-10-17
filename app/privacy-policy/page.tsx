import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
  title: 'Privacy Policy | Nasmal Tourisms',
  description: 'Learn how Nasmal Tourisms protects and handles your personal information and privacy.',
};

export default function PrivacyPolicyPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
        <Breadcrumb
          variant="light"
          separator=">"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Privacy Policy' },
          ]}
        />

        <div style={{ marginTop: '28px', marginBottom: '40px' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '2px', color: '#047857', textTransform: 'uppercase' }}>
            YOUR PRIVACY MATTERS
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#0f172a', marginTop: '8px', marginBottom: '12px' }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            Last Updated: January 2026 &bull; Nasmal Tourisms LLC, Dubai, UAE
          </p>
        </div>

        <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '16px' }}>
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>1. Information We Collect</h2>
            <p>
              When booking tours or interacting with our platform, we collect personal details including your name, email address, phone number, booking preferences, and payment verification details required to process reservations.
            </p>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>2. How We Use Your Information</h2>
            <p>
              Your information is strictly utilized to process tour reservations, send instant digital vouchers, provide customer service updates, and ensure compliance with local UAE tourism authority regulations. We never sell or rent your personal information to third parties.
            </p>
          </section>

          <section id="cookies" style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>3. Cookies & Tracking Technologies</h2>
            <p>
              We use functional session cookies to remember your travel dates, wishlist items, and language preferences. These cookies enhance performance and personalize your exploration experience across the Emirates.
            </p>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>4. Data Security</h2>
            <p>
              We implement industry-grade SSL encryption and security controls to safeguard your transaction and booking records against unauthorized access, loss, or disclosure.
            </p>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>5. Contact Our Privacy Officer</h2>
            <p>
              For inquiries regarding data privacy or to request information updates, contact <a href="mailto:Nasmaltourism@gmail.com" style={{ color: '#047857', fontWeight: 600 }}>Nasmaltourism@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

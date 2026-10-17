import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
  title: 'Terms & Conditions | Nasmal Tourisms',
  description: 'Terms and conditions for booking tours and experiences with Nasmal Tourisms in the UAE.',
};

export default function TermsAndConditionsPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
        <Breadcrumb
          variant="light"
          separator=">"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Terms & Conditions' },
          ]}
        />

        <div style={{ marginTop: '28px', marginBottom: '40px' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '2px', color: '#047857', textTransform: 'uppercase' }}>
            LEGAL INFORMATION
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#0f172a', marginTop: '8px', marginBottom: '12px' }}>
            Terms & Conditions
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            Last Updated: January 2026 &bull; Nasmal Tourisms LLC, Dubai, UAE
          </p>
        </div>

        <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '16px' }}>
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>1. Introduction</h2>
            <p>
              Welcome to Nasmal Tourisms. By accessing our website, browsing our curated experiences, or booking tours and activities across Dubai and the United Arab Emirates, you agree to comply with and be bound by the following terms and conditions.
            </p>
          </section>

          <section id="booking-policy" style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>2. Booking & Confirmation</h2>
            <p>
              All bookings made through Nasmal Tourisms are subject to availability and confirmation. A booking is considered confirmed once payment is authorized and a confirmation voucher with your booking reference is issued.
            </p>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>3. Health & Safety Guidelines</h2>
            <p>
              Certain adventure tours (such as dune bashing, skydiving, or water sports) have age, pregnancy, or physical fitness restrictions. Guests are responsible for reviewing safety advisories before participating in specialized excursions.
            </p>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>4. Contact Us</h2>
            <p>
              If you have any questions regarding these terms, please contact our support team at <a href="mailto:Nasmaltourism@gmail.com" style={{ color: '#047857', fontWeight: 600 }}>Nasmaltourism@gmail.com</a> or call <a href="tel:+971582659321" style={{ color: '#047857', fontWeight: 600 }}>+971 582659321</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

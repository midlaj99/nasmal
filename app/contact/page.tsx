import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us | Nasmal Tourisms Dubai',
  description: 'Get in touch with Nasmal Tourisms. Send us an enquiry for booking packages, customized tours, or feedback. We are here to help 24/7.',
  keywords: [
    'Nasmal Tourisms Contact',
    'Dubai tour booking enquiry',
    'UAE holiday packages',
    'Dubai desert safari booking',
    'Dubai tourism support',
  ],
  openGraph: {
    title: 'Contact Us | Nasmal Tourisms Dubai',
    description: 'Get in touch with Nasmal Tourisms for tour bookings, customized packages, and travel support in Dubai & UAE.',
    url: 'https://nasmaltourisms.com/contact',
    siteName: 'Nasmal Tourisms',
    locale: 'en_US',
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}

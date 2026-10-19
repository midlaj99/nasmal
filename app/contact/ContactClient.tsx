'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './contact.module.css';

interface FormState {
  fullname: string;
  phone: string;
  email: string;
  enquiryType: string;
  message: string;
}

const INITIAL_FORM: FormState = {
  fullname: '',
  phone: '',
  email: '',
  enquiryType: 'Booking',
  message: '',
};

export default function ContactClient() {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    id: string;
    fullname: string;
    enquiryType: string;
  } | null>(null);

  // Accordion open states (first one open by default, user can toggle any)
  const [openFaqs, setOpenFaqs] = useState<{ [key: number]: boolean }>({
    0: true,
    1: false,
    2: false,
    3: false,
  });

  const toggleFaq = (index: number) => {
    setOpenFaqs(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errorMsg) setErrorMsg(null);
  };

  const handleSelectType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      enquiryType: type,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.fullname.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg('Please enter your phone number.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 5) {
      setErrorMsg('Please enter a message with at least 5 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry. Please try again.');
      }

      setSubmittedData({
        id: data.enquiry?.id || `ENQ-${Date.now().toString().slice(-6)}`,
        fullname: formData.fullname,
        enquiryType: formData.enquiryType,
      });
      setFormData(INITIAL_FORM);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please check your connection or contact us via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmittedData(null);
    setFormData(INITIAL_FORM);
    setErrorMsg(null);
  };

  return (
    <main className={styles.pageWrapper}>
      {/* ============================================================
          1. HERO SECTION (DESTINATION PAGE STYLE)
          ============================================================ */}
      <div className={styles.hero}>
        <Image
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=2400&q=85"
          alt="Contact Nasmal Tourisms"
          fill
          sizes="100vw"
          className={styles.heroImage}
          priority
        />
        <div className={styles.heroOverlay} />

        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            {/* Top Breadcrumb Navigation */}
            <div className={styles.breadcrumbWrapper}>
              <Breadcrumb
                variant="dark"
                separator=">"
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Contact Us' },
                ]}
              />
            </div>
            
            <span className={styles.eyebrow}>DREAM &bull; EXPLORE &bull; DISCOVER</span>
            <h1 className={styles.heroTitle}>
              Get in <span className={styles.highlightText}>Touch</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Please contact us to make lifetime memories with unforgettable travel experiences!
            </p>
          </div>
        </div>

        {/* Fluid wave divider matching page body background */}
        <div className={styles.waveDivider}>
          <svg 
            viewBox="0 0 1440 90" 
            preserveAspectRatio="none" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={styles.waveSvg}
          >
            <path 
              d="M0,40 C320,75 580,15 880,48 C1140,75 1320,32 1440,38 L1440,90 L0,90 Z" 
              fill="#f6f8fa" 
            />
          </svg>
        </div>
      </div>

      {/* ============================================================
          CONTAINER FOR MAIN STACKED CONTENT CARDS
          ============================================================ */}
      <div className={styles.contentContainer}>
        {/* ============================================================
            2. CARD 1: SEND US AN ENQUIRY
            ============================================================ */}
        <section className={styles.card} aria-labelledby="enquiry-card-heading">
          <div className={styles.cardHeaderWithIcon}>
            <div className={styles.greenCircleBadge}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div>
              <h2 id="enquiry-card-heading" className={styles.cardTitle}>
                Send Us an Enquiry
              </h2>
              <p className={styles.cardSubtitle}>
                Complete the form below and our team will get back to you promptly.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className={styles.errorBanner} role="alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {submittedData ? (
            <div className={styles.successCard}>
              <div className={styles.successIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#047857', marginBottom: '8px' }}>
                Enquiry Received!
              </h3>
              <p style={{ color: '#475569', fontSize: '14.5px', maxWidth: '460px', margin: '0 auto 20px auto', lineHeight: '1.6' }}>
                Thank you, <strong>{submittedData.fullname}</strong>. Reference <strong>#{submittedData.id}</strong> has been logged for your <strong>{submittedData.enquiryType}</strong> enquiry. Our travel specialist will reach out shortly.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className={styles.callPillBtn}
                style={{ margin: '0 auto', border: '1px solid #cbd5e1' }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.formGrid}>
                {/* Left Column */}
                <div className={styles.formCol}>
                  {/* Full Name */}
                  <div className={styles.formField}>
                    <label htmlFor="fullname" className={styles.fieldLabel}>
                      Full Name <span className={styles.requiredStar}>*</span>
                    </label>
                    <div className={styles.inputBox}>
                      <span className={styles.inputIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </span>
                      <input
                        type="text"
                        id="fullname"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        className={styles.textInput}
                        required
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className={styles.formField}>
                    <label htmlFor="email" className={styles.fieldLabel}>
                      Email Address <span className={styles.requiredStar}>*</span>
                    </label>
                    <div className={styles.inputBox}>
                      <span className={styles.inputIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </svg>
                      </span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        className={styles.textInput}
                        required
                      />
                    </div>
                  </div>

                  {/* Enquiry Type: 3 Visual Chips */}
                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>
                      Enquiry Type <span className={styles.requiredStar}>*</span>
                    </label>
                    <div className={styles.enquiryChipsGrid}>
                      {/* 1. Booking */}
                      <button
                        type="button"
                        onClick={() => handleSelectType('Booking')}
                        className={`${styles.enquiryChipBtn} ${
                          formData.enquiryType === 'Booking' ? styles.enquiryChipActive : ''
                        }`}
                      >
                        {formData.enquiryType === 'Booking' && (
                          <span className={styles.chipCheckBadge}>✓</span>
                        )}
                        <span className={styles.enquiryChipEmoji}>🎫</span>
                        <span className={styles.enquiryChipTitle}>Booking</span>
                        <span className={styles.enquiryChipSub}>Tour &amp; Ticket</span>
                      </button>

                      {/* 2. Package */}
                      <button
                        type="button"
                        onClick={() => handleSelectType('Package')}
                        className={`${styles.enquiryChipBtn} ${
                          formData.enquiryType === 'Package' ? styles.enquiryChipActive : ''
                        }`}
                      >
                        {formData.enquiryType === 'Package' && (
                          <span className={styles.chipCheckBadge}>✓</span>
                        )}
                        <span className={styles.enquiryChipEmoji}>💼</span>
                        <span className={styles.enquiryChipTitle}>Package</span>
                        <span className={styles.enquiryChipSub}>Custom Tours</span>
                      </button>

                      {/* 3. Feedback */}
                      <button
                        type="button"
                        onClick={() => handleSelectType('Feedback')}
                        className={`${styles.enquiryChipBtn} ${
                          formData.enquiryType === 'Feedback' ? styles.enquiryChipActive : ''
                        }`}
                      >
                        {formData.enquiryType === 'Feedback' && (
                          <span className={styles.chipCheckBadge}>✓</span>
                        )}
                        <span className={styles.enquiryChipEmoji}>👍</span>
                        <span className={styles.enquiryChipTitle}>Feedback</span>
                        <span className={styles.enquiryChipSub}>Reviews &amp; Suggestions</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className={styles.formCol}>
                  {/* Phone Number */}
                  <div className={styles.formField}>
                    <label htmlFor="phone" className={styles.fieldLabel}>
                      Phone Number <span className={styles.requiredStar}>*</span>
                    </label>
                    <div className={styles.inputBox}>
                      <span className={styles.inputIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </span>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+971 58 265 9321"
                        className={styles.textInput}
                        required
                      />
                    </div>
                  </div>

                  {/* Your Message (Spanning remaining height) */}
                  <div className={`${styles.formField} ${styles.messageBoxWrapper}`}>
                    <label htmlFor="message" className={styles.fieldLabel}>
                      Your Message <span className={styles.requiredStar}>*</span>
                    </label>
                    <div className={styles.textareaBox}>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your tour preferences, travel dates, party size, custom package needs, or share your valuable feedback..."
                        className={styles.textareaInput}
                        required
                      />
                    </div>
                    <span className={styles.messageNote}>
                      Please share as much details as possible.
                    </span>
                  </div>
                </div>
              </div>

              {/* Full Width Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={styles.submitFullBtn}
                id="contact-submit-btn"
              >
                {loading ? (
                  <>
                    <span className={styles.spinner}></span>
                    <span>Submitting Message...</span>
                  </>
                ) : (
                  <>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    <span>Submit Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </section>


        {/* ============================================================
            4. CARD 3: "CONTACT DETAILS"
            ============================================================ */}
        <section className={styles.card} aria-labelledby="details-heading">
          <div className={styles.detailsHeader}>
            <span className={styles.detailsHeaderIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </span>
            <h2 id="details-heading" className={styles.cardTitle} style={{ margin: 0 }}>
              Contact Details
            </h2>
          </div>

          <div className={styles.detailsGrid}>
            {/* 1. Head Office */}
            <div className={styles.detailItem}>
              <div className={styles.detailIconBox}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className={styles.detailContent}>
                <div className={styles.detailLabel}>Head Office</div>
                <div className={styles.detailValue}>
                  Building No. 3170233, AL MANKHOOL - 401{'\n'}
                  Bur Dubai, Dubai, UAE
                </div>
              </div>
            </div>

            {/* 2. Email */}
            <div className={styles.detailItem}>
              <div className={styles.detailIconBox}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
              </div>
              <div className={styles.detailContent}>
                <div className={styles.detailLabel}>Email</div>
                <div className={styles.detailValue}>
                  <a href="mailto:nasmaltourism@gmail.com" className={styles.detailLink}>
                    nasmaltourism@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* 3. Phone / Support */}
            <div className={styles.detailItem}>
              <div className={styles.detailIconBox}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className={styles.detailContent}>
                <div className={styles.detailLabel}>Phone / Support</div>
                <div className={styles.detailValue}>
                  <a href="tel:+971582659321" className={styles.detailLink}>
                    +971 582659321
                  </a>
                </div>
              </div>
            </div>

            {/* 4. Working Hours */}
            <div className={styles.detailItem}>
              <div className={styles.detailIconBox}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className={styles.detailContent}>
                <div className={styles.detailLabel}>Working Hours</div>
                <div className={styles.detailValue}>
                  9:00 AM - 9:00 PM (GST){'\n'}
                  Monday to Sunday (UAE Local Time)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            5. CARD 4: "OUR DUBAI LOCATION"
            ============================================================ */}
        <section className={styles.card} aria-labelledby="location-heading">
          <div className={styles.locationHeader}>
            <div className={styles.locationTitleGroup}>
              <span style={{ color: '#047857', display: 'flex' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                  <line x1="12" y1="18" x2="12.01" y2="18"></line>
                </svg>
              </span>
              <h2 id="location-heading" className={styles.locationTitle}>
                Our Dubai Location
              </h2>
            </div>

            <a
              href="https://maps.google.com/?q=Al+Mankhool+Bur+Dubai+UAE"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viewInMapsLink}
            >
              <span>View in Maps</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>

          <div className={styles.locationGrid}>
            {/* Embedded Google Map */}
            <div className={styles.mapGraphicContainer}>
              <iframe
                title="Nasmal Dubai Map Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14434.565943195203!2d55.2945853!3d25.24899755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43222e37f797%3A0xf13f19b46d20ffea!2sMankhool%20-%20Dubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sin!4v1792401093362!5m2!1sen!2sin"
                className={styles.mapIframe}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>

            {/* Location Address & Accessibility Info */}
            <div className={styles.locationInfoList}>
              <div className={styles.locationItem}>
                <span className={styles.locationItemIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </span>
                <span className={styles.locationItemText}>
                  Building No. 3170233, AL MANKHOOL - 401{'\n'}
                  Bur Dubai, Dubai, UAE
                </span>
              </div>

              <div className={styles.locationItem}>
                <span className={styles.locationItemIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="3" width="16" height="18" rx="2"></rect>
                    <line x1="9" y1="9" x2="15" y2="9"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                  </svg>
                </span>
                <span className={styles.locationItemText}>
                  Easy to reach from major landmarks and metro stations.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            6. FAQ SECTION
            ============================================================ */}
        <section className={styles.faqSection} aria-labelledby="faq-main-heading">
          <div className={styles.faqHeader}>
            <div className={styles.faqCategoryTag}>FREQUENTLY ASKED QUESTIONS</div>
            <h2 id="faq-main-heading" className={styles.faqMainTitle}>
              Quick Answers to Common Questions
            </h2>
            <p className={styles.faqSubTitle}>
              Find quick answers to your most common questions about tours, reservations, and customer support.
            </p>
          </div>

          <div className={styles.faqList}>
            {/* FAQ 1 */}
            <div className={styles.faqCard}>
              <button
                type="button"
                className={styles.faqTrigger}
                onClick={() => toggleFaq(0)}
                aria-expanded={Boolean(openFaqs[0])}
              >
                <div className={styles.faqTriggerLeft}>
                  <div className={styles.faqIconCircle}>?</div>
                  <span className={styles.faqQuestionText}>
                    How fast will I receive a confirmation for my booking?
                  </span>
                </div>
                <svg
                  className={`${styles.faqChevron} ${openFaqs[0] ? styles.faqChevronOpen : ''}`}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              {openFaqs[0] && (
                <div className={styles.faqBody}>
                  Most bookings receive instant confirmation via email. Confirmations with digital vouchers for additional packages or special requests, will be sent within 24 hours during operating hours.
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className={styles.faqCard}>
              <button
                type="button"
                className={styles.faqTrigger}
                onClick={() => toggleFaq(1)}
                aria-expanded={Boolean(openFaqs[1])}
              >
                <div className={styles.faqTriggerLeft}>
                  <div className={styles.faqIconCircle}>?</div>
                  <span className={styles.faqQuestionText}>
                    Can I customize a package for private groups or families?
                  </span>
                </div>
                <svg
                  className={`${styles.faqChevron} ${openFaqs[1] ? styles.faqChevronOpen : ''}`}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              {openFaqs[1] && (
                <div className={styles.faqBody}>
                  Absolutely! Select &ldquo;Package&rdquo; as your enquiry type above or contact us directly on WhatsApp. We design bespoke itineraries that fit any group size, from families to private charters, and make your Dubai experience memorable.
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className={styles.faqCard}>
              <button
                type="button"
                className={styles.faqTrigger}
                onClick={() => toggleFaq(2)}
                aria-expanded={Boolean(openFaqs[2])}
              >
                <div className={styles.faqTriggerLeft}>
                  <div className={styles.faqIconCircle}>?</div>
                  <span className={styles.faqQuestionText}>
                    Where does hotel pick-up take place for Dubai activities?
                  </span>
                </div>
                <svg
                  className={`${styles.faqChevron} ${openFaqs[2] ? styles.faqChevronOpen : ''}`}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              {openFaqs[2] && (
                <div className={styles.faqBody}>
                  We provide seamless pick-up from major hotels and key locations in Dubai, including Deira, Bur Dubai, Sheikh Zayed Road, Marina and Jumeirah. Exact pick-up time and details will be shared after confirmation.
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div className={styles.faqCard}>
              <button
                type="button"
                className={styles.faqTrigger}
                onClick={() => toggleFaq(3)}
                aria-expanded={Boolean(openFaqs[3])}
              >
                <div className={styles.faqTriggerLeft}>
                  <div className={styles.faqIconCircle}>?</div>
                  <span className={styles.faqQuestionText}>
                    What is your cancellation and rescheduling policy?
                  </span>
                </div>
                <svg
                  className={`${styles.faqChevron} ${openFaqs[3] ? styles.faqChevronOpen : ''}`}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              {openFaqs[3] && (
                <div className={styles.faqBody}>
                  Free cancellation is available up to 24 hours prior to the scheduled start time. For full details, please review our <Link href="/terms-and-conditions" style={{ color: '#047857', fontWeight: 600 }}>Terms &amp; Conditions</Link>.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

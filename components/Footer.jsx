'use client';

import { useState } from 'react';
import styles from './Footer.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Phone, Mail as MailIcon } from 'lucide-react';

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 4000);
      } else {
        setError(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch {
      setError('Unable to subscribe. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className={styles.footer}>

      {/* Top decorative line */}
      <div className={styles.topLine} />

      <div className={styles.footerInner}>

        {/* Brand Column */}
        <div className={styles.brandSection}>
          <Image
            src="/images/avlogo.JPG"
            alt="Activerse Logo"
            width={160}
            height={44}
            className={styles.logo}
          />
          <p className={styles.brandDesc}>
            Six games. One wristband. Zero chairs.<br />
            The future of physical gaming.
          </p>
          <div className={styles.socialRow}>
            <a
              href="https://www.instagram.com/activerse_gurgaon?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialBtn}
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialBtn}
              aria-label="X / Twitter"
            >
              <TwitterIcon />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialBtn}
              aria-label="YouTube"
            >
              <YoutubeIcon />
            </a>
          </div>
        </div>

        {/* Explore Column */}
        <div className={styles.navColumn}>
          <h4 className={styles.colTitle}>Explore</h4>
          <a href="/#hero" className={styles.navLink}>Home</a>
          <a href="/#games" className={styles.navLink}>Our Games</a>
          <a href="/#reviews" className={styles.navLink}>Reviews</a>
          <Link href="/scores-and-rewards" className={styles.navLink}>Scores &amp; Rewards</Link>
          <a href="/#booking" className={`${styles.navLink} ${styles.bookNowRed}`}>Book Now</a>
        </div>

        {/* Visit Us Column */}
        <div className={styles.contactColumn}>
          <h4 className={styles.colTitle}>Visit Us</h4>
          <div className={styles.contactRow}>
            <MapPin size={16} />
            <span>Lower Ground floor, F11, 16&amp;17, Golf Course Rd, DLF Phase 1, Sector 27, Gurugram, Haryana 122002</span>
          </div>
          <div className={styles.contactRow}>
            <Clock size={16} />
            <span>Mon-Sun : 11:00am - 10:00pm</span>
          </div>
          <div className={styles.contactRow}>
            <Phone size={16} />
            <a href="tel:+919729729347">+91 9729729347</a>
          </div>
          <div className={styles.contactRow}>
            <MailIcon size={16} />
            <a href="mailto:Activersepvtltd@gmail.com">Activersepvtltd@gmail.com</a>
          </div>
        </div>

        {/* Newsletter Column */}
        <div className={styles.newsletterSection}>
          <h4 className={styles.colTitle}>Stay in the Grid</h4>
          <p className={styles.brandDesc}>
            Get notified about new arenas, events, and exclusive rewards.
          </p>
          {subscribed ? (
            <div className={styles.successMsg}>
              ✓ You're in. See you in the arena.
            </div>
          ) : (
            <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={styles.emailInput}
                required
                disabled={isSubmitting}
              />
              <button type="submit" className={styles.joinBtn} disabled={isSubmitting}>
                {isSubmitting ? '...' : 'Join'}
              </button>
            </form>
          )}
          {error && <div className={styles.errorMsg}>{error}</div>}
        </div>

      </div>

      {/* Footer Bottom Bar */}
      <div className={styles.bottomBar}>
        <span className={styles.copyright}>© 2026 Activerse. All rights reserved.</span>
        <div className={styles.legalLinks}>
          <Link href="/faq" className={styles.legalLink}>FAQ</Link>
          <span className={styles.divider}>|</span>
          <Link href="/privacy-policy" className={styles.legalLink}>Privacy Policy</Link>
          <span className={styles.divider}>|</span>
          <Link href="/terms-conditions" className={styles.legalLink}>Terms</Link>
          <span className={styles.divider}>|</span>
          <Link href="/cancellation-refund" className={styles.legalLink}>Cancellation &amp; Refund</Link>
          <span className={styles.divider}>|</span>
          <Link href="/shipping-policy" className={styles.legalLink}>Shipping Policy</Link>
        </div>
      </div>

    </footer>
  );
}

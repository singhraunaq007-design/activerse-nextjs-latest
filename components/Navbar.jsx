'use client';

import { useState } from 'react';
import styles from './Navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Smooth scroll handler for internal links
  const handleNavClick = (e, href) => {
    if (href.startsWith('/#')) {
      const targetId = href.split('#')[1];
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
      closeMenu();
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <Image 
            src="/images/avlogo.JPG" 
            alt="Activerse Logo" 
            width={225} 
            height={60} 
            className={styles.logo}
            priority
          />
        </Link>
      </div>

      {/* Hamburger Toggle */}
      <button 
        className={`${styles.hamburger} ${isOpen ? styles.hamburgerActive : ''}`} 
        onClick={toggleMenu}
        aria-label="Toggle Navigation Menu"
      >
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </button>

      {/* Nav Links */}
      <div className={`${styles.navLinks} ${isOpen ? styles.navLinksActive : ''}`}>
        <Link href="/#hero" className={styles.navItem} onClick={(e) => handleNavClick(e, '/#hero')}>Home</Link>
        <Link href="/#games" className={styles.navItem} onClick={(e) => handleNavClick(e, '/#games')}>Our Games</Link>
        <Link href="/#reviews" className={styles.navItem} onClick={(e) => handleNavClick(e, '/#reviews')}>Reviews</Link>
        <Link href="/scores-and-rewards" className={styles.navItem} onClick={closeMenu}>Scores & Rewards</Link>
        <Link href="/#booking" className={`${styles.navItem} ${styles.bookingBtn}`} onClick={(e) => handleNavClick(e, '/#booking')}>Booking</Link>
      </div>
    </nav>
  );
}

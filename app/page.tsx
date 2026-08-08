'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Michroma, Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import HeroScene from '@/components/HeroScene';
import PremiumGamesGallery from '@/components/PremiumGamesGallery';
import Reviews from '@/components/Reviews';
import About from '@/components/About';
import MarqueeStrip from '@/components/MarqueeStrip';
import Booking from '@/components/Booking';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import styles from './page.module.css';

const michroma = Michroma({
  variable: '--font-michroma',
  subsets: ['latin'],
  weight: ['400'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export default function Home() {
  useEffect(() => {
    // Handle hash navigation when coming from other pages
    const handleHashNavigation = () => {
      if (window.location.hash) {
        const hash = window.location.hash;
        if (hash.length > 1) {
          setTimeout(() => {
            try {
              const element = document.querySelector(hash);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            } catch (error) {
              console.warn('Invalid hash selector:', hash);
            }
          }, 100);
        }
      }
    };

    handleHashNavigation();
    window.addEventListener('hashchange', handleHashNavigation);

    return () => {
      window.removeEventListener('hashchange', handleHashNavigation);
    };
  }, []);

  return (
    <main className={`${michroma.variable} ${inter.variable} ${styles.siteRoot}`}>
      <CustomCursor />
      <Navbar />
      <HeroScene />
      <PremiumGamesGallery />
      <Reviews />
      <About />
      <MarqueeStrip />
      <Booking />
      <Footer />

      {/* Admin Login Button (matches live site, recolored to the new palette) */}
      <Link
        href="/login"
        className="fixed bottom-5 right-5 bg-[#f9004d] text-white p-4 rounded-full no-underline z-[999] shadow-[0_5px_20px_rgba(249,0,77,0.4)] hover:scale-110 hover:shadow-[0_8px_30px_rgba(249,0,77,0.6)] transition-all duration-300"
        title="Admin Login"
      >
        🔐
      </Link>
    </main>
  );
}

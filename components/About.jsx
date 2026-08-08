'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import styles from './About.module.css';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const wordsRef = useRef([]);
  const subtextRef = useRef(null);
  const imagesRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;

    // Animate words lighting up as you scroll down
    gsap.to(wordsRef.current, {
      scrollTrigger: {
        trigger: section,
        start: "top center",
        end: "center center",
        scrub: 0.5,
      },
      color: "var(--color-activerse-red)",
      textShadow: "0 0 40px rgba(249, 0, 77, 0.6)",
      stagger: 0.1,
    });

    // Fade in the subtext when the headline is fully lit
    gsap.to(subtextRef.current, {
      scrollTrigger: {
        trigger: section,
        start: "center center",
        end: "bottom center",
        scrub: false,
        toggleActions: "play none none reverse"
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    });

    // Parallax floating gameplay images
    imagesRef.current.forEach((img, i) => {
      gsap.fromTo(img,
        { y: 100, opacity: 0 },
        {
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1 + (i * 0.5), // Different speeds for parallax
          },
          y: -100 - (i * 50),
          opacity: 0.6,
          ease: "none"
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // Split headline for individual word animation
  const headlineWords = ["THE", "FUTURE", "IS", "PHYSICAL."];

  const addToRefs = (el) => {
    if (el && !wordsRef.current.includes(el)) {
      wordsRef.current.push(el);
    }
  };

  return (
    <section ref={sectionRef} className={styles.aboutSection}>
      <div className={styles.textContainer}>
        <h2 className={styles.headline}>
          {headlineWords.map((word, i) => (
            <span key={i} ref={addToRefs} className={styles.word}>
              {word}
            </span>
          ))}
        </h2>
        <p ref={subtextRef} className={styles.subtext}>
          We believe the next generation of gaming isn't sitting on a couch with a controller.
          It's intense, it's tactile, and it demands your sweat. Activerse is a sprawling
          arena of custom-built, tech-driven challenges.
        </p>
      </div>

      {/* Floating Gameplay Images */}
      <div className={`${styles.floatingImg} ${styles.img1}`} ref={el => imagesRef.current[0] = el}>
        <Image src="/images/BattleArena.jpeg" alt="Battle Arena Gameplay" fill style={{objectFit: 'cover'}} />
      </div>
      <div className={`${styles.floatingImg} ${styles.img2}`} ref={el => imagesRef.current[1] = el}>
        <Image src="/images/LaserEscape.jpeg" alt="Laser Escape Gameplay" fill style={{objectFit: 'cover'}} />
      </div>
      <div className={`${styles.floatingImg} ${styles.img3}`} ref={el => imagesRef.current[2] = el}>
        <Image src="/images/Megagrid.jpeg" alt="Mega Grid Gameplay" fill style={{objectFit: 'cover'}} />
      </div>
    </section>
  );
}

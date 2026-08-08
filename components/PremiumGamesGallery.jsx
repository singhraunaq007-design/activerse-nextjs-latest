'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import styles from './PremiumGamesGallery.module.css';

const gamesData = [
  {
    id: "laser",
    title: "Laser Escape",
    desc: "The room turns into a maze of beams. Duck, crawl, twist your way through. Speed and agility are your only weapons.",
    image: "/images/LaserEscape.jpeg",
    glowColor: "#39ff14",
    glowShadow: "rgba(57, 255, 20, 0.5)"
  },
  {
    id: "grid",
    title: "Mega Grid",
    desc: "Chase the blue. Avoid the red. Stay safe on the green. Simple rules, brutal cardio. The floor is lava, literally.",
    image: "/images/Megagrid.jpeg",
    glowColor: "#f9004d",
    glowShadow: "rgba(249, 0, 77, 0.5)"
  },
  {
    id: "shoot",
    title: "Air Shoot",
    desc: "Test your aim and coordination under intense pressure. A fusion of physical stamina and digital precision.",
    image: "/images/Airshoot.jpeg",
    glowColor: "#ffb300",
    glowShadow: "rgba(255, 179, 0, 0.5)"
  },
  {
    id: "arena",
    title: "Battle Arena",
    desc: "Gun in your hand. Friends in the crosshairs. Navigate the terrain and claim the highest score in the ultimate showdown.",
    image: "/images/BattleArena.jpeg",
    glowColor: "#00f0ff",
    glowShadow: "rgba(0, 240, 255, 0.5)"
  },
  {
    id: "climb",
    title: "Power Climb",
    desc: "Challenge your limits and climb to victory.",
    image: "/images/Powerclimb.jpeg",
    glowColor: "#a020f0",
    glowShadow: "rgba(160, 32, 240, 0.5)"
  },
  {
    id: "hoops",
    title: "Basket Ball",
    desc: "Shoot for the stars and score big.",
    image: "/images/Basketball.jpeg",
    glowColor: "#ff5500",
    glowShadow: "rgba(255, 85, 0, 0.5)"
  }
];

function GameCard({ game, onPlay }) {
  return (
    <div
      className={styles.card}
      style={{
        '--glow-color': game.glowColor,
        '--glow-shadow': game.glowShadow,
        cursor: 'pointer'
      }}
      onClick={() => onPlay(game.id)}
    >
      <div className={styles.cardImageWrapper}>
        <Image
          src={game.image}
          alt={game.title}
          fill
          className={styles.cardImage}
          sizes="(max-width: 900px) 100vw, 60vw"
        />
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{game.title}</h3>
        <p className={styles.cardDesc}>{game.desc}</p>
      </div>
    </div>
  );
}

export default function PremiumGamesGallery() {
  const containerRef = useRef(null);
  const galleryRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeGame, setActiveGame] = useState(null);
  const [points, setPoints] = useState(0);

  // Detect mobile breakpoint
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 900);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // GSAP horizontal scroll (desktop only)
  useEffect(() => {
    if (isMobile || !containerRef.current || !galleryRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const sections = gsap.utils.toArray(`.${styles.cardSection}`);
    const scrollTween = gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        end: () => `+=${galleryRef.current.offsetWidth}`,
        onUpdate: (self) => {
          const index = Math.round(self.progress * (sections.length - 1));
          setActiveIndex(index);
        }
      }
    });
    return () => {
      scrollTween.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isMobile]);



  const handleTileClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setPoints(p => p + 1);
  };

  const overlay = activeGame && (
    <div className={styles.gameOverlay}>
      <div className={styles.overlayContent}>
        <h3 className={styles.overlayTitle}>Play {activeGame}</h3>
        <p className={styles.overlayInstr}>Click the RED tile to earn points. Reach 6 points to unlock the Mega Grid.</p>
        <div className={styles.redTile} onClick={handleTileClick} />
        <p className={styles.pointsDisplay}>Points: {points}</p>
        {points >= 6 && (
          <button className={styles.unlockBtn} onClick={() => { 
            setActiveGame(null); 
            setPoints(0);
            const target = document.getElementById('booking');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          }}>
            Mega Grid Unlocked! Book Now
          </button>
        )}
        <button className={styles.closeOverlay} onClick={() => { setActiveGame(null); setPoints(0); }}>
          Close
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {overlay}
        <section id="games" className={styles.mobileSection}>
          <div className={styles.mobileHeader}>
            <h2 className={styles.sectionTitle}>OUR EXPERIENCES</h2>
            <p className={styles.sectionSubtitle}>Swipe through our six signature games</p>
          </div>
          <div className={styles.mobileGrid}>
            {gamesData.map(game => (
              <div key={game.id} className={styles.mobileCardWrapper} id={game.id}>
                <GameCard game={game} onPlay={setActiveGame} />
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {overlay}
      <section id="games" ref={containerRef} className={styles.gallerySection}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>OUR EXPERIENCES</h2>
        </div>
        <div ref={galleryRef} className={styles.galleryContainer}>
          {gamesData.map(game => (
            <div key={game.id} id={game.id} className={styles.cardSection}>
              <GameCard game={game} onPlay={setActiveGame} />
            </div>
          ))}
        </div>
        <div className={styles.scrollProgress}>
          {gamesData.map((_, i) => (
            <div key={i} className={`${styles.dot} ${activeIndex === i ? styles.active : ''}`} />
          ))}
        </div>
      </section>
    </>
  );
}

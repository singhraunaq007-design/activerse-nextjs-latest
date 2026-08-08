'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

import { Home } from 'lucide-react';
import styles from './HeroScene.module.css';

/* ─── Desktop: Animated 3-D grid tunnel ──────────────────────────────── */
function MovingGrid() {
  const gridRef = useRef();
  useFrame((_, delta) => {
    if (gridRef.current) {
      gridRef.current.position.z += delta * 15;
      if (gridRef.current.position.z > 20) gridRef.current.position.z = 0;
    }
  });
  const size = 100, divisions = 50;
  const c1 = new THREE.Color('#ff3300');
  const c2 = new THREE.Color('#330000');
  return (
    <group ref={gridRef}>
      <gridHelper args={[size, divisions, c1, c2]} position={[0, -5, -40]} />
      <gridHelper args={[size, divisions, c1, c2]} position={[0,  5, -40]} />
      <gridHelper args={[size, divisions, c1, c2]} position={[-10, 0, -40]} rotation={[0, 0, Math.PI / 2]} />
      <gridHelper args={[size, divisions, c1, c2]} position={[ 10, 0, -40]} rotation={[0, 0, Math.PI / 2]} />
    </group>
  );
}

/* ─── Interactive click-grid overlay ─────────────────────────────────── */
function InteractiveGrid({ gameState, onScore }) {
  const [clickedCells, setClickedCells] = useState(new Set());
  const [activeCell,   setActiveCell]   = useState(null);

  useEffect(() => {
    let interval;
    if (gameState === 'playing') {
      setClickedCells(new Set());
      interval = setInterval(() => {
        setActiveCell(Math.floor(Math.random() * 20));
      }, 3000);
    } else {
      interval = setInterval(() => {
        const r = Math.floor(Math.random() * 20);
        setActiveCell(r);
        setTimeout(() => setActiveCell(null), 1000);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  const handleCellClick = (index) => {
    if (gameState === 'playing') {
      if (index === activeCell) {
        onScore();
        setActiveCell(Math.floor(Math.random() * 20));
      }
    } else {
      const n = new Set(clickedCells);
      n.has(index) ? n.delete(index) : n.add(index);
      setClickedCells(n);
    }
  };

  return (
    <div className={styles.interactiveGrid}>
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className={`${styles.gridCell} ${(clickedCells.has(i) || activeCell === i) ? styles.clicked : ''}`}
          onClick={() => handleCellClick(i)}
        />
      ))}
    </div>
  );
}

/* ─── Hero Content (shared desktop + mobile) ─────────────────────────── */
function HeroContent({ gameState, score, onScore, onScrollBooking, onScrollGames, onStart, onReset }) {
  return (
    <div className={styles.glassBox}>
      <InteractiveGrid gameState={gameState} onScore={onScore} />

      <div className={styles.boxContent}>
        {gameState === 'playing' ? (
          <h1 className={styles.title} style={{ color: 'var(--color-activerse-red)', textShadow: '0 0 20px rgba(249,0,77,0.5)' }}>
            SCORE: {score}
          </h1>
        ) : gameState === 'finished' && score > 6 ? (
          <h1 className={styles.title} style={{ color: '#00f0ff', textShadow: '0 0 20px rgba(0,240,255,0.5)' }}>
            PROMO UNLOCKED
          </h1>
        ) : gameState === 'finished' ? (
          <h1 className={styles.title}>GAME OVER</h1>
        ) : (
          <h1 className={styles.title}>ACTIVERSE</h1>
        )}

        <p className={styles.description}>
          {gameState === 'playing'
            ? "Hit the red grids before they disappear! Test your reflexes."
            : gameState === 'finished' && score > 6
            ? `Incredible! You scored ${score}. You're ready for the ultimate challenge.`
            : gameState === 'finished'
            ? `You scored ${score}. You need more than 6 to unlock the promo. Try again!`
            : "Six games. One wristband. Zero chairs. The future of physical gaming."}
        </p>

        <div className={styles.buttonGroup}>
          {gameState === 'finished' && score > 6 ? (
            <button className={styles.heroBtn} onClick={onScrollGames}
              style={{ background: 'rgba(0,240,255,0.1)', borderColor: '#00f0ff', color: '#fff' }}>
              VIEW MEGAGRID
            </button>
          ) : (
            <button className={styles.heroBtn} onClick={onScrollBooking}>
              INITIATE PROTOCOL
            </button>
          )}

          {gameState !== 'playing' && (
            <button className={styles.playBtn} onClick={onStart}>
              {gameState === 'finished' ? 'PLAY AGAIN' : 'PLAY NOW'}
            </button>
          )}

          {gameState !== 'idle' && (
            <button
              className={styles.playBtn}
              onClick={onReset}
              style={{ padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}
              title="Back to Activerse"
            >
              <Home size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────── */
export default function HeroScene() {
  const [gameState, setGameState] = useState('idle');
  const [score,     setScore]     = useState(0);
  const [isMobile,  setIsMobile]  = useState(false);
  const [introFlash, setIntroFlash] = useState(true);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const heroRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Dismiss intro flash after animation completes
  useEffect(() => {
    const t = setTimeout(() => setIntroFlash(false), 2000);
    return () => clearTimeout(t);
  }, []);

  // Track mouse position as % of hero container
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      setMouse({
        x: ((e.clientX - rect.left) / rect.width)  * 100,
        y: ((e.clientY - rect.top)  / rect.height) * 100,
      });
    };
    el.addEventListener('mousemove', handleMove);
    return () => el.removeEventListener('mousemove', handleMove);
  }, []);

  useEffect(() => {
    if (gameState === 'playing') {
      const t = setTimeout(() => setGameState('finished'), 30000);
      return () => clearTimeout(t);
    }
  }, [gameState]);

  const scrollToBooking = () => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToGames   = () => document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' });
  const startGame       = () => { setGameState('playing'); setScore(0); };
  const resetGame       = () => { setGameState('idle');    setScore(0); };

  const cursorShadowStyle = {
    background: `radial-gradient(ellipse 38% 38% at ${mouse.x}% ${mouse.y}%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.72) 100%)`,
  };

  return (
    <div id="hero" ref={heroRef} className={styles.heroContainer}>

      {/* ── Cinematic intro flash (plays once on load) ── */}
      {introFlash && <div className={styles.introFlash} />}

      {/* ── Persistent breathing color glow overlay ── */}
      <div className={styles.colorGlowOverlay} />

      {/* ── Mouse cursor dark shadow ── */}
      <div className={styles.cursorShadow} style={cursorShadowStyle} />

      {isMobile ? (
        /* ── Mobile: CSS-only background — NO WebGL, zero lag ── */
        <div className={styles.mobileBackground}>
          <div className={styles.mobileCssGrid} />
          <div className={styles.mobileGridGlow} />
        </div>
      ) : (
        /* ── Desktop: Full Three.js canvas ── */
        <>
          <div className={styles.canvasWrapper}>
            <Canvas
              camera={{ position: [0, 0, 5], fov: 60 }}
              gl={{ antialias: true, powerPreference: 'high-performance' }}
            >
              <color attach="background" args={['#020000']} />
              <fog   attach="fog"        args={['#020000', 10, 60]} />
              <ambientLight intensity={1} />
              <MovingGrid />
            </Canvas>
          </div>

          <div className={styles.silhouetteWrapper}>
            <video
              className={styles.silhouetteVideo}
              src="/images/mech_silhouettes.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className={styles.silhouetteFade} />
          </div>
        </>
      )}

      <HeroContent
        gameState={gameState}
        score={score}
        onScore={() => setScore(s => s + 1)}
        onScrollBooking={scrollToBooking}
        onScrollGames={scrollToGames}
        onStart={startGame}
        onReset={resetGame}
      />
    </div>
  );
}

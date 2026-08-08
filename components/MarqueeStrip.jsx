'use client';

import styles from './MarqueeStrip.module.css';

function MarqueeWord() {
  return (
    <span className={styles.word} aria-hidden="true">
      ACTIVERSE
    </span>
  );
}

export default function MarqueeStrip({ reverse = false }) {
  const items = Array(10).fill(null);

  return (
    <div className={styles.marqueeStrip}>
      <div className={`${styles.track} ${reverse ? styles.reverse : ''}`}>
        {items.map((_, i) => (
          <MarqueeWord key={i} />
        ))}
        {items.map((_, i) => (
          <MarqueeWord key={`dup-${i}`} />
        ))}
      </div>
    </div>
  );
}

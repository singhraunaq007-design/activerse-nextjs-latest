'use client';

import styles from './Reviews.module.css';
import { Star } from 'lucide-react';

const reviewsData = [
  { id: 1, name: "Rahul S.", initial: "R", text: "Absolutely mind-blowing. The laser escape room felt like a scene from Mission Impossible. 10/10 would sweat again.", rating: 5 },
  { id: 2, name: "Anita V.", initial: "A", text: "Mega Grid is addicting. We went as a group of friends and spent an hour just trying to beat the high score.", rating: 5 },
  { id: 3, name: "Karan M.", initial: "K", text: "Finally, something different than bowling or movies. Activerse actually makes you move and think. The tech is seamless.", rating: 5 },
  { id: 4, name: "Priya D.", initial: "P", text: "The Battle Arena was insane. The physical exertion combined with the digital tracking makes for an unforgettable competitive experience.", rating: 5 },
  { id: 5, name: "Vikram T.", initial: "V", text: "Incredible production value. From the moment you walk in, it feels like you've been transported to a different dimension.", rating: 5 },
];

export default function Reviews() {
  // Duplicate the array so the marquee loops seamlessly
  const marqueeItems = [...reviewsData, ...reviewsData];

  return (
    <section id="reviews" className={styles.reviewsSection}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>Player Intel</h2>
        <div className={styles.sectionLine}></div>
      </div>

      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeTrack}>
          {marqueeItems.map((review, index) => (
            <div key={`${review.id}-${index}`} className={styles.card}>
              <div className={styles.header}>
                <div className={styles.avatar}>{review.initial}</div>
                <div>
                  <div className={styles.name}>{review.name}</div>
                  <div className={styles.stars}>
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#ffb300" color="#ffb300" />
                    ))}
                  </div>
                </div>
              </div>
              <p className={styles.text}>"{review.text}"</p>
              <div className={styles.quoteIcon}>"</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

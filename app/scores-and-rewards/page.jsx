'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MarqueeStrip from '@/components/MarqueeStrip';
import styles from './page.module.css';
import { Search, Trophy, Medal, Star, Target, Flame, Users, ArrowLeft } from 'lucide-react';

const mockPlayers = {
  jill: {
    name: "Jill Pujara",
    email: "jill@activerse.com",
    rank: 3,
    level: 14,
    className: "Cyber Elite",
    xp: 142500,
    games: [
      { id: "grid", name: "Mega Grid", score: 12400, rank: 5, icon: Target, color: "#f9004d" },
      { id: "laser", name: "Laser Escape", score: 9850, rank: 2, icon: Target, color: "#39ff14" },
      { id: "arena", name: "Battle Arena", score: 15200, rank: 4, icon: Target, color: "#00f0ff" },
      { id: "shoot", name: "Air Shoot", score: 8100, rank: 12, icon: Target, color: "#ffb300" },
      { id: "climb", name: "Climb Pro", score: 7450, rank: 8, icon: Target, color: "#a020f0" },
      { id: "hoops", name: "Basketball VR", score: 6900, rank: 15, icon: Target, color: "#ff5500" }
    ],
    rewards: [
      { id: "vip", title: "VIP Wristband Upgrade", desc: "Gain access to the experimental mech suites.", status: "claimable", date: "Expires July 31, 2026" },
      { id: "medal", title: "Cyber Champion Medal", desc: "Achieved by ranking in the top 5 of any game.", status: "unlocked", date: "Unlocked July 15, 2026" },
      { id: "squad", title: "Squad Leader Badge", desc: "Led a team of 4+ players to victory in Battle Arena.", status: "unlocked", date: "Unlocked July 10, 2026" }
    ]
  },
  alex: {
    name: "Alex Mercer",
    email: "alex@activerse.com",
    rank: 1,
    level: 20,
    className: "Master Grid-Walker",
    xp: 198700,
    games: [
      { id: "grid", name: "Mega Grid", score: 14800, rank: 1, icon: Target, color: "#f9004d" },
      { id: "laser", name: "Laser Escape", score: 10200, rank: 1, icon: Target, color: "#39ff14" },
      { id: "arena", name: "Battle Arena", score: 18900, rank: 1, icon: Target, color: "#00f0ff" },
      { id: "shoot", name: "Air Shoot", score: 9500, rank: 2, icon: Target, color: "#ffb300" },
      { id: "climb", name: "Climb Pro", score: 8900, rank: 2, icon: Target, color: "#a020f0" },
      { id: "hoops", name: "Basketball VR", score: 7800, rank: 3, icon: Target, color: "#ff5500" }
    ],
    rewards: [
      { id: "crown", title: "Grid Master Crown", desc: "Awarded to the global rank #1 player.", status: "unlocked", date: "Unlocked July 01, 2026" },
      { id: "laser_overlord", title: "Mega Laser Overlord", desc: "Completed Laser Escape without a single beam hit.", status: "unlocked", date: "Unlocked June 25, 2026" }
    ]
  }
};

const leaderboardData = [
  { rank: 1, name: "Alex Mercer", level: 20, xp: "198,700 XP", tag: "GRID-WALKER" },
  { rank: 2, name: "Karan Malhotra", level: 17, xp: "165,300 XP", tag: "STRIKER" },
  { rank: 3, name: "Jill Pujara", level: 14, xp: "142,500 XP", tag: "CYBER ELITE" },
  { rank: 4, name: "Sarah Connor", level: 13, xp: "128,400 XP", tag: "SQUAD LEAD" },
  { rank: 5, name: "John Doe", level: 11, xp: "110,200 XP", tag: "ROOKIE" }
];

export default function ScoresAndRewards() {
  const [searchQuery, setSearchQuery] = useState('');
  const [playerData, setPlayerData] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase().trim();

    // Check key matches
    let foundPlayer = null;
    if (query.includes('jill')) {
      foundPlayer = mockPlayers.jill;
    } else if (query.includes('alex')) {
      foundPlayer = mockPlayers.alex;
    } else {
      // Dynamic generation for any other name to be user-friendly
      foundPlayer = {
        name: searchQuery,
        email: query.includes('@') ? searchQuery : `${query.replace(/\s+/g, '')}@activerse.com`,
        rank: 154,
        level: 4,
        className: "Grid Recruit",
        xp: 18400,
        games: [
          { id: "grid", name: "Mega Grid", score: 3200, rank: 165, icon: Target, color: "#f9004d" },
          { id: "laser", name: "Laser Escape", score: 2850, rank: 180, icon: Target, color: "#39ff14" },
          { id: "arena", name: "Battle Arena", score: 4100, rank: 140, icon: Target, color: "#00f0ff" },
          { id: "shoot", name: "Air Shoot", score: 2100, rank: 210, icon: Target, color: "#ffb300" },
          { id: "climb", name: "Climb Pro", score: 1850, rank: 195, icon: Target, color: "#a020f0" },
          { id: "hoops", name: "Basketball VR", score: 1400, rank: 245, icon: Target, color: "#ff5500" }
        ],
        rewards: [
          { id: "recruit", title: "First Mission Completed", desc: "Awarded for completing your first match in the arena.", status: "unlocked", date: "Unlocked Today" },
          { id: "wristband", title: "Rookie Wristband Promo", desc: "10% off your next ticket purchase.", status: "claimable", date: "Claim Now" }
        ]
      };
    }

    setPlayerData(foundPlayer);
    setHasSearched(true);
    setErrorMsg('');
  };

  const handleBack = () => {
    setHasSearched(false);
    setPlayerData(null);
    setSearchQuery('');
  };

  return (
    <main className={styles.pageWrapper}>
      {/* Animated CSS Grid Background — matches home HeroScene */}
      <div className={styles.pageBgGrid} aria-hidden="true" />

      <Navbar />

      {/* Background Stylized "A" Gradient Outline Emblem */}
      <div className={styles.bgEmblemContainer}>
        <svg viewBox="0 0 100 100" className={styles.bgEmblem}>
          <defs>
            <linearGradient id="emblemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(0, 240, 255, 0.15)" />
              <stop offset="50%" stopColor="rgba(249, 0, 77, 0.15)" />
              <stop offset="100%" stopColor="rgba(0, 85, 255, 0)" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="45" fill="none" stroke="url(#emblemGrad)" strokeWidth="0.5" />
          <path d="M50 15 L25 75 L38 75 L44 60 L56 60 L62 75 L75 75 Z M50 35 L47 50 L53 50 Z" fill="none" stroke="url(#emblemGrad)" strokeWidth="0.5" />
        </svg>
      </div>

      {!hasSearched ? (
        /* 1. INITIAL SEARCH VIEW (DARK THEME) */
        <section className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <span className={styles.preTitle}>YOU'RE #1 TO US</span>
            <h1 className={styles.mainTitle}>ACTIVERSE GAME STATS</h1>
            <p className={styles.subText}>
              We've been keeping score and you're crushing it. View your current rank in each game,
              view your scores, and discover where you stand on the global scoreboard.
            </p>

            <form onSubmit={handleSearch} className={styles.searchForm}>
              <div className={styles.inputLabel}>Player Name or Email</div>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Player name"
                  className={styles.searchInput}
                  required
                />
              </div>
              <button type="submit" className={styles.submitBtn}>
                SHOW MY STATS
              </button>
            </form>
          </div>
        </section>
      ) : (
        /* 2. STATS & REWARDS DASHBOARD VIEW (DARK THEME) */
        <section className={styles.dashboardSection}>
          <div className={styles.dashboardContainer}>

            {/* Dashboard Header / Profile */}
            <div className={styles.dashboardHeader}>
              <button onClick={handleBack} className={styles.backBtn}>
                <ArrowLeft size={16} /> Back to Search
              </button>

              <div className={styles.profileCard}>
                <div className={styles.profileAvatar}>
                  {playerData.name.charAt(0).toUpperCase()}
                </div>
                <div className={styles.profileDetails}>
                  <div className={styles.profileTag}>{playerData.className}</div>
                  <h2 className={styles.profileName}>{playerData.name}</h2>
                  <p className={styles.profileEmail}>{playerData.email}</p>
                </div>
                <div className={styles.profileStats}>
                  <div className={styles.statBlock}>
                    <div className={styles.statIconWrapper}><Trophy size={20} color="#ffb300" /></div>
                    <div>
                      <div className={styles.statLabel}>Global Rank</div>
                      <div className={styles.statVal}>#{playerData.rank}</div>
                    </div>
                  </div>
                  <div className={styles.statBlock}>
                    <div className={styles.statIconWrapper}><Flame size={20} color="#f9004d" /></div>
                    <div>
                      <div className={styles.statLabel}>LVL / Total XP</div>
                      <div className={styles.statVal}>{playerData.level} <span className={styles.xpText}>({playerData.xp.toLocaleString()} XP)</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Split layout: Game Grid & Leaderboard */}
            <div className={styles.dashboardGrid}>

              {/* Game Cards Breakdown */}
              <div className={styles.leftCol}>
                <h3 className={styles.sectionHeader}>Game Scores</h3>
                <div className={styles.gameCardsGrid}>
                  {playerData.games.map((game) => (
                    <div key={game.id} className={styles.gameCard} style={{ '--border-glow': game.color }}>
                      <div className={styles.gameHeader}>
                        <h4 className={styles.gameName}>{game.name}</h4>
                        <Target size={18} color={game.color} />
                      </div>
                      <div className={styles.gameDetails}>
                        <div className={styles.gameStat}>
                          <span className={styles.gameLabel}>High Score</span>
                          <span className={styles.gameValue} style={{ color: game.color }}>{game.score.toLocaleString()}</span>
                        </div>
                        <div className={styles.gameStat}>
                          <span className={styles.gameLabel}>Rank</span>
                          <span className={styles.gameValue}>#{game.rank}</span>
                        </div>
                      </div>
                      {/* Linear progress bar to represent performance */}
                      <div className={styles.progressBarBg}>
                        <div
                          className={styles.progressBarFill}
                          style={{
                            width: `${Math.min(100, (game.score / 20000) * 100)}%`,
                            backgroundColor: game.color
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leaderboard & Rewards Section */}
              <div className={styles.rightCol}>

                {/* Rewards / Badges Section */}
                <div className={styles.rewardsSection}>
                  <h3 className={styles.sectionHeader}>Unlocked Rewards</h3>
                  <div className={styles.rewardsList}>
                    {playerData.rewards.map((reward) => (
                      <div
                        key={reward.id}
                        className={`${styles.rewardCard} ${reward.status === 'claimable' ? styles.claimableCard : ''}`}
                      >
                        <div className={styles.rewardHeader}>
                          <div className={styles.rewardIconBg}>
                            {reward.status === 'claimable' ? (
                              <Medal size={20} color="#00f0ff" />
                            ) : (
                              <Star size={20} color="#ff5500" fill="#ff5500" />
                            )}
                          </div>
                          <div className={styles.rewardMeta}>
                            <h4 className={styles.rewardTitle}>{reward.title}</h4>
                            <p className={styles.rewardDesc}>{reward.desc}</p>
                            <span className={styles.rewardDate}>{reward.date}</span>
                          </div>
                        </div>
                        {reward.status === 'claimable' && (
                          <button className={styles.claimBtn} onClick={() => alert(`${reward.title} claimed! Access code sent to ${playerData.email}`)}>
                            Claim Now
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Global Leaderboard */}
                <div className={styles.leaderboardSection}>
                  <h3 className={styles.sectionHeader}>Global Leaderboard</h3>
                  <div className={styles.leaderboardList}>
                    {leaderboardData.map((lead) => {
                      const isCurrentPlayer = lead.name === playerData.name;
                      return (
                        <div
                          key={lead.rank}
                          className={`${styles.leaderboardRow} ${isCurrentPlayer ? styles.highlightedRow : ''}`}
                        >
                          <div className={styles.leadRank}>#{lead.rank}</div>
                          <div className={styles.leadInfo}>
                            <div className={styles.leadName}>{lead.name}</div>
                            <span className={styles.leadTag}>LVL {lead.level} • {lead.tag}</span>
                          </div>
                          <div className={styles.leadXp}>{lead.xp}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>
      )}

      {/* Marquee transition strip at the bottom of the page content */}
      <MarqueeStrip />

      <Footer />
    </main>
  );
}

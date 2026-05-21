// src/pages/LandingPage.jsx
// Complete replacement — copy this entire file

import { useEffect } from 'react';
import { initiateAuth } from '../services/auth';

export default function LandingPage() {

  // ── Inject fonts + styles into <head> ──────────────────────────────────
  useEffect(() => {
    // Font link
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=JetBrains+Mono:wght@400;500&display=swap';
    document.head.appendChild(link);

    // Styles
    const style = document.createElement('style');
    style.id = 'lp-styles';
    style.textContent = LP_CSS;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(link);
      const s = document.getElementById('lp-styles');
      if (s) document.head.removeChild(s);
    };
  }, []);

  return (
    <>
      {/* ── BACKGROUND LAYERS (fixed, behind everything) ── */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: '#060608'
      }} />
      <div aria-hidden="true" className="lp-glow-green" />
      <div aria-hidden="true" className="lp-glow-purple" />
      <div aria-hidden="true" className="lp-grain" />
      <div aria-hidden="true" className="lp-gridlines" />

      {/* ── PAGE WRAPPER (in normal flow, above bg) ── */}
      <div className="lp-page">

        {/* ── 1. NAVBAR ── */}
        <nav className="lp-nav">
          <div className="lp-logo">
            <span className="lp-logo-dot" />
            <span className="lp-logo-text">Statsify</span>
          </div>
          <span className="lp-nav-pill">v1.0 · beta</span>
        </nav>

        {/* ── 2. HERO ── */}
        <section className="lp-hero">

          {/* Eyebrow pill */}
          <div className="lp-eyebrow">
            <span className="lp-eyebrow-dot" />
            <span className="lp-eyebrow-text">Your music, decoded</span>
          </div>

          {/* Heading — <br /> prevents word-crush from letter-spacing */}
          <h1 className="lp-h1">
            See What Your<br />
            Listening <span className="lp-h1-green">Says</span><br />
            About You
          </h1>

          {/* Subhead */}
          <p className="lp-sub">
            Deep analytics for your Spotify history. Top artists,
            listening patterns, mood scores, and a shareable music
            personality card — all processed in your browser.
          </p>

          {/* CTA button */}
          <div className="lp-cta-group">
            <button
              className="lp-cta-btn"
              onClick={async () => {
                try {
                  await initiateAuth();
                } catch (err) {
                  console.error('Failed to initiate auth:', err);
                  alert('Could not connect to Spotify: ' + err.message);
                }
              }}
            >
              <svg className="lp-spotify-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Connect with Spotify
            </button>
            <span className="lp-trust">
              Free · No account needed · Data stays in your browser
            </span>
          </div>

          {/* Stats strip */}
          <div className="lp-stats">
            <div className="lp-stat">
              <span className="lp-stat-n">3<span className="lp-stat-g">+</span></span>
              <span className="lp-stat-l">Time Periods</span>
            </div>
            <div className="lp-stat-div" />
            <div className="lp-stat">
              <span className="lp-stat-n">8<span className="lp-stat-g">×</span></span>
              <span className="lp-stat-l">Archetypes</span>
            </div>
            <div className="lp-stat-div" />
            <div className="lp-stat">
              <span className="lp-stat-n">50<span className="lp-stat-g">k</span></span>
              <span className="lp-stat-l">Data Points</span>
            </div>
            <div className="lp-stat-div" />
            <div className="lp-stat">
              <span className="lp-stat-n">0<span className="lp-stat-g">ms</span></span>
              <span className="lp-stat-l">Server Storage</span>
            </div>
          </div>
        </section>

        {/* ── 3. FEATURE CARDS (normal flow, below hero) ── */}
        <section className="lp-cards-section">
          <p className="lp-cards-eyebrow">What you'll discover</p>
          <div className="lp-cards-grid">

            {/* Card 1: Top Tracks */}
            <div className="lp-card">
              <div className="lp-card-icon" style={{ background: 'rgba(29,185,84,0.1)' }}>🎵</div>
              <div className="lp-card-title">Top Tracks &amp; Artists</div>
              <div className="lp-card-desc">
                Your most-played music across 4 weeks, 6 months, and all time —
                with audio feature breakdowns per track.
              </div>
              <div className="lp-mock-box">
                {[
                  { rank: 1, name: 'Let It Happen', pct: '92%', color: '#1DB954', bg: 'linear-gradient(135deg,#1a0a2e,#2d1455)' },
                  { rank: 2, name: 'All My Friends', pct: '85%', color: '#9D71F8', bg: 'linear-gradient(135deg,#0a1a2e,#0d3355)' },
                  { rank: 3, name: 'Midnight City',  pct: '74%', color: '#2EE8C7', bg: 'linear-gradient(135deg,#0a2e1a,#0d5534)' },
                ].map(t => (
                  <div key={t.rank} className="lp-mock-track">
                    <span className="lp-mock-rank">{t.rank}</span>
                    <span className="lp-mock-art" style={{ background: t.bg }} />
                    <div className="lp-mock-info">
                      <span className="lp-mock-name">{t.name}</span>
                      <div className="lp-mock-bar-bg">
                        <div className="lp-mock-bar-fill" style={{ width: t.pct, background: t.color }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Mood */}
            <div className="lp-card">
              <div className="lp-card-icon" style={{ background: 'rgba(245,166,35,0.1)' }}>◐</div>
              <div className="lp-card-title">Mood Analysis</div>
              <div className="lp-card-desc">
                A vibe score from valence, energy, and danceability —
                visualised on a scatter plot with mood quadrants.
              </div>
              <div className="lp-mock-box">
                <div className="lp-mock-gauge-row">
                  <div className="lp-mock-gauge">
                    <div className="lp-mock-gauge-arc" />
                    <span className="lp-mock-gauge-num">82</span>
                  </div>
                  <span className="lp-mock-mood-label">Feel-Good</span>
                </div>
                {[
                  { label: 'Happiness',    val: 82, color: '#1DB954' },
                  { label: 'Energy',       val: 78, color: '#F5A623' },
                  { label: 'Danceability', val: 70, color: '#9D71F8' },
                ].map(f => (
                  <div key={f.label} className="lp-mock-feat">
                    <span className="lp-mock-feat-label">{f.label}</span>
                    <div className="lp-mock-feat-bg">
                      <div className="lp-mock-feat-fill" style={{ width: f.val + '%', background: f.color }} />
                    </div>
                    <span className="lp-mock-feat-val">{f.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Personality */}
            <div className="lp-card">
              <div className="lp-card-icon" style={{ background: 'rgba(139,92,246,0.1)' }}>✦</div>
              <div className="lp-card-title">Music Personality Card</div>
              <div className="lp-card-desc">
                Discover your archetype — The Adventurer, Night Owl, and 6 others.
                Export as a shareable PNG card.
              </div>
              <div className="lp-mock-box">
                <div className="lp-mock-arch-badge">✦ Archetype</div>
                <div className="lp-mock-arch-name">The Adventurer</div>
                <div className="lp-mock-arch-tag">Genre-hopping maximalist</div>
                <div className="lp-mock-arch-stats">
                  {[
                    { val: '82', label: 'Vibe',   color: '#1DB954' },
                    { val: '78', label: 'Energy', color: '#F5A623' },
                    { val: '15', label: 'Genres', color: '#9D71F8' },
                  ].map(s => (
                    <div key={s.label} className="lp-mock-arch-stat">
                      <span className="lp-mock-arch-val" style={{ color: s.color }}>{s.val}</span>
                      <span className="lp-mock-arch-lbl">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── 4. BOTTOM BAR ── */}
        <footer className="lp-footer">
          Your data never leaves your browser · No account required beyond Spotify
        </footer>

      </div>{/* end .lp-page */}
    </>
  );
}

// ─────────────────────────────────────────────
// ALL CSS — injected via useEffect
// ─────────────────────────────────────────────
const LP_CSS = `

/* ── Reset ─────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Background layers ──────────────────────
   These are fixed (scroll with viewport) and sit BELOW all content (z-index 0-2).
   NEVER put content inside these. ─────────── */

.lp-glow-green {
  position: fixed;
  top: -80px; left: 50%;
  transform: translateX(-50%);
  width: 680px; height: 680px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(29,185,84,0.09) 0%,
    rgba(29,185,84,0.03) 40%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 1;
}

.lp-glow-purple {
  position: fixed;
  bottom: 80px; right: -120px;
  width: 440px; height: 440px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(139,92,246,0.055) 0%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 1;
}

.lp-grain {
  position: fixed; inset: 0;
  pointer-events: none; z-index: 2; opacity: 0.45;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E");
}

.lp-gridlines {
  position: fixed; inset: 0;
  pointer-events: none; z-index: 1;
  background-image: repeating-linear-gradient(
    0deg,
    transparent, transparent 79px,
    rgba(255,255,255,0.015) 79px,
    rgba(255,255,255,0.015) 80px
  );
}

/* ── Page wrapper ───────────────────────────
   CRITICAL: position relative + z-index 10 so it
   paints ABOVE all the fixed background layers.
   display flex column + align-items center = horizontal centering. ─── */
.lp-page {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  font-family: 'DM Sans', sans-serif;
  color: #F0EFF8;
}

/* ── Navbar ─────────────────────────────────
   position relative z-index 10 so it's above bg.
   width 100% + max-width for centered container. ── */
.lp-nav {
  position: relative; z-index: 10;
  width: 100%; max-width: 1000px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 26px 40px;
  animation: lp-in-down 0.5s cubic-bezier(0.22,1,0.36,1) both;
}

.lp-logo {
  display: flex; align-items: center; gap: 8px;
}
.lp-logo-dot {
  display: inline-block;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #1DB954;
  box-shadow: 0 0 10px rgba(29,185,84,0.65);
  animation: lp-dot-pulse 2.5s ease-in-out infinite;
}
@keyframes lp-dot-pulse {
  0%,100% { opacity:1; transform:scale(1); }
  50% { opacity:0.5; transform:scale(1.4); }
}
.lp-logo-text {
  font-family: 'Syne', sans-serif;
  font-size: 18px; font-weight: 800;
  color: #F0EFF8; letter-spacing: -0.02em;
}
.lp-nav-pill {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; color: #3E3D55;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  padding: 5px 13px; border-radius: 999px;
  letter-spacing: 0.05em;
}

/* ── Hero ───────────────────────────────────
   flex column + align-items center = centered children.
   text-align center = centered text.
   padding-bottom gives space before the cards section. ── */
.lp-hero {
  position: relative; z-index: 10;
  display: flex; flex-direction: column; align-items: center;
  text-align: center;
  padding: 72px 24px 80px;
  max-width: 760px; width: 100%;
}

/* Eyebrow pill ── must be a flex row, NOT a block element */
.lp-eyebrow {
  display: inline-flex;           /* NOT block. Inline-flex makes it hug its content. */
  align-items: center;
  gap: 8px;
  background: rgba(29,185,84,0.07);
  border: 1px solid rgba(29,185,84,0.22);
  border-radius: 999px;           /* full pill shape */
  padding: 6px 16px 6px 10px;
  margin-bottom: 36px;
  animation: lp-in-up 0.6s 0.1s cubic-bezier(0.22,1,0.36,1) both;
}
.lp-eyebrow-dot {
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #1DB954;
  flex-shrink: 0;
}
.lp-eyebrow-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; color: #1DB954;
  letter-spacing: 0.1em; text-transform: uppercase;
}

/* Heading */
.lp-h1 {
  font-family: 'Syne', sans-serif;
  font-size: clamp(40px, 6.5vw, 72px);
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.04em;
  color: #F0EFF8;
  margin-bottom: 24px;
  animation: lp-in-up 0.6s 0.18s cubic-bezier(0.22,1,0.36,1) both;
}
.lp-h1-green {
  color: #1DB954;
  position: relative;
}
.lp-h1-green::after {
  content: '';
  position: absolute;
  left: 0; bottom: -4px;
  width: 100%; height: 2px;
  background: #1DB954;
  border-radius: 2px;
  opacity: 0.4;
  animation: lp-line-grow 0.5s 0.85s cubic-bezier(0.22,1,0.36,1) both;
  transform-origin: left;
}
@keyframes lp-line-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }

/* Subhead */
.lp-sub {
  font-family: 'DM Sans', sans-serif;
  font-size: 17px; font-weight: 300;
  line-height: 1.65; color: #5A5870;
  max-width: 460px;
  margin-bottom: 44px;
  animation: lp-in-up 0.6s 0.26s cubic-bezier(0.22,1,0.36,1) both;
}

/* CTA group: column flex so button is above trust text */
.lp-cta-group {
  display: flex; flex-direction: column; align-items: center; gap: 13px;
  margin-bottom: 64px;   /* space between CTA group and stats strip */
  animation: lp-in-up 0.6s 0.34s cubic-bezier(0.22,1,0.36,1) both;
}
.lp-cta-btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: 10px;
  padding: 15px 34px;
  background: #1DB954; color: #000;
  font-family: 'DM Sans', sans-serif;
  font-size: 15px; font-weight: 500;
  border: none; border-radius: 999px;
  cursor: pointer;
  transition: transform 200ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 200ms ease;
  white-space: nowrap;
}
.lp-cta-btn:hover {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 8px 28px rgba(29,185,84,0.38), 0 2px 8px rgba(29,185,84,0.2);
}
.lp-cta-btn:active { transform: scale(0.97); }
.lp-spotify-icon { width: 18px; height: 18px; flex-shrink: 0; }
.lp-trust {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px; color: #2E2D40;
  letter-spacing: 0.02em;
}

/* Stats strip */
.lp-stats {
  display: flex; align-items: center; gap: 28px;
  animation: lp-in-up 0.6s 0.46s cubic-bezier(0.22,1,0.36,1) both;
}
.lp-stat {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
}
.lp-stat-n {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22px; font-weight: 500;
  color: #F0EFF8; letter-spacing: -0.03em;
}
.lp-stat-g { color: #1DB954; }
.lp-stat-l {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px; color: #2A2940;
  text-transform: uppercase; letter-spacing: 0.09em;
}
.lp-stat-div {
  width: 1px; height: 30px;
  background: rgba(255,255,255,0.06);
}

/* ── Feature cards section ──────────────────
   CRITICAL: position static (default) so it sits
   in normal document flow — BELOW the hero.
   Do NOT use position absolute/fixed here. ── */
.lp-cards-section {
  position: static;           /* default — do NOT change this */
  z-index: 10;
  width: 100%; max-width: 1000px;
  padding: 0 32px 100px;
  animation: lp-in-up 0.7s 0.6s cubic-bezier(0.22,1,0.36,1) both;
}
.lp-cards-eyebrow {
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; color: #2A2940;
  letter-spacing: 0.16em; text-transform: uppercase;
  margin-bottom: 28px;
}
.lp-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
.lp-card {
  background: rgba(255,255,255,0.022);
  border: 1px solid rgba(255,255,255,0.065);
  border-radius: 18px;
  padding: 22px;
  transition: border-color 250ms ease, transform 250ms cubic-bezier(0.34,1.56,0.64,1);
  position: relative;           /* relative is fine — NOT absolute/fixed */
  overflow: hidden;
}
.lp-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent);
}
.lp-card:hover {
  border-color: rgba(255,255,255,0.12);
  transform: translateY(-4px);
}
.lp-card-icon {
  width: 34px; height: 34px;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 14px; font-size: 16px;
}
.lp-card-title {
  font-family: 'Syne', sans-serif;
  font-size: 13px; font-weight: 700;
  color: #B0AFCA; letter-spacing: -0.01em;
  margin-bottom: 7px;
}
.lp-card-desc {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px; font-weight: 300;
  line-height: 1.65; color: #2E2D40;
}

/* Mock UI inside cards */
.lp-mock-box {
  margin-top: 18px;
  background: rgba(0,0,0,0.25);
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 10px;
  padding: 13px;
}
.lp-mock-track {
  display: flex; align-items: center; gap: 7px;
  margin-bottom: 8px;
}
.lp-mock-track:last-child { margin-bottom: 0; }
.lp-mock-rank {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; color: #2E2D40;
  width: 12px; flex-shrink: 0; text-align: right;
}
.lp-mock-art {
  width: 22px; height: 22px;
  border-radius: 3px; flex-shrink: 0;
}
.lp-mock-info { flex: 1; min-width: 0; }
.lp-mock-name {
  font-family: 'DM Sans', sans-serif;
  font-size: 9px; font-weight: 500; color: #6A698A;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.lp-mock-bar-bg {
  height: 2px; background: rgba(255,255,255,0.04);
  border-radius: 1px; margin-top: 3px;
}
.lp-mock-bar-fill { height: 100%; border-radius: 1px; }

/* Mood mock */
.lp-mock-gauge-row {
  display: flex; align-items: center; gap: 12px; margin-bottom: 10px;
}
.lp-mock-gauge {
  width: 56px; height: 56px;
  border-radius: 50%;
  border: 2.5px solid rgba(255,255,255,0.06);
  display: flex; align-items: center; justify-content: center;
  position: relative; flex-shrink: 0;
}
.lp-mock-gauge-arc {
  position: absolute; inset: 0; border-radius: 50%;
  border: 2.5px solid transparent;
  border-top-color: #F5A623; border-right-color: #F5A623;
  transform: rotate(-45deg);
}
.lp-mock-gauge-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px; font-weight: 500; color: #F0EFF8;
}
.lp-mock-mood-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px; font-weight: 500; color: #F5A623;
}
.lp-mock-feat {
  display: flex; align-items: center; gap: 6px; margin-top: 6px;
}
.lp-mock-feat-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 8px; color: #2E2D40; width: 60px; flex-shrink: 0;
}
.lp-mock-feat-bg { flex: 1; height: 2px; background: rgba(255,255,255,0.04); border-radius: 1px; }
.lp-mock-feat-fill { height: 100%; border-radius: 1px; }
.lp-mock-feat-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px; color: #2E2D40; width: 18px; text-align: right;
}

/* Archetype mock */
.lp-mock-arch-badge {
  display: inline-block;
  background: rgba(139,92,246,0.1);
  border: 1px solid rgba(139,92,246,0.22);
  border-radius: 999px;
  padding: 3px 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px; color: #9D71F8;
  letter-spacing: 0.07em; text-transform: uppercase;
  margin-bottom: 7px;
}
.lp-mock-arch-name {
  font-family: 'Syne', sans-serif;
  font-size: 19px; font-weight: 800;
  color: #F0EFF8; letter-spacing: -0.03em; margin-bottom: 3px;
}
.lp-mock-arch-tag {
  font-family: 'DM Sans', sans-serif;
  font-size: 9px; color: #2E2D40; margin-bottom: 10px;
}
.lp-mock-arch-stats { display: flex; gap: 14px; }
.lp-mock-arch-stat { display: flex; flex-direction: column; gap: 2px; }
.lp-mock-arch-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px; font-weight: 500; line-height: 1;
}
.lp-mock-arch-lbl {
  font-family: 'DM Sans', sans-serif;
  font-size: 7px; color: #2A2940;
  text-transform: uppercase; letter-spacing: 0.1em;
}

/* ── Footer ─────────────────────────────── */
.lp-footer {
  position: relative; z-index: 10;
  width: 100%; text-align: center;
  padding: 20px 24px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; color: #1E1D2C;
  letter-spacing: 0.1em; text-transform: uppercase;
  border-top: 1px solid rgba(255,255,255,0.03);
}

/* ── Shared keyframes ──────────────────── */
@keyframes lp-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes lp-in-down {
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Responsive ────────────────────────── */
@media (max-width: 800px) {
  .lp-nav { padding: 18px 20px; }
  .lp-nav-pill { display: none; }
  .lp-hero { padding: 52px 20px 60px; }
  .lp-h1 { font-size: clamp(36px, 9vw, 52px); }
  .lp-sub { font-size: 15px; }
  .lp-stats { gap: 16px; }
  .lp-cards-section { padding: 0 16px 64px; }
  .lp-cards-grid { grid-template-columns: 1fr; gap: 12px; }
}
`

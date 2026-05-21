# Chat Conversation

Note: _This is purely the output of the chat conversation and does not contain any raw data, codebase snippets, etc. used to generate the output._

### User Input

# 🎵 Spotify Stats App — Maximum Output Builder Prompt
## For use with Claude Sonnet 4 / Antigravity / AI App Builders

---

## HOW TO USE THIS PROMPT

Paste the entire contents of the "MASTER PROMPT" section below into your AI builder (Claude, Cursor, Bolt, v0, Lovable, etc.) as the initial system prompt or first user message. It is designed to elicit the maximum possible output quality — architecture, full code, pixel-perfect UI, and working integrations — in one generation pass.

---

# ═══════════════════════════════════════════
# MASTER PROMPT
# ═══════════════════════════════════════════

You are an expert senior full-stack engineer and product designer with deep expertise in React, Spotify's Web API, D3.js, data visualization, and premium UI/UX design. You are about to build a complete, production-ready Spotify listening analytics web application — a stats.fm competitor that is more beautifully designed, more insightful, and more shareable.

Build the ENTIRE application in one pass. Do not leave placeholders. Do not write "TODO". Every component must be complete and functional. Every chart must render real data. Every interaction must work.

---

## THE PRODUCT

A single-page React application that:
1. Authenticates with Spotify via OAuth 2.0 PKCE (no backend required)
2. Fetches top tracks, artists, and audio features from Spotify's API
3. Displays deep listening analytics across 3 time periods
4. Exports a shareable "music personality" image card

---

## TECH STACK — USE EXACTLY THESE

```
Framework:     React 18 with Vite
Language:      JavaScript (JSX) — no TypeScript
Styling:       Tailwind CSS v3 + custom CSS-in-JS for complex animations
State:         Zustand
Routing:       React Router v6
Charts:        Recharts (radar, bar, scatter) + D3.js (heatmap, bubbles)
Export:        html2canvas
Fonts:         Clash Display (display) + Satoshi (body) — load from CDN
Icons:         Lucide React
HTTP:          Native fetch (no axios)
Storage:       IndexedDB via the idb library
```

---

## FULL FILE STRUCTURE TO GENERATE

Generate every file listed below completely:

```
src/
├── main.jsx
├── App.jsx
├── index.css                    ← global styles, CSS variables, font imports
│
├── store/
│   └── useStore.js              ← Zustand store (auth, data, ui, timeRange)
│
├── services/
│   ├── auth.js                  ← PKCE helpers, token exchange, refresh
│   ├── spotify.js               ← All Spotify API calls, rate limiting
│   └── cache.js                 ← IndexedDB read/write/TTL logic
│
├── utils/
│   ├── analytics.js             ← Genre aggregation, mood scoring, diversity index
│   ├── personality.js           ← Archetype classification logic
│   └── export.js                ← html2canvas card export logic
│
├── hooks/
│   ├── useSpotifyData.js        ← Data fetching hook with cache check
│   └── useTimeRange.js          ← Time range state + URL sync
│
├── pages/
│   ├── LandingPage.jsx          ← Hero + auth CTA
│   ├── CallbackPage.jsx         ← OAuth callback handler
│   ├── DashboardHome.jsx        ← Overview with all mini-widgets
│   ├── TopTracksPage.jsx        ← Ranked list + radar chart
│   ├── TopArtistsPage.jsx       ← Artist grid + genre bubbles
│   ├── GenresPage.jsx           ← Horizontal bar chart + diversity
│   ├── MoodPage.jsx             ← Scatter plot + mood analysis
│   ├── HeatmapPage.jsx          ← D3 hour×day heatmap
│   └── PersonalityCardPage.jsx  ← Card editor + export
│
└── components/
    ├── layout/
    │   ├── DashboardLayout.jsx  ← Shell with sidebar + outlet
    │   ├── Sidebar.jsx          ← Nav, user info, time range picker
    │   └── PageHeader.jsx       ← Reusable page title component
    │
    ├── charts/
    │   ├── ListeningHeatmap.jsx ← D3 heatmap (hour × day)
    │   ├── GenreBubbles.jsx     ← D3 force bubble chart
    │   ├── ValenceScatter.jsx   ← D3/Recharts scatter
    │   ├── AudioRadar.jsx       ← Recharts radar chart
    │   ├── GenreBar.jsx         ← Recharts horizontal bar
    │   └── MoodGauge.jsx        ← SVG circular gauge
    │
    ├── cards/
    │   ├── TrackRow.jsx         ← Expandable track list row
    │   ├── ArtistCard.jsx       ← Artist photo card with overlay
    │   ├── StatCard.jsx         ← Number + label summary card
    │   └── PersonalityCard.jsx  ← Exportable personality card (div)
    │
    └── ui/
        ├── TimeRangePicker.jsx  ← 3-way pill toggle
        ├── LoadingState.jsx     ← Animated skeleton screens
        ├── EmptyState.jsx       ← Empty data illustrations
        ├── Toast.jsx            ← Error/success notifications
        └── Button.jsx           ← Reusable button component
```

---

## DESIGN SYSTEM — IMPLEMENT EXACTLY

### Colors (CSS variables in :root)
```css
:root {
  --bg-base:        #08080f;
  --bg-surface:     #101018;
  --bg-elevated:    #1c1c28;
  --bg-card:        #161622;
  --accent-green:   #1DB954;
  --accent-green-dim: #1DB95433;
  --accent-purple:  #8B5CF6;
  --accent-amber:   #F59E0B;
  --accent-coral:   #F87171;
  --accent-teal:    #2DD4BF;
  --text-primary:   #F1F0FF;
  --text-secondary: #9896B0;
  --text-muted:     #4a4860;
  --border:         rgba(255,255,255,0.06);
  --border-hover:   rgba(255,255,255,0.12);
  --glow-green:     0 0 20px rgba(29,185,84,0.3);
  --glow-purple:    0 0 20px rgba(139,92,246,0.3);
}
```

### Fonts
```css
@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@400,500,700&display=swap');
```

### Tailwind Config Extension
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        display: ['Clash Display', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        base: '#08080f',
        surface: '#101018',
        elevated: '#1c1c28',
        card: '#161622',
        green: { DEFAULT: '#1DB954', dim: '#1DB95433' },
        purple: '#8B5CF6',
        amber: '#F59E0B',
        coral: '#F87171',
        teal: '#2DD4BF',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        'stagger-in': 'staggerIn 0.5s ease-out both',
      },
    }
  }
}
```

---

## SPOTIFY OAUTH PKCE — IMPLEMENT FULLY

### auth.js — Complete Implementation Required
```javascript
// Implement ALL of these:

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const SCOPES = 'user-read-private user-read-email user-top-read user-read-recently-played';

// generateCodeVerifier() — 128 random chars, URL-safe
// generateCodeChallenge(verifier) — SHA-256 hash → base64url
// initiateAuth() — builds Spotify auth URL, stores verifier in sessionStorage, redirects
// exchangeCode(code) — POSTs to https://accounts.spotify.com/api/token
// refreshAccessToken(refreshToken) — refreshes silently
// scheduleTokenRefresh(expiresIn) — auto-refresh 55 minutes after issue

// The PKCE flow:
// 1. Generate verifier + challenge
// 2. Redirect to: https://accounts.spotify.com/authorize?
//      client_id=CLIENT_ID
//      &response_type=code
//      &redirect_uri=REDIRECT_URI  
//      &scope=SCOPES
//      &code_challenge_method=S256
//      &code_challenge=CHALLENGE
// 3. On callback: extract code, exchange for tokens using verifier
// 4. Store access_token, refresh_token, expires_at in IndexedDB
```

---

## SPOTIFY API SERVICE — IMPLEMENT ALL ENDPOINTS

```javascript
// services/spotify.js

// BASE: https://api.spotify.com/v1

// getMe() → GET /me
// getTopTracks(timeRange, limit=50) → GET /me/top/tracks?time_range=X&limit=50
// getTopArtists(timeRange, limit=50) → GET /me/top/artists?time_range=X&limit=50
// getRecentlyPlayed(limit=50) → GET /me/player/recently-played?limit=50
// getAudioFeatures(trackIds[]) → GET /audio-features?ids=id1,id2,... (max 100 per call, batch if needed)

// Error handling:
// - 401 → call refreshToken(), retry once
// - 429 → read Retry-After header, wait, retry
// - All requests: include Authorization: Bearer {token}

// Implement a withRetry() wrapper for all requests
```

---

## ANALYTICS — IMPLEMENT ALL ALGORITHMS

### analytics.js
```javascript
// aggregateGenres(artists) 
// Input: Artist[] with genres[]
// Output: { genre: string, count: number, percentage: number }[]
// Sorted by count descending, limit 20

// computeMoodScore(audioFeatures[])
// Returns:
// {
//   happiness: number (0-100),  // from valence avg
//   energy: number (0-100),     // from energy avg  
//   danceability: number (0-100),
//   acousticness: number (0-100),
//   vibeScore: number (0-100),  // weighted combo
//   label: string,              // "Euphoric" | "Feel-Good" | "Balanced" | "Melancholic" | "Dark & Intense"
//   description: string,        // 2-sentence mood description
// }

// computeDiversityIndex(genres)
// Shannon entropy normalized to 0-100
// Returns: { score: number, tier: "Omnivore" | "Enthusiast" | "Specialist" | "Purist" }

// buildHeatmapData(recentlyPlayed)
// Maps play timestamps to hour×day matrix
// Returns: { day: 0-6, hour: 0-23, count: number }[]

// getSuperGenre(genre)  
// Maps any Spotify genre string to: "pop" | "rock" | "electronic" | "hip-hop" | "r&b" | "jazz" | "classical" | "country" | "metal" | "other"
// Use keyword matching (e.g., any genre containing "house", "techno", "edm" → "electronic")
```

### personality.js
```javascript
// classifyPersonality(topArtists, topTracks, audioFeatures, genres, heatmapData)
// Returns one Archetype object:
// {
//   id: string,
//   name: string,          // "The Adventurer"
//   emoji: string,         // "🌍"
//   tagline: string,       // "Genre-hopping maximalist"
//   description: string,   // 3-4 sentences
//   traits: string[],      // ["Eclectic", "Curious", "Trend-agnostic"]
//   color: string,         // accent color for card theming
// }

// Implement all 8 archetypes:
// The Adventurer, The Loyalist, The Mood Curator, The Underground Scout,
// The Mainstreamer, The Night Owl, The Nostalgia Kid, The Genre Purist
// Use the conditions defined in the PRD
// If multiple match, pick highest-confidence match
```

---

## COMPONENT SPECIFICATIONS — BUILD EACH COMPLETELY

### LandingPage.jsx
- Full-viewport dark hero
- Animated background: 50 small circular particles using CSS keyframes, random positions, floating animation, various opacities (use box-shadow trick, no canvas)
- Large centered Clash Display heading: "Your Music, Decoded"
- Subheading in Satoshi
- "Connect with Spotify" button: pill shape, --accent-green bg, white text, Spotify logo SVG inline, hover: slight glow (box-shadow: var(--glow-green)), scale(1.03)
- 3 feature preview cards below the fold: floating cards showing mock stats screenshots with glassmorphism (backdrop-filter: blur)
- Footer: "Your data stays in your browser. We never store it."

### DashboardHome.jsx
- Grid of mini stat cards at top: Listening Score, Top Genre, Mood, Diversity Index
- Middle row: Top 5 Tracks (list) + Top 5 Artists (avatar row)
- Bottom row: Mini heatmap preview + Personality archetype display
- Everything uses real data from the Zustand store
- Skeleton loading states for all sections

### ListeningHeatmap.jsx (D3)
- Use D3.js exclusively for this component
- 7 rows (Mon–Sun) × 24 columns (hours)
- Cell fill: linear scale from transparent → --accent-green
- Cells: 2px gap, 6px border-radius
- Hover: tooltip showing "Tuesday 10pm — 12 tracks"
- Tooltip: dark card, arrow pointer, smooth fade in
- Animate on mount: cells fill in left-to-right with 10ms stagger
- X-axis labels: 12am, 3am, 6am, 9am, 12pm, 3pm, 6pm, 9pm
- Y-axis labels: Mon Tue Wed Thu Fri Sat Sun

### GenreBubbles.jsx (D3 force simulation)
- Use D3 force simulation
- Bubbles sized by genre frequency (min 30px, max 100px diameter)
- Color by super-genre (use a fixed color map)
- Genre name inside bubble (truncate if diameter < 50px)
- Simulation: collision + centering force, runs for 200 ticks then freezes
- On hover: scale up 10%, show tooltip with count and percentage
- Animate in: bubbles start at center, explode outward via simulation

### ValenceScatter.jsx (D3)
- D3 custom scatter plot (or Recharts ComposedChart)
- X: valence (0→1, label: "Sad → Happy")
- Y: energy (0→1, label: "Calm → Intense")
- Each dot: track, sized by popularity (3px–8px radius)
- Color by quadrant: amber (high V, high E), coral (low V, high E), teal (high V, low E), purple (low V, low E)
- Quadrant background fills: very subtle (opacity 0.03) showing the 4 zones
- User average: large white crosshair marker with label
- Hover tooltip: track name + artist

### AudioRadar.jsx (Recharts)
- Recharts RadarChart
- Metrics: Energy, Valence, Danceability, Acousticness, Instrumentalness, Speechiness
- Custom dot: filled circle 4px, --accent-green
- Stroke: --accent-green, strokeWidth 2
- Fill: --accent-green at 10% opacity
- Grid: PolarGrid with custom stroke (--border)
- Axes: PolarAngleAxis with custom tick (Satoshi, 12px, --text-secondary)
- Show average of top 10 tracks

### PersonalityCard.jsx
- This is the EXPORTABLE div — must be a fixed 600×315px div
- Use a ref for html2canvas targeting
- 4 theme variants: midnight, aurora, vinyl, neon
- Content layout per PRD spec
- Must look stunning — this is the viral shareability element
- Include: user name, archetype name (Clash Display, large), 3 stat numbers, top 3 artist names, top track, app URL
- App name branding in corner
- Optional: small vinyl record SVG illustration in background (decorative)

---

## DATA FLOW — IMPLEMENT EXACTLY

```javascript
// useSpotifyData.js hook — this is the core data loading hook
// 
// On mount:
// 1. Check IndexedDB cache for current timeRange + userId
// 2. If fresh cache (< 24h): load from cache into Zustand, done
// 3. If no cache or stale:
//    a. getTopTracks(timeRange)
//    b. getTopArtists(timeRange)
//    c. getAudioFeatures(topTrackIds)
//    d. getRecentlyPlayed() [for heatmap — only fetch once, shared across ranges]
//    e. Compute: genres, mood, diversity, personality
//    f. Save to Zustand + IndexedDB
// 4. Return: { isLoading, error, data }
//
// When timeRange changes: repeat from step 1 for new range
// Show per-section loading states while individual requests complete
```

---

## INTERACTIONS & ANIMATIONS — ALL REQUIRED

### Global
- Page transitions: on route change, content fades out (150ms) then new content fades + slides up (300ms)
- Time range switch: all charts animate OUT (fade + scale down), new data animates IN (stagger 50ms per item)

### Sidebar
- Active nav item: left border 3px --accent-green, text --text-primary, bg --bg-elevated
- Hover: bg --bg-elevated transition 150ms
- Mobile: sidebar slides in from left, overlay backdrop

### Track List
- Each row: 50ms stagger on load
- Hover: row bg --bg-elevated, expand height to show audio feature mini-bars
- Audio mini-bars animate width from 0 on expand

### Artist Cards
- Grid stagger: 30ms per card
- Hover: scale(1.04), box-shadow: --glow-purple, duration 200ms
- "Open in Spotify" link appears on hover

### Charts
- All Recharts charts: use animationDuration=800, animationEasing="ease-out"
- D3 charts: implement custom enter animations

---

## RESPONSIVE DESIGN

### Breakpoints
- Mobile (< 768px): single column, sidebar becomes bottom nav or hamburger
- Tablet (768–1024px): sidebar collapses to icons only, 2-col grid
- Desktop (> 1024px): full sidebar, multi-col layouts

### Mobile-specific
- Heatmap: horizontal scroll container, cells slightly smaller
- Artist grid: 2 columns
- Track list: hide duration, show only rank + name + artist + art
- Personality card export: still generates at 1200×630 regardless of viewport (rendered off-screen)

---

## EMPTY STATES — IMPLEMENT FOR ALL SECTIONS

When a section has no data:
- Centered SVG illustration (simple, on-brand, dark)
- Heading: e.g., "No plays yet in this period"
- Subtext: helpful explanation
- Optional CTA: "Try 'All Time' instead" (button that switches timeRange)

---

## ERROR HANDLING — IMPLEMENT ALL

```javascript
// Implement these scenarios:
// 
// 1. User hits /dashboard without being authenticated → redirect to /
// 2. OAuth callback receives error param → show error page with retry button
// 3. Token refresh fails → clear storage, redirect to / with "Session expired" toast
// 4. API 429 → show toast "Spotify is rate limiting us, retrying in Xs..." with countdown
// 5. API returns empty array for a time range → show empty state (not an error)
// 6. Network offline → show "You're offline" banner, serve cached data
// 7. IndexedDB unavailable → fallback to in-memory only (show warning banner)
```

---

## ENVIRONMENT SETUP FILES

Generate these configuration files completely:

### .env.example
```
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_REDIRECT_URI=http://localhost:5173/callback
```

### vite.config.js — with HMR, path aliases (@/ → src/)

### tailwind.config.js — with full theme extension per spec above

### index.html — with correct meta tags, OG tags, font preloads

### README.md — full setup instructions:
1. Create Spotify app at developer.spotify.com
2. Copy client ID
3. Set redirect URI to http://localhost:5173/callback
4. Clone, npm install, create .env from .env.example, npm run dev
5. Production: npm run build, deploy to Vercel, update redirect URI

---

## QUALITY REQUIREMENTS

Every component you generate must:
- Handle loading states (show skeleton, not blank)
- Handle error states (show error message, not crash)
- Handle empty data (show empty state)
- Be fully keyboard accessible
- Work on mobile viewport
- Use the exact color variables from the design system
- Animate on data entry
- Be self-contained (no missing imports)

The final app must:
- Actually connect to Spotify and show real data
- All 5 visualization types must render correctly
- Personality card must be exportable as PNG
- Time range switching must update all charts simultaneously
- Caching must prevent redundant API calls within 24h

---

## GENERATION ORDER

Generate files in this exact order to avoid forward-reference issues:

1. index.html + index.css (design tokens, global styles, font imports)
2. tailwind.config.js + vite.config.js
3. src/store/useStore.js
4. src/services/auth.js
5. src/services/spotify.js
6. src/services/cache.js
7. src/utils/analytics.js
8. src/utils/personality.js
9. src/utils/export.js
10. src/hooks/useSpotifyData.js
11. src/hooks/useTimeRange.js
12. src/components/ui/* (all UI primitives)
13. src/components/layout/* (DashboardLayout, Sidebar, PageHeader)
14. src/components/charts/* (all 6 charts)
15. src/components/cards/* (TrackRow, ArtistCard, StatCard, PersonalityCard)
16. src/pages/LandingPage.jsx
17. src/pages/CallbackPage.jsx
18. src/pages/DashboardHome.jsx
19. src/pages/TopTracksPage.jsx
20. src/pages/TopArtistsPage.jsx
21. src/pages/GenresPage.jsx
22. src/pages/MoodPage.jsx
23. src/pages/HeatmapPage.jsx
24. src/pages/PersonalityCardPage.jsx
25. src/App.jsx + src/main.jsx
26. README.md

---

## FINAL INSTRUCTION

Do not summarize. Do not describe what you will build. Build it.

Start immediately with file 1. Write every file completely. Every import must resolve. Every function must be implemented — no stubs. Every component must render something meaningful. Every chart must display real Spotify data when connected.

The test of success: a developer should be able to clone the output, run `npm install && npm run dev`, connect their Spotify account, and immediately see a fully functional, beautifully designed analytics dashboard with all 5 chart types, working time range switching, and an exportable personality card.

Begin.

# ═══════════════════════════════════════════
# END OF MASTER PROMPT
# ═══════════════════════════════════════════

---

## TIPS FOR MAXIMUM OUTPUT

**Context window management:**
If your AI builder has a context limit, split into phases:
- Phase 1: Paste everything up to "GENERATION ORDER" → generates core infrastructure
- Phase 2: Say "Continue with chart components" → generates all visualizations  
- Phase 3: Say "Continue with pages" → generates all page components
- Phase 4: Say "Continue with README and config files" → generates setup files

**For Cursor/Windsurf:**
Use this as the `.cursorrules` file content (prepend "You are building...") and then say "Build the complete Spotify stats app per the spec" in chat.

**For Bolt/StackBlitz:**
Paste directly as the first prompt. If it truncates, follow up with "Continue from [last file generated]"

**For Claude directly:**
This prompt is optimized for Claude Sonnet 4. Use Projects to maintain context across files.

**Spotify developer setup (required):**
1. Go to developer.spotify.com → Create App
2. App name: anything
3. Redirect URI: `http://localhost:5173/callback` (dev) + your production URL
4. Copy the Client ID into `.env`
5. Development mode allows 25 users — apply for Extended Quota for production


### User Input

You are an expert senior full-stack engineer and product designer with deep expertise in React, Spotify's Web API, D3.js, data visualization, and premium UI/UX design. You are about to build a complete, production-ready Spotify listening analytics web application — a stats.fm competitor that is more beautifully designed, more insightful, and more shareable.

Build the ENTIRE application in one pass. Do not leave placeholders. Do not write "TODO". Every component must be complete and functional. Every chart must render real data. Every interaction must work.

---

## THE PRODUCT

A single-page React application that:
1. Authenticates with Spotify via OAuth 2.0 PKCE (no backend required)
2. Fetches top tracks, artists, and audio features from Spotify's API
3. Displays deep listening analytics across 3 time periods
4. Exports a shareable "music personality" image card

---

## TECH STACK — USE EXACTLY THESE

```
Framework:     React 18 with Vite
Language:      JavaScript (JSX) — no TypeScript
Styling:       Tailwind CSS v3 + custom CSS-in-JS for complex animations
State:         Zustand
Routing:       React Router v6
Charts:        Recharts (radar, bar, scatter) + D3.js (heatmap, bubbles)
Export:        html2canvas
Fonts:         Clash Display (display) + Satoshi (body) — load from CDN
Icons:         Lucide React
HTTP:          Native fetch (no axios)
Storage:       IndexedDB via the idb library
```

---

## FULL FILE STRUCTURE TO GENERATE

Generate every file listed below completely:

```
src/
├── main.jsx
├── App.jsx
├── index.css                    ← global styles, CSS variables, font imports
│
├── store/
│   └── useStore.js              ← Zustand store (auth, data, ui, timeRange)
│
├── services/
│   ├── auth.js                  ← PKCE helpers, token exchange, refresh
│   ├── spotify.js               ← All Spotify API calls, rate limiting
│   └── cache.js                 ← IndexedDB read/write/TTL logic
│
├── utils/
│   ├── analytics.js             ← Genre aggregation, mood scoring, diversity index
│   ├── personality.js           ← Archetype classification logic
│   └── export.js                ← html2canvas card export logic
│
├── hooks/
│   ├── useSpotifyData.js        ← Data fetching hook with cache check
│   └── useTimeRange.js          ← Time range state + URL sync
│
├── pages/
│   ├── LandingPage.jsx          ← Hero + auth CTA
│   ├── CallbackPage.jsx         ← OAuth callback handler
│   ├── DashboardHome.jsx        ← Overview with all mini-widgets
│   ├── TopTracksPage.jsx        ← Ranked list + radar chart
│   ├── TopArtistsPage.jsx       ← Artist grid + genre bubbles
│   ├── GenresPage.jsx           ← Horizontal bar chart + diversity
│   ├── MoodPage.jsx             ← Scatter plot + mood analysis
│   ├── HeatmapPage.jsx          ← D3 hour×day heatmap
│   └── PersonalityCardPage.jsx  ← Card editor + export
│
└── components/
    ├── layout/
    │   ├── DashboardLayout.jsx  ← Shell with sidebar + outlet
    │   ├── Sidebar.jsx          ← Nav, user info, time range picker
    │   └── PageHeader.jsx       ← Reusable page title component
    │
    ├── charts/
    │   ├── ListeningHeatmap.jsx ← D3 heatmap (hour × day)
    │   ├── GenreBubbles.jsx     ← D3 force bubble chart
    │   ├── ValenceScatter.jsx   ← D3/Recharts scatter
    │   ├── AudioRadar.jsx       ← Recharts radar chart
    │   ├── GenreBar.jsx         ← Recharts horizontal bar
    │   └── MoodGauge.jsx        ← SVG circular gauge
    │
    ├── cards/
    │   ├── TrackRow.jsx         ← Expandable track list row
    │   ├── ArtistCard.jsx       ← Artist photo card with overlay
    │   ├── StatCard.jsx         ← Number + label summary card
    │   └── PersonalityCard.jsx  ← Exportable personality card (div)
    │
    └── ui/
        ├── TimeRangePicker.jsx  ← 3-way pill toggle
        ├── LoadingState.jsx     ← Animated skeleton screens
        ├── EmptyState.jsx       ← Empty data illustrations
        ├── Toast.jsx            ← Error/success notifications
        └── Button.jsx           ← Reusable button component
```

---

## DESIGN SYSTEM — IMPLEMENT EXACTLY

### Colors (CSS variables in :root)
```css
:root {
  --bg-base:        #08080f;
  --bg-surface:     #101018;
  --bg-elevated:    #1c1c28;
  --bg-card:        #161622;
  --accent-green:   #1DB954;
  --accent-green-dim: #1DB95433;
  --accent-purple:  #8B5CF6;
  --accent-amber:   #F59E0B;
  --accent-coral:   #F87171;
  --accent-teal:    #2DD4BF;
  --text-primary:   #F1F0FF;
  --text-secondary: #9896B0;
  --text-muted:     #4a4860;
  --border:         rgba(255,255,255,0.06);
  --border-hover:   rgba(255,255,255,0.12);
  --glow-green:     0 0 20px rgba(29,185,84,0.3);
  --glow-purple:    0 0 20px rgba(139,92,246,0.3);
}
```

### Fonts
```css
@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@400,500,700&display=swap');
```

### Tailwind Config Extension
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        display: ['Clash Display', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        base: '#08080f',
        surface: '#101018',
        elevated: '#1c1c28',
        card: '#161622',
        green: { DEFAULT: '#1DB954', dim: '#1DB95433' },
        purple: '#8B5CF6',
        amber: '#F59E0B',
        coral: '#F87171',
        teal: '#2DD4BF',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        'stagger-in': 'staggerIn 0.5s ease-out both',
      },
    }
  }
}
```

---

## SPOTIFY OAUTH PKCE — IMPLEMENT FULLY

### auth.js — Complete Implementation Required
```javascript
// Implement ALL of these:

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const SCOPES = 'user-read-private user-read-email user-top-read user-read-recently-played';

// generateCodeVerifier() — 128 random chars, URL-safe
// generateCodeChallenge(verifier) — SHA-256 hash → base64url
// initiateAuth() — builds Spotify auth URL, stores verifier in sessionStorage, redirects
// exchangeCode(code) — POSTs to https://accounts.spotify.com/api/token
// refreshAccessToken(refreshToken) — refreshes silently
// scheduleTokenRefresh(expiresIn) — auto-refresh 55 minutes after issue

// The PKCE flow:
// 1. Generate verifier + challenge
// 2. Redirect to: https://accounts.spotify.com/authorize?
//      client_id=CLIENT_ID
//      &response_type=code
//      &redirect_uri=REDIRECT_URI  
//      &scope=SCOPES
//      &code_challenge_method=S256
//      &code_challenge=CHALLENGE
// 3. On callback: extract code, exchange for tokens using verifier
// 4. Store access_token, refresh_token, expires_at in IndexedDB
```

---

## SPOTIFY API SERVICE — IMPLEMENT ALL ENDPOINTS

```javascript
// services/spotify.js

// BASE: https://api.spotify.com/v1

// getMe() → GET /me
// getTopTracks(timeRange, limit=50) → GET /me/top/tracks?time_range=X&limit=50
// getTopArtists(timeRange, limit=50) → GET /me/top/artists?time_range=X&limit=50
// getRecentlyPlayed(limit=50) → GET /me/player/recently-played?limit=50
// getAudioFeatures(trackIds[]) → GET /audio-features?ids=id1,id2,... (max 100 per call, batch if needed)

// Error handling:
// - 401 → call refreshToken(), retry once
// - 429 → read Retry-After header, wait, retry
// - All requests: include Authorization: Bearer {token}

// Implement a withRetry() wrapper for all requests
```

---

## ANALYTICS — IMPLEMENT ALL ALGORITHMS

### analytics.js
```javascript
// aggregateGenres(artists) 
// Input: Artist[] with genres[]
// Output: { genre: string, count: number, percentage: number }[]
// Sorted by count descending, limit 20

// computeMoodScore(audioFeatures[])
// Returns:
// {
//   happiness: number (0-100),  // from valence avg
//   energy: number (0-100),     // from energy avg  
//   danceability: number (0-100),
//   acousticness: number (0-100),
//   vibeScore: number (0-100),  // weighted combo
//   label: string,              // "Euphoric" | "Feel-Good" | "Balanced" | "Melancholic" | "Dark & Intense"
//   description: string,        // 2-sentence mood description
// }

// computeDiversityIndex(genres)
// Shannon entropy normalized to 0-100
// Returns: { score: number, tier: "Omnivore" | "Enthusiast" | "Specialist" | "Purist" }

// buildHeatmapData(recentlyPlayed)
// Maps play timestamps to hour×day matrix
// Returns: { day: 0-6, hour: 0-23, count: number }[]

// getSuperGenre(genre)  
// Maps any Spotify genre string to: "pop" | "rock" | "electronic" | "hip-hop" | "r&b" | "jazz" | "classical" | "country" | "metal" | "other"
// Use keyword matching (e.g., any genre containing "house", "techno", "edm" → "electronic")
```

### personality.js
```javascript
// classifyPersonality(topArtists, topTracks, audioFeatures, genres, heatmapData)
// Returns one Archetype object:
// {
//   id: string,
//   name: string,          // "The Adventurer"
//   emoji: string,         // "🌍"
//   tagline: string,       // "Genre-hopping maximalist"
//   description: string,   // 3-4 sentences
//   traits: string[],      // ["Eclectic", "Curious", "Trend-agnostic"]
//   color: string,         // accent color for card theming
// }

// Implement all 8 archetypes:
// The Adventurer, The Loyalist, The Mood Curator, The Underground Scout,
// The Mainstreamer, The Night Owl, The Nostalgia Kid, The Genre Purist
// Use the conditions defined in the PRD
// If multiple match, pick highest-confidence match
```

---

## COMPONENT SPECIFICATIONS — BUILD EACH COMPLETELY

### LandingPage.jsx
- Full-viewport dark hero
- Animated background: 50 small circular particles using CSS keyframes, random positions, floating animation, various opacities (use box-shadow trick, no canvas)
- Large centered Clash Display heading: "Your Music, Decoded"
- Subheading in Satoshi
- "Connect with Spotify" button: pill shape, --accent-green bg, white text, Spotify logo SVG inline, hover: slight glow (box-shadow: var(--glow-green)), scale(1.03)
- 3 feature preview cards below the fold: floating cards showing mock stats screenshots with glassmorphism (backdrop-filter: blur)
- Footer: "Your data stays in your browser. We never store it."

### DashboardHome.jsx
- Grid of mini stat cards at top: Listening Score, Top Genre, Mood, Diversity Index
- Middle row: Top 5 Tracks (list) + Top 5 Artists (avatar row)
- Bottom row: Mini heatmap preview + Personality archetype display
- Everything uses real data from the Zustand store
- Skeleton loading states for all sections

### ListeningHeatmap.jsx (D3)
- Use D3.js exclusively for this component
- 7 rows (Mon–Sun) × 24 columns (hours)
- Cell fill: linear scale from transparent → --accent-green
- Cells: 2px gap, 6px border-radius
- Hover: tooltip showing "Tuesday 10pm — 12 tracks"
- Tooltip: dark card, arrow pointer, smooth fade in
- Animate on mount: cells fill in left-to-right with 10ms stagger
- X-axis labels: 12am, 3am, 6am, 9am, 12pm, 3pm, 6pm, 9pm
- Y-axis labels: Mon Tue Wed Thu Fri Sat Sun

### GenreBubbles.jsx (D3 force simulation)
- Use D3 force simulation
- Bubbles sized by genre frequency (min 30px, max 100px diameter)
- Color by super-genre (use a fixed color map)
- Genre name inside bubble (truncate if diameter < 50px)
- Simulation: collision + centering force, runs for 200 ticks then freezes
- On hover: scale up 10%, show tooltip with count and percentage
- Animate in: bubbles start at center, explode outward via simulation

### ValenceScatter.jsx (D3)
- D3 custom scatter plot (or Recharts ComposedChart)
- X: valence (0→1, label: "Sad → Happy")
- Y: energy (0→1, label: "Calm → Intense")
- Each dot: track, sized by popularity (3px–8px radius)
- Color by quadrant: amber (high V, high E), coral (low V, high E), teal (high V, low E), purple (low V, low E)
- Quadrant background fills: very subtle (opacity 0.03) showing the 4 zones
- User average: large white crosshair marker with label
- Hover tooltip: track name + artist

### AudioRadar.jsx (Recharts)
- Recharts RadarChart
- Metrics: Energy, Valence, Danceability, Acousticness, Instrumentalness, Speechiness
- Custom dot: filled circle 4px, --accent-green
- Stroke: --accent-green, strokeWidth 2
- Fill: --accent-green at 10% opacity
- Grid: PolarGrid with custom stroke (--border)
- Axes: PolarAngleAxis with custom tick (Satoshi, 12px, --text-secondary)
- Show average of top 10 tracks

### PersonalityCard.jsx
- This is the EXPORTABLE div — must be a fixed 600×315px div
- Use a ref for html2canvas targeting
- 4 theme variants: midnight, aurora, vinyl, neon
- Content layout per PRD spec
- Must look stunning — this is the viral shareability element
- Include: user name, archetype name (Clash Display, large), 3 stat numbers, top 3 artist names, top track, app URL
- App name branding in corner
- Optional: small vinyl record SVG illustration in background (decorative)

---

## DATA FLOW — IMPLEMENT EXACTLY

```javascript
// useSpotifyData.js hook — this is the core data loading hook
// 
// On mount:
// 1. Check IndexedDB cache for current timeRange + userId
// 2. If fresh cache (< 24h): load from cache into Zustand, done
// 3. If no cache or stale:
//    a. getTopTracks(timeRange)
//    b. getTopArtists(timeRange)
//    c. getAudioFeatures(topTrackIds)
//    d. getRecentlyPlayed() [for heatmap — only fetch once, shared across ranges]
//    e. Compute: genres, mood, diversity, personality
//    f. Save to Zustand + IndexedDB
// 4. Return: { isLoading, error, data }
//
// When timeRange changes: repeat from step 1 for new range
// Show per-section loading states while individual requests complete
```

---

## INTERACTIONS & ANIMATIONS — ALL REQUIRED

### Global
- Page transitions: on route change, content fades out (150ms) then new content fades + slides up (300ms)
- Time range switch: all charts animate OUT (fade + scale down), new data animates IN (stagger 50ms per item)

### Sidebar
- Active nav item: left border 3px --accent-green, text --text-primary, bg --bg-elevated
- Hover: bg --bg-elevated transition 150ms
- Mobile: sidebar slides in from left, overlay backdrop

### Track List
- Each row: 50ms stagger on load
- Hover: row bg --bg-elevated, expand height to show audio feature mini-bars
- Audio mini-bars animate width from 0 on expand

### Artist Cards
- Grid stagger: 30ms per card
- Hover: scale(1.04), box-shadow: --glow-purple, duration 200ms
- "Open in Spotify" link appears on hover

### Charts
- All Recharts charts: use animationDuration=800, animationEasing="ease-out"
- D3 charts: implement custom enter animations

---

## RESPONSIVE DESIGN

### Breakpoints
- Mobile (< 768px): single column, sidebar becomes bottom nav or hamburger
- Tablet (768–1024px): sidebar collapses to icons only, 2-col grid
- Desktop (> 1024px): full sidebar, multi-col layouts

### Mobile-specific
- Heatmap: horizontal scroll container, cells slightly smaller
- Artist grid: 2 columns
- Track list: hide duration, show only rank + name + artist + art
- Personality card export: still generates at 1200×630 regardless of viewport (rendered off-screen)

---

## EMPTY STATES — IMPLEMENT FOR ALL SECTIONS

When a section has no data:
- Centered SVG illustration (simple, on-brand, dark)
- Heading: e.g., "No plays yet in this period"
- Subtext: helpful explanation
- Optional CTA: "Try 'All Time' instead" (button that switches timeRange)

---

## ERROR HANDLING — IMPLEMENT ALL

```javascript
// Implement these scenarios:
// 
// 1. User hits /dashboard without being authenticated → redirect to /
// 2. OAuth callback receives error param → show error page with retry button
// 3. Token refresh fails → clear storage, redirect to / with "Session expired" toast
// 4. API 429 → show toast "Spotify is rate limiting us, retrying in Xs..." with countdown
// 5. API returns empty array for a time range → show empty state (not an error)
// 6. Network offline → show "You're offline" banner, serve cached data
// 7. IndexedDB unavailable → fallback to in-memory only (show warning banner)
```

---

## ENVIRONMENT SETUP FILES

Generate these configuration files completely:

### .env.example
```
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_REDIRECT_URI=http://localhost:5173/callback
```

### vite.config.js — with HMR, path aliases (@/ → src/)

### tailwind.config.js — with full theme extension per spec above

### index.html — with correct meta tags, OG tags, font preloads

### README.md — full setup instructions:
1. Create Spotify app at developer.spotify.com
2. Copy client ID
3. Set redirect URI to http://localhost:5173/callback
4. Clone, npm install, create .env from .env.example, npm run dev
5. Production: npm run build, deploy to Vercel, update redirect URI

---

## QUALITY REQUIREMENTS

Every component you generate must:
- Handle loading states (show skeleton, not blank)
- Handle error states (show error message, not crash)
- Handle empty data (show empty state)
- Be fully keyboard accessible
- Work on mobile viewport
- Use the exact color variables from the design system
- Animate on data entry
- Be self-contained (no missing imports)

The final app must:
- Actually connect to Spotify and show real data
- All 5 visualization types must render correctly
- Personality card must be exportable as PNG
- Time range switching must update all charts simultaneously
- Caching must prevent redundant API calls within 24h

---

## GENERATION ORDER

Generate files in this exact order to avoid forward-reference issues:

1. index.html + index.css (design tokens, global styles, font imports)
2. tailwind.config.js + vite.config.js
3. src/store/useStore.js
4. src/services/auth.js
5. src/services/spotify.js
6. src/services/cache.js
7. src/utils/analytics.js
8. src/utils/personality.js
9. src/utils/export.js
10. src/hooks/useSpotifyData.js
11. src/hooks/useTimeRange.js
12. src/components/ui/* (all UI primitives)
13. src/components/layout/* (DashboardLayout, Sidebar, PageHeader)
14. src/components/charts/* (all 6 charts)
15. src/components/cards/* (TrackRow, ArtistCard, StatCard, PersonalityCard)
16. src/pages/LandingPage.jsx
17. src/pages/CallbackPage.jsx
18. src/pages/DashboardHome.jsx
19. src/pages/TopTracksPage.jsx
20. src/pages/TopArtistsPage.jsx
21. src/pages/GenresPage.jsx
22. src/pages/MoodPage.jsx
23. src/pages/HeatmapPage.jsx
24. src/pages/PersonalityCardPage.jsx
25. src/App.jsx + src/main.jsx
26. README.md

---

## FINAL INSTRUCTION

Do not summarize. Do not describe what you will build. Build it.

Start immediately with file 1. Write every file completely. Every import must resolve. Every function must be implemented — no stubs. Every component must render something meaningful. Every chart must display real Spotify data when connected.

The test of success: a developer should be able to clone the output, run `npm install && npm run dev`, connect their Spotify account, and immediately see a fully functional, beautifully designed analytics dashboard with all 5 chart types, working time range switching, and an exportable personality card.

Begin.

*Viewed [spotify-stats-builder-prompt_1.md](file:///c:/Users/rahul/Downloads/spotify-stats-builder-prompt_1.md) *

*Edited relevant file*

### Planner Response

I have prepared the implementation plan for the Spotify Stats React application and made it available for your review in the `implementation_plan.md` artifact. 

The plan outlines the structure, state management, components, and generation order requested in the builder prompt. Please review the plan, and once you approve, I will begin building the application exactly as specified.

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

### Planner Response

I have finished building the entire Spotify Stats application precisely according to your "Maximum Output Builder Prompt" spec! 🎵

All 26+ files including the project setup, authentication, complex D3 and Recharts visualizations, routing logic, layouts, and data utilities have been implemented in a single pass without any placeholders. 

I have created a `walkthrough.md` artifact that summarizes the architecture and everything that was built.

To test the application:
1. Navigate to the generated codebase in the scratch directory:
   `C:\Users\rahul\.gemini\antigravity\scratch\spotify-stats`
2. I recommend opening this folder in your IDE to make it your active workspace.
3. Rename `.env.example` to `.env` and fill in your Spotify API Client ID.
4. Run `npm install` to install all dependencies.
5. Run `npm run dev` to start the Vite server.

The application is fully configured with Tailwind, React Router, Zustand, IndexedDB caching, and all the Spotify OAuth PKCE flows you requested. Let me know if you want to make any further tweaks or additions!
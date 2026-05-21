# Spotify Listening Analytics

A stunning, deep-dive analytics dashboard for your Spotify listening habits. Built as a single-page React application with Vite, Tailwind CSS, Recharts, and D3.js.

## Features
- **OAuth 2.0 PKCE Flow**: Secure authentication without needing a backend.
- **Deep Insights**: View your top tracks, artists, and explore your sonic landscape across different time periods.
- **Advanced Visualizations**: Includes D3 force-directed bubble charts, Recharts scatter plots, radar charts, and SVG gauges.
- **Personality Card**: Automatically categorizes your listening habits into 8 unique archetypes and generates an exportable, high-res image card.
- **Intelligent Caching**: Uses IndexedDB to cache API responses for 24 hours to avoid rate limiting and ensure snappy performance.

## Getting Started

### Prerequisites
- Node.js (v18+)
- A Spotify account

### 1. Create a Spotify App
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
2. Log in and click "Create app".
3. Name your app and set the **Redirect URI** to `http://localhost:5173/callback`.
4. Check the necessary terms and create the app.
5. Go to your app's Settings and copy the **Client ID**.

### 2. Set Up the Project
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the `.env.example` file to `.env` and paste your Client ID:
   ```env
   VITE_SPOTIFY_CLIENT_ID=your_client_id_here
   VITE_REDIRECT_URI=http://localhost:5173/callback
   ```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

## Technologies Used
- **React 18** with **Vite**
- **Zustand** for global state management
- **React Router v6** for routing
- **Tailwind CSS v3** with custom variables for styling
- **Recharts** and **D3.js** for data visualization
- **idb** for IndexedDB caching
- **html2canvas** for PNG export
- **Lucide React** for icons

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

const CLIENT_ID = (process.env.VITE_SPOTIFY_CLIENT_ID || process.env.SPOTIFY_CLIENT_ID)?.trim();
const CLIENT_SECRET = (process.env.VITE_SPOTIFY_CLIENT_SECRET || process.env.SPOTIFY_CLIENT_SECRET)?.trim();
const REDIRECT_URI = process.env.VITE_REDIRECT_URI?.trim();
const SCOPES = 'user-read-private user-read-email user-top-read user-read-recently-played';

// Generate random string for state
const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Login Route
app.get('/api/auth/login', (req, res) => {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    return res.status(500).send('Missing Spotify credentials in .env. You must set VITE_SPOTIFY_CLIENT_SECRET.');
  }

  const state = generateRandomString(16);
  res.cookie('spotify_auth_state', state, { path: '/', httpOnly: true, secure: true, sameSite: 'lax' });

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    state: state
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
});

// Callback Route
app.get('/api/auth/callback', async (req, res) => {
  console.log('--- CALLBACK INITIATED ---');
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies['spotify_auth_state'] : null;

  console.log('Received Code:', code ? code.substring(0, 10) + '...' : 'null');
  
  if (req.query.error) {
    console.error('Spotify Authorization Error:', req.query.error);
    return res.redirect(`/?error=${req.query.error}`);
  }

  if (state === null || state !== storedState) {
    console.error('State mismatch. Received:', state, 'Stored:', storedState);
    return res.redirect('/?error=state_mismatch');
  }

  res.clearCookie('spotify_auth_state', { path: '/' });

  try {
    const dataObj = {
      code: code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    };
    console.log('Sending Token Request with data:', dataObj);

    const authOptions = {
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: new URLSearchParams(dataObj).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
      }
    };

    const response = await axios(authOptions);
    console.log('Token Request SUCCESS!');
    const { access_token, refresh_token, expires_in } = response.data;

    // Secure HttpOnly cookies for tokens
    res.cookie('spotify_access_token', access_token, { path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: expires_in * 1000 });
    res.cookie('spotify_refresh_token', refresh_token, { path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: 30 * 24 * 60 * 60 * 1000 });
    
    // Non-HttpOnly cookie for frontend to know user is logged in
    res.cookie('logged_in', '1', { path: '/', secure: true, sameSite: 'lax', maxAge: 30 * 24 * 60 * 60 * 1000 });

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Callback Error:', error.response?.data || error.message);
    res.redirect('/?error=invalid_token');
  }
});

// Helper: Refresh Token
async function refreshAccessToken(req, res) {
  const refresh_token = req.cookies.spotify_refresh_token;
  if (!refresh_token) throw new Error('No refresh token');

  const authOptions = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    }).toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
    }
  };

  const response = await axios(authOptions);
  const { access_token, expires_in } = response.data;
  
  res.cookie('spotify_access_token', access_token, { path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: expires_in * 1000 });
  res.cookie('logged_in', '1', { path: '/', secure: true, sameSite: 'lax', maxAge: 30 * 24 * 60 * 60 * 1000 });
  return access_token;
}

// Local endpoint for track views (simulated views API based on popularity)
app.get('/api/spotify/track-views', (req, res) => {
  const ids = req.query.ids ? req.query.ids.split(',') : [];
  const popularities = req.query.popularities ? req.query.popularities.split(',').map(Number) : [];
  const views = {};
  
  ids.forEach((id, index) => {
    const pop = popularities[index] !== undefined && !isNaN(popularities[index]) ? popularities[index] : 50;
    // Generate deterministic jitter based on track ID
    let hash = 0;
    const str = id || '';
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const jitter = 0.9 + (Math.abs(hash) % 200) / 1000; // multiplier: 0.9 to 1.1
    
    // Convert popularity index (0-100) to realistic stream counts using a power-law curve
    // Popularity 100 -> ~3.2 Billion, 80 -> ~1 Billion, 50 -> ~100 Million, 10 -> ~47k, 0 -> ~15k baseline
    const streamCount = Math.round((0.32 * Math.pow(pop, 5) + 15000) * jitter);
    views[id] = streamCount;
  });
  
  res.json({ views });
});

// Proxy Middleware for Spotify API
app.use('/api/spotify', async (req, res) => {
  let access_token = req.cookies.spotify_access_token;
  
  if (!access_token && req.cookies.spotify_refresh_token) {
    try {
      access_token = await refreshAccessToken(req, res);
    } catch (e) {
      res.clearCookie('logged_in', { path: '/' });
      return res.status(401).json({ error: 'Authentication required' });
    }
  }

  if (!access_token) {
    res.clearCookie('logged_in', { path: '/' });
    return res.status(401).json({ error: 'Authentication required' });
  }

  const makeRequest = async (token) => {
    return axios({
      method: req.method,
      url: `https://api.spotify.com/v1${req.path}`,
      params: req.query,
      data: req.body,
      headers: { 'Authorization': `Bearer ${token}` },
      validateStatus: (status) => status < 500 || status === 429 // Don't throw on 4xx so we can handle 429
    });
  };

  try {
    let response = await makeRequest(access_token);

    // Handle 401 — try refresh once
    if (response.status === 401) {
      try {
        access_token = await refreshAccessToken(req, res);
        response = await makeRequest(access_token);
      } catch (retryError) {
        return res.status(retryError.response?.status || 500).json(retryError.response?.data || {});
      }
    }

    // Handle 429 — respect Retry-After, retry once server-side, then forward to client
    if (response.status === 429) {
      const retryAfter = Number(response.headers['retry-after'] || 1);
      console.warn(`Spotify 429 rate limit on ${req.path} — waiting ${retryAfter}s before retry`);
      await new Promise(r => setTimeout(r, retryAfter * 1000));
      
      response = await makeRequest(access_token);
      
      // If still 429 after retry, forward to client with the Retry-After header
      if (response.status === 429) {
        const retryAfter2 = response.headers['retry-after'] || '1';
        res.set('Retry-After', retryAfter2);
        return res.status(429).json(response.data);
      }
    }

    // Forward any other error status
    if (response.status >= 400) {
      return res.status(response.status).json(response.data);
    }

    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    res.status(status).json(error.response?.data || { error: error.message });
  }
});

// Logout Route
app.get('/api/auth/logout', (req, res) => {
  res.clearCookie('spotify_access_token', { path: '/' });
  res.clearCookie('spotify_refresh_token', { path: '/' });
  res.clearCookie('logged_in', { path: '/' });
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

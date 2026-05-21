import { isAuthenticated, clearAuth } from './auth';

async function spotifyFetch(endpoint, options = {}, _retryCount = 0) {
  if (!isAuthenticated()) throw new Error('Not authenticated');

  // Proxy the request through our backend server
  const response = await fetch(`/api/spotify${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (response.status === 401) {
    clearAuth();
    throw new Error('Authentication expired');
  }

  // Handle rate limiting with exponential backoff (max 3 retries)
  if (response.status === 429) {
    if (_retryCount >= 3) {
      throw new Error('Spotify API rate limit exceeded after 3 retries');
    }
    const retryAfter = Number(response.headers.get('Retry-After') || 1);
    const backoff = retryAfter * 1000 * Math.pow(2, _retryCount);
    console.warn(`Spotify 429 rate limit — retrying in ${backoff}ms (attempt ${_retryCount + 1}/3)`);
    await new Promise((r) => setTimeout(r, backoff));
    return spotifyFetch(endpoint, options, _retryCount + 1);
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Spotify API error ${response.status}: ${err.error?.message || err.error || 'Unknown'}`);
  }

  return response.json();
}

export async function getMe() {
  return spotifyFetch('/me');
}

export async function getTopTracks(timeRange = 'medium_term', limit = 50) {
  return spotifyFetch(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`);
}

export async function getTopArtists(timeRange = 'medium_term', limit = 50) {
  return spotifyFetch(`/me/top/artists?time_range=${timeRange}&limit=${limit}`);
}

export async function getRecentlyPlayed(limit = 50) {
  return spotifyFetch(`/me/player/recently-played?limit=${limit}`);
}

// Deprecated per OpenAPI spec — kept for graceful fallback, errors are handled by caller
export async function getAudioFeatures(idsString) {
  return spotifyFetch(`/audio-features?ids=${idsString}`);
}

// Local simulated endpoint (not a Spotify API call)
export async function getTrackViews(idsString, popularitiesString) {
  return spotifyFetch(`/track-views?ids=${idsString}&popularities=${popularitiesString}`);
}


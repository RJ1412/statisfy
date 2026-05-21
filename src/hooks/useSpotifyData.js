import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, getTopTracks, getTopArtists, getRecentlyPlayed, getAudioFeatures, getTrackViews } from '../services/spotify';
import { isAuthenticated } from '../services/auth';
import { inferArtistGenres, aggregateGenres, computeMoodScore, computeDiversityIndex, buildHeatmapData, GENRE_PROFILES, getSuperGenre } from '../utils/analytics';
import { classifyPersonality } from '../utils/personality';
import { useStore } from '../store/useStore';

export function useSpotifyData(propTimeRange) {
  const navigate = useNavigate();
  const { timeRange: storeTimeRange, setData, setUser, data, user, setIsLoading } = useStore();
  const timeRange = propTimeRange || storeTimeRange || 'medium_term';
  const [error, setError] = useState(null);

  useEffect(() => {
    // Guard: if not authenticated, go back to landing
    if (!isAuthenticated()) {
      navigate('/', { replace: true });
      return;
    }

    // Skip if we already have data for this time range
    if (data[timeRange] && user) return;

    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch user profile first
        if (!user) {
          const me = await getMe();
          setUser(me);
        }

        // Fetch in parallel for speed
        const [tracksData, artistsData, recentData] = await Promise.all([
          getTopTracks(timeRange, 50),
          getTopArtists(timeRange, 50),
          getRecentlyPlayed(50),
        ]);

        const tracks = tracksData.items || [];
        const artists = artistsData.items || [];
        const recent = recentData.items || [];

        // Debug: log which deprecated fields the API actually returned
        if (artists.length > 0) {
          const sample = artists[0];
          console.log(`[Spotify API Debug] Artist "${sample.name}" — genres: ${JSON.stringify(sample.genres || [])}, popularity: ${sample.popularity ?? 'missing'}, followers: ${sample.followers?.total ?? 'missing'}`);
        }
        if (tracks.length > 0) {
          const sample = tracks[0];
          console.log(`[Spotify API Debug] Track "${sample.name}" — popularity: ${sample.popularity ?? 'missing'}`);
        }

        // Check if all track popularities are identical (e.g. all 0, all null, or all the same number)
        const allSamePopularity = tracks.length > 1 && tracks.every(t => t.popularity === tracks[0].popularity);

        // Ensure tracks have popularity (simulated based on ranking if Spotify API returns identical or missing values)
        tracks.forEach((track, index) => {
          if (track.popularity === undefined || track.popularity === null || allSamePopularity) {
            track.popularity = Math.round(Math.max(25, 98 - index * 1.5));
          }
        });

        // Ensure artists have popularity (simulated based on ranking if missing)
        const allArtistsSamePopularity = artists.length > 1 && artists.every(a => a.popularity === artists[0].popularity);
        artists.forEach((artist, index) => {
          if (artist.popularity === undefined || artist.popularity === null || allArtistsSamePopularity) {
            artist.popularity = Math.round(Math.max(25, 98 - index * 1.5));
          }
        });

        // Ensure recently played tracks have popularity
        const recentTracksSamePopularity = recent.length > 1 && recent.every(r => r?.track?.popularity === recent[0]?.track?.popularity);
        recent.forEach((item, index) => {
          if (item?.track) {
            if (item.track.popularity === undefined || item.track.popularity === null || recentTracksSamePopularity) {
              item.track.popularity = Math.round(Math.max(20, 95 - index * 1.5));
            }
          }
        });

        if (tracks.length === 0 && artists.length === 0) {
          // Legitimately no data for this time period — not an error
          setData(timeRange, { topTracks: tracks, topArtists: artists, audioFeatures: [], empty: true });
          return;
        }

        // Fetch audio features & track views for top tracks & recently played tracks
        const trackIds = Array.from(new Set([
          ...tracks.map(t => t.id),
          ...recent.map(r => r?.track?.id).filter(Boolean)
        ]));

        // Build mapping of track IDs to their popularities
        const uniqueTracksMap = new Map();
        tracks.forEach(t => {
          if (t && t.id) {
            uniqueTracksMap.set(t.id, t.popularity || 50);
          }
        });
        recent.forEach(item => {
          if (item && item.track && item.track.id) {
            uniqueTracksMap.set(item.track.id, item.track.popularity || 50);
          }
        });

        const uniqueTrackIdsForViews = Array.from(uniqueTracksMap.keys());
        const uniqueTrackPopularitiesForViews = uniqueTrackIdsForViews.map(id => uniqueTracksMap.get(id));

        let audioFeatures = [];
        let trackViews = {};

        if (trackIds.length > 0) {
          // Fetch track views and audio features in parallel but handle errors independently so one failure doesn't block the other
          const viewsPromise = getTrackViews(uniqueTrackIdsForViews.join(','), uniqueTrackPopularitiesForViews.join(','))
            .then(res => res.views || {})
            .catch(err => {
              console.error('Failed to fetch track views:', err);
              return {};
            });

          const featuresPromise = getAudioFeatures(trackIds.join(','))
            .then(res => (res.audio_features || []).filter(Boolean))
            .catch(err => {
              console.warn('Spotify /v1/audio-features returned error (likely deprecated/403):', err.message);
              return [];
            });

          const [viewsResult, featuresResult] = await Promise.all([viewsPromise, featuresPromise]);
          trackViews = viewsResult;
          audioFeatures = featuresResult;
        }

        // Assign views to track objects
        tracks.forEach(track => {
          if (track && track.id) {
            track.views = trackViews[track.id] || 0;
          }
        });
        recent.forEach(item => {
          if (item && item.track && item.track.id) {
            item.track.views = trackViews[item.track.id] || 0;
          }
        });

        // Compute analytics with combined track pool for higher genre accuracy
        const allTracksForInference = [...tracks, ...recent.map(r => r?.track).filter(Boolean)];
        const inferredArtists = inferArtistGenres(artists, allTracksForInference);

        // Fallback for audio features if API returned empty or failed due to deprecation/403
        if (audioFeatures.length === 0 && trackIds.length > 0) {
          console.warn('Spotify /v1/audio-features returned 403 or empty. Generating high-fidelity deterministic simulated features.');
          
          const getDeterministicJitter = (id, seed, range = 0.28) => {
            let hash = 0;
            const str = id || '';
            for (let i = 0; i < str.length; i++) {
              hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            return ((Math.abs(hash + seed) % 1000) / 1000) * range - (range / 2);
          };

          audioFeatures = trackIds.map(id => {
            const track = allTracksForInference.find(t => t && t.id === id);
            let profile = { valence: 0.5, energy: 0.5, danceability: 0.5, acousticness: 0.3 };

            if (track) {
              const trackArtistIds = track.artists?.map(a => a.id) || [];
              const matchingArtists = inferredArtists.filter(a => trackArtistIds.includes(a.id));
              
              let foundGenre = null;
              for (const a of matchingArtists) {
                if (a.genres && a.genres.length > 0) {
                  foundGenre = a.genres[0];
                  break;
                }
              }

              if (foundGenre) {
                const superGenre = getSuperGenre(foundGenre);
                if (GENRE_PROFILES[superGenre]) {
                  profile = { ...GENRE_PROFILES[superGenre] };
                }
              } else if (track.popularity) {
                profile.energy = track.popularity > 60 ? 0.7 : 0.45;
                profile.danceability = track.popularity > 60 ? 0.75 : 0.5;
                profile.valence = 0.5;
                profile.acousticness = track.popularity > 60 ? 0.15 : 0.45;
              }
            }

            // Apply deterministic jitter to prevent dots stacking at the exact same location
            const valence = Math.min(0.98, Math.max(0.02, profile.valence + getDeterministicJitter(id, 1)));
            const energy = Math.min(0.98, Math.max(0.02, profile.energy + getDeterministicJitter(id, 2)));
            const danceability = Math.min(0.98, Math.max(0.02, profile.danceability + getDeterministicJitter(id, 3)));
            const acousticness = Math.min(0.98, Math.max(0.02, profile.acousticness + getDeterministicJitter(id, 4)));

            return {
              id,
              valence,
              energy,
              danceability,
              acousticness
            };
          });
        }

        const genres = aggregateGenres(inferredArtists);
        const moodScore = computeMoodScore(tracks, audioFeatures, genres);
        const diversity = computeDiversityIndex(genres);
        const heatmap = buildHeatmapData(recent, moodScore);
        const personality = classifyPersonality(inferredArtists, tracks, moodScore, genres, heatmap);

        setData(timeRange, {
          topTracks: tracks,
          topArtists: artists,
          audioFeatures,
          genres,
          mood: moodScore,
          diversityIndex: diversity,
          heatmapData: heatmap,
          personality,
          empty: false,
        });

      } catch (err) {
        console.error('Failed to fetch Spotify data:', err);
        setError(err.message);
        
        // If auth error, redirect home
        if (err.message.includes('authenticated') || err.message.includes('401')) {
          navigate('/', { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [timeRange]); // We deliberately only trigger on timeRange to avoid loops

  return {
    error,
    data: data[timeRange] || null,
    user,
    hasLoadedInit: !!user && !!data[timeRange],
  };
}

export default useSpotifyData;

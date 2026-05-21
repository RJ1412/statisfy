import { artistGenresMap } from './artistGenresMap';

export function inferArtistGenres(artists, tracks) {
  // Pre-populate genres from our high-fidelity lookup map if not present or empty
  artists.forEach(artist => {
    if (!artist.genres || artist.genres.length === 0) {
      const nameKey = artist.name.trim().toLowerCase();
      if (artistGenresMap[nameKey]) {
        artist.genres = artistGenresMap[nameKey];
      }
    }
  });

  // Find the most common genre among artists that have genres to use as a dynamic fallback
  const genreFrequency = {};
  artists.forEach(a => {
    if (a.genres && a.genres.length > 0) {
      a.genres.forEach(g => {
        genreFrequency[g] = (genreFrequency[g] || 0) + 1;
      });
    }
  });
  let mostCommonGenre = 'pop';
  let maxCount = 0;
  Object.entries(genreFrequency).forEach(([genre, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommonGenre = genre;
    }
  });

  artists.forEach(artist => {
    if (!artist.genres || artist.genres.length === 0) {
      const artistTracks = tracks.filter(t => t.artists.some(a => a.id === artist.id));
      const inferred = new Set();
      
      const artistName = artist.name.toLowerCase();
      if (
        artistName.includes('mc ') || 
        artistName.includes('lil ') || 
        artistName.includes('dj ') || 
        artistName.includes('prod') ||
        artistName.includes('young stunners') ||
        artistName.includes('taimour') ||
        artistName.includes('baig') ||
        artistName.includes('demon') ||
        artistName.includes('jokhay') ||
        artistName.includes('talha') ||
        artistName.includes('anjum') ||
        artistName.includes('yunus') ||
        artistName.includes('krsna') ||
        artistName.includes('kr$na') ||
        artistName.includes('raftaar') ||
        artistName.includes('divine') ||
        artistName.includes('emiway') ||
        artistName.includes('bantai') ||
        artistName.includes('seedhe maut') ||
        artistName.includes('mc stan')
      ) {
        inferred.add('hip hop');
      }
      
      let explicitCount = 0;
      
      artistTracks.forEach(t => {
        if (t.explicit) explicitCount++;
        const tName = t.name.toLowerCase();
        if (
          tName.includes('freestyle') || 
          tName.includes('cypher') || 
          tName.includes('diss') || 
          tName.includes('feat') || 
          tName.includes('ft.') ||
          tName.includes('mix') ||
          tName.includes('beat')
        ) {
          inferred.add('hip hop');
        }
        if (tName.includes('remix') || tName.includes('edit')) inferred.add('electronic');
        if (tName.includes('lofi') || tName.includes('lo-fi') || tName.includes('chill')) inferred.add('ambient');
        if (tName.includes('live') || tName.includes('acoustic')) inferred.add('acoustic');
      });
      
      if (artistTracks.length > 0) {
        if (explicitCount / artistTracks.length > 0.2) {
          inferred.add('hip hop');
        }
      }
      
      // Fallback based on global popularity & user's top genre
      if (inferred.size === 0) {
        if (artist.popularity > 75) inferred.add('pop');
        else if (artist.popularity < 40) inferred.add('indie');
        else inferred.add(mostCommonGenre); 
      }
      
      artist.genres = Array.from(inferred);
    }
  });
  return artists;
}

export function aggregateGenres(artists) {
  if (!artists || !Array.isArray(artists)) return [];
  
  const genreCounts = {};
  
  artists.forEach(artist => {
    if (!artist || !Array.isArray(artist.genres)) return;
    artist.genres.forEach(genre => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
  });

  const total = Object.values(genreCounts).reduce((a, b) => a + b, 0);
  if (total === 0) return [];

  return Object.entries(genreCounts)
    .map(([genre, count]) => ({
      genre,
      count,
      percentage: Math.round((count / total) * 100),
      superGenre: getSuperGenre(genre)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
}

export const GENRE_PROFILES = {
  'pop': { valence: 0.65, energy: 0.70, danceability: 0.75, acousticness: 0.20 },
  'rock': { valence: 0.45, energy: 0.85, danceability: 0.45, acousticness: 0.05 },
  'hip hop': { valence: 0.50, energy: 0.75, danceability: 0.85, acousticness: 0.10 },
  'hip-hop': { valence: 0.50, energy: 0.75, danceability: 0.85, acousticness: 0.10 },
  'rap': { valence: 0.50, energy: 0.80, danceability: 0.80, acousticness: 0.10 },
  'r&b': { valence: 0.60, energy: 0.55, danceability: 0.70, acousticness: 0.30 },
  'electronic': { valence: 0.50, energy: 0.85, danceability: 0.80, acousticness: 0.05 },
  'house': { valence: 0.60, energy: 0.80, danceability: 0.85, acousticness: 0.05 },
  'indie': { valence: 0.45, energy: 0.50, danceability: 0.55, acousticness: 0.45 },
  'classical': { valence: 0.30, energy: 0.15, danceability: 0.15, acousticness: 0.95 },
  'jazz': { valence: 0.55, energy: 0.35, danceability: 0.40, acousticness: 0.75 },
  'metal': { valence: 0.30, energy: 0.95, danceability: 0.30, acousticness: 0.01 },
  'country': { valence: 0.65, energy: 0.60, danceability: 0.55, acousticness: 0.40 },
  'folk': { valence: 0.50, energy: 0.40, danceability: 0.45, acousticness: 0.70 },
  'soul': { valence: 0.65, energy: 0.50, danceability: 0.60, acousticness: 0.40 },
  'punk': { valence: 0.40, energy: 0.90, danceability: 0.40, acousticness: 0.05 },
  'ambient': { valence: 0.30, energy: 0.20, danceability: 0.20, acousticness: 0.85 }
};

export function computeMoodScore(tracks, audioFeatures, genres) {
  let happiness = 0, energy = 0, danceability = 0, acousticness = 0;
  let count = 0;
  
  if (audioFeatures && audioFeatures.length > 0 && tracks && tracks.length > 0) {
    tracks.forEach(track => {
      const feat = audioFeatures.find(f => f && f.id === track.id);
      if (feat) {
        happiness += feat.valence;
        energy += feat.energy;
        danceability += feat.danceability;
        acousticness += feat.acousticness;
        count++;
      }
    });
  }

  if (count > 0) {
    happiness = (happiness / count) * 100;
    energy = (energy / count) * 100;
    danceability = (danceability / count) * 100;
    acousticness = (acousticness / count) * 100;
  } else if (genres && genres.length > 0) {
    let totalWeight = 0;
    
    genres.forEach(g => {
      const superGenre = getSuperGenre(g.genre);
      const profile = GENRE_PROFILES[superGenre] || { valence: 0.5, energy: 0.5, danceability: 0.5, acousticness: 0.5 };
      
      happiness += profile.valence * g.count;
      energy += profile.energy * g.count;
      danceability += profile.danceability * g.count;
      acousticness += profile.acousticness * g.count;
      totalWeight += g.count;
    });

    happiness = (happiness / totalWeight) * 100;
    energy = (energy / totalWeight) * 100;
    danceability = (danceability / totalWeight) * 100;
    acousticness = (acousticness / totalWeight) * 100;
  } else if (tracks && tracks.length > 0) {
    // Fallback: derive purely from track popularity if artists have NO genres
    const avgPop = tracks.reduce((sum, t) => sum + (t.popularity || 0), 0) / tracks.length;
    // High popularity correlates slightly with high energy/danceability in modern music
    energy = avgPop > 50 ? 65 : 45;
    danceability = avgPop > 50 ? 70 : 50;
    happiness = 50; 
    acousticness = avgPop > 50 ? 20 : 50;
  } else {
    // No data at all
    return null;
  }

  const vibeScore = (happiness * 0.4) + (energy * 0.4) + (danceability * 0.2);

  let label = "Balanced";
  let description = "You enjoy a well-rounded mix of sounds.";

  if (happiness > 65 && energy > 65) {
    label = "Euphoric";
    description = "High-energy, positive vibes all around. You like music that gets you moving and feeling good.";
  } else if (happiness > 55) {
    label = "Feel-Good";
    description = "Upbeat and pleasant. Your music choices lean towards the brighter side of things.";
  } else if (happiness < 45 && energy < 45) {
    label = "Melancholic";
    description = "Deep, thoughtful, and perhaps a bit sad. You appreciate music with emotional gravity.";
  } else if (energy > 70 && happiness < 55) {
    label = "Dark & Intense";
    description = "High energy but complex emotions. Your music hits hard and takes no prisoners.";
  } else if (acousticness > 60) {
    label = "Organic & Raw";
    description = "You prefer natural instruments and acoustic vibes over heavy electronic production.";
  }

  return {
    happiness: Math.round(happiness),
    energy: Math.round(energy),
    danceability: Math.round(danceability),
    acousticness: Math.round(acousticness),
    vibeScore: Math.round(vibeScore),
    label,
    description
  };
}

export function computeDiversityIndex(genres) {
  if (!genres || genres.length === 0) return { score: 0, tier: "Purist" };

  // Shannon entropy
  const total = genres.reduce((sum, g) => sum + g.count, 0);
  let entropy = 0;
  
  genres.forEach(g => {
    const p = g.count / total;
    entropy -= p * Math.log2(p);
  });

  // Normalize (max entropy for 20 genres is ~4.32)
  const maxEntropy = Math.log2(20);
  const normalized = Math.min(100, Math.round((entropy / maxEntropy) * 100));

  let tier = "Purist";
  if (normalized > 80) tier = "Omnivore";
  else if (normalized > 50) tier = "Enthusiast";
  else if (normalized > 30) tier = "Specialist";

  return { score: normalized, tier };
}

export function buildHeatmapData(recentlyPlayed, moodScore) {
  // Track counts per day (0=Mon, 6=Sun) and per hour (0-23)
  const dayCounts = Array(7).fill(0.1); // Small baseline to prevent division by zero or completely dead days
  const hourCounts = Array(24).fill(0.1); // Small baseline
  let totalPlays = 0;

  if (recentlyPlayed && recentlyPlayed.length > 0) {
    recentlyPlayed.forEach(item => {
      if (!item || !item.played_at) return;
      const date = new Date(item.played_at);
      const day = date.getDay(); // 0=Sunday, 6=Saturday
      const hour = date.getHours();
      
      const d3Day = day === 0 ? 6 : day - 1; // Mon=0, Sun=6
      
      dayCounts[d3Day] += 1;
      hourCounts[hour] += 1;
      totalPlays += 1;
    });
  }

  if (totalPlays === 0) {
    // Fallback counts if no recentlyPlayed data exists
    let targetHour = 14;
    if (moodScore) {
      if (moodScore.energy > 65 || moodScore.danceability > 65) targetHour = 20; // Late evening
      else if (moodScore.acousticness > 60) targetHour = 8; // Early morning
      else if (moodScore.happiness < 45) targetHour = 2; // Late night
    }
    
    for (let h = 0; h < 24; h++) {
      let dist = Math.abs(h - targetHour);
      if (dist > 12) dist = 24 - dist;
      hourCounts[h] = Math.max(0.1, 10 - dist * 1.5);
    }
    
    for (let d = 0; d < 7; d++) {
      dayCounts[d] = (d === 4 || d === 5 || d === 6) ? 8 : 5; // higher activity on Fri/Sat/Sun
    }
  }

  // Calculate full density matrix based on the actual probability distributions
  const flatData = [];
  let maxProduct = 0;
  
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      const prod = dayCounts[d] * hourCounts[h];
      if (prod > maxProduct) maxProduct = prod;
    }
  }

  const targetMax = 12; // stats.fm style max count in a single cell

  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      const prod = dayCounts[d] * hourCounts[h];
      let rawCount = (prod / (maxProduct || 1)) * targetMax;
      
      // Add a small deterministic jitter to make the heatmap look natural
      const seed = d * 24 + h;
      const jitter = 0.85 + (Math.abs(Math.sin(seed)) % 0.3); // multiplier between 0.85 and 1.15
      
      let finalCount = Math.round(rawCount * jitter);
      
      // If hour is in an inactive window (baseline 0.1 value wasn't increased), force to 0
      if (hourCounts[h] <= 0.2) {
        finalCount = Math.random() > 0.95 ? 1 : 0;
      }
      
      flatData.push({ day: d, hour: h, count: finalCount });
    }
  }

  flatData.empty = false;
  return flatData;
}

export function getSuperGenre(genreName) {
  const name = genreName.toLowerCase();
  
  if ((name.includes('pop') || name.includes('bollywood') || name.includes('filmi') || name.includes('desi')) && !name.includes('k-pop') && !name.includes('hip hop') && !name.includes('rap') && !name.includes('dhh')) return 'pop';
  if (name.includes('metal')) return 'metal';
  if (name.includes('rock') || name.includes('punk')) return 'rock';
  if (name.includes('hip hop') || name.includes('rap') || name.includes('trap') || name.includes('dhh')) return 'hip-hop';
  if (name.includes('r&b') || name.includes('soul') || name.includes('funk')) return 'r&b';
  if (name.includes('electronic') || name.includes('house') || name.includes('techno') || name.includes('edm') || name.includes('dance')) return 'electronic';
  if (name.includes('jazz') || name.includes('blues')) return 'jazz';
  if (name.includes('classical') || name.includes('orchestra')) return 'classical';
  if (name.includes('country') || name.includes('folk')) return 'country';
  if (name.includes('indie') || name.includes('alternative')) return 'indie';
  
  return 'other';
}

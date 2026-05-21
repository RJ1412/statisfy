export function classifyPersonality(topArtists, topTracks, moodScore, genres, heatmapData) {
  // Determine attributes
  const isEclectic = genres && genres.length > 15;
  const isPurist = !genres || genres.length < 5;
  
  const avgPop = topTracks && topTracks.length > 0 ? topTracks.reduce((sum, t) => sum + (t.popularity || 0), 0) / topTracks.length : 50;
  const isUnderground = avgPop < 40;
  const isMainstream = avgPop > 75;

  const isMoody = moodScore && moodScore.happiness < 40;

  const lateNightPlays = (heatmapData && !heatmapData.empty) ? heatmapData.filter(d => d.hour >= 0 && d.hour <= 5).reduce((sum, d) => sum + d.count, 0) : 0;
  const totalPlays = (heatmapData && !heatmapData.empty) ? Math.max(1, heatmapData.reduce((sum, d) => sum + d.count, 0)) : 1;
  const isNightOwl = (lateNightPlays / totalPlays) > 0.2;

  let oldTracksCount = 0;
  topTracks.forEach(t => {
    if (t.album && t.album.release_date) {
      const year = parseInt(t.album.release_date.substring(0, 4), 10);
      if (year < 2010) oldTracksCount++;
    }
  });
  const isNostalgic = oldTracksCount > (topTracks.length * 0.3);

  // Evaluate each archetype — return plain serializable objects (NO functions!)
  const archetypes = [
    {
      id: "adventurer",
      name: "The Adventurer",
      emoji: "🌍",
      tagline: "Genre-hopping maximalist",
      description: "You're not tied down to one sound. Your listening habits look like a musical passport filled with stamps from every corner of the sonic landscape.",
      traits: ["Eclectic", "Curious", "Trend-agnostic"],
      color: "var(--accent-teal)",
      matches: isEclectic && !isMainstream
    },
    {
      id: "night_owl",
      name: "The Night Owl",
      emoji: "🦉",
      tagline: "Creature of the late hours",
      description: "When the sun goes down, your volume goes up. You do your best listening while the rest of the world is asleep.",
      traits: ["Nocturnal", "Focused", "Atmospheric"],
      color: "var(--accent-purple)",
      matches: isNightOwl
    },
    {
      id: "underground_scout",
      name: "The Underground Scout",
      emoji: "🕵️",
      tagline: "Finding it before it's cool",
      description: "Pop radio is a foreign concept to you. You dig deep into the algorithms to find gems with less than 10k monthly listeners.",
      traits: ["Tastemaker", "Niche", "Devoted"],
      color: "var(--accent-amber)",
      matches: isUnderground
    },
    {
      id: "nostalgia_kid",
      name: "The Nostalgia Kid",
      emoji: "📼",
      tagline: "Living in the golden era",
      description: "New music is fine, but nothing beats the classics. You frequently find yourself taking trips down memory lane.",
      traits: ["Sentimental", "Classic", "Loyal"],
      color: "var(--accent-coral)",
      matches: isNostalgic
    },
    {
      id: "mood_curator",
      name: "The Mood Curator",
      emoji: "🌧️",
      tagline: "Feeling every single note",
      description: "You don't just listen to music; you absorb its emotional weight. Your playlists are highly specific emotional landscapes.",
      traits: ["Emotional", "Deep", "Introspective"],
      color: "#6366F1",
      matches: isMoody
    },
    {
      id: "mainstreamer",
      name: "The Mainstreamer",
      emoji: "🔥",
      tagline: "Riding the cultural wave",
      description: "If everyone is listening to it, so are you. You have an ear for hits and you love sharing the cultural moment.",
      traits: ["Current", "Social", "Upbeat"],
      color: "var(--accent-green)",
      matches: isMainstream
    },
    {
      id: "genre_purist",
      name: "The Genre Purist",
      emoji: "⛩️",
      tagline: "Deep in the rabbit hole",
      description: "You know what you like, and you stick to it. You appreciate the subtle nuances within your chosen sonic domain.",
      traits: ["Focused", "Specialized", "Expert"],
      color: "var(--text-primary)",
      matches: isPurist
    },
    {
      id: "loyalist",
      name: "The Loyalist",
      emoji: "🔁",
      tagline: "On loop forever",
      description: "You've found your favorites and you're sticking with them. You contribute significantly to your top artists' streaming numbers.",
      traits: ["Dedicated", "Consistent", "Passionate"],
      color: "#EC4899",
      matches: true
    }
  ];

  // Find first matching archetype and return without the 'matches' key
  const match = archetypes.find(a => a.matches) || archetypes[archetypes.length - 1];
  const { matches, ...result } = match;
  return result;
}

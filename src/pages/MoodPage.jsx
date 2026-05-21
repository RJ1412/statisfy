import React from 'react';
import useStore from '../store/useStore';
import useSpotifyData from '../hooks/useSpotifyData';
import ValenceScatter from '../components/charts/ValenceScatter';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';
export default function MoodPage() {
  const { isLoading, topTracks, mood, audioFeatures } = useStore();
  const { hasLoadedInit } = useSpotifyData();
  const [plotData, setPlotData] = React.useState([]);

  React.useEffect(() => {
    if (hasLoadedInit && topTracks.length > 0) {
      const merged = topTracks.map(track => {
        const feat = audioFeatures?.find(f => f && f.id === track.id);
        
        return {
          id: track.id,
          valence: feat ? feat.valence : 0.5,
          energy: feat ? feat.energy : 0.5,
          name: track.name || 'Unknown',
          artist: track.artists?.[0]?.name || 'Unknown',
          popularity: track.popularity || 0
        };
      });
      setPlotData(merged);
    }
  }, [topTracks, audioFeatures, hasLoadedInit]);

  if (isLoading || !hasLoadedInit) {
    return <LoadingState message="Measuring your vibes..." />;
  }

  if (!mood) {
    return <EmptyState title="Not enough data for mood analysis" />;
  }

  return (
    <div className="space-y-8 page-enter pb-12 pt-4">

      <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-8">
        
        {/* Scatter Plot */}
        <div className="card-grain bg-surface border border-border rounded-xl p-6 shadow-card h-[500px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <p className="font-eyebrow">VALENCE vs ENERGY</p>
            <p className="font-body text-[12px] text-text-secondary">Dots sized by popularity</p>
          </div>
          <div className="flex-1 min-h-0">
             {plotData.length > 0 ? (
              <ValenceScatter data={plotData} />
            ) : (
              <div className="h-full flex items-center justify-center text-text-muted">Loading Plot...</div>
            )}
          </div>
        </div>

        {/* Mood Sidebar */}
        <div className="card-grain bg-surface border border-border rounded-xl p-8 flex flex-col shadow-card">
          <p className="font-eyebrow mb-6">OVERALL VIBE</p>
          
          <h3 className="font-display text-[48px] font-bold text-text-primary leading-none mb-4">
            {mood.label}
          </h3>
          <p className="font-body text-[15px] text-text-secondary leading-relaxed mb-10">
            {mood.description}
          </p>

          <div className="space-y-6 mt-auto border-t border-border pt-6">
            <ProgressBar label="Happiness" val={mood.happiness} color="bg-green" />
            <ProgressBar label="Energy" val={mood.energy} color="bg-amber" />
            <ProgressBar label="Danceability" val={mood.danceability} color="bg-purple" />
            <ProgressBar label="Acousticness" val={mood.acousticness} color="bg-teal" />
          </div>
        </div>

      </div>
    </div>
  );
}

function ProgressBar({ label, val, color }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="font-eyebrow">{label}</span>
        <span className="font-mono text-[14px]">{val}%</span>
      </div>
      <div className="h-[2px] bg-elevated rounded-sm overflow-hidden">
        <div className={`h-full ${color} transition-all duration-1000 ease-out`} style={{width: `${val}%`}}></div>
      </div>
    </div>
  );
}

import React from 'react';
import useStore from '../store/useStore';
import useSpotifyData from '../hooks/useSpotifyData';
import TrackRow from '../components/cards/TrackRow';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';
import TrackStats from '../components/charts/TrackStats';

export default function TopTracksPage() {
  const { isLoading, topTracks } = useStore();
  const { hasLoadedInit } = useSpotifyData();

  if (isLoading || !hasLoadedInit) {
    return <LoadingState message="Loading your top tracks..." />;
  }

  if (!topTracks || topTracks.length === 0) {
    return <EmptyState title="No tracks found" />;
  }

  return (
    <div className="space-y-8 page-enter pt-4">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Radar Chart Sidebar */}
        <div className="lg:col-span-1 lg:order-2 sticky top-6">
          <div className="card-grain bg-surface border border-border rounded-xl p-6 shadow-card">
            <p className="font-eyebrow mb-2">TRACK ANALYTICS</p>
            <p className="font-body text-[13px] text-text-secondary mb-6 leading-relaxed">
              Distribution of release eras and metadata for your top tracks.
            </p>
            <TrackStats tracks={topTracks} />
          </div>
        </div>

        {/* Track List */}
        <div className="lg:col-span-2 lg:order-1 flex flex-col space-y-1 bg-surface border border-border rounded-xl p-2 md:p-4 shadow-card">
          {/* List Header */}
          <div className="hidden md:grid grid-cols-[32px_44px_1fr_1fr_48px] gap-3 px-3 py-2 border-b border-border mb-2">
            <div className="font-eyebrow text-right">#</div>
            <div className="font-eyebrow">TITLE</div>
            <div className="col-start-3 font-eyebrow"></div>
            <div className="font-eyebrow">ALBUM</div>
            <div className="font-eyebrow text-right">TIME</div>
          </div>

          {topTracks.map((track, i) => (
            <TrackRow 
              key={track.id} 
              track={track} 
              rank={i + 1} 
              index={i}
            />
          ))}
        </div>

      </div>
    </div>
  );
}

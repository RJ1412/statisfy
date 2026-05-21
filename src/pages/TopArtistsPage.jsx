import React from 'react';
import useStore from '../store/useStore';
import useSpotifyData from '../hooks/useSpotifyData';
import ArtistCard from '../components/cards/ArtistCard';
import GenreBubbles from '../components/charts/GenreBubbles';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';

export default function TopArtistsPage() {
  const { isLoading, topArtists, genres } = useStore();
  const { hasLoadedInit } = useSpotifyData();

  if (isLoading || !hasLoadedInit) {
    return <LoadingState message="Loading your top artists..." />;
  }

  if (!topArtists || topArtists.length === 0) {
    return <EmptyState title="No top artists found" />;
  }

  return (
    <div className="space-y-12 page-enter pb-12 pt-4">

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {topArtists.map((artist, i) => (
          <ArtistCard 
            key={artist.id} 
            artist={artist} 
            rank={i + 1} 
            index={i} 
          />
        ))}
      </div>

      <div className="pt-8 border-t border-border">
        <h2 className="text-[24px] font-display font-bold mb-6 text-center">GENRE CONSTELLATION</h2>
        <div className="card-grain bg-surface border border-border rounded-xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03)_0%,transparent_80%)] pointer-events-none" />
          <GenreBubbles data={genres} />
        </div>
      </div>
    </div>
  );
}

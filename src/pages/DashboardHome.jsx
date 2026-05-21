import React from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import useSpotifyData from '../hooks/useSpotifyData';
import StatCard from '../components/cards/StatCard';
import TrackRow from '../components/cards/TrackRow';
import ArtistCard from '../components/cards/ArtistCard';
import LoadingState, { SkeletonCard } from '../components/ui/LoadingState';
import MoodGauge from '../components/charts/MoodGauge';

export default function DashboardHome() {
  const { isLoading, topTracks, topArtists, genres, mood, diversityIndex, personality, user, heatmapData } = useStore();
  const { hasLoadedInit } = useSpotifyData();

  if (isLoading || !hasLoadedInit) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-elevated rounded-md w-1/3" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <SkeletonCard key={i} className="h-32" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SkeletonCard className="h-96" />
          <SkeletonCard className="h-96" />
        </div>
      </div>
    );
  }

  const topGenre = (genres && genres.length > 0) ? genres[0].genre : 'Various';

  // Compute real peak hour from heatmap data (inferred or actual)
  const peakHour = (() => {
    if (!heatmapData || heatmapData.length === 0) return '12 PM'; // Safe fallback
    const hourTotals = Array(24).fill(0);
    heatmapData.forEach(d => { hourTotals[d.hour] += d.count; });
    const peak = hourTotals.indexOf(Math.max(...hourTotals));
    const suffix = peak >= 12 ? 'PM' : 'AM';
    const display = peak === 0 ? 12 : peak > 12 ? peak - 12 : peak;
    return `${display} ${suffix}`;
  })();

  // Dynamic greeting label based on time of day
  const greetingLabel = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Morning Recap';
    if (h < 18) return 'Afternoon Snapshot';
    return 'Evening Digest';
  })();

  return (
    <div className="space-y-8 page-enter pt-4">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="VIBE SCORE" 
          value={Math.round(mood?.vibeScore || 0)} 
          subtitle={mood?.label || 'Balanced'}
          colorClass="text-amber"
          bgClass="bg-amber-dim"
          index={0}
        />
        <StatCard 
          title="TOP GENRE" 
          value={<span className="capitalize text-2xl truncate">{topGenre}</span>}
          subtitle={genres && genres.length > 0 ? `${genres[0].percentage}% of artists` : 'Exploring new sounds'}
          colorClass="text-purple"
          bgClass="bg-purple-dim"
          index={1}
        />
        <StatCard 
          title="DIVERSITY" 
          value={Math.round(diversityIndex?.score || 0)}
          subtitle={diversityIndex?.tier || 'Explorer'}
          colorClass="text-teal"
          bgClass="bg-teal-dim"
          index={2}
        />
        <StatCard 
          title="PEAK HOUR" 
          value={peakHour}
          subtitle="Most active time"
          colorClass="text-green"
          bgClass="bg-green-dim"
          index={3}
        />
      </div>

      {/* Middle Grid - Tracks & Artists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Top Tracks */}
        <div className="card-grain bg-surface border border-border rounded-xl p-5 md:p-6 relative overflow-hidden">
          <div className="flex justify-between items-end mb-6 relative z-10">
            <h2 className="text-[20px] font-display font-bold">TOP 5 TRACKS</h2>
            <Link to="/dashboard/tracks" className="text-[13px] font-body font-bold text-text-secondary hover:text-green transition-colors uppercase tracking-wider">
              View all &rarr;
            </Link>
          </div>
          <div className="space-y-1 relative z-10">
            {topTracks.slice(0, 5).map((track, i) => (
              <TrackRow key={track.id} track={track} rank={i + 1} index={i} />
            ))}
          </div>
        </div>

        {/* Top Artists */}
        <div className="card-grain bg-surface border border-border rounded-xl p-5 md:p-6 relative overflow-hidden">
          <div className="flex justify-between items-end mb-6 relative z-10">
            <h2 className="text-[20px] font-display font-bold">TOP 5 ARTISTS</h2>
            <Link to="/dashboard/artists" className="text-[13px] font-body font-bold text-text-secondary hover:text-green transition-colors uppercase tracking-wider">
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 relative z-10">
            {topArtists.slice(0, 5).map((artist, i) => (
              <ArtistCard 
                key={artist.id} 
                artist={artist} 
                rank={i + 1} 
                index={i} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid - Vibe & Archetype */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Vibe */}
        <div className="card-grain bg-surface border border-border rounded-xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
          <h2 className="absolute top-6 left-6 text-[20px] font-display font-bold z-10">YOUR VIBE</h2>
          <div className="scale-110 mt-6 relative z-10">
            <MoodGauge score={mood?.vibeScore || 0} tierLabel={mood?.label || 'Balanced'} />
          </div>
        </div>

        {/* Archetype */}
        <div className="card-grain bg-surface border border-border rounded-xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[300px] group cursor-pointer" onClick={() => window.location.hash = '#/dashboard/personality'}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(157,113,248,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-slow pointer-events-none" />
          <h2 className="absolute top-6 left-6 text-[20px] font-display font-bold z-10">YOUR ARCHETYPE</h2>
          
          <div className="text-center relative z-10 mt-8">
            <h3 className="text-[40px] font-display font-bold text-purple mb-2 drop-shadow-md group-hover:scale-105 transition-transform duration-spring">
              {personality?.name || 'Loading'}
            </h3>
            <p className="font-body text-sm text-text-secondary max-w-[280px]">
              {personality?.tagline || 'Analyzing your unique musical DNA...'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

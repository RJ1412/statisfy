import React from 'react';
import useStore from '../store/useStore';
import useSpotifyData from '../hooks/useSpotifyData';
import GenreBar from '../components/charts/GenreBar';
import GenreBubbles from '../components/charts/GenreBubbles';
import MoodGauge from '../components/charts/MoodGauge';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';

export default function GenresPage() {
  const { isLoading, genres, diversityIndex } = useStore();
  const { hasLoadedInit } = useSpotifyData();
  const [viewMode, setViewMode] = React.useState('bar'); // 'bar' or 'cloud'

  if (isLoading || !hasLoadedInit) {
    return <LoadingState message="Analyzing your genre profile..." />;
  }

  if (!genres || genres.length === 0) {
    return <EmptyState title="Explore music to discover your top genres" />;
  }

  return (
    <div className="space-y-8 page-enter pb-12 pt-4">

      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 items-stretch">
        
        {/* Genre Visualization Area */}
        <div className="card-grain bg-surface border border-border rounded-xl p-6 shadow-card min-h-[460px] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <p className="font-eyebrow">TOP GENRES BREAKDOWN</p>
            <div className="flex bg-void p-1 rounded-pill border border-border">
              <button
                onClick={() => setViewMode('bar')}
                className={`px-3 py-1 text-[11px] font-bold rounded-pill transition-all ${
                  viewMode === 'bar' 
                    ? 'bg-green text-void shadow-glow-green' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('cloud')}
                className={`px-3 py-1 text-[11px] font-bold rounded-pill transition-all ${
                  viewMode === 'cloud' 
                    ? 'bg-green text-void shadow-glow-green' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Cloud
              </button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center min-h-0">
            {viewMode === 'bar' ? (
              <GenreBar data={genres} />
            ) : (
              <GenreBubbles data={genres} />
            )}
          </div>
        </div>

        {/* Diversity Gauge Area */}
        <div className="card-grain bg-surface border border-border rounded-xl p-6 shadow-card flex flex-col items-center justify-center min-h-[460px] text-center">
          <p className="font-eyebrow mb-8 w-full text-left">DIVERSITY INDEX</p>
          
          <div className="scale-125 mb-8">
            <MoodGauge score={diversityIndex?.score || 0} tierLabel={diversityIndex?.tier || 'Unknown'} />
          </div>

          <div className="mt-8 pt-6 border-t border-border w-full">
            <p className="font-body text-[13px] text-text-secondary">
              Based on Shannon entropy calculation of your top {genres.length} genres.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

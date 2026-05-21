import React, { useRef, useState } from 'react';
import useStore from '../store/useStore';
import useSpotifyData from '../hooks/useSpotifyData';
import PersonalityCard from '../components/cards/PersonalityCard';
import Button from '../components/ui/Button';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';
import { exportComponentAsPNG } from '../utils/export';
import { Download, Share2, Palette } from 'lucide-react';

export default function PersonalityCardPage() {
  const { isLoading, user, personality, topArtists, topTracks, mood, genres } = useStore();
  const { hasLoadedInit } = useSpotifyData();
  const cardRef = useRef(null);
  const [theme, setTheme] = useState('midnight');
  const [isExporting, setIsExporting] = useState(false);

  if (isLoading || !hasLoadedInit) {
    return <LoadingState message="Forging your persona..." />;
  }

  if (!personality || !topArtists.length || !topTracks.length) {
    return <EmptyState title="Not enough data to generate card" />;
  }

  const handleExport = async () => {
    setIsExporting(true);
    await exportComponentAsPNG(cardRef, `${user?.display_name || 'user'}-spotify-persona.png`, 2); // scale 2 for retina
    setIsExporting(false);
  };

  const cardData = {
    user,
    archetype: personality,
    topArtists,
    topTrack: topTracks[0],
    vibeScore: mood?.vibeScore ?? 0,
    energyScore: mood?.energy ?? 0,
    genresCount: genres?.length ?? 0
  };

  return (
    <div className="space-y-8 page-enter pb-12 pt-4">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Editor Controls */}
        <div className="bg-surface border border-border rounded-xl p-6 lg:col-span-1 sticky top-6 shadow-card">
          <h3 className="font-display font-bold text-[18px] mb-6 flex items-center">
            <Palette className="w-5 h-5 mr-2 text-green" />
            Customize Card
          </h3>
          
          <div className="space-y-4 mb-8">
            <p className="font-eyebrow">THEME</p>
            <div className="grid grid-cols-2 gap-3">
              {['midnight', 'aurora', 'vinyl', 'neon'].map(t => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`py-2 px-3 rounded-md font-body text-[13px] font-bold capitalize transition-all border ${
                    theme === t 
                      ? 'border-green bg-green-trace text-green shadow-glow-green' 
                      : 'border-border hover:border-active text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${theme === t ? 'bg-green' : 'bg-transparent border border-text-muted'}`} />
                    {t}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-border">
            <Button 
              onClick={handleExport} 
              className="w-full justify-center"
              disabled={isExporting}
            >
              {isExporting ? 'GENERATING...' : 'DOWNLOAD PNG'}
              {!isExporting && <Download className="w-4 h-4 ml-2" />}
            </Button>
            
            <p className="font-body text-[12px] text-text-secondary text-center">
              Image exports at high resolution (1600x840px)
            </p>
          </div>
        </div>

        {/* Card Preview Container */}
        <div className="lg:col-span-2 bg-[#000] border border-border rounded-xl overflow-hidden shadow-card min-h-[350px] sm:min-h-[450px] relative w-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-[0.7] xl:scale-[0.85] transition-transform duration-slow">
            <div className="shadow-[0_20px_60px_rgba(0,0,0,0.8)] rounded-[32px]">
              <PersonalityCard ref={cardRef} data={cardData} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';

export default function TrackRow({ track, rank, audioFeatures, index }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  const feature = audioFeatures?.find(f => f?.id === track.id);

  return (
    <div 
      className="group bg-transparent hover:bg-elevated rounded-md border border-transparent hover:border-border transition-colors duration-fast overflow-hidden"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div 
        className="grid grid-cols-[32px_44px_1fr] md:grid-cols-[32px_44px_1fr_1fr_48px] items-center gap-3 p-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="text-right font-mono text-[14px] text-text-muted group-hover:text-text-secondary transition-colors">
          {rank}
        </div>
        
        <div className="relative w-11 h-11 rounded overflow-hidden">
          <img 
            src={track.album.images[2]?.url || track.album.images[0]?.url} 
            alt={track.album.name} 
            className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
        </div>
        
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-body text-[14px] font-semibold text-text-primary truncate group-hover:text-green transition-colors">
            {track.name}
          </h3>
          <p className="font-body text-[13px] text-text-secondary truncate">
            {track.artists.map(a => a.name).join(', ')}
          </p>
        </div>
        
        {/* Desktop only columns */}
        <div className="hidden md:block font-body text-[13px] text-text-secondary truncate pr-4">
          {track.album.name}
        </div>

        <div className="hidden md:block font-mono text-[12px] text-text-muted text-right">
          {formatDuration(track.duration_ms)}
        </div>
      </div>

      {/* Expanded view for track metadata */}
      <div 
        className="bg-black/20 px-4 md:px-16 overflow-hidden transition-all duration-slow ease-spring"
        style={{ maxHeight: isExpanded ? '140px' : '0px' }}
      >
        <div className={`py-4 border-t border-glass-border transform transition-transform duration-slow flex flex-wrap gap-x-8 gap-y-4 md:gap-16 ${isExpanded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <div>
            <p className="font-eyebrow text-[10px] text-text-muted mb-1">RELEASED</p>
            <p className="font-mono text-sm text-text-primary">{track.album?.release_date || 'Unknown'}</p>
          </div>
          <div>
            <p className="font-eyebrow text-[10px] text-text-muted mb-1">TYPE</p>
            <p className="font-body text-sm text-text-primary capitalize">{track.album?.album_type || 'Single'}</p>
          </div>
          <div>
            <p className="font-eyebrow text-[10px] text-text-muted mb-1">RATING</p>
            <p className="font-body text-sm text-text-primary">{track.explicit ? 'Explicit' : 'Clean'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


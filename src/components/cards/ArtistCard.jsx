import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

export default function ArtistCard({ artist, rank, index }) {
  const imageUrl = artist?.images?.[1]?.url || artist?.images?.[0]?.url || 'https://images.unsplash.com/photo-1514525253344-f814d074e015?q=80&w=200&auto=format&fit=crop';
  const artistName = artist?.name || 'Unknown Artist';
  // Fallback mock data for fingerprint if needed visually
  const mockEnergy = Math.random() * 40 + 40;
  const mockValence = Math.random() * 60 + 20;

  return (
    <div 
      className="group relative w-full aspect-square animate-stagger-in artist-card-wrapper cursor-pointer"
      style={{ animationDelay: `${index * 30}ms`, perspective: '800px' }}
    >
      <div className="artist-card-inner relative w-full h-full transform-style-3d transition-transform duration-500 ease-out group-hover:md:rotate-y-180">
        
        {/* FRONT FACE */}
        <div className="artist-card-front absolute inset-0 backface-hidden rounded-lg overflow-hidden bg-surface border border-border group-hover:border-active transition-colors">
          <img 
            src={imageUrl} 
            alt={artist.name} 
            className="w-full h-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
          
          {/* Rank Badge */}
          <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-surface/90 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-lg">
            <span className="font-mono text-[12px] font-medium text-text-primary">{rank}</span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col justify-end">
            <h3 className="font-body text-[14px] font-bold text-white truncate drop-shadow-md">
              {artistName}
            </h3>
            {artist?.genres && (
              <p className="font-mono text-[10px] text-green mt-0.5 uppercase truncate">
                {artist.genres[0]}
              </p>
            )}
          </div>
        </div>

        {/* BACK FACE (Desktop hover only) */}
        <div className="artist-card-back absolute inset-0 backface-hidden rounded-lg overflow-hidden bg-surface border border-active p-[5cqw] rotate-y-180 flex flex-col justify-center gap-[4cqw] shadow-glow-purple">
          <div>
            <h3 className="font-display text-[8.5cqw] font-bold text-white truncate mb-[2cqw]">
              {artistName}
            </h3>
            
            {artist.genres && artist.genres.length > 0 && (
              <div className="flex flex-wrap gap-[1.5cqw]">
                {artist.genres.slice(0, 2).map(g => (
                  <span key={g} className="px-[2cqw] py-[0.5cqw] border border-green text-green text-[5cqw] font-body rounded-sm capitalize truncate max-w-[42cqw]">
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-[2.5cqw]">
            <div className="space-y-[2cqw]">
              <div>
                <div className="flex justify-between font-mono text-[4.5cqw] text-text-muted mb-[1cqw]">
                  <span>ENERGY</span><span>{Math.round(mockEnergy)}%</span>
                </div>
                <div className="h-[1.5cqw] bg-void rounded-sm overflow-hidden"><div className="h-full bg-amber" style={{width: `${mockEnergy}%`}}></div></div>
              </div>
              <div>
                <div className="flex justify-between font-mono text-[4.5cqw] text-text-muted mb-[1cqw]">
                  <span>VALENCE</span><span>{Math.round(mockValence)}%</span>
                </div>
                <div className="h-[1.5cqw] bg-void rounded-sm overflow-hidden"><div className="h-full bg-purple" style={{width: `${mockValence}%`}}></div></div>
              </div>
            </div>

            {artist?.external_urls?.spotify && (
              <a 
                href={artist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center w-full py-[2.5cqw] border border-green text-green hover:bg-green hover:text-black rounded text-[5.5cqw] font-body font-bold transition-colors"
              >
                Open in Spotify
                <ExternalLink className="w-[6cqw] h-[6cqw] ml-[1.5cqw]" />
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

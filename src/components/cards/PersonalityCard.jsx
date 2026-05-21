import React, { forwardRef } from 'react';
import { Music2 } from 'lucide-react';

const PersonalityCard = forwardRef(({ data, theme = 'midnight' }, ref) => {
  if (!data || !data.archetype || !data.user) return null;

  const { user, archetype, topArtists, topTrack } = data;
  
  // Theme map to Tailwind/CSS classes
  const themeStyles = {
    midnight: {
      card: "bg-[linear-gradient(135deg,#08080f_0%,#0f0f1e_50%,#080818_100%)] text-[#F0EFF8]",
      accent: "text-[#1DB954]",
      accentBg: "bg-[#1DB954]",
      border: "border-white/10",
      glow: "bg-[radial-gradient(ellipse_200px_150px_at_15%_20%,rgba(29,185,84,0.08)_0%,transparent_70%)]"
    },
    aurora: {
      card: "bg-[linear-gradient(135deg,#0a0518_0%,#0d1a2e_100%)] text-[#F0EFF8]",
      accent: "text-[#2EE8C7]",
      accentBg: "bg-[#2EE8C7]",
      border: "border-white/10",
      glow: "bg-[radial-gradient(circle_at_80%_80%,rgba(157,113,248,0.15)_0%,transparent_50%)]"
    },
    vinyl: {
      card: "bg-[#f0ece4] text-[#1a1208]",
      accent: "text-[#F5A623]",
      accentBg: "bg-[#F5A623]",
      border: "border-[#1a1208]/20",
      glow: ""
    },
    neon: {
      card: "bg-[#000000] text-[#FFFFFF]",
      accent: "text-[#F06292]",
      accentBg: "bg-[#F06292]",
      border: "border-[#F06292]/30",
      glow: "bg-[radial-gradient(circle_at_50%_0%,rgba(240,98,146,0.15)_0%,transparent_60%)]"
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles.midnight;

  // Split name for animation
  const nameChars = archetype.name.split('');

  return (
    <div 
      ref={ref}
      className={`card-grain relative w-[800px] h-[420px] overflow-hidden rounded-[32px] ${currentTheme.card} ${currentTheme.border} border p-10 flex flex-col font-body`}
      style={{
        boxSizing: 'border-box'
      }}
    >
      {/* Background Glow */}
      {currentTheme.glow && <div className={`absolute inset-0 pointer-events-none ${currentTheme.glow}`} />}
      
      {/* Decorative SVG Vinyl Ring */}
      <svg className={`absolute -bottom-24 -right-24 w-80 h-80 opacity-[0.06] ${theme === 'vinyl' ? 'text-[#1a1208]' : 'text-white'} pointer-events-none`} viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </svg>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center">
          <div className={`w-2.5 h-2.5 rounded-full mr-2 ${currentTheme.accentBg}`} />
          <span className="font-display font-bold text-[14px] tracking-widest uppercase">
            STATSIFY
          </span>
        </div>
        <Music2 className="w-5 h-5 opacity-80" />
      </div>

      {/* Title */}
      <div className="mb-4 relative z-10">
        <p className={`font-mono text-[10px] tracking-[0.2em] uppercase mb-2 ${theme === 'vinyl' ? 'text-[#1a1208]/60' : 'text-white/50'}`}>
          {user?.display_name?.toUpperCase()}'S MUSIC DNA
        </p>
        <div className="h-[1px] w-full bg-current opacity-10 mb-4" />
      </div>

      {/* Archetype Reveal */}
      <div className="relative z-10 mb-6">
        <h1 className="font-display font-bold text-[52px] leading-none mb-1 tracking-tight flex whitespace-pre">
          <span className={`${currentTheme.accent} mr-3`}>✦</span>
          {nameChars.map((char, i) => (
            <span 
              key={i} 
              className="inline-block animate-[letterDrop_400ms_cubic-bezier(0.34,1.56,0.64,1)_both]"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {char}
            </span>
          ))}
        </h1>
        <p className={`font-body text-[14px] ml-[44px] ${theme === 'vinyl' ? 'text-[#1a1208]/70' : 'text-white/60'}`}>
          {archetype.tagline}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="flex gap-4 mb-auto relative z-10 ml-[44px]">
        {[
          { label: 'VIBE', val: Math.round(data.vibeScore || 85) },
          { label: 'ENERGY', val: Math.round(data.energyScore || 70) },
          { label: 'GENRES', val: data.genresCount || 15 }
        ].map(stat => (
          <div key={stat.label} className={`border ${currentTheme.border} rounded-lg px-4 py-2 flex flex-col items-center min-w-[80px] bg-white/5`}>
            <span className="font-mono text-[32px] font-medium leading-none mb-1">{stat.val}</span>
            <span className={`font-eyebrow text-[9px] ${theme === 'vinyl' ? 'text-[#1a1208]/60' : 'text-white/50'}`}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Footer Data */}
      <div className="mt-auto relative z-10 grid grid-cols-[1fr_auto] items-end gap-8">
        <div className="space-y-1.5">
          <div className="flex items-baseline">
            <span className={`font-eyebrow w-[100px] ${theme === 'vinyl' ? 'text-[#1a1208]/60' : 'text-white/50'}`}>TOP ARTISTS</span>
            <span className="font-body text-[13px] font-semibold truncate max-w-[280px]">
              {topArtists?.slice(0, 3).map(a => a.name).join(' · ')}
            </span>
          </div>
          <div className="flex items-baseline">
            <span className={`font-eyebrow w-[100px] ${theme === 'vinyl' ? 'text-[#1a1208]/60' : 'text-white/50'}`}>TOP TRACK</span>
            <span className="font-body text-[13px] font-semibold truncate max-w-[280px]">
              "{topTrack?.name}" — {topTrack?.artists[0]?.name}
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <p className={`font-mono text-[10px] ${theme === 'vinyl' ? 'text-[#1a1208]/60' : 'text-white/50'}`}>
            statsify.app<br/>
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
      
      {/* Inline Keyframes just for this component to ensure html2canvas catches it if needed, though Tailwind handles the main animation. */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes letterDrop {
          from { opacity: 0; transform: translateY(-20px) rotate(-2deg); }
          to   { opacity: 1; transform: translateY(0) rotate(0); }
        }
      `}} />
    </div>
  );
});

export default PersonalityCard;

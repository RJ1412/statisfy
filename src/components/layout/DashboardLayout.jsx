import React, { useState } from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { Check } from 'lucide-react';
import Sidebar from './Sidebar';
import Toast from '../ui/Toast';
import useStore from '../../store/useStore';
import TimeRangePicker from '../ui/TimeRangePicker';

export default function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, topTracks, topArtists, genres, mood, isLoading } = useStore();

  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-void overflow-hidden relative text-text-primary">
      <Sidebar 
        isOpen={mobileMenuOpen} 
        onClose={setMobileMenuOpen} 
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto overflow-x-hidden pb-20 md:pb-0 md:ml-16 xl:ml-60 transition-all duration-300">
        
        {/* stats.fm-inspired Profile Header Banner */}
        <div className="relative w-full overflow-hidden border-b border-border bg-base/50">
          
          {/* Cover Banner with Ambient Mesh Gradient */}
          <div 
            className="w-full h-32 md:h-48 mesh-glow-animate relative overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(29, 185, 84, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(157, 113, 248, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(46, 232, 199, 0.08) 0%, transparent 60%), linear-gradient(135deg, #090a0f 0%, #151824 100%)'
            }}
          >
            {/* Subtle grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>

          {/* Profile Info Overlay Row */}
          <div className="px-4 md:px-8 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 -mt-10 md:-mt-16">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-4 text-center md:text-left">
              
              {/* Avatar with Glow Border */}
              <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-base overflow-hidden bg-elevated shadow-lg hover:scale-105 transition-transform duration-base">
                {user?.images?.[0]?.url ? (
                  <img 
                    src={user.images[0].url} 
                    alt={user.display_name} 
                    className="w-full h-full object-cover relative z-10"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-elevated text-2xl md:text-3xl font-bold text-green relative z-10">
                    {user?.display_name?.[0] || 'U'}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full border-2 border-green/30 scale-105 pointer-events-none"></div>
              </div>

              {/* User Bio Details */}
              <div className="pb-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                  <h2 className="font-display text-[22px] md:text-[28px] font-bold text-text-primary tracking-tight leading-none">
                    {user?.display_name || 'User'}
                  </h2>
                  
                  {/* Verified Tick Badge */}
                  <div 
                    className="flex items-center justify-center bg-[#2EE8C7]/10 text-[#2EE8C7] p-0.5 rounded-full border border-[#2EE8C7]/20" 
                    title="Verified Spotify Stats Profile"
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>

                  {/* stats.fm-style Green Plus Tag */}
                  <span 
                    className="bg-green text-void text-[9px] font-bold px-1.5 py-0.5 rounded-sm leading-none tracking-widest shadow-glow-green" 
                    title="statsify Plus Activated"
                  >
                    PLUS
                  </span>
                </div>
                
                <p className="font-mono text-[11px] md:text-[12px] text-text-secondary capitalize">
                  @{user?.id || 'spotify_user'} &middot; {user?.product || 'free'} plan
                </p>
              </div>
            </div>

            {/* Quick Summary Metrics Grid */}
            <div className="flex flex-wrap items-center justify-center gap-3 pb-1">
              {[
                { label: 'TRACKS', val: isLoading ? '—' : (topTracks?.length || 0) },
                { label: 'ARTISTS', val: isLoading ? '—' : (topArtists?.length || 0) },
                { label: 'GENRES', val: isLoading ? '—' : (genres?.length || 0) },
                { label: 'VIBE SCORE', val: isLoading ? '—' : `${Math.round(mood?.vibeScore || 0)}%`, accent: true }
              ].map((metric, i) => (
                <div 
                  key={i} 
                  className={`px-3 md:px-4 py-1.5 md:py-2 border rounded-lg bg-surface/40 backdrop-blur-sm transition-all min-w-[70px] md:min-w-[85px] text-center
                    ${metric.accent 
                      ? 'border-green/20 hover:border-green/40 shadow-glow-green' 
                      : 'border-border hover:border-active'
                    }
                  `}
                >
                  <div className="font-mono text-[16px] md:text-[20px] font-bold text-text-primary leading-none mb-1">
                    {metric.val}
                  </div>
                  <div className="font-eyebrow text-[8px] md:text-[9px] text-text-secondary leading-none">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky Scrollable Navigation Tab Bar */}
          <div className="border-t border-border/80 px-4 md:px-8 bg-surface/30 backdrop-blur-sm flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
            <div className="flex space-x-1.5 py-2.5">
              {[
                { to: '/dashboard', label: 'Overview', end: true },
                { to: '/dashboard/tracks', label: 'Top Tracks' },
                { to: '/dashboard/artists', label: 'Top Artists' },
                { to: '/dashboard/genres', label: 'Top Genres' },
                { to: '/dashboard/mood', label: 'Vibe Analysis' },
                { to: '/dashboard/heatmap', label: 'Listening Pattern' },
                { to: '/dashboard/personality', label: 'My Card' }
              ].map(tab => (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.end}
                  className={({ isActive }) => `
                    px-3 py-1.5 rounded-pill font-body text-[12px] md:text-[13px] font-bold transition-all whitespace-nowrap
                    ${isActive 
                      ? 'bg-green text-void shadow-glow-green scale-100' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-elevated/40 scale-95'
                    }
                  `}
                >
                  {tab.label}
                </NavLink>
              ))}
            </div>
            
            <div className="py-2 flex-shrink-0">
              <TimeRangePicker />
            </div>
          </div>
        </div>

        {/* Child Router Outlets */}
        <div className="flex-1 p-4 md:p-8 max-w-[1200px] w-full mx-auto relative z-10">
          <Outlet />
        </div>
      </main>

      <Toast />
    </div>
  );
}

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Music, Users, Hash, HeartPulse, Calendar, Image as ImageIcon, LogOut, MoreHorizontal } from 'lucide-react';
import useStore from '../../store/useStore';
import { logout } from '../../services/auth';
import TimeRangePicker from '../ui/TimeRangePicker';

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useStore();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/dashboard/tracks', icon: Music, label: 'Top Tracks' },
    { to: '/dashboard/artists', icon: Users, label: 'Top Artists' },
    { to: '/dashboard/mood', icon: HeartPulse, label: 'Mood' },
    { to: '/dashboard/personality', icon: ImageIcon, label: 'My Card' },
    { to: '/dashboard/heatmap', icon: Calendar, label: 'Heatmap', hideMobile: true },
    { to: '/dashboard/genres', icon: Hash, label: 'Genres', hideMobile: true },
  ];

  return (
    <>
      {/* Mobile Backdrop for full menu if needed */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-void/90 backdrop-blur-md z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Desktop & Tablet */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 hidden md:flex flex-col bg-base border-r border-border transition-all duration-300 ease-out
        w-16 xl:w-60
      `}>
        {/* App Logo */}
        <div className="p-4 xl:p-6 border-b border-border flex items-center justify-center xl:justify-start">
          <div className="w-2 h-2 rounded-full bg-green shadow-glow-green xl:mr-3"></div>
          <span className="hidden xl:block font-display font-bold text-[18px] tracking-wide">STATSIFY</span>
        </div>

        {/* User Info - Only on XL */}
        <div className="hidden xl:flex p-6 border-b border-border items-center space-x-4">
          <div className="relative">
            {user?.images?.[0]?.url ? (
              <img src={user.images[0].url} alt={user.display_name} className="w-10 h-10 rounded-full object-cover relative z-10" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center relative z-10">
                <span className="text-lg font-bold text-green">{user?.display_name?.[0] || 'U'}</span>
              </div>
            )}
            <div className="absolute inset-0 rounded-full border-2 border-border-green scale-110 pointer-events-none"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-text-primary truncate">{user?.display_name || 'User'}</h2>
            <p className="text-xs text-text-secondary truncate capitalize">{user?.product || 'Spotify Free'} Plan</p>
          </div>
        </div>

        {/* Desktop Time Range */}
        <div className="hidden xl:block px-6 pt-6 pb-2">
          <p className="font-eyebrow mb-3">TIME RANGE</p>
          <TimeRangePicker />
        </div>
        <div className="hidden xl:block px-6 pt-4 pb-2">
          <p className="font-eyebrow mb-2">NAVIGATION</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 xl:py-2 px-2 xl:px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              title={item.label}
              className={({ isActive }) => `
                nav-item flex items-center justify-center xl:justify-start px-0 xl:px-4 py-3 xl:py-2.5 rounded-md text-sm font-medium transition-all duration-base ease-out group
                ${isActive 
                  ? 'text-green bg-green-trace' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-elevated'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="hidden xl:block ml-3">{item.label}</span>
                  {isActive && <div className="absolute left-0 top-[20%] bottom-[20%] w-[3px] bg-green rounded-r-sm shadow-glow-green"></div>}
                  
                  {/* Tooltip for Tablet */}
                  <div className="xl:hidden absolute left-full ml-4 px-2 py-1 bg-elevated text-text-primary text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-card border border-border">
                    {item.label}
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Disconnect */}
        <div className="p-2 xl:p-4 border-t border-border mt-auto">
          <button
            onClick={logout}
            title="Disconnect"
            className="flex items-center justify-center xl:justify-start w-full px-2 xl:px-4 py-3 xl:py-2 text-sm font-medium text-text-secondary hover:text-coral transition-colors rounded-md hover:bg-coral/10 group"
          >
            <LogOut className="w-5 h-5 xl:mr-3" />
            <span className="hidden xl:block">Disconnect</span>
            
            <div className="xl:hidden absolute left-full ml-4 px-2 py-1 bg-elevated text-coral text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-card border border-coral/20">
              Disconnect
            </div>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[60px] bg-surface border-t border-border flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] z-50">
        {navItems.filter(item => !item.hideMobile).slice(0, 4).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) => `
              flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors
              ${isActive ? 'text-green' : 'text-text-secondary hover:text-text-primary'}
            `}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
        {/* "More" menu toggle on mobile */}
        <button 
          onClick={() => onClose(!isOpen)}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isOpen ? 'text-green' : 'text-text-secondary'}`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </div>

      {/* Mobile Overlay Menu */}
      <div className={`
        md:hidden fixed inset-x-0 bottom-[60px] bg-surface border-t border-border rounded-t-xl z-40 transform transition-transform duration-300 ease-out flex flex-col p-4 space-y-2
        ${isOpen ? 'translate-y-0' : 'translate-y-full opacity-0 pointer-events-none'}
      `}>
        <p className="font-eyebrow mb-2">More Options</p>
        {navItems.filter(item => item.hideMobile).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => onClose(false)}
            className="flex items-center px-4 py-3 rounded-md text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-elevated"
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
        <div className="pt-4 mt-2 border-t border-border">
          <p className="font-eyebrow mb-3">Time Range</p>
          <TimeRangePicker />
        </div>
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 mt-2 text-sm font-medium text-coral hover:bg-coral/10 rounded-md"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Disconnect
        </button>
      </div>
    </>
  );
}

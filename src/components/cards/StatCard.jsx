import React, { useEffect, useState } from 'react';

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  colorClass = "text-green", 
  bgClass = "bg-green-dim",
  index = 0
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const isNumber = typeof value === 'number';

  useEffect(() => {
    if (!isNumber) return;
    
    // Count-up animation
    let startTimestamp = null;
    const duration = 800; // 800ms
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOut cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      setDisplayValue(Math.floor(easeProgress * value));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value, isNumber]);

  return (
    <div 
      className="card-grain bg-surface border border-border rounded-lg p-5 md:p-6 relative overflow-hidden group hover:border-active transition-all duration-base animate-slide-up shadow-sm hover:shadow-card"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-eyebrow text-text-muted group-hover:text-text-secondary transition-colors">{title}</h3>
          {Icon && (
            <div className={`p-2 rounded-md ${bgClass} shadow-sm group-hover:shadow-md transition-shadow`}>
              <Icon className={`w-4 h-4 md:w-5 md:h-5 ${colorClass}`} />
            </div>
          )}
        </div>
        
        <div className="mt-auto pt-4">
          <p className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-1 tracking-tight">
            {isNumber ? displayValue : value}
          </p>
          {subtitle && (
            <p className="font-body text-[13px] text-text-secondary line-clamp-2">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Subtle glow orb bottom right */}
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[40px] opacity-10 group-hover:opacity-30 transition-opacity duration-slow pointer-events-none ${bgClass.replace('-dim', '')}`} />
    </div>
  );
}

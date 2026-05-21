import React from 'react';

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  icon: Icon = null
}) {
  const baseStyles = "inline-flex items-center justify-center font-body font-bold rounded-pill transition-all duration-base ease-spring focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-void disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-green text-black hover:bg-green/90 shadow-glow-green hover:scale-[1.04] active:scale-[0.98] px-8 py-4 text-[16px] focus:ring-green",
    secondary: "bg-surface text-text-primary hover:bg-glass border border-border px-5 py-2.5 text-sm focus:ring-white/20",
    outline: "bg-transparent text-text-primary hover:bg-glass border border-border px-5 py-2.5 text-sm focus:ring-white/20"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="w-5 h-5 mr-3" />}
      {children}
    </button>
  );
}

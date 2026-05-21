import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = "Loading...", fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4 text-text-secondary h-full min-h-[200px]">
      <div className="relative">
        <Loader2 className="w-10 h-10 text-green animate-spin relative z-10" />
        <div className="absolute inset-0 bg-green rounded-full blur-xl opacity-30 animate-pulse"></div>
      </div>
      <p className="font-display font-medium text-lg tracking-wide">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-void z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

export function SkeletonCard({ className = "" }) {
  return (
    <div className={`skeleton skeleton-card ${className}`} />
  );
}

export function SkeletonText({ className = "", width = "100%" }) {
  return (
    <div className={`skeleton h-[14px] ${className}`} style={{ width }} />
  );
}

export function SkeletonCircle({ size = 40, className = "" }) {
  return (
    <div className={`skeleton skeleton-circle ${className}`} style={{ width: size, height: size }} />
  );
}

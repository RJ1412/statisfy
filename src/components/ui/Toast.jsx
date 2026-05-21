import React, { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function Toast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleRateLimit = (e) => {
      setToast({
        type: 'warning',
        message: `Spotify rate limit reached. Retrying in ${Math.ceil(e.detail.waitTime / 1000)}s...`
      });
      setTimeout(() => setToast(null), e.detail.waitTime);
    };

    const handleError = (e) => {
      setToast({
        type: 'error',
        message: e.detail.message || 'An error occurred'
      });
      setTimeout(() => setToast(null), 5000);
    };

    window.addEventListener('spotify-rate-limit', handleRateLimit);
    window.addEventListener('app-error', handleError);

    return () => {
      window.removeEventListener('spotify-rate-limit', handleRateLimit);
      window.removeEventListener('app-error', handleError);
    };
  }, []);

  if (!toast) return null;

  const isError = toast.type === 'error';
  const Icon = AlertCircle;
  const colorClass = isError ? 'text-coral' : 'text-amber';
  const bgClass = isError ? 'bg-coral/10 border-coral/20' : 'bg-amber/10 border-amber/20';

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-[100] animate-[toastIn_300ms_var(--ease-spring)_both]">
      <div className={`flex items-center space-x-3 px-5 py-3 rounded-md border ${bgClass} backdrop-blur-md shadow-card max-w-sm`}>
        <Icon className={`w-5 h-5 ${colorClass}`} />
        <p className={`text-sm font-body font-medium ${colorClass} flex-1`}>{toast.message}</p>
        <button onClick={() => setToast(null)} className={`${colorClass} hover:opacity-70 transition-opacity`}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

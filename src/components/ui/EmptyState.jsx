import React from 'react';
import { Music, Disc3, Mic2, Activity } from 'lucide-react';
import Button from './Button';
import useTimeRange from '../../hooks/useTimeRange';

export default function EmptyState({ 
  icon: Icon = Music, 
  title = "No data available", 
  description = "We couldn't find any data for this section in the selected time period.",
  showAction = true 
}) {
  const { timeRange, setTimeRange } = useTimeRange();

  const handleSwitchRange = () => {
    // If not long term, switch to long term, otherwise try medium
    setTimeRange(timeRange !== 'long_term' ? 'long_term' : 'medium_term');
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-card rounded-2xl border border-border h-full min-h-[300px]">
      <div className="w-16 h-16 rounded-full bg-elevated flex items-center justify-center mb-6 shadow-lg relative">
        <div className="absolute inset-0 bg-green/10 rounded-full blur-xl"></div>
        <Icon className="w-8 h-8 text-green relative z-10" />
      </div>
      <h3 className="text-xl font-display font-bold text-primary mb-2">{title}</h3>
      <p className="text-secondary max-w-sm mb-6">{description}</p>
      
      {showAction && (
        <Button onClick={handleSwitchRange} variant="secondary">
          Try '{timeRange !== 'long_term' ? 'All Time' : '6 Months'}' instead
        </Button>
      )}
    </div>
  );
}

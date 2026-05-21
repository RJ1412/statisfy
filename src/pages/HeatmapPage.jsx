import React from 'react';
import useStore from '../store/useStore';
import useSpotifyData from '../hooks/useSpotifyData';
import ListeningHeatmap from '../components/charts/ListeningHeatmap';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';

export default function HeatmapPage() {
  const { isLoading, heatmapData } = useStore();
  const { hasLoadedInit } = useSpotifyData();

  if (isLoading || !hasLoadedInit) {
    return <LoadingState message="Mapping your time..." />;
  }

  if (!heatmapData || heatmapData.length === 0) {
    return <EmptyState title="No recent listening history" />;
  }

  const totalPlays = heatmapData.reduce((sum, d) => sum + d.count, 0);
  const morning = heatmapData.filter(d => d.hour >= 6 && d.hour <= 11).reduce((sum, d) => sum + d.count, 0);
  const afternoon = heatmapData.filter(d => d.hour >= 12 && d.hour <= 17).reduce((sum, d) => sum + d.count, 0);
  const evening = heatmapData.filter(d => d.hour >= 18 && d.hour <= 23).reduce((sum, d) => sum + d.count, 0);
  const lateNight = heatmapData.filter(d => d.hour >= 0 && d.hour <= 5).reduce((sum, d) => sum + d.count, 0);

  const stats = [
    { label: 'Morning (6a-12p)', val: morning },
    { label: 'Afternoon (12p-6p)', val: afternoon },
    { label: 'Evening (6p-12a)', val: evening },
    { label: 'Late Night (12a-6a)', val: lateNight }
  ];
  
  const topPeriod = stats.reduce((prev, current) => (prev.val > current.val) ? prev : current);

  return (
    <div className="space-y-8 page-enter pb-12 pt-4">

      <div className="card-grain bg-surface border border-border rounded-xl p-6 lg:p-8 shadow-card">
        <p className="font-eyebrow mb-6">ACTIVITY MAP</p>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px]">
            <ListeningHeatmap data={heatmapData} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-surface border border-border rounded-xl p-6 flex flex-col justify-center transition-colors
            ${topPeriod.label === stat.label ? 'ring-1 ring-green ring-offset-2 ring-offset-void bg-green-trace' : ''}
          `}>
            <p className="font-eyebrow mb-2">{stat.label}</p>
            <p className="font-display font-bold text-[32px] text-text-primary">
              {Math.round((stat.val / Math.max(1, totalPlays)) * 100)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

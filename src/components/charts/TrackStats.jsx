import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function TrackStats({ tracks }) {
  const data = useMemo(() => {
    if (!tracks || tracks.length === 0) return [];
    
    const decades = {};
    let explicitCount = 0;
    
    tracks.forEach(track => {
      if (track.explicit) explicitCount++;
      
      if (track.album && track.album.release_date) {
        const year = parseInt(track.album.release_date.substring(0, 4), 10);
        if (!isNaN(year)) {
          const decade = Math.floor(year / 10) * 10;
          const label = `${decade}s`;
          decades[label] = (decades[label] || 0) + 1;
        }
      }
    });

    const chartData = Object.keys(decades).map(key => ({
      name: key,
      count: decades[key]
    })).sort((a, b) => a.name.localeCompare(b.name));

    return { chartData, explicitCount, total: tracks.length };
  }, [tracks]);

  if (!data.chartData || data.chartData.length === 0) return null;

  const explicitPercent = Math.round((data.explicitCount / data.total) * 100);

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      
      {/* Era Distribution */}
      <div>
        <p className="font-eyebrow text-text-secondary mb-4">ERA DISTRIBUTION</p>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#8A89A6', fontSize: 11, fontFamily: 'Satoshi' }}
                tickLine={false}
                axisLine={false}
                dy={8}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                contentStyle={{ backgroundColor: '#0f0f1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#1DB954' }}
                formatter={(val) => [`${val} tracks`, 'Count']}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === data.chartData.length - 1 ? '#1DB954' : '#6366F1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Explicit vs Clean */}
      <div className="pt-4 border-t border-border">
        <div className="flex justify-between items-end mb-2">
          <p className="font-eyebrow text-text-secondary">EXPLICIT TRACKS</p>
          <p className="font-mono text-sm">{explicitPercent}%</p>
        </div>
        <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
          <div 
            className="h-full bg-coral transition-all duration-slow" 
            style={{ width: `${explicitPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

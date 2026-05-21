import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const genreColors = {
  'electronic': '#9D71F8',  // purple
  'hip-hop':    '#F5A623',  // amber
  'pop':        '#1DB954',  // green
  'rock':       '#FF6B6B',  // coral
  'r&b':        '#F06292',  // pink
  'jazz':       '#2EE8C7',  // teal
  'classical':  '#B0BEC5',  // silver
  'country':    '#A5D6A7',  // sage
  'metal':      '#EF9A9A',  // light coral
  'indie':      '#FF8A65',  // terracotta
  'other':      '#5C6BC0',  // indigo
};

export default function GenreBar({ data }) {
  if (!data || data.length === 0) return null;

  const top10 = data.slice(0, 10);
  
  const colorMap = (genre) => genreColors[genre] || genreColors['other'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-surface border border-border shadow-card px-3 py-2 rounded-md font-body text-sm z-10">
          <div className="font-bold text-white capitalize mb-1">{p.genre}</div>
          <div className="text-[11px] font-mono text-text-secondary">{p.count} artists · {p.percentage}%</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full min-h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={top10}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis 
            dataKey="genre" 
            type="category" 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: '#F0EFF8', fontSize: 13, fontFamily: 'Satoshi', fontWeight: 500 }}
            width={100}
            style={{ textTransform: 'capitalize' }}
          />
          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} content={<CustomTooltip />} />
          <Bar 
            dataKey="count" 
            radius={[0, 4, 4, 0]}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {top10.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colorMap(entry.superGenre)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

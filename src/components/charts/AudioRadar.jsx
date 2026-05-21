import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function AudioRadar({ data }) {
  if (!data || data.length === 0) return null;

  // Average the features
  const avg = data.reduce((acc, curr) => {
    acc.danceability += curr.danceability || 0;
    acc.energy += curr.energy || 0;
    acc.valence += curr.valence || 0;
    acc.acousticness += curr.acousticness || 0;
    acc.instrumentalness += curr.instrumentalness || 0;
    acc.speechiness += curr.speechiness || 0;
    return acc;
  }, {
    danceability: 0, energy: 0, valence: 0, 
    acousticness: 0, instrumentalness: 0, speechiness: 0
  });

  const count = Math.max(1, data.length);
  const radarData = [
    { metric: 'Danceability', value: Math.round((avg.danceability / count) * 100) },
    { metric: 'Energy', value: Math.round((avg.energy / count) * 100) },
    { metric: 'Valence', value: Math.round((avg.valence / count) * 100) },
    { metric: 'Acoustic', value: Math.round((avg.acousticness / count) * 100) },
    { metric: 'Instrumental', value: Math.round((avg.instrumentalness / count) * 100) },
    { metric: 'Speech', value: Math.round((avg.speechiness / count) * 100) },
  ];

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
          <PolarGrid 
            gridType="polygon"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={0.5}
          />
          <PolarAngleAxis 
            dataKey="metric" 
            tick={{ fill: '#8A89A6', fontSize: 11, fontFamily: 'Satoshi' }}
            tickLine={false}
            axisLine={false}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Sonic Profile"
            dataKey="value"
            stroke="#1DB954"
            strokeWidth={2}
            fill="#1DB954"
            fillOpacity={0.12}
            dot={{ fill: '#1DB954', r: 4, strokeWidth: 0 }}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

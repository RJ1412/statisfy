import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function ListeningHeatmap({ data }) {
  const containerRef = useRef(null);
  const [width, setWidth] = React.useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setWidth(entries[0].contentRect.width);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!data || data.length === 0 || !containerRef.current || width === 0) return;

    const height = Math.max(260, width * 0.35);
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    
    // Clear previous
    d3.select(containerRef.current).selectAll('*').remove();

    const svg = d3.select(containerRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'overflow-visible');

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Grid calculations
    const cols = 24;
    const rows = 7;
    const cellGap = 3;
    const cellWidth = (innerWidth - (cols - 1) * cellGap) / cols;
    const cellHeight = cellWidth * 0.8;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = [0, 3, 6, 9, 12, 15, 18, 21];
    const hourLabels = ['12a', '3a', '6a', '9a', '12p', '3p', '6p', '9p'];

    // Y Axis Labels
    g.selectAll('.dayLabel')
      .data(days)
      .enter().append('text')
      .text(d => d)
      .attr('x', -10)
      .attr('y', (d, i) => i * (cellHeight + cellGap) + cellHeight / 2)
      .style('text-anchor', 'end')
      .style('alignment-baseline', 'middle')
      .attr('class', 'font-body text-[12px] fill-text-muted');

    // X Axis Labels
    g.selectAll('.timeLabel')
      .data(hours)
      .enter().append('text')
      .text((d, i) => hourLabels[i])
      .attr('x', d => d * (cellWidth + cellGap) + cellWidth / 2)
      .attr('y', rows * (cellHeight + cellGap) + 15)
      .style('text-anchor', 'middle')
      .attr('class', 'font-mono text-[11px] fill-text-muted');

    // Filter effect for glow
    const defs = svg.append('defs');
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%').attr('y', '-50%')
      .attr('width', '200%').attr('height', '200%');
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const maxCount = d3.max(data, d => d.count);
    
    // Custom color interpolation
    const colorScale = d3.scaleSequential(d3.interpolate('#1a1a2e', '#1DB954')).domain([0, maxCount]);

    // Tooltip
    const tooltip = d3.select(containerRef.current)
      .append('div')
      .attr('class', 'absolute opacity-0 bg-surface border border-border shadow-card p-3 rounded-md text-sm pointer-events-none z-10 transition-opacity duration-fast')
      .style('transform', 'translate(-50%, -100%)')
      .style('margin-top', '-10px');

    const formatHour = (h) => h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;

    // Draw cells
    g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => d.hour * (cellWidth + cellGap))
      .attr('y', d => d.day * (cellHeight + cellGap))
      .attr('width', cellWidth)
      .attr('height', cellHeight)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('fill', d => {
        if (d.count === 0) return '#1a1a2e'; // --bg-elevated basically
        if (d.count === maxCount && maxCount > 0) return '#F5A623'; // peak amber
        return colorScale(d.count);
      })
      .attr('filter', d => (d.count === maxCount && maxCount > 0) ? 'url(#glow)' : null)
      .style('opacity', 0)
      .style('transform-origin', d => `${d.hour * (cellWidth + cellGap) + cellWidth/2}px ${d.day * (cellHeight + cellGap) + cellHeight/2}px`)
      .style('transform', 'scale(0.5)')
      .on('mouseover', (event, d) => {
        if (d.count === 0) return;
        d3.select(event.currentTarget).style('stroke', '#fff').style('stroke-width', 1.5);
        
        const isPeak = d.count === maxCount;
        tooltip.html(`
          <div class="font-body text-text-primary font-bold mb-1">${days[d.day]} &middot; ${formatHour(d.hour)}</div>
          <div class="w-full h-[1px] bg-border mb-1.5"></div>
          <div class="font-mono text-text-secondary text-[11px]">${d.count} tracks played</div>
          ${isPeak ? '<div class="text-amber text-[10px] uppercase tracking-wider mt-1 font-bold">Peak listening time</div>' : ''}
        `)
        .style('left', `${event.pageX - containerRef.current.getBoundingClientRect().left}px`)
        .style('top', `${event.pageY - containerRef.current.getBoundingClientRect().top}px`)
        .style('opacity', 1);
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget).style('stroke', 'none');
        tooltip.style('opacity', 0);
      })
      .transition()
      .delay((d) => (d.hour * 5) + (d.day * 10)) // wave-in
      .duration(400)
      .ease(d3.easeCubicOut)
      .style('opacity', 1)
      .style('transform', 'scale(1)');

  }, [data, width]);

  return (
    <div className="relative w-full">
      <div ref={containerRef} className="w-full relative" />
      
      {/* Stat Pills below heatmap */}
      {data && data.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <div className="px-3 py-1.5 rounded-full bg-surface border border-border text-[11px] font-mono text-text-secondary flex items-center">
            <span className="text-amber mr-2">◈</span>
            Peak Hour: <span className="text-text-primary ml-1 font-bold">
              {(() => {
                const max = [...data].sort((a,b)=>b.count-a.count)[0];
                return max ? (max.hour === 0 ? '12 AM' : max.hour < 12 ? `${max.hour} AM` : max.hour === 12 ? '12 PM' : `${max.hour - 12} PM`) : 'N/A';
              })()}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-surface border border-border text-[11px] font-mono text-text-secondary flex items-center">
            <span className="text-green mr-2">◈</span>
            Active Day: <span className="text-text-primary ml-1 font-bold">
              {(() => {
                const dayCounts = [0,0,0,0,0,0,0];
                data.forEach(d => dayCounts[d.day] += d.count);
                const maxDay = dayCounts.indexOf(Math.max(...dayCounts));
                return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][maxDay];
              })()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

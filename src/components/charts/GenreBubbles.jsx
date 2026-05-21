import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

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

export default function GenreBubbles({ data }) {
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

    const height = Math.max(380, width * 0.65);
    
    d3.select(containerRef.current).selectAll('*').remove();

    const svg = d3.select(containerRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Deep copy data for simulation
    const nodes = data.map(d => ({...d}));

    const colorMap = (genre) => genreColors[genre] || genreColors['other'];

    // Simulation
    const simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(5))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide(d => Math.max(36, Math.min(110, Math.sqrt(d.count) * 18)) + 4))
      .stop();

    // Pre-calculate positions
    for (let i = 0; i < 200; ++i) simulation.tick();

    // Tooltip
    const tooltip = d3.select(containerRef.current)
      .append('div')
      .attr('class', 'absolute opacity-0 bg-surface border border-border shadow-card px-3 py-2 rounded-md font-body text-sm pointer-events-none z-10 transition-opacity')
      .style('transform', 'translate(-50%, -100%)')
      .style('margin-top', '-10px');

    const nodeGroup = svg.selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('transform', `translate(${width/2}, ${height/2})`) // Start center for explosion
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).select('circle')
          .transition().duration(200).ease(d3.easeElastic)
          .attr('transform', 'scale(1.1)')
          .style('stroke-opacity', 1);
        
        tooltip.html(`
          <div class="font-bold text-white capitalize mb-1">${d.genre}</div>
          <div class="text-[11px] font-mono text-text-secondary">${d.count} artists · ${d.percentage}%</div>
        `)
        .style('left', `${event.pageX - containerRef.current.getBoundingClientRect().left}px`)
        .style('top', `${event.pageY - containerRef.current.getBoundingClientRect().top}px`)
        .style('opacity', 1);
      })
      .on('mouseout', function() {
        d3.select(this).select('circle')
          .transition().duration(200)
          .attr('transform', 'scale(1)')
          .style('stroke-opacity', 0.6);
        tooltip.style('opacity', 0);
      });

    // Circles
    nodeGroup.append('circle')
      .attr('r', 0) // start radius 0
      .style('fill', d => {
        const hex = colorMap(d.superGenre);
        // hex to rgba 15%
        const r = parseInt(hex.slice(1,3), 16), g = parseInt(hex.slice(3,5), 16), b = parseInt(hex.slice(5,7), 16);
        return `rgba(${r},${g},${b},0.15)`;
      })
      .style('stroke', d => colorMap(d.superGenre))
      .style('stroke-width', 1.5)
      .style('stroke-opacity', 0.6)
      .transition()
      .delay((d, i) => i * 15)
      .duration(800)
      .ease(d3.easeElasticOut.amplitude(1).period(0.6))
      .attr('r', d => Math.max(36, Math.min(110, Math.sqrt(d.count) * 18)));

    // Labels
    nodeGroup.append('text')
      .text(d => d.genre)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .style('fill', '#fff')
      .style('font-family', 'Satoshi')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .style('pointer-events', 'none')
      .style('text-transform', 'capitalize')
      .style('opacity', 0)
      .filter(d => Math.max(36, Math.min(110, Math.sqrt(d.count) * 18)) >= 44) // hide if too small
      .transition()
      .delay((d, i) => i * 15 + 300)
      .duration(400)
      .style('opacity', 1);

    // Explode animation
    nodeGroup.transition()
      .delay((d, i) => i * 10)
      .duration(600)
      .ease(d3.easeCubicOut)
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

  }, [data, width]);

  return <div ref={containerRef} className="w-full relative" />;
}

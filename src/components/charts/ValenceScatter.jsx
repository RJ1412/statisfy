import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function ValenceScatter({ data }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0 || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = Math.max(400, width * 0.7);
    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    
    d3.select(containerRef.current).selectAll('*').remove();

    const svg = d3.select(containerRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear().domain([0, 1]).range([0, innerWidth]);
    const yScale = d3.scaleLinear().domain([0, 1]).range([innerHeight, 0]); // SVG y is inverted
    const rScale = d3.scaleLinear().domain([0, 100]).range([3, 8]);

    // Quadrants Backgrounds
    const quadrants = [
      { x: 0, y: innerHeight/2, w: innerWidth/2, h: innerHeight/2, c: '#9D71F8', label: 'MELANCHOLIC' }, // Sad/Calm
      { x: innerWidth/2, y: innerHeight/2, w: innerWidth/2, h: innerHeight/2, c: '#2EE8C7', label: 'CHILL' }, // Happy/Calm
      { x: 0, y: 0, w: innerWidth/2, h: innerHeight/2, c: '#FF6B6B', label: 'ANGRY' }, // Sad/Intense
      { x: innerWidth/2, y: 0, w: innerWidth/2, h: innerHeight/2, c: '#F5A623', label: 'EUPHORIC' }  // Happy/Intense
    ];

    const qGroup = g.append('g').attr('class', 'quadrants');
    
    quadrants.forEach(q => {
      qGroup.append('rect')
        .attr('x', q.x).attr('y', q.y)
        .attr('width', q.w).attr('height', q.h)
        .attr('fill', q.c)
        .attr('opacity', 0.04);
        
      // Label
      qGroup.append('text')
        .attr('x', q.x === 0 ? q.x + 10 : q.x + q.w - 10)
        .attr('y', q.y === 0 ? q.y + 20 : q.y + q.h - 10)
        .text(q.label)
        .attr('fill', q.c)
        .attr('opacity', 0.4)
        .attr('font-family', 'Satoshi')
        .attr('font-size', '10px')
        .attr('font-weight', '700')
        .attr('letter-spacing', '0.1em')
        .attr('text-anchor', q.x === 0 ? 'start' : 'end');
    });

    // Axes lines
    g.append('line')
      .attr('x1', 0).attr('x2', innerWidth)
      .attr('y1', innerHeight/2).attr('y2', innerHeight/2)
      .attr('stroke', 'rgba(255,255,255,0.1)')
      .attr('stroke-dasharray', '4 4');
      
    g.append('line')
      .attr('x1', innerWidth/2).attr('x2', innerWidth/2)
      .attr('y1', 0).attr('y2', innerHeight)
      .attr('stroke', 'rgba(255,255,255,0.1)')
      .attr('stroke-dasharray', '4 4');

    // Axes Labels
    g.append('text')
      .attr('x', innerWidth/2)
      .attr('y', innerHeight + 35)
      .text('← Sad · Happy →')
      .attr('fill', '#8A89A6')
      .attr('font-family', 'Satoshi')
      .attr('font-size', '12px')
      .attr('text-anchor', 'middle');
      
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight/2)
      .attr('y', -30)
      .text('Calm · Intense →')
      .attr('fill', '#8A89A6')
      .attr('font-family', 'Satoshi')
      .attr('font-size', '12px')
      .attr('text-anchor', 'middle');

    // Dots
    const dotColor = (d) => {
      if (d.valence > 0.5 && d.energy > 0.5) return '#F5A623';
      if (d.valence < 0.5 && d.energy > 0.5) return '#FF6B6B';
      if (d.valence > 0.5 && d.energy < 0.5) return '#2EE8C7';
      return '#9D71F8';
    };

    // Tooltip
    const tooltip = d3.select(containerRef.current)
      .append('div')
      .attr('class', 'absolute opacity-0 bg-surface border border-border shadow-card px-3 py-2 rounded-md z-10 pointer-events-none transition-opacity font-body')
      .style('transform', 'translate(-50%, -100%)')
      .style('margin-top', '-10px');

    g.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.valence))
      .attr('cy', d => yScale(d.energy))
      .attr('r', 0)
      .attr('fill', d => {
        const hex = dotColor(d);
        const r = parseInt(hex.slice(1,3), 16), gC = parseInt(hex.slice(3,5), 16), b = parseInt(hex.slice(5,7), 16);
        return `rgba(${r},${gC},${b},0.7)`;
      })
      .attr('stroke', d => dotColor(d))
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).transition().duration(150).attr('r', rScale(d.popularity) * 1.5);
        tooltip.html(`
          <div class="font-bold text-white mb-0.5">${d.name}</div>
          <div class="text-xs text-text-secondary mb-1">${d.artist}</div>
          <div class="font-mono text-[10px] text-text-muted">
            V: ${Math.round(d.valence*100)}% | E: ${Math.round(d.energy*100)}%
          </div>
        `)
        .style('left', `${event.pageX - containerRef.current.getBoundingClientRect().left}px`)
        .style('top', `${event.pageY - containerRef.current.getBoundingClientRect().top}px`)
        .style('opacity', 1);
      })
      .on('mouseout', function(event, d) {
        d3.select(this).transition().duration(150).attr('r', rScale(d.popularity));
        tooltip.style('opacity', 0);
      })
      .transition()
      .delay((d, i) => i * 20)
      .duration(600)
      .ease(d3.easeElasticOut.amplitude(1).period(0.5))
      .attr('r', d => rScale(d.popularity));

    // Averages Crosshair
    const avgV = d3.mean(data, d => d.valence);
    const avgE = d3.mean(data, d => d.energy);

    const crosshairG = g.append('g')
      .attr('transform', `translate(${xScale(avgV)}, ${yScale(avgE)})`)
      .style('opacity', 0);

    crosshairG.append('line').attr('class', 'crosshair-v').attr('x1', 0).attr('x2', 0).attr('y1', -innerHeight).attr('y2', innerHeight)
      .style('stroke', 'white').style('stroke-width', 1).style('stroke-dasharray', '4 4').style('opacity', 0.2);
    crosshairG.append('line').attr('class', 'crosshair-h').attr('x1', -innerWidth).attr('x2', innerWidth).attr('y1', 0).attr('y2', 0)
      .style('stroke', 'white').style('stroke-width', 1).style('stroke-dasharray', '4 4').style('opacity', 0.2);
      
    crosshairG.append('circle').attr('class', 'crosshair-dot').attr('r', 6).style('fill', 'white');
    crosshairG.append('circle').attr('class', 'crosshair-pulse animate-[pulse_2s_ease-out_infinite]').attr('r', 6).style('fill', 'none').style('stroke', 'white');

    crosshairG.transition().delay(1000).duration(800).style('opacity', 1);

  }, [data]);

  return (
    <div className="relative w-full">
      <div ref={containerRef} className="w-full relative" />
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0%   { r: 6px; opacity: 0.6; }
          100% { r: 20px; opacity: 0; }
        }
      `}} />
    </div>
  );
}

import React, { useMemo, useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { countryNames } from '../data';

const stanceColors = {
  pro_nato: '#3b82f6',
  neutral: '#6b7280',
  pro_russia: '#ef4444'
};

const stanceLabels = {
  pro_nato: 'Pro-NATO',
  neutral: 'Neutral',
  pro_russia: 'Pro-Russia'
};

function StreamGraph({ 
  temporalData, 
  events = [], 
  selectedStances = ['pro_nato', 'pro_russia', 'neutral'],
  setSelectedStances,
  selectedCountry = null,
  countryTemporalData = null,
  dateRange,
  setDateRange,
  countryStanceData = [],
  minDate,
  maxDate
}) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const brushRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800 });
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: null });
  const [eventTooltip, setEventTooltip] = useState({ show: false, x: 0, y: 0, event: null });

  const chartHeight = 190;

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width: width - 40 });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Process data for stream graph - show country-specific data if country is selected
  const streamData = useMemo(() => {
    // If a country is selected, use country-specific data
    if (selectedCountry && countryStanceData && countryStanceData.length > 0) {
      const aggregated = {};
      
      // Filter countryStanceData for the selected country and selected stances
      countryStanceData
        .filter(d => d.country_code === selectedCountry && selectedStances.includes(d.stance))
        .forEach(d => {
          const dateKey = `${d.year}-${String(d.month).padStart(2, '0')}`;
          if (!aggregated[dateKey]) {
            aggregated[dateKey] = { date: dateKey, pro_nato: 0, neutral: 0, pro_russia: 0 };
          }
          aggregated[dateKey][d.stance] += d.user_count;
        });
      
      // Add total for tooltips
      return Object.values(aggregated).map(d => ({
        ...d,
        total: d.pro_nato + d.neutral + d.pro_russia
      })).sort((a, b) => a.date.localeCompare(b.date));
    }
    
    // Otherwise use global temporal data
    if (!temporalData || temporalData.length === 0) return [];
    
    const dataSource = temporalData;
    
    const aggregated = {};
    
    if (dataSource.length > 0 && dataSource[0].date !== undefined && dataSource[0].pro_nato !== undefined) {
      dataSource.forEach(d => {
        aggregated[d.date] = { 
          date: d.date,
          pro_nato: d.pro_nato,
          neutral: d.neutral,
          pro_russia: d.pro_russia
        };
      });
    } else {
      dataSource.forEach(d => {
        const dateKey = d.date || `${d.year}-${String(d.month).padStart(2, '0')}`;
        if (!aggregated[dateKey]) {
          aggregated[dateKey] = { date: dateKey, pro_nato: 0, neutral: 0, pro_russia: 0 };
        }
        if (d.user_count !== undefined && d.stance) {
          aggregated[dateKey][d.stance] += d.user_count;
        }
      });
    }

    // Add total for tooltips
    return Object.values(aggregated).map(d => ({
      ...d,
      total: d.pro_nato + d.neutral + d.pro_russia
    })).sort((a, b) => a.date.localeCompare(b.date));
  }, [temporalData, selectedCountry, countryStanceData, selectedStances]);

  // Show ALL events (not filtered by date range) so milestones are always visible
  const allEvents = useMemo(() => {
    if (!events) return [];
    return events;
  }, [events]);

  // Render stream graph
  useEffect(() => {
    if (!svgRef.current || streamData.length === 0) return;

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 40, left: 55 };
    const innerWidth = dimensions.width - margin.left - margin.right;
    const innerHeight = chartHeight - margin.top - margin.bottom;

    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale
    const xScale = d3.scalePoint()
      .domain(streamData.map(d => d.date))
      .range([0, innerWidth]);

    // Prepare stacked data
    const keys = selectedStances.filter(s => selectedStances.includes(s));
    const stack = d3.stack()
      .keys(keys)
      .offset(d3.stackOffsetWiggle)
      .order(d3.stackOrderInsideOut);

    const stacked = stack(streamData);

    // Y Scale
    const yMax = d3.max(stacked, layer => d3.max(layer, d => Math.abs(d[0]) > Math.abs(d[1]) ? Math.abs(d[0]) : Math.abs(d[1])));
    const yScale = d3.scaleLinear()
      .domain([-yMax * 1.1, yMax * 1.1])
      .range([innerHeight, 0]);

    // Area generator
    const area = d3.area()
      .x(d => xScale(d.data.date))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]))
      .curve(d3.curveBasis);

    // Draw streams with gradient effect
    stacked.forEach((layer, i) => {
      const color = stanceColors[layer.key];
      
      // Create gradient
      const gradientId = `gradient-${layer.key}`;
      const gradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', gradientId)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');
      
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', color)
        .attr('stop-opacity', 0.9);
      
      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', color)
        .attr('stop-opacity', 0.7);
    });

    // Draw streams
    g.selectAll('.stream')
      .data(stacked)
      .join('path')
      .attr('class', 'stream')
      .attr('fill', d => `url(#gradient-${d.key})`)
      .attr('d', area)
      .attr('stroke', d => stanceColors[d.key])
      .attr('stroke-width', 0.5)
      .attr('stroke-opacity', 0.3)
      .style('transition', 'opacity 0.2s')
      .style('cursor', 'pointer')
      .on('mouseenter', function(event, d) {
        // Dim other streams
        g.selectAll('.stream').attr('opacity', 0.4);
        d3.select(this).attr('opacity', 1);
      })
      .on('mouseleave', function() {
        g.selectAll('.stream').attr('opacity', 1);
      })
      .on('click', function(event, d) {
        // Toggle stance filter when clicking on a stream
        if (setSelectedStances) {
          const clickedStance = d.key;
          if (selectedStances.includes(clickedStance)) {
            // If only this stance is selected, select all stances
            if (selectedStances.length === 1) {
              setSelectedStances(['pro_nato', 'pro_russia', 'neutral']);
            } else {
              // Otherwise, select only this stance
              setSelectedStances([clickedStance]);
            }
          } else {
            // Add this stance to selection
            setSelectedStances([...selectedStances, clickedStance]);
          }
        }
      })
      .on('mousemove', function(event, d) {
        const [mx] = d3.pointer(event, g.node());
        const dateIndex = Math.round((mx / innerWidth) * (streamData.length - 1));
        const dataPoint = streamData[Math.max(0, Math.min(dateIndex, streamData.length - 1))];
        
        if (dataPoint) {
          const rect = containerRef.current.getBoundingClientRect();
          const percentage = dataPoint.total > 0 
            ? ((dataPoint[d.key] / dataPoint.total) * 100).toFixed(1) 
            : 0;
          
          setTooltip({
            show: true,
            x: event.clientX - rect.left,
            y: event.clientY - rect.top - 10,
            content: {
              date: dataPoint.date,
              stance: d.key,
              users: dataPoint[d.key],
              percentage,
              total: dataPoint.total,
              allStances: {
                pro_nato: dataPoint.pro_nato,
                neutral: dataPoint.neutral,
                pro_russia: dataPoint.pro_russia
              }
            }
          });
        }
      })
      .on('mouseleave', function() {
        setTooltip({ show: false, x: 0, y: 0, content: null });
        g.selectAll('.stream').attr('opacity', 1);
      });

    // X Axis
    const xAxis = d3.axisBottom(xScale)
      .tickValues(streamData.filter((_, i) => i % 3 === 0).map(d => d.date))
      .tickFormat(d => {
        const date = new Date(d + '-01');
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      });

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#64748b')
      .attr('font-size', '10px');

    g.selectAll('.x-axis path, .x-axis line')
      .attr('stroke', '#e2e8f0');

    // Add brush for date range selection BEFORE event markers so markers stay on top
    let brushGroup = null;
    if (setDateRange && minDate && maxDate && streamData.length > 1) {
      // Helper to get x position from date
      const getDatePosition = (date) => {
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const index = streamData.findIndex(d => d.date === dateStr);
        if (index === -1) {
          // Find closest date
          const targetTime = date.getTime();
          let closestIndex = 0;
          let closestDiff = Infinity;
          streamData.forEach((d, i) => {
            const dTime = new Date(d.date + '-01').getTime();
            const diff = Math.abs(dTime - targetTime);
            if (diff < closestDiff) {
              closestDiff = diff;
              closestIndex = i;
            }
          });
          return (closestIndex / (streamData.length - 1)) * innerWidth;
        }
        return (index / (streamData.length - 1)) * innerWidth;
      };

      // Helper function to convert brush position to dates
      const brushToDate = (x0, x1) => {
        const dateIndex0 = Math.round((x0 / innerWidth) * (streamData.length - 1));
        const dateIndex1 = Math.round((x1 / innerWidth) * (streamData.length - 1));
        
        const startDateStr = streamData[Math.max(0, dateIndex0)]?.date;
        const endDateStr = streamData[Math.min(streamData.length - 1, dateIndex1)]?.date;
        
        if (startDateStr && endDateStr) {
          const startDate = new Date(startDateStr + '-01');
          const endDate = new Date(endDateStr + '-01');
          // Set end date to last day of month
          const endDateAdjusted = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
          return [startDate, endDateAdjusted];
        }
        return null;
      };

      // Function to update handle grip positions
      const updateGripPositions = (selection) => {
        if (!selection) return;
        const [x0, x1] = selection;
        brushGroup.select('.handle-grip-w')
          .attr('transform', `translate(${x0 + 5}, 0)`);
        brushGroup.select('.handle-grip-e')
          .attr('transform', `translate(${x1 - 5}, 0)`);
      };

      const brush = d3.brushX()
        .extent([[0, 0], [innerWidth, innerHeight]])
        .on('brush', (event) => {
          // Update in real-time as user drags/resizes
          if (!event.sourceEvent || !event.selection) return;
          
          const [x0, x1] = event.selection;
          updateGripPositions(event.selection);
          const dates = brushToDate(x0, x1);
          if (dates) {
            setDateRange(dates);
          }
        })
        .on('end', (event) => {
          // Only respond to user-initiated events
          if (!event.sourceEvent) return;
          
          if (!event.selection) {
            // If brush is cleared, reset to full date range
            setDateRange([minDate, maxDate]);
            return;
          }
          
          const [x0, x1] = event.selection;
          updateGripPositions(event.selection);
          const dates = brushToDate(x0, x1);
          if (dates) {
            setDateRange(dates);
          }
        });

      brushGroup = g.append('g')
        .attr('class', 'brush')
        .call(brush);

      // Set initial brush position based on current dateRange
      const isFullRange = dateRange[0].getTime() <= minDate.getTime() && 
                         dateRange[1].getTime() >= maxDate.getTime() - 86400000 * 31;
      
      if (!isFullRange) {
        const x0 = getDatePosition(dateRange[0]);
        const x1 = getDatePosition(dateRange[1]);
        if (!isNaN(x0) && !isNaN(x1) && x0 >= 0 && x1 <= innerWidth) {
          brushGroup.call(brush.move, [x0, x1]);
        }
      }

      // Style the brush - make selection more visible and easier to grab
      brushGroup.selectAll('.selection')
        .attr('fill', '#3b82f6')
        .attr('fill-opacity', 0.15)
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 2)
        .attr('rx', 4)
        .style('cursor', 'move');

      // Make handles larger and more visible for easier grabbing
      brushGroup.selectAll('.handle')
        .attr('fill', '#1d4ed8')
        .attr('fill-opacity', 1)
        .attr('width', 10)
        .attr('rx', 3)
        .style('cursor', 'ew-resize');

      // Add custom handle grips (visual indicators for grabbing)
      brushGroup.selectAll('.handle--w, .handle--e').each(function() {
        const handle = d3.select(this);
        const isWest = handle.classed('handle--w');
        
        // Add grip lines to handles
        const parent = handle.node().parentNode;
        const handleRect = handle.node().getBBox();
        
        // Create grip indicator group
        const gripGroup = d3.select(parent).append('g')
          .attr('class', `handle-grip handle-grip-${isWest ? 'w' : 'e'}`)
          .style('pointer-events', 'none');
        
        // Three small lines as grip indicator
        for (let i = -1; i <= 1; i++) {
          gripGroup.append('line')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', innerHeight / 2 + i * 8 - 4)
            .attr('y2', innerHeight / 2 + i * 8 + 4)
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .attr('stroke-linecap', 'round');
        }
      });

      brushGroup.selectAll('.overlay')
        .attr('cursor', 'crosshair')
        .style('pointer-events', 'all');

      // Set initial grip positions
      if (!isFullRange) {
        const x0 = getDatePosition(dateRange[0]);
        const x1 = getDatePosition(dateRange[1]);
        if (!isNaN(x0) && !isNaN(x1)) {
          updateGripPositions([x0, x1]);
        }
      }

      brushRef.current = brush;
    }

    // Draw event markers AFTER brush so they appear on top
    if (allEvents && allEvents.length > 0) {
      const eventGroup = g.append('g').attr('class', 'events').style('pointer-events', 'all');
      
      allEvents.forEach(event => {
        const eventDate = event.date.substring(0, 7);
        const xPos = xScale(eventDate);
        
        if (xPos !== undefined) {
          const marker = eventGroup.append('g')
            .attr('class', 'event-marker')
            .attr('transform', `translate(${xPos}, 0)`)
            .style('cursor', 'pointer')
            .style('pointer-events', 'all');

          // Vertical line - make it more visible
          marker.append('line')
            .attr('y1', -20)
            .attr('y2', innerHeight)
            .attr('stroke', event.type === 'major' ? '#f59e0b' : '#94a3b8')
            .attr('stroke-width', event.type === 'major' ? 2 : 1)
            .attr('stroke-dasharray', event.type === 'major' ? 'none' : '4,4')
            .attr('opacity', 0.7)
            .style('pointer-events', 'none');

          // Marker dot - larger and with shadow for visibility
          marker.append('circle')
            .attr('cy', -12)
            .attr('r', event.type === 'major' ? 6 : 5)
            .attr('fill', event.type === 'major' ? '#f59e0b' : '#6b7280')
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('filter', 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))');

          marker.on('mouseenter', (e) => {
            const rect = containerRef.current.getBoundingClientRect();
            setEventTooltip({
              show: true,
              x: e.clientX - rect.left,
              y: e.clientY - rect.top - 90,
              event: event
            });
          })
          .on('mouseleave', () => {
            setEventTooltip({ show: false, x: 0, y: 0, event: null });
          });
        }
      });
    }

    // Y-axis label
    g.append('text')
      .attr('x', -20)
      .attr('y', innerHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('transform', `rotate(-90, -20, ${innerHeight / 2})`)
      .attr('fill', '#64748b')
      .attr('font-size', '11px')
      .text('User Count');

    // Add hover overlay at the end (on top of everything except event markers)
    // This captures mouse move events for tooltip display but passes click/drag to brush
    const hoverOverlay = g.append('rect')
      .attr('class', 'hover-overlay')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .style('pointer-events', 'none'); // Start with no pointer events

    // Create a separate group for capturing hover events that doesn't block brush
    // We'll use JavaScript to handle the mouse events on the SVG instead
    svg.on('mousemove', function(event) {
      const [mx, my] = d3.pointer(event, g.node());
      
      // Check if within chart bounds
      if (mx < 0 || mx > innerWidth || my < 0 || my > innerHeight) {
        setTooltip({ show: false, x: 0, y: 0, content: null });
        g.selectAll('.stream').attr('opacity', 1);
        return;
      }
      
      const dateIndex = Math.round((mx / innerWidth) * (streamData.length - 1));
      const dataPoint = streamData[Math.max(0, Math.min(dateIndex, streamData.length - 1))];
      
      if (dataPoint) {
        // Determine which stance area the mouse is in based on y position
        const yValue = yScale.invert(my);
        let hoveredStance = null;
        
        // Check each stacked layer to find which one the mouse is in
        for (const layer of stacked) {
          const layerData = layer[dateIndex] || layer[Math.max(0, Math.min(dateIndex, layer.length - 1))];
          if (layerData && yValue >= layerData[0] && yValue <= layerData[1]) {
            hoveredStance = layer.key;
            break;
          }
        }
        
        if (!hoveredStance) {
          // Default to the largest stance if not found
          hoveredStance = 'pro_nato';
          if (dataPoint.neutral > dataPoint.pro_nato && dataPoint.neutral > dataPoint.pro_russia) {
            hoveredStance = 'neutral';
          } else if (dataPoint.pro_russia > dataPoint.pro_nato) {
            hoveredStance = 'pro_russia';
          }
        }
        
        const rect = containerRef.current.getBoundingClientRect();
        const percentage = dataPoint.total > 0 
          ? ((dataPoint[hoveredStance] / dataPoint.total) * 100).toFixed(1) 
          : 0;
        
        setTooltip({
          show: true,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top - 10,
          content: {
            date: dataPoint.date,
            stance: hoveredStance,
            users: dataPoint[hoveredStance],
            percentage,
            total: dataPoint.total,
            allStances: {
              pro_nato: dataPoint.pro_nato,
              neutral: dataPoint.neutral,
              pro_russia: dataPoint.pro_russia
            }
          }
        });
        
        // Highlight the hovered stream
        g.selectAll('.stream').attr('opacity', d => d.key === hoveredStance ? 1 : 0.4);
      }
    })
    .on('mouseleave', function() {
      setTooltip({ show: false, x: 0, y: 0, content: null });
      g.selectAll('.stream').attr('opacity', 1);
    });

  }, [streamData, dimensions, selectedStances, allEvents, setDateRange, minDate, maxDate, setSelectedStances, dateRange]);

  // Format number
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toLocaleString() || '0';
  };

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr + '-01');
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div ref={containerRef} className="relative w-full h-full px-4 pt-1" style={{ overflow: 'visible' }}>
      {/* Country indicator when a country is selected */}
      {selectedCountry && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm z-10 flex items-center gap-2">
          <span>Showing data for:</span>
          <span className="font-semibold">{countryNames[selectedCountry] || selectedCountry}</span>
        </div>
      )}

      {/* SVG Container */}
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={chartHeight}
        className="overflow-visible"
      />

      {/* Tooltip - Using fixed positioning to escape container bounds */}
      {tooltip.show && tooltip.content && (
        <div
          className="fixed pointer-events-none bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 px-3 py-2 z-[100] min-w-[180px]"
          style={{
            left: (() => {
              const rect = containerRef.current?.getBoundingClientRect();
              const x = rect ? rect.left + tooltip.x : tooltip.x;
              return Math.min(x, window.innerWidth - 220);
            })(),
            top: (() => {
              const rect = containerRef.current?.getBoundingClientRect();
              return rect ? rect.top + tooltip.y - 10 : tooltip.y;
            })(),
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="text-xs font-medium text-slate-700 mb-2 border-b border-slate-100 pb-1">
            {formatDate(tooltip.content.date)}
          </div>
          
          {/* Highlighted stance */}
          <div className="flex items-center gap-2 text-xs mb-2 bg-slate-50 -mx-1 px-1 py-1 rounded">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: stanceColors[tooltip.content.stance] }}></span>
            <span className="font-medium text-slate-700">{stanceLabels[tooltip.content.stance]}</span>
            <span className="ml-auto font-bold">{formatNumber(tooltip.content.users)}</span>
            <span className="text-slate-400">({tooltip.content.percentage}%)</span>
          </div>
          
          {/* All stances breakdown */}
          <div className="space-y-1">
            {['pro_nato', 'neutral', 'pro_russia'].map(stance => {
              if (stance === tooltip.content.stance) return null;
              const value = tooltip.content.allStances[stance];
              const pct = tooltip.content.total > 0 ? ((value / tooltip.content.total) * 100).toFixed(1) : 0;
              return (
                <div key={stance} className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded" style={{ backgroundColor: stanceColors[stance] }}></span>
                  <span>{stanceLabels[stance]}</span>
                  <span className="ml-auto">{formatNumber(value)}</span>
                  <span className="text-slate-400">({pct}%)</span>
                </div>
              );
            })}
          </div>
          
          <div className="text-xs text-slate-400 mt-2 pt-1 border-t border-slate-100">
            Total: {formatNumber(tooltip.content.total)} users
          </div>
        </div>
      )}

      {/* Event Tooltip */}
      {eventTooltip.show && eventTooltip.event && (
        <div
          className="fixed pointer-events-none bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-amber-200 px-4 py-3 z-[100] max-w-xs"
          style={{
            left: (() => {
              const rect = containerRef.current?.getBoundingClientRect();
              const x = rect ? rect.left + eventTooltip.x : eventTooltip.x;
              return Math.min(x, window.innerWidth - 220);
            })(),
            top: (() => {
              const rect = containerRef.current?.getBoundingClientRect();
              return rect ? rect.top + eventTooltip.y : eventTooltip.y;
            })(),
            transform: 'translate(-50%, 0)'
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${eventTooltip.event.type === 'major' ? 'bg-amber-500' : 'bg-slate-400'}`}></span>
            <span className="text-xs text-slate-500">
              {new Date(eventTooltip.event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className="text-sm font-semibold text-slate-800 mb-1">{eventTooltip.event.title}</div>
          <div className="text-xs text-slate-600">{eventTooltip.event.description}</div>
        </div>
      )}
    </div>
  );
}

export default StreamGraph;

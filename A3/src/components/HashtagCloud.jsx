import React, { useMemo, useRef, useEffect, useState } from 'react';

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

function HashtagCloud({ 
  hashtagData = [], 
  dateRange, 
  selectedStances = ['pro_nato', 'pro_russia', 'neutral'],
  selectedCountry = null,
  countryMultipliers = {}
}) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 100 });
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, hashtag: null });
  const [collapsed, setCollapsed] = useState(false);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width: width - 24, height: height - 40 });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  // Process hashtag data based on filters
  const processedHashtags = useMemo(() => {
    if (!hashtagData || hashtagData.length === 0) return [];
    
    const [startDate, endDate] = dateRange;
    
    // Filter by date range and selected stances
    const filtered = hashtagData.filter(d => {
      const date = new Date(d.year, d.month - 1, 1);
      const monthEnd = new Date(d.year, d.month, 0);
      return date <= endDate && monthEnd >= startDate && selectedStances.includes(d.stance);
    });
    
    // Aggregate by tag
    const aggregated = {};
    filtered.forEach(d => {
      if (!aggregated[d.tag]) {
        aggregated[d.tag] = { tag: d.tag, count: 0, stance: d.stance };
      }
      
      // Apply country multiplier if a country is selected
      let multiplier = 1;
      if (selectedCountry) {
        const countryMult = countryMultipliers[selectedCountry] || countryMultipliers.default || { pro_nato: 1, neutral: 1, pro_russia: 1 };
        multiplier = countryMult[d.stance] || 1;
      }
      
      aggregated[d.tag].count += Math.round(d.count * multiplier);
    });
    
    // Sort by count and take top hashtags
    return Object.values(aggregated)
      .sort((a, b) => b.count - a.count)
      .slice(0, 30); // Top 30 hashtags
  }, [hashtagData, dateRange, selectedStances, selectedCountry, countryMultipliers]);

  // Calculate font sizes
  const fontSizes = useMemo(() => {
    if (processedHashtags.length === 0) return [];
    
    const counts = processedHashtags.map(h => h.count);
    const maxCount = Math.max(...counts);
    const minCount = Math.min(...counts);
    const range = maxCount - minCount || 1;
    
    // Font size range: 11px to 28px
    const minFont = 11;
    const maxFont = 28;
    
    return processedHashtags.map(h => {
      const normalized = (h.count - minCount) / range;
      return minFont + normalized * (maxFont - minFont);
    });
  }, [processedHashtags]);

  // Format number for tooltip
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const handleMouseEnter = (e, hashtag) => {
    const rect = containerRef.current.getBoundingClientRect();
    setTooltip({
      show: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      hashtag
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, hashtag: null });
  };

  if (processedHashtags.length === 0) {
    return (
      <div ref={containerRef} className="bg-white">
        <div className="px-3 py-2 border-b border-slate-200 border-t-2 border-t-slate-300 flex items-center justify-between cursor-pointer select-none" onClick={() => setCollapsed(v => !v)}>
          <span>
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Top Hashtags</span>
            <span className="ml-2 text-[11px] text-slate-400 font-normal">(showing top 30)</span>
          </span>
          <span className="text-slate-400 text-lg">{collapsed ? '+' : '–'}</span>
        </div>
        {!collapsed && (
          <div className="px-3 py-3 text-slate-400 text-sm">No hashtags for selected filters</div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-white">
      {/* Header - matching Statistics section styling */}
      <div className="px-3 py-2 border-b border-slate-200 border-t-2 border-t-slate-300 flex items-center justify-between cursor-pointer select-none" onClick={() => setCollapsed(v => !v)}>
        <span>
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Top Hashtags</span>
          <span className="ml-2 text-[11px] text-slate-400 font-normal">(showing top 30)</span>
        </span>
        <span className="text-slate-400 text-lg">{collapsed ? '+' : '–'}</span>
      </div>

      {/* Word Cloud Container */}
      {!collapsed && (
        <div className="px-3 py-3 flex flex-wrap items-start content-start justify-start gap-x-2 gap-y-1">
          {processedHashtags.map((hashtag, idx) => (
            <span
              key={hashtag.tag}
              className="cursor-pointer transition-all duration-200 hover:scale-110"
              style={{
                fontSize: `${fontSizes[idx]}px`,
                color: stanceColors[hashtag.stance],
                fontWeight: fontSizes[idx] > 20 ? 600 : fontSizes[idx] > 15 ? 500 : 400,
                opacity: 0.85 + (fontSizes[idx] - 11) / (28 - 11) * 0.15,
                lineHeight: 1.3
              }}
              onMouseEnter={(e) => handleMouseEnter(e, hashtag)}
              onMouseLeave={handleMouseLeave}
            >
              {hashtag.tag}
            </span>
          ))}
        </div>
      )}

      {/* Tooltip */}
      {tooltip.show && tooltip.hashtag && !collapsed && (
        <div
          className="fixed pointer-events-none bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 px-3 py-2 z-[100]"
          style={{
            left: (() => {
              const rect = containerRef.current?.getBoundingClientRect();
              const x = rect ? rect.left + tooltip.x : tooltip.x;
              return Math.min(x, window.innerWidth - 180);
            })(),
            top: (() => {
              const rect = containerRef.current?.getBoundingClientRect();
              return rect ? rect.top + tooltip.y - 70 : tooltip.y - 70;
            })(),
            transform: 'translateX(-50%)'
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: stanceColors[tooltip.hashtag.stance] }}
            ></span>
            <span className="text-sm font-semibold text-slate-800">{tooltip.hashtag.tag}</span>
          </div>
          <div className="text-xs text-slate-600">
            <span className="font-medium">{formatNumber(tooltip.hashtag.count)}</span> mentions
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {stanceLabels[tooltip.hashtag.stance]}
          </div>
        </div>
      )}
    </div>
  );
}

export default HashtagCloud;

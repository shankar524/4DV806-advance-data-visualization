import React, { useMemo, useRef, useEffect, useState } from 'react';

const stanceColors = {
  pro_nato: '#3b82f6',
  neutral: '#6b7280',
  pro_russia: '#ef4444'
};

function WordCloud({ 
  hashtagData = [], 
  selectedStances = ['pro_nato', 'pro_russia', 'neutral'],
  maxWords = 40
}) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 280, height: 200 });
  const [hoveredTag, setHoveredTag] = useState(null);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width: width - 20, height: height - 50 });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter and process hashtags
  const processedTags = useMemo(() => {
    if (!hashtagData || hashtagData.length === 0) return [];

    // Filter by selected stances
    const filtered = hashtagData.filter(h => selectedStances.includes(h.stance));
    
    // Sort by count and take top N
    const sorted = [...filtered].sort((a, b) => b.count - a.count).slice(0, maxWords);
    
    // Calculate font sizes (logarithmic scale for better distribution)
    const maxCount = Math.max(...sorted.map(h => h.count));
    const minCount = Math.min(...sorted.map(h => h.count));
    const logMax = Math.log(maxCount + 1);
    const logMin = Math.log(minCount + 1);
    
    return sorted.map(h => ({
      ...h,
      fontSize: 10 + ((Math.log(h.count + 1) - logMin) / (logMax - logMin || 1)) * 18,
      color: stanceColors[h.stance]
    }));
  }, [hashtagData, selectedStances, maxWords]);

  // Simple spiral layout
  const positionedTags = useMemo(() => {
    if (processedTags.length === 0) return [];

    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;
    
    const positions = [];
    let angle = 0;
    let radius = 0;
    const angleStep = 0.5;
    const radiusStep = 3;
    
    processedTags.forEach((tag, index) => {
      // Estimate text width based on font size and tag length
      const estimatedWidth = tag.tag.length * (tag.fontSize * 0.5);
      const estimatedHeight = tag.fontSize * 1.2;
      
      // Find a position that doesn't overlap
      let attempts = 0;
      let x, y;
      let validPosition = false;
      
      while (!validPosition && attempts < 200) {
        x = centerX + radius * Math.cos(angle) - estimatedWidth / 2;
        y = centerY + radius * Math.sin(angle);
        
        // Check bounds
        if (x > 5 && x + estimatedWidth < width - 5 && y > 10 && y + estimatedHeight < height - 10) {
          // Check overlap with existing positions
          const hasOverlap = positions.some(pos => {
            return !(x + estimatedWidth < pos.x || 
                    x > pos.x + pos.width ||
                    y + estimatedHeight < pos.y ||
                    y > pos.y + pos.height);
          });
          
          if (!hasOverlap) {
            validPosition = true;
          }
        }
        
        angle += angleStep;
        if (angle > Math.PI * 2) {
          angle = 0;
          radius += radiusStep;
        }
        attempts++;
      }
      
      if (validPosition) {
        positions.push({
          ...tag,
          x,
          y,
          width: estimatedWidth,
          height: estimatedHeight
        });
      }
    });
    
    return positions;
  }, [processedTags, dimensions]);

  // Format number
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toLocaleString() || '0';
  };

  return (
    <div ref={containerRef} className="relative w-full h-full p-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-sm font-semibold text-slate-700">Hashtag Cloud</h3>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stanceColors.pro_nato }}></span>
            Pro-NATO
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stanceColors.neutral }}></span>
            Neutral
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stanceColors.pro_russia }}></span>
            Pro-Russia
          </span>
        </div>
      </div>

      {/* Word Cloud SVG */}
      <svg width={dimensions.width} height={dimensions.height} className="overflow-visible">
        {positionedTags.map((tag, index) => (
          <text
            key={tag.tag}
            x={tag.x + tag.width / 2}
            y={tag.y + tag.height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={tag.fontSize}
            fill={tag.color}
            fontWeight={tag.fontSize > 18 ? 600 : 400}
            className="cursor-pointer transition-all duration-200"
            style={{
              opacity: hoveredTag === null || hoveredTag === tag.tag ? 1 : 0.3,
              transform: hoveredTag === tag.tag ? 'scale(1.1)' : 'scale(1)',
              transformOrigin: `${tag.x + tag.width / 2}px ${tag.y + tag.height / 2}px`
            }}
            onMouseEnter={() => setHoveredTag(tag.tag)}
            onMouseLeave={() => setHoveredTag(null)}
          >
            {tag.tag}
          </text>
        ))}
      </svg>

      {/* Tooltip */}
      {hoveredTag && (
        <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 px-3 py-2 z-50">
          {(() => {
            const tag = processedTags.find(t => t.tag === hoveredTag);
            if (!tag) return null;
            return (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tag.color }}></span>
                  <span className="font-medium text-slate-800">{tag.tag}</span>
                </div>
                <span className="text-sm text-slate-600">{formatNumber(tag.count)} mentions</span>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default WordCloud;

import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import Flag from 'react-world-flags';

// We'll use a simplified world topology
const WORLD_TOPOLOGY_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Country code mapping from numeric to alpha-2
const numericToAlpha2 = {
  4: 'AF', 8: 'AL', 12: 'DZ', 20: 'AD', 24: 'AO', 28: 'AG', 32: 'AR', 51: 'AM', 36: 'AU',
  40: 'AT', 31: 'AZ', 44: 'BS', 48: 'BH', 50: 'BD', 52: 'BB', 112: 'BY', 56: 'BE', 84: 'BZ',
  204: 'BJ', 64: 'BT', 68: 'BO', 70: 'BA', 72: 'BW', 76: 'BR', 96: 'BN', 100: 'BG', 854: 'BF',
  108: 'BI', 116: 'KH', 120: 'CM', 124: 'CA', 132: 'CV', 140: 'CF', 148: 'TD', 152: 'CL',
  156: 'CN', 170: 'CO', 174: 'KM', 178: 'CG', 180: 'CD', 188: 'CR', 384: 'CI', 191: 'HR',
  192: 'CU', 196: 'CY', 203: 'CZ', 208: 'DK', 262: 'DJ', 212: 'DM', 214: 'DO', 218: 'EC',
  818: 'EG', 222: 'SV', 226: 'GQ', 232: 'ER', 233: 'EE', 231: 'ET', 242: 'FJ', 246: 'FI',
  250: 'FR', 266: 'GA', 270: 'GM', 268: 'GE', 276: 'DE', 288: 'GH', 300: 'GR', 308: 'GD',
  320: 'GT', 324: 'GN', 624: 'GW', 328: 'GY', 332: 'HT', 340: 'HN', 348: 'HU', 352: 'IS',
  356: 'IN', 360: 'ID', 364: 'IR', 368: 'IQ', 372: 'IE', 376: 'IL', 380: 'IT', 388: 'JM',
  392: 'JP', 400: 'JO', 398: 'KZ', 404: 'KE', 296: 'KI', 408: 'KP', 410: 'KR', 414: 'KW',
  417: 'KG', 418: 'LA', 428: 'LV', 422: 'LB', 426: 'LS', 430: 'LR', 434: 'LY', 438: 'LI',
  440: 'LT', 442: 'LU', 807: 'MK', 450: 'MG', 454: 'MW', 458: 'MY', 462: 'MV', 466: 'ML',
  470: 'MT', 584: 'MH', 478: 'MR', 480: 'MU', 484: 'MX', 583: 'FM', 498: 'MD', 492: 'MC',
  496: 'MN', 499: 'ME', 504: 'MA', 508: 'MZ', 104: 'MM', 516: 'NA', 520: 'NR', 524: 'NP',
  528: 'NL', 554: 'NZ', 558: 'NI', 562: 'NE', 566: 'NG', 578: 'NO', 512: 'OM', 586: 'PK',
  585: 'PW', 591: 'PA', 598: 'PG', 600: 'PY', 604: 'PE', 608: 'PH', 616: 'PL', 620: 'PT',
  634: 'QA', 642: 'RO', 643: 'RU', 646: 'RW', 659: 'KN', 662: 'LC', 670: 'VC', 882: 'WS',
  674: 'SM', 678: 'ST', 682: 'SA', 686: 'SN', 688: 'RS', 690: 'SC', 694: 'SL', 702: 'SG',
  703: 'SK', 705: 'SI', 90: 'SB', 706: 'SO', 710: 'ZA', 728: 'SS', 724: 'ES', 144: 'LK',
  729: 'SD', 740: 'SR', 748: 'SZ', 752: 'SE', 756: 'CH', 760: 'SY', 158: 'TW', 762: 'TJ',
  834: 'TZ', 764: 'TH', 626: 'TL', 768: 'TG', 776: 'TO', 780: 'TT', 788: 'TN', 792: 'TR',
  795: 'TM', 798: 'TV', 800: 'UG', 804: 'UA', 784: 'AE', 826: 'GB', 840: 'US', 858: 'UY',
  860: 'UZ', 548: 'VU', 862: 'VE', 704: 'VN', 887: 'YE', 894: 'ZM', 716: 'ZW'
};

// Reverse mapping: alpha2 to numeric
const alpha2ToNumeric = Object.fromEntries(
  Object.entries(numericToAlpha2).map(([num, alpha]) => [alpha, parseInt(num)])
);

function WorldMap({ data, selectedCountry, onCountrySelect, selectedStances = ['pro_nato', 'pro_russia', 'neutral'], fullscreen = false }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const zoomRef = useRef(null);
  const projectionRef = useRef(null); // Store projection for zoom-to-country
  const pathRef = useRef(null); // Store path generator
  const transformRef = useRef(d3.zoomIdentity); // Store current transform
  const prevSelectedCountryRef = useRef(null); // Track previous selection
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: null });
  const [worldData, setWorldData] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 });
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Create a lookup for country data
  const countryDataMap = React.useMemo(() => {
    const map = {};
    data.forEach(d => {
      map[d.country_code] = d;
    });
    return map;
  }, [data]);
  
  // Load world topology
  useEffect(() => {
    fetch(WORLD_TOPOLOGY_URL)
      .then(response => response.json())
      .then(topology => {
        const countries = feature(topology, topology.objects.countries);
        setWorldData(countries);
      })
      .catch(error => console.error('Error loading world data:', error));
  }, []);
  
  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Also observe container size changes
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [fullscreen]);
  
  // Render map
  useEffect(() => {
    if (!worldData || !svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;
    
    // Clear previous content
    svg.selectAll('*').remove();
    
    // Create a group for the map that will be zoomed/panned
    const g = svg.append('g').attr('class', 'map-group');
    
    // Create projection
    const projection = d3.geoNaturalEarth1()
      .fitSize([width, height], worldData);
    
    const path = d3.geoPath().projection(projection);
    
    // Store refs for zoom-to-country functionality
    projectionRef.current = projection;
    pathRef.current = path;
    
    // Set up zoom behavior with pan constraints
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .translateExtent([[0, 0], [width, height]]) // Constrain panning to map bounds
      .extent([[0, 0], [width, height]])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        transformRef.current = event.transform; // Store transform
        setZoomLevel(event.transform.k);
      });
    
    // Store zoom ref for external controls
    zoomRef.current = zoom;
    
    // Apply zoom to SVG
    svg.call(zoom);
    
    // Restore previous transform if it exists
    if (transformRef.current && transformRef.current !== d3.zoomIdentity) {
      svg.call(zoom.transform, transformRef.current);
      g.attr('transform', transformRef.current);
    }
    
    // Color scales
    const natoColorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, 1]);
    const russiaColorScale = d3.scaleSequential(d3.interpolateReds).domain([0, 1]);
    const neutralColorScale = d3.scaleSequential(d3.interpolateGreys).domain([0, 1]);
    
    // Get max user count for intensity scaling
    const maxUsers = Math.max(...data.map(d => d.total), 1);
    
    // Function to get country color
    const getCountryColor = (countryCode) => {
      const countryInfo = countryDataMap[countryCode];
      if (!countryInfo || countryInfo.total === 0) {
        return '#f1f5f9'; // Light gray for no data
      }
      
      // Intensity based on user count (log scale for better distribution)
      const intensity = Math.log(countryInfo.total + 1) / Math.log(maxUsers + 1);
      const scaledIntensity = 0.3 + intensity * 0.7; // Range from 0.3 to 1
      
      // Color based on dominant stance
      switch (countryInfo.dominant_stance) {
        case 'pro_nato':
          return natoColorScale(scaledIntensity);
        case 'pro_russia':
          return russiaColorScale(scaledIntensity);
        case 'neutral':
          return neutralColorScale(scaledIntensity);
        default:
          return '#f1f5f9';
      }
    };
    
    // Draw countries
    g.append('g')
      .selectAll('path')
      .data(worldData.features)
      .join('path')
      .attr('d', path)
      .attr('class', 'country')
      .attr('fill', d => {
        const alpha2 = numericToAlpha2[d.id];
        return getCountryColor(alpha2);
      })
      .attr('stroke', d => {
        const alpha2 = numericToAlpha2[d.id];
        return selectedCountry === alpha2 ? '#1e40af' : '#94a3b8';
      })
      .attr('stroke-width', d => {
        const alpha2 = numericToAlpha2[d.id];
        return selectedCountry === alpha2 ? 3 : 0.5;
      })
      .attr('opacity', d => {
        // If a country is selected, defocus other countries
        if (!selectedCountry) return 1;
        const alpha2 = numericToAlpha2[d.id];
        return selectedCountry === alpha2 ? 1 : 0.3;
      })
      .on('mouseenter', (event, d) => {
        const alpha2 = numericToAlpha2[d.id];
        const countryInfo = countryDataMap[alpha2];
        
        if (countryInfo) {
          const rect = containerRef.current.getBoundingClientRect();
          setTooltip({
            show: true,
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            content: countryInfo
          });
        }
      })
      .on('mousemove', (event) => {
        const rect = containerRef.current.getBoundingClientRect();
        setTooltip(prev => ({
          ...prev,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        }));
      })
      .on('mouseleave', () => {
        setTooltip({ show: false, x: 0, y: 0, content: null });
      })
      .on('click', (event, d) => {
        const alpha2 = numericToAlpha2[d.id];
        if (countryDataMap[alpha2]) {
          onCountrySelect(selectedCountry === alpha2 ? null : alpha2);
        }
      });
    
  }, [worldData, dimensions, data, countryDataMap, selectedCountry, onCountrySelect]);
  
  // Zoom to selected country when it changes
  useEffect(() => {
    if (!worldData || !svgRef.current || !zoomRef.current || !pathRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;
    
    // If country is deselected, reset to initial view
    if (!selectedCountry) {
      if (prevSelectedCountryRef.current) {
        // Only reset if we had a previous selection
        transformRef.current = d3.zoomIdentity;
        svg.transition()
          .duration(750)
          .call(zoomRef.current.transform, d3.zoomIdentity);
      }
      prevSelectedCountryRef.current = null;
      return;
    }
    
    // Skip if same country is already selected
    if (selectedCountry === prevSelectedCountryRef.current) return;
    prevSelectedCountryRef.current = selectedCountry;
    
    // Find the country feature
    const numericId = alpha2ToNumeric[selectedCountry];
    const countryFeature = worldData.features.find(f => f.id === numericId);
    
    if (!countryFeature) return;
    
    // Calculate bounds of the country
    const bounds = pathRef.current.bounds(countryFeature);
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const x = (bounds[0][0] + bounds[1][0]) / 2;
    const y = (bounds[0][1] + bounds[1][1]) / 2;
    
    // Calculate scale and translate - add padding
    const scale = Math.max(1, Math.min(8, 0.7 / Math.max(dx / width, dy / height)));
    const translate = [width / 2 - scale * x, height / 2 - scale * y];
    
    // Create new transform
    const newTransform = d3.zoomIdentity
      .translate(translate[0], translate[1])
      .scale(scale);
    
    // Store and apply transform with animation
    transformRef.current = newTransform;
    svg.transition()
      .duration(750)
      .call(zoomRef.current.transform, newTransform);
      
  }, [selectedCountry, worldData, dimensions]);
  
  // Format number
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };
  
  // Zoom control handlers
  const handleZoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, 1.5);
    }
  };
  
  const handleZoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, 0.67);
    }
  };
  
  const handleZoomReset = () => {
    if (svgRef.current && zoomRef.current) {
      transformRef.current = d3.zoomIdentity; // Reset stored transform
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.transform, d3.zoomIdentity);
    }
  };
  
  return (
    <div ref={containerRef} className={`relative ${fullscreen ? 'w-full h-full' : ''} overflow-hidden`}>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className={`cursor-grab active:cursor-grabbing bg-slate-100`}
        style={{ display: 'block' }}
      />
      
      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-md overflow-hidden">
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-slate-100 transition-colors text-slate-600 hover:text-slate-800"
          title="Zoom In"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
          </svg>
        </button>
        <div className="border-t border-slate-200"></div>
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-slate-100 transition-colors text-slate-600 hover:text-slate-800"
          title="Zoom Out"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h12" />
          </svg>
        </button>
        <div className="border-t border-slate-200"></div>
        <button
          onClick={handleZoomReset}
          className="p-2 hover:bg-slate-100 transition-colors text-slate-600 hover:text-slate-800"
          title="Reset View"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>
      
      {/* Zoom Level Indicator */}
      {zoomLevel > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-md text-xs text-slate-600">
          {zoomLevel.toFixed(1)}x
        </div>
      )}
      
      {/* Tooltip */}
      {tooltip.show && tooltip.content && (
        <div
          className="tooltip"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            transform: tooltip.x > dimensions.width - 200 ? 'translateX(-100%)' : 'none'
          }}
        >
          <div className="font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-2 flex items-center gap-2">
            <Flag code={tooltip.content.country_code} className="w-6 h-4 rounded shadow-sm object-cover" fallback={<span>🌍</span>} />
            {tooltip.content.country_name}
          </div>
          <div className="space-y-1 text-slate-600">
            {/* Show total user count */}
            <div className="flex justify-between">
              <span>Total Users:</span>
              <span className="font-medium">{formatNumber(tooltip.content.total)}</span>
            </div>
            
            {/* Only show percentages when 2 or more stances are selected */}
            {selectedStances.length >= 2 && (
              <>
                {selectedStances.includes('pro_nato') && (
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      Pro-NATO:
                    </span>
                    <span className="font-medium">
                      {tooltip.content.total > 0 
                        ? (tooltip.content.pro_nato / tooltip.content.total * 100).toFixed(1) + '%'
                        : '0%'}
                    </span>
                  </div>
                )}
                {selectedStances.includes('neutral') && (
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                      Neutral:
                    </span>
                    <span className="font-medium">
                      {tooltip.content.total > 0 
                        ? (tooltip.content.neutral / tooltip.content.total * 100).toFixed(1) + '%'
                        : '0%'}
                    </span>
                  </div>
                )}
                {selectedStances.includes('pro_russia') && (
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Pro-Russia:
                    </span>
                    <span className="font-medium">
                      {tooltip.content.total > 0 
                        ? (tooltip.content.pro_russia / tooltip.content.total * 100).toFixed(1) + '%'
                        : '0%'}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default WorldMap;

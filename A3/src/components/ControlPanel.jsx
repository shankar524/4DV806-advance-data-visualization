import React, { useState, useMemo } from 'react';
import Flag from 'react-world-flags';
import { FiSearch, FiX, FiGlobe, FiRotateCcw, FiInfo } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// Milestone dates for the date slider
const milestones = [
  { date: new Date(2022, 1, 24), label: 'Invasion Start', description: 'Russia invades Ukraine' },
  { date: new Date(2022, 3, 3), label: 'Bucha Massacre', description: 'Civilian atrocities discovered' },
  { date: new Date(2022, 4, 20), label: 'Mariupol Falls', description: 'Azovstal steel plant surrenders' },
  { date: new Date(2022, 8, 21), label: 'Mobilization', description: 'Russia announces mobilization' },
  { date: new Date(2022, 10, 11), label: 'Kherson Liberation', description: 'Ukraine recaptures Kherson' },
  { date: new Date(2023, 1, 24), label: '1 Year of War', description: 'One year since invasion' }
];

const stanceConfig = {
  pro_nato: { label: 'Pro-NATO/Ukraine', color: '#3b82f6', bgColor: 'bg-blue-500' },
  pro_russia: { label: 'Pro-Russia', color: '#ef4444', bgColor: 'bg-red-500' },
  neutral: { label: 'Neutral', color: '#9ca3af', bgColor: 'bg-gray-400' }
};

const ControlPanel = ({
  dateRange,
  setDateRange,
  selectedStances,
  setSelectedStances,
  searchQuery,
  setSearchQuery,
  searchResults,
  onCountrySelect,
  selectedCountry,
  selectedCountryData,
  onCloseCountry,
  countryData,
  totals,
  onReset,
  minDate,
  maxDate,
  temporalChartData
}) => {
  const [hoveredMilestone, setHoveredMilestone] = useState(null);
  
  // Calculate position for date values
  const totalDays = (maxDate - minDate) / (1000 * 60 * 60 * 24);
  
  const getPositionPercent = (date) => {
    const days = (date - minDate) / (1000 * 60 * 60 * 24);
    return (days / totalDays) * 100;
  };
  
  const percentToDate = (percent) => {
    const days = (percent / 100) * totalDays;
    return new Date(minDate.getTime() + days * 24 * 60 * 60 * 1000);
  };
  
  const handleSliderChange = (values) => {
    const startDate = percentToDate(values[0]);
    const endDate = percentToDate(values[1]);
    setDateRange([startDate, endDate]);
  };
  
  const handleStanceToggle = (stance) => {
    if (selectedStances.includes(stance)) {
      if (selectedStances.length > 1) {
        setSelectedStances(selectedStances.filter(s => s !== stance));
      }
    } else {
      setSelectedStances([...selectedStances, stance]);
    }
  };
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  
  // Group countries by dominant stance
  const countriesByStance = useMemo(() => {
    const groups = { pro_nato: [], pro_russia: [], neutral: [] };
    countryData.forEach(c => {
      if (c.dominant_stance && groups[c.dominant_stance]) {
        groups[c.dominant_stance].push(c);
      }
    });
    // Sort by total tweets descending
    Object.keys(groups).forEach(stance => {
      groups[stance].sort((a, b) => b.total - a.total);
    });
    return groups;
  }, [countryData]);
  
  // Hoverable country list popover state
  const [hoveredStance, setHoveredStance] = useState(null);
  
  return (
    <div className="w-[480px] bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Tweet Analysis on Russia-Ukraine Conflict</h1>
            <p className="text-blue-200 text-sm">Using Tweet volume</p>
          </div>
        </div>
      </div>
      
      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search countries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <FiX size={16} />
            </button>
          )}
        </div>
        
        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute z-20 w-[440px] mt-1 bg-white rounded-lg shadow-lg border border-slate-200 max-h-56 overflow-y-auto">
            {searchResults.map(country => (
              <button
                key={country.country_code}
                onClick={() => {
                  onCountrySelect(country.country_code);
                  setSearchQuery('');
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-sm"
              >
                <Flag code={country.country_code} className="w-5 h-3 object-cover rounded-sm" />
                <span>{country.country_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* FILTERS SECTION */}
      <div className="bg-slate-50/50">
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Filters</span>
          <button
            onClick={onReset}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <FiRotateCcw size={12} />
            Reset All
          </button>
        </div>
        
        {/* Date Range Slider */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700">Date Range</span>
            <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">{formatDate(dateRange[0])} - {formatDate(dateRange[1])}</span>
          </div>
        
        <div className="relative mt-4 pb-2">
          {/* RC Slider Range */}
          <div className="relative">
            {/* Milestone Markers - positioned on top of slider */}
            {milestones.map((m, i) => {
              const pos = getPositionPercent(m.date);
              if (pos < 0 || pos > 100) return null;
              // Determine tooltip alignment based on position
              const tooltipAlign = pos < 20 ? 'left-0' : pos > 80 ? 'right-0' : 'left-1/2 -translate-x-1/2';
              return (
                <div
                  key={i}
                  className="absolute transform -translate-x-1/2 z-10 cursor-pointer"
                  style={{ left: `${pos}%`, top: -2 }}
                  onMouseEnter={() => setHoveredMilestone(i)}
                  onMouseLeave={() => setHoveredMilestone(null)}
                >
                  <div className="w-0.5 h-4 bg-slate-600"></div>
                  {hoveredMilestone === i && (
                    <div className={`absolute bottom-6 ${tooltipAlign} bg-slate-700 text-white text-xs px-2 py-1.5 rounded whitespace-nowrap z-50 shadow-lg`}>
                      <div className="font-medium">{m.label}</div>
                      <div className="text-[10px] opacity-80">{m.description}</div>
                      <div className="text-[10px] opacity-60">{m.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <Slider
            range
            min={0}
            max={100}
            value={[getPositionPercent(dateRange[0]), getPositionPercent(dateRange[1])]}
            onChange={handleSliderChange}
            allowCross={false}
            styles={{
              track: { backgroundColor: '#3b82f6', height: 6 },
              rail: { backgroundColor: '#e2e8f0', height: 6 },
              handle: {
                backgroundColor: '#fff',
                borderColor: '#3b82f6',
                borderWidth: 2,
                width: 16,
                height: 16,
                marginTop: -5,
                opacity: 1,
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }
            }}
          />
        </div>
        
        {/* Timeline labels */}
        <div className="flex justify-between text-[10px] text-slate-500 mt-1 px-1">
          <span>Feb 2022</span>
          <span>May 2023</span>
        </div>
        </div>
      
        {/* Stance Filter */}
        <div className="px-5 py-4 border-t border-slate-100">
          <span className="text-sm font-medium text-slate-700">Stance Filter</span>
          <div className="mt-3 space-y-2">
            {Object.entries(stanceConfig).map(([key, config]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedStances.includes(key)}
                    onChange={() => handleStanceToggle(key)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border-2 transition-all ${
                    selectedStances.includes(key) 
                      ? 'border-transparent' 
                      : 'border-slate-300 group-hover:border-slate-400'
                  }`} style={{ backgroundColor: selectedStances.includes(key) ? config.color : 'transparent' }}>
                    {selectedStances.includes(key) && (
                      <svg className="w-3 h-3 text-white mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-slate-600">{config.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      {/* STATISTICS SECTION */}
      <div className="bg-white">
        <div className="px-5 py-3 border-b border-slate-200 border-t-2 border-t-slate-300">
          <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Statistics</span>
        </div>
        
        <div className="px-5 py-4">
        
        {/* Show country-specific stats when a country is selected */}
        {selectedCountryData ? (
          <div className="space-y-4">
            {/* Country Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Flag code={selectedCountryData.country_code} className="w-8 h-5 object-cover rounded shadow-sm" />
                <span className="font-semibold text-lg text-slate-800">{selectedCountryData.country_name}</span>
              </div>
              <button onClick={onCloseCountry} className="text-slate-400 hover:text-slate-600">
                <FiX size={18} />
              </button>
            </div>
            
            {/* Tweets by Stance - Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Tweets by Stance</span>
                <span className="text-sm font-semibold text-slate-800">
                  {selectedCountryData.totals.total >= 1000000 
                    ? `${(selectedCountryData.totals.total / 1000000).toFixed(1)}M` 
                    : selectedCountryData.totals.total >= 1000 
                      ? `${(selectedCountryData.totals.total / 1000).toFixed(0)}K`
                      : selectedCountryData.totals.total.toLocaleString()} tweets
                </span>
              </div>
              <div className="flex h-4 rounded-full overflow-hidden bg-slate-200">
                {selectedCountryData.totals.pro_nato > 0 && (
                  <div
                    className="bg-blue-500"
                    style={{ width: `${(selectedCountryData.totals.pro_nato / selectedCountryData.totals.total) * 100}%` }}
                  ></div>
                )}
                {selectedCountryData.totals.neutral > 0 && (
                  <div
                    className="bg-gray-400"
                    style={{ width: `${(selectedCountryData.totals.neutral / selectedCountryData.totals.total) * 100}%` }}
                  ></div>
                )}
                {selectedCountryData.totals.pro_russia > 0 && (
                  <div
                    className="bg-red-500"
                    style={{ width: `${(selectedCountryData.totals.pro_russia / selectedCountryData.totals.total) * 100}%` }}
                  ></div>
                )}
              </div>
              {/* Tweet counts legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-slate-700">
                    {selectedCountryData.totals.pro_nato >= 1000000 
                      ? `${(selectedCountryData.totals.pro_nato / 1000000).toFixed(1)}M` 
                      : selectedCountryData.totals.pro_nato >= 1000 
                        ? `${(selectedCountryData.totals.pro_nato / 1000).toFixed(0)}K`
                        : selectedCountryData.totals.pro_nato.toLocaleString()}
                    ({((selectedCountryData.totals.pro_nato / selectedCountryData.totals.total) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                  <span className="text-xs text-slate-700">
                    {selectedCountryData.totals.neutral >= 1000000 
                      ? `${(selectedCountryData.totals.neutral / 1000000).toFixed(1)}M` 
                      : selectedCountryData.totals.neutral >= 1000 
                        ? `${(selectedCountryData.totals.neutral / 1000).toFixed(0)}K`
                        : selectedCountryData.totals.neutral.toLocaleString()}
                    ({((selectedCountryData.totals.neutral / selectedCountryData.totals.total) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <span className="text-xs text-slate-700">
                    {selectedCountryData.totals.pro_russia >= 1000000 
                      ? `${(selectedCountryData.totals.pro_russia / 1000000).toFixed(1)}M` 
                      : selectedCountryData.totals.pro_russia >= 1000 
                        ? `${(selectedCountryData.totals.pro_russia / 1000).toFixed(0)}K`
                        : selectedCountryData.totals.pro_russia.toLocaleString()}
                    ({((selectedCountryData.totals.pro_russia / selectedCountryData.totals.total) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            </div>
            
            {/* Unique Users */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-sm text-slate-600">Unique Tweet Authors</span>
              <span className="text-sm font-semibold text-slate-800">
                {selectedCountryData.totals.unique_users >= 1000000 
                  ? `${(selectedCountryData.totals.unique_users / 1000000).toFixed(1)}M` 
                  : selectedCountryData.totals.unique_users >= 1000 
                    ? `${(selectedCountryData.totals.unique_users / 1000).toFixed(0)}K`
                    : selectedCountryData.totals.unique_users.toLocaleString()}
              </span>
            </div>
          </div>
        ) : (
          <>
        {/* Countries by Stance */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Countries by Stance</span>
            <span className="text-sm font-semibold text-slate-800">{countryData.length} countries</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {selectedStances.includes('pro_nato') && countriesByStance.pro_nato.length > 0 && (
              <div
                className="relative flex items-center gap-1.5 cursor-pointer group"
                onMouseEnter={() => setHoveredStance('pro_nato')}
                onMouseLeave={() => setHoveredStance(null)}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <span className="text-xs font-medium text-slate-700 group-hover:text-blue-600">{countriesByStance.pro_nato.length}</span>
                <FiInfo size={10} className="text-slate-400 group-hover:text-blue-500" />
                {hoveredStance === 'pro_nato' && (
                  <div 
                    className="absolute bottom-full left-0 pb-2 z-30"
                    onMouseEnter={() => setHoveredStance('pro_nato')}
                    onMouseLeave={() => setHoveredStance(null)}
                  >
                    <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-2 w-56 max-h-48 overflow-y-auto">
                      <div className="text-xs font-medium text-slate-700 mb-2">Pro-NATO Countries ({countriesByStance.pro_nato.length})</div>
                      <div className="space-y-1">
                        {countriesByStance.pro_nato.map(c => (
                          <button
                            key={c.country_code}
                            onClick={() => onCountrySelect(c.country_code)}
                            className="w-full flex items-center gap-2 py-1 px-1 rounded hover:bg-slate-100 text-left"
                          >
                            <Flag code={c.country_code} className="w-5 h-3 object-cover rounded-sm shadow-sm" />
                            <span className="text-xs text-slate-800 flex-1 truncate">{c.country_name}</span>
                            <span className="text-xs text-slate-600">{c.dominant_percentage.toFixed(0)}%</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {selectedStances.includes('neutral') && countriesByStance.neutral.length > 0 && (
              <div
                className="relative flex items-center gap-1.5 cursor-pointer group"
                onMouseEnter={() => setHoveredStance('neutral')}
                onMouseLeave={() => setHoveredStance(null)}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                <span className="text-xs font-medium text-slate-700 group-hover:text-gray-600">{countriesByStance.neutral.length}</span>
                <FiInfo size={10} className="text-slate-400 group-hover:text-gray-500" />
                {hoveredStance === 'neutral' && (
                  <div 
                    className="absolute bottom-full left-0 pb-2 z-30"
                    onMouseEnter={() => setHoveredStance('neutral')}
                    onMouseLeave={() => setHoveredStance(null)}
                  >
                    <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-2 w-56 max-h-48 overflow-y-auto">
                      <div className="text-xs font-medium text-slate-700 mb-2">Neutral Countries ({countriesByStance.neutral.length})</div>
                      <div className="space-y-1">
                        {countriesByStance.neutral.map(c => (
                          <button
                            key={c.country_code}
                            onClick={() => onCountrySelect(c.country_code)}
                            className="w-full flex items-center gap-2 py-1 px-1 rounded hover:bg-slate-100 text-left"
                          >
                            <Flag code={c.country_code} className="w-5 h-3 object-cover rounded-sm shadow-sm" />
                            <span className="text-xs text-slate-800 flex-1 truncate">{c.country_name}</span>
                            <span className="text-xs text-slate-600">{c.dominant_percentage.toFixed(0)}%</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {selectedStances.includes('pro_russia') && countriesByStance.pro_russia.length > 0 && (
              <div
                className="relative flex items-center gap-1.5 cursor-pointer group"
                onMouseEnter={() => setHoveredStance('pro_russia')}
                onMouseLeave={() => setHoveredStance(null)}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <span className="text-xs font-medium text-slate-700 group-hover:text-red-600">{countriesByStance.pro_russia.length}</span>
                <FiInfo size={10} className="text-slate-400 group-hover:text-red-500" />
                {hoveredStance === 'pro_russia' && (
                  <div 
                    className="absolute bottom-full right-0 pb-2 z-30"
                    onMouseEnter={() => setHoveredStance('pro_russia')}
                    onMouseLeave={() => setHoveredStance(null)}
                  >
                    <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-2 w-56 max-h-48 overflow-y-auto">
                      <div className="text-xs font-medium text-slate-700 mb-2">Pro-Russia Countries ({countriesByStance.pro_russia.length})</div>
                      <div className="space-y-1">
                        {countriesByStance.pro_russia.map(c => (
                          <button
                            key={c.country_code}
                            onClick={() => onCountrySelect(c.country_code)}
                            className="w-full flex items-center gap-2 py-1 px-1 rounded hover:bg-slate-100 text-left"
                          >
                            <Flag code={c.country_code} className="w-5 h-3 object-cover rounded-sm shadow-sm" />
                            <span className="text-xs text-slate-800 flex-1 truncate">{c.country_name}</span>
                            <span className="text-xs text-slate-600">{c.dominant_percentage.toFixed(0)}%</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Tweets by Stance Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Tweets by Stance</span>
            <span className="text-sm font-semibold text-slate-800">{totals.tweets >= 1000000 ? `${(totals.tweets / 1000000).toFixed(1)}M` : `${(totals.tweets / 1000).toFixed(0)}K`} tweets</span>
          </div>
          <div className="flex h-4 rounded-full overflow-hidden bg-slate-200">
            {selectedStances.includes('pro_nato') && totals.pro_nato > 0 && (
              <div
                className="bg-blue-500"
                style={{ width: `${(totals.pro_nato / totals.tweets) * 100}%` }}
              ></div>
            )}
            {selectedStances.includes('neutral') && totals.neutral > 0 && (
              <div
                className="bg-gray-400"
                style={{ width: `${(totals.neutral / totals.tweets) * 100}%` }}
              ></div>
            )}
            {selectedStances.includes('pro_russia') && totals.pro_russia > 0 && (
              <div
                className="bg-red-500"
                style={{ width: `${(totals.pro_russia / totals.tweets) * 100}%` }}
              ></div>
            )}
          </div>
          {/* Tweet counts legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {selectedStances.includes('pro_nato') && (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <span className="text-xs text-slate-700">{(totals.pro_nato / 1000000).toFixed(1)}M ({((totals.pro_nato / totals.tweets) * 100).toFixed(0)}%)</span>
              </div>
            )}
            {selectedStances.includes('neutral') && (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                <span className="text-xs text-slate-700">{(totals.neutral / 1000000).toFixed(1)}M ({((totals.neutral / totals.tweets) * 100).toFixed(0)}%)</span>
              </div>
            )}
            {selectedStances.includes('pro_russia') && (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <span className="text-xs text-slate-700">{(totals.pro_russia / 1000000).toFixed(1)}M ({((totals.pro_russia / totals.tweets) * 100).toFixed(0)}%)</span>
              </div>
            )}
          </div>
        </div>
          </>
        )}
        </div>
      </div>
      
      {/* Temporal Trend Chart */}
      {temporalChartData && temporalChartData.length > 0 && (
        <div className="px-5 py-4 border-t border-slate-100">
          <span className="text-sm font-medium text-slate-700 uppercase tracking-wide">Trends</span>
          <div className="h-44 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={temporalChartData} margin={{ top: 5, right: 10, bottom: 20, left: 40 }}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#475569' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={{ stroke: '#cbd5e1' }}
                  tickFormatter={(value) => {
                    const date = new Date(value + '-01');
                    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                  }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#475569' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={{ stroke: '#cbd5e1' }}
                  tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}
                  width={35}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length > 0) {
                      const date = new Date(label + '-01');
                      const formattedDate = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                      return (
                        <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-slate-200 text-xs">
                          <div className="font-medium text-slate-700 mb-1">{formattedDate}</div>
                          {payload.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                              <span className="text-slate-600">{stanceConfig[entry.dataKey]?.label}:</span>
                              <span className="font-medium" style={{ color: entry.color }}>
                                {(entry.value / 1000).toFixed(0)}K
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {selectedStances.includes('pro_nato') && (
                  <Line
                    type="monotone"
                    dataKey="pro_nato"
                    stroke={stanceConfig.pro_nato.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 3 }}
                  />
                )}
                {selectedStances.includes('neutral') && (
                  <Line
                    type="monotone"
                    dataKey="neutral"
                    stroke={stanceConfig.neutral.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 3 }}
                  />
                )}
                {selectedStances.includes('pro_russia') && (
                  <Line
                    type="monotone"
                    dataKey="pro_russia"
                    stroke={stanceConfig.pro_russia.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 3 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;

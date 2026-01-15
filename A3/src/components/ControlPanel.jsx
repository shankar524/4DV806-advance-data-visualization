import React, { useState, useMemo } from 'react';
import Flag from 'react-world-flags';
import { FiSearch, FiX, FiRotateCcw, FiInfo } from 'react-icons/fi';

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
  showTrendChart = false
}) => {
  // Format date for input field (YYYY-MM)
  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };
  
  // Parse date from input field
  const parseDateFromInput = (value, isEndDate = false) => {
    const [year, month] = value.split('-').map(Number);
    if (isEndDate) {
      // For end date, use the last day of the month
      return new Date(year, month, 0);
    }
    return new Date(year, month - 1, 1);
  };
  
  const handleStartDateChange = (e) => {
    const newStart = parseDateFromInput(e.target.value, false);
    if (newStart >= minDate && newStart <= dateRange[1]) {
      setDateRange([newStart, dateRange[1]]);
    }
  };
  
  const handleEndDateChange = (e) => {
    const newEnd = parseDateFromInput(e.target.value, true);
    if (newEnd <= maxDate && newEnd >= dateRange[0]) {
      setDateRange([dateRange[0], newEnd]);
    }
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
    <div className="h-full bg-white overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Russia-Ukraine Conflict</h1>
            <p className="text-blue-200 text-xs">Tweet Stance Analysis</p>
          </div>
        </div>
      </div>
      
      {/* Search */}
      <div className="px-3 pt-3 pb-2">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search countries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <FiX size={14} />
            </button>
          )}
        </div>
        
        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute z-20 w-[290px] mt-1 bg-white rounded-lg shadow-lg border border-slate-200 max-h-56 overflow-y-auto">
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
        <div className="px-3 py-2 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Filters</span>
          <button
            onClick={onReset}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <FiRotateCcw size={10} />
            Reset
          </button>
        </div>
        
        {/* Date Range Inputs */}
        <div className="px-3 py-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-700">Date Range</span>
          </div>
        
          <div className="grid grid-cols-2 gap-3">
            {/* Start Date */}
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Start Date</label>
              <div className="relative">
                <input
                  type="month"
                  value={formatDateForInput(dateRange[0])}
                  min={formatDateForInput(minDate)}
                  max={formatDateForInput(dateRange[1])}
                  onChange={handleStartDateChange}
                  className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>
            </div>
            
            {/* End Date */}
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">End Date</label>
              <div className="relative">
                <input
                  type="month"
                  value={formatDateForInput(dateRange[1])}
                  min={formatDateForInput(dateRange[0])}
                  max={formatDateForInput(maxDate)}
                  onChange={handleEndDateChange}
                  className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>
            </div>
          </div>
          
          {/* Quick hint about brush selection */}
          <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Drag on the trend chart to select date range</span>
          </div>
        </div>
      
        {/* Stance Filter */}
        <div className="px-3 py-3 border-t border-slate-100">
          <span className="text-xs font-medium text-slate-700">Stance Filter</span>
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
        <div className="px-3 py-2 border-b border-slate-200 border-t-2 border-t-slate-300">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Statistics</span>
        </div>
        
        <div className="px-3 py-3">
        
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
            
            {/* Users by Stance - Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-700">Users by Stance</span>
                <span className="text-xs font-semibold text-slate-800">
                  {selectedCountryData.totals.total >= 1000000 
                    ? `${(selectedCountryData.totals.total / 1000000).toFixed(1)}M` 
                    : selectedCountryData.totals.total >= 1000 
                      ? `${(selectedCountryData.totals.total / 1000).toFixed(0)}K`
                      : selectedCountryData.totals.total.toLocaleString()} users
                </span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden bg-slate-200">
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
              <span className="text-xs text-slate-600">Total Tweets</span>
              <span className="text-xs font-semibold text-slate-800">
                {selectedCountryData.totals.total_tweets >= 1000000 
                  ? `${(selectedCountryData.totals.total_tweets / 1000000).toFixed(1)}M` 
                  : selectedCountryData.totals.total_tweets >= 1000 
                    ? `${(selectedCountryData.totals.total_tweets / 1000).toFixed(0)}K`
                    : (selectedCountryData.totals.total_tweets || 0).toLocaleString()}
              </span>
            </div>
            
            {/* Tweets by Stance - Progress Bar (Country) */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-700">Tweets by Stance</span>
                <span className="text-xs font-semibold text-slate-800">
                  {selectedCountryData.totals.total_tweets >= 1000000 
                    ? `${(selectedCountryData.totals.total_tweets / 1000000).toFixed(1)}M` 
                    : selectedCountryData.totals.total_tweets >= 1000 
                      ? `${(selectedCountryData.totals.total_tweets / 1000).toFixed(0)}K`
                      : (selectedCountryData.totals.total_tweets || 0).toLocaleString()} tweets
                </span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden bg-slate-200">
                {(selectedCountryData.totals.pro_nato_tweets || 0) > 0 && (
                  <div
                    className="bg-blue-500"
                    style={{ width: `${((selectedCountryData.totals.pro_nato_tweets || 0) / selectedCountryData.totals.total_tweets) * 100}%` }}
                  ></div>
                )}
                {(selectedCountryData.totals.neutral_tweets || 0) > 0 && (
                  <div
                    className="bg-gray-400"
                    style={{ width: `${((selectedCountryData.totals.neutral_tweets || 0) / selectedCountryData.totals.total_tweets) * 100}%` }}
                  ></div>
                )}
                {(selectedCountryData.totals.pro_russia_tweets || 0) > 0 && (
                  <div
                    className="bg-red-500"
                    style={{ width: `${((selectedCountryData.totals.pro_russia_tweets || 0) / selectedCountryData.totals.total_tweets) * 100}%` }}
                  ></div>
                )}
              </div>
              {/* Tweet counts legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-slate-700">
                    {(selectedCountryData.totals.pro_nato_tweets || 0) >= 1000000 
                      ? `${((selectedCountryData.totals.pro_nato_tweets || 0) / 1000000).toFixed(1)}M` 
                      : (selectedCountryData.totals.pro_nato_tweets || 0) >= 1000 
                        ? `${((selectedCountryData.totals.pro_nato_tweets || 0) / 1000).toFixed(0)}K`
                        : (selectedCountryData.totals.pro_nato_tweets || 0).toLocaleString()}
                    ({selectedCountryData.totals.total_tweets > 0 ? (((selectedCountryData.totals.pro_nato_tweets || 0) / selectedCountryData.totals.total_tweets) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                  <span className="text-xs text-slate-700">
                    {(selectedCountryData.totals.neutral_tweets || 0) >= 1000000 
                      ? `${((selectedCountryData.totals.neutral_tweets || 0) / 1000000).toFixed(1)}M` 
                      : (selectedCountryData.totals.neutral_tweets || 0) >= 1000 
                        ? `${((selectedCountryData.totals.neutral_tweets || 0) / 1000).toFixed(0)}K`
                        : (selectedCountryData.totals.neutral_tweets || 0).toLocaleString()}
                    ({selectedCountryData.totals.total_tweets > 0 ? (((selectedCountryData.totals.neutral_tweets || 0) / selectedCountryData.totals.total_tweets) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <span className="text-xs text-slate-700">
                    {(selectedCountryData.totals.pro_russia_tweets || 0) >= 1000000 
                      ? `${((selectedCountryData.totals.pro_russia_tweets || 0) / 1000000).toFixed(1)}M` 
                      : (selectedCountryData.totals.pro_russia_tweets || 0) >= 1000 
                        ? `${((selectedCountryData.totals.pro_russia_tweets || 0) / 1000).toFixed(0)}K`
                        : (selectedCountryData.totals.pro_russia_tweets || 0).toLocaleString()}
                    ({selectedCountryData.totals.total_tweets > 0 ? (((selectedCountryData.totals.pro_russia_tweets || 0) / selectedCountryData.totals.total_tweets) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
              </div>
            </div>
            
            {/* Average Tweets per User (Country) */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-700">Avg Tweets per User</span>
                <span className="text-xs font-semibold text-slate-800">
                  {selectedCountryData.totals.total > 0 
                    ? (selectedCountryData.totals.total_tweets / selectedCountryData.totals.total).toFixed(1) 
                    : '0'}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-slate-700">
                    {selectedCountryData.totals.pro_nato > 0 
                      ? ((selectedCountryData.totals.pro_nato_tweets || 0) / selectedCountryData.totals.pro_nato).toFixed(1) 
                      : '0'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                  <span className="text-xs text-slate-700">
                    {selectedCountryData.totals.neutral > 0 
                      ? ((selectedCountryData.totals.neutral_tweets || 0) / selectedCountryData.totals.neutral).toFixed(1) 
                      : '0'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <span className="text-xs text-slate-700">
                    {selectedCountryData.totals.pro_russia > 0 
                      ? ((selectedCountryData.totals.pro_russia_tweets || 0) / selectedCountryData.totals.pro_russia).toFixed(1) 
                      : '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
        {/* Countries by Stance */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-700">Countries by Stance</span>
            <span className="text-xs font-semibold text-slate-800">{countryData.length} countries</span>
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
        
        {/* Users by Stance Bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-700">Users by Stance</span>
            <span className="text-xs font-semibold text-slate-800">{totals.users >= 1000000 ? `${(totals.users / 1000000).toFixed(1)}M` : `${(totals.users / 1000).toFixed(0)}K`} users</span>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden bg-slate-200">
            {selectedStances.includes('pro_nato') && totals.pro_nato > 0 && (
              <div
                className="bg-blue-500"
                style={{ width: `${(totals.pro_nato / totals.users) * 100}%` }}
              ></div>
            )}
            {selectedStances.includes('neutral') && totals.neutral > 0 && (
              <div
                className="bg-gray-400"
                style={{ width: `${(totals.neutral / totals.users) * 100}%` }}
              ></div>
            )}
            {selectedStances.includes('pro_russia') && totals.pro_russia > 0 && (
              <div
                className="bg-red-500"
                style={{ width: `${(totals.pro_russia / totals.users) * 100}%` }}
              ></div>
            )}
          </div>
          {/* User counts legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {selectedStances.includes('pro_nato') && (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <span className="text-xs text-slate-700">{(totals.pro_nato / 1000000).toFixed(1)}M ({((totals.pro_nato / totals.users) * 100).toFixed(0)}%)</span>
              </div>
            )}
            {selectedStances.includes('neutral') && (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                <span className="text-xs text-slate-700">{(totals.neutral / 1000000).toFixed(1)}M ({((totals.neutral / totals.users) * 100).toFixed(0)}%)</span>
              </div>
            )}
            {selectedStances.includes('pro_russia') && (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <span className="text-xs text-slate-700">{(totals.pro_russia / 1000000).toFixed(1)}M ({((totals.pro_russia / totals.users) * 100).toFixed(0)}%)</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Tweets by Stance Bar (Global) */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-700">Tweets by Stance</span>
            <span className="text-xs font-semibold text-slate-800">
              {totals.tweets >= 1000000 ? `${(totals.tweets / 1000000).toFixed(1)}M` : `${(totals.tweets / 1000).toFixed(0)}K`} tweets
            </span>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden bg-slate-200">
            {selectedStances.includes('pro_nato') && (totals.pro_nato_tweets || 0) > 0 && (
              <div
                className="bg-blue-500"
                style={{ width: `${((totals.pro_nato_tweets || 0) / totals.tweets) * 100}%` }}
              ></div>
            )}
            {selectedStances.includes('neutral') && (totals.neutral_tweets || 0) > 0 && (
              <div
                className="bg-gray-400"
                style={{ width: `${((totals.neutral_tweets || 0) / totals.tweets) * 100}%` }}
              ></div>
            )}
            {selectedStances.includes('pro_russia') && (totals.pro_russia_tweets || 0) > 0 && (
              <div
                className="bg-red-500"
                style={{ width: `${((totals.pro_russia_tweets || 0) / totals.tweets) * 100}%` }}
              ></div>
            )}
          </div>
          {/* Tweet counts legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {selectedStances.includes('pro_nato') && (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <span className="text-xs text-slate-700">
                  {((totals.pro_nato_tweets || 0) / 1000000).toFixed(1)}M ({totals.tweets > 0 ? (((totals.pro_nato_tweets || 0) / totals.tweets) * 100).toFixed(0) : 0}%)
                </span>
              </div>
            )}
            {selectedStances.includes('neutral') && (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                <span className="text-xs text-slate-700">
                  {((totals.neutral_tweets || 0) / 1000000).toFixed(1)}M ({totals.tweets > 0 ? (((totals.neutral_tweets || 0) / totals.tweets) * 100).toFixed(0) : 0}%)
                </span>
              </div>
            )}
            {selectedStances.includes('pro_russia') && (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <span className="text-xs text-slate-700">
                  {((totals.pro_russia_tweets || 0) / 1000000).toFixed(1)}M ({totals.tweets > 0 ? (((totals.pro_russia_tweets || 0) / totals.tweets) * 100).toFixed(0) : 0}%)
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Average Tweets per User (Global) */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-700">Avg Tweets per User</span>
            <span className="text-xs font-semibold text-slate-800">
              {totals.users > 0 ? (totals.tweets / totals.users).toFixed(1) : '0'}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {selectedStances.includes('pro_nato') && (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <span className="text-xs text-slate-700">
                  {totals.pro_nato > 0 ? ((totals.pro_nato_tweets || 0) / totals.pro_nato).toFixed(1) : '0'}
                </span>
              </div>
            )}
            {selectedStances.includes('neutral') && (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                <span className="text-xs text-slate-700">
                  {totals.neutral > 0 ? ((totals.neutral_tweets || 0) / totals.neutral).toFixed(1) : '0'}
                </span>
              </div>
            )}
            {selectedStances.includes('pro_russia') && (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <span className="text-xs text-slate-700">
                  {totals.pro_russia > 0 ? ((totals.pro_russia_tweets || 0) / totals.pro_russia).toFixed(1) : '0'}
                </span>
              </div>
            )}
          </div>
        </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;

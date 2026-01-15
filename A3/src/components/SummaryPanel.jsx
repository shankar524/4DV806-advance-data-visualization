import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Flag from 'react-world-flags';
import { FiGlobe } from 'react-icons/fi';

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

function SummaryPanel({ 
  totals, 
  temporalData, 
  dailyData, 
  selectedStances, 
  dateRange,
  selectedCountryData,
  onCloseCountry,
  countryData = []
}) {
  // Hover state for country list popover
  const [hoveredStance, setHoveredStance] = useState(null);

  // Calculate country counts by dominant stance
  const countryCounts = useMemo(() => {
    const counts = { pro_nato: 0, neutral: 0, pro_russia: 0 };
    
    countryData.forEach(country => {
      if (country.dominant_stance) {
        counts[country.dominant_stance]++;
      }
    });
    
    return counts;
  }, [countryData]);

  // Group countries by dominant stance
  const countriesByStance = useMemo(() => {
    const groups = { pro_nato: [], neutral: [], pro_russia: [] };
    
    countryData.forEach(country => {
      if (country.dominant_stance && groups[country.dominant_stance]) {
        groups[country.dominant_stance].push({
          code: country.country_code,
          name: country.country_name,
          percentage: country.dominant_percentage
        });
      }
    });
    
    // Sort each group by percentage descending
    Object.keys(groups).forEach(stance => {
      groups[stance].sort((a, b) => b.percentage - a.percentage);
    });
    
    return groups;
  }, [countryData]);

  // Calculate if we should show daily or monthly data based on date range
  const daysDiff = useMemo(() => {
    if (!dateRange || dateRange.length < 2) return 100;
    const [start, end] = dateRange;
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  }, [dateRange]);
  
  const showDaily = daysDiff <= 35;
  
  // Use country-specific data if a country is selected
  const isCountryView = !!selectedCountryData;
  const chartData = isCountryView 
    ? selectedCountryData.timeline 
    : (showDaily ? dailyData : temporalData);
  
  const displayTotals = isCountryView 
    ? selectedCountryData.totals 
    : totals;

  // Format number
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toLocaleString() || '0';
  };
  
  // Format date for chart
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 2) {
      // Monthly format: YYYY-MM
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    } else if (parts.length === 3) {
      // Daily format: YYYY-MM-DD
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return dateStr;
  };
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
        <div className="font-medium text-slate-700 mb-2">{formatDate(label)}</div>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-slate-600">{stanceLabels[entry.dataKey]}:</span>
              <span className="font-medium">{formatNumber(entry.value)} users</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Calculate percentages
  const getPercentage = (value) => {
    const total = isCountryView ? displayTotals.total : displayTotals.users;
    return total > 0 ? (value / total * 100).toFixed(1) : 0;
  };

  const totalUsers = isCountryView ? displayTotals.total : displayTotals.users;
  
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {isCountryView ? (
            <Flag 
              code={selectedCountryData.country_code} 
              className="w-10 h-7 rounded shadow-sm object-cover" 
              fallback={<FiGlobe className="w-8 h-8 text-blue-500" />}
            />
          ) : (
            <FiGlobe className="w-8 h-8 text-blue-500" />
          )}
          <div>
            <h2 className="text-lg font-semibold text-slate-700">
              {isCountryView ? selectedCountryData.country_name : 'Summary Statistics'}
            </h2>
            {isCountryView && (
              <p className="text-xs text-slate-500">Country-specific analysis</p>
            )}
          </div>
        </div>
        {isCountryView && (
          <button
            onClick={onCloseCountry}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded hover:bg-slate-100"
            title="Back to global view"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Country Counts by Dominant Stance - Only show in global view */}
      {!isCountryView && countryData.length > 0 && (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3 mb-4">
          <div className="text-sm font-medium text-slate-600 mb-2">Countries by Dominant Stance</div>
          <div className="flex items-center justify-between gap-2">
            {/* Pro-NATO */}
            <div 
              className="relative flex items-center gap-1.5 cursor-pointer hover:bg-white/50 px-2 py-1 rounded transition-colors"
              onMouseEnter={() => setHoveredStance('pro_nato')}
              onMouseLeave={() => setHoveredStance(null)}
            >
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-lg font-bold text-blue-600">{countryCounts.pro_nato}</span>
              <span className="text-xs text-slate-500">Pro-NATO</span>
              
              {/* Hover Popover */}
              {hoveredStance === 'pro_nato' && countriesByStance.pro_nato.length > 0 && (
                <div className="absolute left-0 top-full mt-1 z-20 bg-white rounded-lg shadow-xl border border-slate-200 p-2 min-w-[180px] max-h-[200px] overflow-y-auto">
                  <div className="space-y-1">
                    {countriesByStance.pro_nato.map(country => (
                      <div key={country.code} className="flex items-center gap-2 text-xs">
                        <Flag code={country.code} className="w-5 h-3.5 rounded shadow-sm object-cover" fallback={<span>🏳️</span>} />
                        <span className="text-slate-700 truncate flex-1">{country.name}</span>
                        <span className="text-slate-500 font-medium">{country.percentage?.toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Neutral */}
            <div 
              className="relative flex items-center gap-1.5 cursor-pointer hover:bg-white/50 px-2 py-1 rounded transition-colors"
              onMouseEnter={() => setHoveredStance('neutral')}
              onMouseLeave={() => setHoveredStance(null)}
            >
              <span className="w-3 h-3 rounded-full bg-gray-500"></span>
              <span className="text-lg font-bold text-gray-600">{countryCounts.neutral}</span>
              <span className="text-xs text-slate-500">Neutral</span>
              
              {/* Hover Popover */}
              {hoveredStance === 'neutral' && countriesByStance.neutral.length > 0 && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-20 bg-white rounded-lg shadow-xl border border-slate-200 p-2 min-w-[180px] max-h-[200px] overflow-y-auto">
                  <div className="space-y-1">
                    {countriesByStance.neutral.map(country => (
                      <div key={country.code} className="flex items-center gap-2 text-xs">
                        <Flag code={country.code} className="w-5 h-3.5 rounded shadow-sm object-cover" fallback={<span>🏳️</span>} />
                        <span className="text-slate-700 truncate flex-1">{country.name}</span>
                        <span className="text-slate-500 font-medium">{country.percentage?.toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Pro-Russia */}
            <div 
              className="relative flex items-center gap-1.5 cursor-pointer hover:bg-white/50 px-2 py-1 rounded transition-colors"
              onMouseEnter={() => setHoveredStance('pro_russia')}
              onMouseLeave={() => setHoveredStance(null)}
            >
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-lg font-bold text-red-600">{countryCounts.pro_russia}</span>
              <span className="text-xs text-slate-500">Pro-Russia</span>
              
              {/* Hover Popover */}
              {hoveredStance === 'pro_russia' && countriesByStance.pro_russia.length > 0 && (
                <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-lg shadow-xl border border-slate-200 p-2 min-w-[180px] max-h-[200px] overflow-y-auto">
                  <div className="space-y-1">
                    {countriesByStance.pro_russia.map(country => (
                      <div key={country.code} className="flex items-center gap-2 text-xs">
                        <Flag code={country.code} className="w-5 h-3.5 rounded shadow-sm object-cover" fallback={<span>🏳️</span>} />
                        <span className="text-slate-700 truncate flex-1">{country.name}</span>
                        <span className="text-slate-500 font-medium">{country.percentage?.toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Users by Stance Distribution */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-slate-600 mb-2">
          Users by Stance
          <span className="ml-2 text-slate-400 font-normal">({formatNumber(totalUsers)} total)</span>
        </h3>
        
        {/* Single Stacked Progress Bar */}
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex mb-3">
          {selectedStances.includes('pro_nato') && displayTotals.pro_nato > 0 && (
            <div 
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${getPercentage(displayTotals.pro_nato)}%` }}
              title={`Pro-NATO: ${formatNumber(displayTotals.pro_nato)} (${getPercentage(displayTotals.pro_nato)}%)`}
            ></div>
          )}
          {selectedStances.includes('neutral') && displayTotals.neutral > 0 && (
            <div 
              className="h-full bg-gray-500 transition-all duration-500"
              style={{ width: `${getPercentage(displayTotals.neutral)}%` }}
              title={`Neutral: ${formatNumber(displayTotals.neutral)} (${getPercentage(displayTotals.neutral)}%)`}
            ></div>
          )}
          {selectedStances.includes('pro_russia') && displayTotals.pro_russia > 0 && (
            <div 
              className="h-full bg-red-500 transition-all duration-500"
              style={{ width: `${getPercentage(displayTotals.pro_russia)}%` }}
              title={`Pro-Russia: ${formatNumber(displayTotals.pro_russia)} (${getPercentage(displayTotals.pro_russia)}%)`}
            ></div>
          )}
        </div>
        
        {/* Legend with values */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {selectedStances.includes('pro_nato') && (
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span>
              <span className="font-semibold text-slate-700">{formatNumber(displayTotals.pro_nato)} ({getPercentage(displayTotals.pro_nato)}%)</span>
            </div>
          )}
          {selectedStances.includes('neutral') && (
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-gray-500"></span>
              <span className="font-semibold text-slate-700">{formatNumber(displayTotals.neutral)} ({getPercentage(displayTotals.neutral)}%)</span>
            </div>
          )}
          {selectedStances.includes('pro_russia') && (
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-500"></span>
              <span className="font-semibold text-slate-700">{formatNumber(displayTotals.pro_russia)} ({getPercentage(displayTotals.pro_russia)}%)</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Temporal Trend Chart */}
      <div className="h-[220px]">
        <h3 className="text-sm font-medium text-slate-600 mb-2">
          User Count Over Time 
          <span className="text-xs text-slate-400 ml-2">
            ({isCountryView ? 'Monthly' : (showDaily ? 'Daily' : 'Monthly')} trend)
          </span>
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              tick={{ fontSize: 10 }}
              stroke="#94a3b8"
              interval="preserveStartEnd"
            />
            <YAxis 
              tickFormatter={formatNumber}
              tick={{ fontSize: 10 }}
              stroke="#94a3b8"
            />
            <Tooltip content={<CustomTooltip />} />
            
            {selectedStances.includes('pro_nato') && (
              <Line
                type="monotone"
                dataKey="pro_nato"
                name="pro_nato"
                stroke={stanceColors.pro_nato}
                strokeWidth={2}
                dot={!isCountryView && showDaily && chartData?.length < 20}
                activeDot={{ r: 4 }}
              />
            )}
            {selectedStances.includes('neutral') && (
              <Line
                type="monotone"
                dataKey="neutral"
                name="neutral"
                stroke={stanceColors.neutral}
                strokeWidth={2}
                dot={!isCountryView && showDaily && chartData?.length < 20}
                activeDot={{ r: 4 }}
              />
            )}
            {selectedStances.includes('pro_russia') && (
              <Line
                type="monotone"
                dataKey="pro_russia"
                name="pro_russia"
                stroke={stanceColors.pro_russia}
                strokeWidth={2}
                dot={!isCountryView && showDaily && chartData?.length < 20}
                activeDot={{ r: 4 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SummaryPanel;
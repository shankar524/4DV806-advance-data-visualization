import React, { useState } from 'react';

const stanceLabels = {
  pro_nato: 'Pro-NATO',
  pro_russia: 'Pro-Russia',
  neutral: 'Neutral'
};

const stanceColors = {
  pro_nato: 'bg-blue-500',
  pro_russia: 'bg-red-500',
  neutral: 'bg-gray-500'
};

// Key milestone dates in the Russia-Ukraine conflict
const milestones = [
  { date: new Date(2022, 1, 24), label: 'Invasion', shortLabel: 'Invasion' },
  { date: new Date(2022, 3, 1), label: 'Bucha Massacre', shortLabel: 'Bucha' },
  { date: new Date(2022, 4, 20), label: 'Mariupol Falls', shortLabel: 'Mariupol' },
  { date: new Date(2022, 8, 21), label: 'Mobilization', shortLabel: 'Mobiliz.' },
  { date: new Date(2022, 10, 11), label: 'Kherson Liberation', shortLabel: 'Kherson' },
  { date: new Date(2023, 1, 24), label: '1 Year of War', shortLabel: '1 Year' },
];

function FilterPanel({ 
  dateRange, 
  setDateRange, 
  selectedStances, 
  setSelectedStances, 
  onReset,
  minDate,
  maxDate 
}) {
  const [hoveredMilestone, setHoveredMilestone] = useState(null);
  // Convert date to slider value (months since minDate)
  const dateToValue = (date) => {
    return (date.getFullYear() - minDate.getFullYear()) * 12 + (date.getMonth() - minDate.getMonth());
  };
  
  // Convert slider value back to date
  const valueToDate = (value) => {
    const totalMonths = minDate.getMonth() + value;
    const year = minDate.getFullYear() + Math.floor(totalMonths / 12);
    const month = totalMonths % 12;
    return new Date(year, month, 1);
  };
  
  const maxValue = dateToValue(maxDate);
  const startValue = dateToValue(dateRange[0]);
  const endValue = dateToValue(dateRange[1]);
  
  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  
  // Toggle stance selection
  const toggleStance = (stance) => {
    if (selectedStances.includes(stance)) {
      // Don't allow deselecting all
      if (selectedStances.length > 1) {
        setSelectedStances(selectedStances.filter(s => s !== stance));
      }
    } else {
      setSelectedStances([...selectedStances, stance]);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex flex-wrap items-center gap-6">
        {/* Date Range Section */}
        <div className="flex-1 min-w-[350px] bg-slate-50 rounded-lg p-3 border border-slate-200">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Date Range
          </label>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700 min-w-[80px]">
              {formatDate(dateRange[0])}
            </span>
            <div className="flex-1 relative h-10">
              {/* Track background */}
              <div className="absolute top-3 left-0 right-0 h-1.5 bg-slate-200 rounded-full"></div>
              
              {/* Active range highlight */}
              <div 
                className="absolute top-3 h-1.5 bg-blue-500 rounded-full"
                style={{
                  left: `${(startValue / maxValue) * 100}%`,
                  right: `${100 - (endValue / maxValue) * 100}%`
                }}
              ></div>
              
              {/* Milestone markers */}
              {milestones.map((milestone, idx) => {
                const milestoneValue = dateToValue(milestone.date);
                const position = (milestoneValue / maxValue) * 100;
                if (position < 0 || position > 100) return null;
                
                return (
                  <div
                    key={idx}
                    className="absolute cursor-pointer group"
                    style={{ left: `${position}%`, top: 0 }}
                    onMouseEnter={() => setHoveredMilestone(idx)}
                    onMouseLeave={() => setHoveredMilestone(null)}
                    onClick={() => {
                      // Set the date range to include this milestone
                      const newStart = new Date(milestone.date.getFullYear(), milestone.date.getMonth(), 1);
                      setDateRange([newStart, dateRange[1] > newStart ? dateRange[1] : maxDate]);
                    }}
                  >
                    {/* Marker line */}
                    <div className={`w-0.5 h-3 mx-auto transition-colors ${
                      hoveredMilestone === idx ? 'bg-blue-600' : 'bg-slate-400'
                    }`}></div>
                    {/* Marker dot */}
                    <div className={`w-2 h-2 -mt-0.5 mx-auto rounded-full transition-all ${
                      hoveredMilestone === idx ? 'bg-blue-600 scale-125' : 'bg-slate-400'
                    }`}></div>
                    
                    {/* Tooltip */}
                    <div className={`absolute left-1/2 -translate-x-1/2 top-8 z-10 whitespace-nowrap transition-all ${
                      hoveredMilestone === idx ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}>
                      <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg">
                        <div className="font-medium">{milestone.label}</div>
                        <div className="text-slate-300">{formatDate(milestone.date)}</div>
                      </div>
                      <div className="w-2 h-2 bg-slate-800 rotate-45 mx-auto -mt-1"></div>
                    </div>
                  </div>
                );
              })}
              
              {/* Start date slider */}
              <input
                type="range"
                min={0}
                max={maxValue}
                value={startValue}
                onChange={(e) => {
                  const newStart = valueToDate(parseInt(e.target.value));
                  if (newStart < dateRange[1]) {
                    setDateRange([newStart, dateRange[1]]);
                  }
                }}
                className="dual-range absolute top-0 left-0 w-full h-8 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:mt-1 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-moz-range-track]:bg-transparent [&::-moz-range-track]:h-0 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:border-0"
              />
              
              {/* End date slider */}
              <input
                type="range"
                min={0}
                max={maxValue}
                value={endValue}
                onChange={(e) => {
                  const newEnd = valueToDate(parseInt(e.target.value));
                  if (newEnd > dateRange[0]) {
                    setDateRange([dateRange[0], newEnd]);
                  }
                }}
                className="dual-range absolute top-0 left-0 w-full h-8 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:mt-1 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-moz-range-track]:bg-transparent [&::-moz-range-track]:h-0 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:border-0"
              />
            </div>
            <span className="text-sm font-medium text-slate-700 min-w-[80px] text-right">
              {formatDate(dateRange[1])}
            </span>
          </div>
        </div>
        
        {/* Divider */}
        <div className="hidden lg:block w-px h-12 bg-slate-200"></div>
        
        {/* Stance Checkboxes */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Stances
          </label>
          <div className="flex items-center gap-4">
            {['pro_nato', 'pro_russia', 'neutral'].map(stance => (
              <label 
                key={stance}
                className="flex items-center gap-2 cursor-pointer select-none hover:bg-white px-2 py-1 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedStances.includes(stance)}
                  onChange={() => toggleStance(stance)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={`w-3 h-3 rounded-full ${stanceColors[stance]}`}></span>
                <span className="text-sm font-medium text-slate-700">{stanceLabels[stance]}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Reset Button */}
        <button
          onClick={onReset}
          className="px-4 py-2.5 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}

export default FilterPanel;

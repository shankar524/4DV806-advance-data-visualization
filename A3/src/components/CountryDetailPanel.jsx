import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend 
} from 'recharts';

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

function CountryDetailPanel({ data, onClose, selectedStances }) {
  if (!data) return null;
  
  // Format number
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toLocaleString() || '0';
  };
  
  // Format date for chart
  const formatDate = (dateStr) => {
    const [year, month] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };
  
  // Calculate percentages
  const getPercentage = (value) => {
    return data.totals.total > 0 ? (value / data.totals.total * 100).toFixed(1) : 0;
  };
  
  // Prepare breakdown data for bar chart
  const breakdownData = [
    { name: 'Pro-NATO', value: data.totals.pro_nato, color: stanceColors.pro_nato },
    { name: 'Neutral', value: data.totals.neutral, color: stanceColors.neutral },
    { name: 'Pro-Russia', value: data.totals.pro_russia, color: stanceColors.pro_russia }
  ].filter(d => {
    const stanceKey = d.name.toLowerCase().replace('-', '_').replace(' ', '_');
    return selectedStances.includes(stanceKey === 'pro_nato' ? 'pro_nato' : 
                                     stanceKey === 'pro_russia' ? 'pro_russia' : 'neutral');
  });
  
  // Custom tooltip for bar chart
  const BarTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
        <div className="font-medium text-slate-700">{d.name}</div>
        <div className="text-sm text-slate-600">
          {formatNumber(d.value)} users ({getPercentage(d.value)}%)
        </div>
      </div>
    );
  };
  
  // Custom tooltip for area chart
  const AreaTooltip = ({ active, payload, label }) => {
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
  
  return (
    <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">{data.country_name}</h2>
          <p className="text-slate-300 text-sm">Country-specific stance analysis</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Metrics Cards */}
          <div className="space-y-4">
            {/* Total Users */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-700">{formatNumber(data.totals.total)}</div>
              <div className="text-sm text-blue-600">Total Users</div>
            </div>
            
            {/* Engagement Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
                <div className="text-xl font-bold text-green-700">{data.totals.avg_retweets?.toFixed(1) || '0'}</div>
                <div className="text-xs text-green-600">Avg Retweets</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
                <div className="text-xl font-bold text-purple-700">{data.totals.avg_favorites?.toFixed(1) || '0'}</div>
                <div className="text-xs text-purple-600">Avg Favorites</div>
              </div>
            </div>
            
            {/* Stance Breakdown */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-slate-700 mb-3">Stance Breakdown</h3>
              <div className="space-y-2">
                {selectedStances.includes('pro_nato') && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      Pro-NATO
                    </span>
                    <span className="text-sm font-medium">
                      {formatNumber(data.totals.pro_nato)} ({getPercentage(data.totals.pro_nato)}%)
                    </span>
                  </div>
                )}
                {selectedStances.includes('neutral') && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm">
                      <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                      Neutral
                    </span>
                    <span className="text-sm font-medium">
                      {formatNumber(data.totals.neutral)} ({getPercentage(data.totals.neutral)}%)
                    </span>
                  </div>
                )}
                {selectedStances.includes('pro_russia') && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm">
                      <span className="w-3 h-3 rounded-full bg-red-500"></span>
                      Pro-Russia
                    </span>
                    <span className="text-sm font-medium">
                      {formatNumber(data.totals.pro_russia)} ({getPercentage(data.totals.pro_russia)}%)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Stance Comparison Bar Chart */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Stance Comparison</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={breakdownData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tickFormatter={formatNumber} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                <Tooltip content={<BarTooltip />} />
                <Bar 
                  dataKey="value" 
                  radius={[0, 4, 4, 0]}
                  fill="#3b82f6"
                >
                  {breakdownData.map((entry, index) => (
                    <rect key={`rect-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Country Timeline */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Monthly Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data.timeline} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  tick={{ fontSize: 9 }}
                  interval="preserveStartEnd"
                />
                <YAxis tickFormatter={formatNumber} tick={{ fontSize: 9 }} />
                <Tooltip content={<AreaTooltip />} />
                {selectedStances.includes('neutral') && (
                  <Area
                    type="monotone"
                    dataKey="neutral"
                    stackId="1"
                    stroke={stanceColors.neutral}
                    fill={stanceColors.neutral}
                    fillOpacity={0.6}
                  />
                )}
                {selectedStances.includes('pro_nato') && (
                  <Area
                    type="monotone"
                    dataKey="pro_nato"
                    stackId="1"
                    stroke={stanceColors.pro_nato}
                    fill={stanceColors.pro_nato}
                    fillOpacity={0.6}
                  />
                )}
                {selectedStances.includes('pro_russia') && (
                  <Area
                    type="monotone"
                    dataKey="pro_russia"
                    stackId="1"
                    stroke={stanceColors.pro_russia}
                    fill={stanceColors.pro_russia}
                    fillOpacity={0.6}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountryDetailPanel;

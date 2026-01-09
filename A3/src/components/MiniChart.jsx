import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const stanceConfig = {
  pro_nato: { label: 'Pro-NATO', color: '#3b82f6' },
  pro_russia: { label: 'Pro-Russia', color: '#ef4444' },
  neutral: { label: 'Neutral', color: '#9ca3af' }
};

const MiniChart = ({ data, selectedStances }) => {
  if (!data || data.length === 0) return null;
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
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
  };
  
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 w-64">
      <div className="text-xs font-medium text-slate-500 mb-2">Temporal Trends</div>
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <XAxis
              dataKey="date"
              tick={false}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              hide={true}
            />
            <Tooltip content={<CustomTooltip />} />
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
      
      {/* Legend */}
      <div className="flex justify-center gap-3 mt-2">
        {selectedStances.includes('pro_nato') && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-xs text-slate-500">NATO</span>
          </div>
        )}
        {selectedStances.includes('neutral') && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <span className="text-xs text-slate-500">Neutral</span>
          </div>
        )}
        {selectedStances.includes('pro_russia') && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-xs text-slate-500">Russia</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniChart;

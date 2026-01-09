import React from 'react';

const stanceConfig = {
  pro_nato: { label: 'Pro-NATO/Ukraine', color: '#3b82f6', gradient: 'linear-gradient(to right, #bfdbfe, #1d4ed8)' },
  neutral: { label: 'Neutral', color: '#9ca3af', gradient: 'linear-gradient(to right, #d1d5db, #374151)' },
  pro_russia: { label: 'Pro-Russia', color: '#ef4444', gradient: 'linear-gradient(to right, #fecaca, #b91c1c)' }
};

const MapLegend = () => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3">
      <div className="text-xs font-medium text-slate-700 mb-2">Dominant Stance</div>
      <div className="space-y-1.5">
        {['pro_nato', 'neutral', 'pro_russia'].map(stance => (
          <div key={stance} className="flex items-center gap-2">
            <div 
              className="w-5 h-3 rounded" 
              style={{ background: stanceConfig[stance].gradient }}
            ></div>
            <span className="text-xs text-slate-600">{stanceConfig[stance].label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <div className="w-5 h-3 rounded bg-slate-100 border border-slate-300"></div>
          <span className="text-xs text-slate-600">No Data</span>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;

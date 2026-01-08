import React, { useState, useEffect, useMemo } from 'react';
import FilterPanel from './components/FilterPanel';
import WorldMap from './components/WorldMap';
import SummaryPanel from './components/SummaryPanel';
import { countryStanceSummary, temporalStanceSummary, countryStanceTemporal, countryNames } from './data';

// Date range constants
const MIN_DATE = new Date(2022, 1, 1); // Feb 2022
const MAX_DATE = new Date(2023, 4, 31); // May 2023

function App() {
  // Filter state
  const [dateRange, setDateRange] = useState([MIN_DATE, MAX_DATE]);
  const [selectedStances, setSelectedStances] = useState(['pro_nato', 'pro_russia', 'neutral']);
  
  // Selected country for detail panel
  const [selectedCountry, setSelectedCountry] = useState(null);
  
  // Process and filter data based on current filters
  const filteredData = useMemo(() => {
    // Filter temporal data by date range and stances
    const [startDate, endDate] = dateRange;
    
    const filteredTemporal = temporalStanceSummary.filter(d => {
      const date = new Date(d.year, d.month - 1, d.day);
      return date >= startDate && date <= endDate && selectedStances.includes(d.stance);
    });
    
    // Filter country temporal data
    const filteredCountryTemporal = countryStanceTemporal.filter(d => {
      const date = new Date(d.year, d.month - 1, 1);
      const monthEnd = new Date(d.year, d.month, 0);
      return date <= endDate && monthEnd >= startDate && selectedStances.includes(d.stance);
    });
    
    // Aggregate country data based on filters
    const countryData = {};
    filteredCountryTemporal.forEach(d => {
      if (!countryData[d.country_code]) {
        countryData[d.country_code] = {
          country_code: d.country_code,
          country_name: countryNames[d.country_code] || d.country_code,
          pro_nato: 0,
          pro_russia: 0,
          neutral: 0,
          total: 0,
          unique_users: 0
        };
      }
      countryData[d.country_code][d.stance] += d.tweet_count;
      countryData[d.country_code].total += d.tweet_count;
      countryData[d.country_code].unique_users += d.unique_users;
    });
    
    // Calculate dominant stance for each country
    Object.values(countryData).forEach(country => {
      const stances = { pro_nato: country.pro_nato, pro_russia: country.pro_russia, neutral: country.neutral };
      const maxStance = Object.entries(stances).reduce((a, b) => a[1] > b[1] ? a : b);
      country.dominant_stance = maxStance[0];
      country.dominant_percentage = country.total > 0 ? (maxStance[1] / country.total * 100) : 0;
    });
    
    // Calculate totals
    const totals = {
      tweets: filteredTemporal.reduce((sum, d) => sum + d.tweet_count, 0),
      countries: Object.keys(countryData).length,
      pro_nato: filteredTemporal.filter(d => d.stance === 'pro_nato').reduce((sum, d) => sum + d.tweet_count, 0),
      pro_russia: filteredTemporal.filter(d => d.stance === 'pro_russia').reduce((sum, d) => sum + d.tweet_count, 0),
      neutral: filteredTemporal.filter(d => d.stance === 'neutral').reduce((sum, d) => sum + d.tweet_count, 0)
    };
    
    // Aggregate temporal data by month for the chart
    const temporalByMonth = {};
    filteredTemporal.forEach(d => {
      const key = `${d.year}-${String(d.month).padStart(2, '0')}`;
      if (!temporalByMonth[key]) {
        temporalByMonth[key] = { date: key, pro_nato: 0, pro_russia: 0, neutral: 0 };
      }
      temporalByMonth[key][d.stance] += d.tweet_count;
    });
    
    const temporalChartData = Object.values(temporalByMonth).sort((a, b) => a.date.localeCompare(b.date));
    
    // Aggregate temporal data by day for daily chart
    const temporalByDay = {};
    filteredTemporal.forEach(d => {
      const key = `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
      if (!temporalByDay[key]) {
        temporalByDay[key] = { date: key, pro_nato: 0, pro_russia: 0, neutral: 0 };
      }
      temporalByDay[key][d.stance] += d.tweet_count;
    });
    
    const dailyChartData = Object.values(temporalByDay).sort((a, b) => a.date.localeCompare(b.date));
    
    return {
      countryData: Object.values(countryData),
      temporalChartData,
      dailyChartData,
      totals
    };
  }, [dateRange, selectedStances]);
  
  // Get detailed data for selected country
  const selectedCountryData = useMemo(() => {
    if (!selectedCountry) return null;
    
    const [startDate, endDate] = dateRange;
    
    // Get temporal data for this country filtered by date range
    const temporalData = countryStanceTemporal.filter(d => {
      const date = new Date(d.year, d.month - 1, 1);
      const monthEnd = new Date(d.year, d.month, 0);
      return d.country_code === selectedCountry && 
             date <= endDate && 
             monthEnd >= startDate && 
             selectedStances.includes(d.stance);
    });
    
    // Get summary data for engagement metrics (not filtered by date for now)
    const summaryData = countryStanceSummary.filter(d => 
      d.country_code === selectedCountry && selectedStances.includes(d.stance)
    );
    
    // Aggregate by month for timeline
    const timeline = {};
    temporalData.forEach(d => {
      const key = `${d.year}-${String(d.month).padStart(2, '0')}`;
      if (!timeline[key]) {
        timeline[key] = { date: key, pro_nato: 0, pro_russia: 0, neutral: 0 };
      }
      timeline[key][d.stance] += d.tweet_count;
    });
    
    // Calculate totals from temporal data (filtered by date range)
    const totals = {
      pro_nato: temporalData.filter(d => d.stance === 'pro_nato').reduce((sum, d) => sum + d.tweet_count, 0),
      pro_russia: temporalData.filter(d => d.stance === 'pro_russia').reduce((sum, d) => sum + d.tweet_count, 0),
      neutral: temporalData.filter(d => d.stance === 'neutral').reduce((sum, d) => sum + d.tweet_count, 0),
      avg_retweets: summaryData.length > 0 ? 
        summaryData.reduce((sum, d) => sum + d.avg_retweets * d.tweet_count, 0) / 
        summaryData.reduce((sum, d) => sum + d.tweet_count, 0) : 0,
      avg_favorites: summaryData.length > 0 ?
        summaryData.reduce((sum, d) => sum + d.avg_favorites * d.tweet_count, 0) /
        summaryData.reduce((sum, d) => sum + d.tweet_count, 0) : 0
    };
    totals.total = totals.pro_nato + totals.pro_russia + totals.neutral;
    
    return {
      country_code: selectedCountry,
      country_name: countryNames[selectedCountry] || selectedCountry,
      totals,
      timeline: Object.values(timeline).sort((a, b) => a.date.localeCompare(b.date))
    };
  }, [selectedCountry, dateRange, selectedStances]);
  
  // Reset all filters
  const handleReset = () => {
    setDateRange([MIN_DATE, MAX_DATE]);
    setSelectedStances(['pro_nato', 'pro_russia', 'neutral']);
    setSelectedCountry(null);
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-4 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Twitter Stance Analysis</h1>
          <p className="text-blue-200 text-sm mt-1">Russia-Ukraine Conflict • Feb 2022 - May 2023</p>
        </div>
      </header>
      
      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Filter Panel */}
        <FilterPanel
          dateRange={dateRange}
          setDateRange={setDateRange}
          selectedStances={selectedStances}
          setSelectedStances={setSelectedStances}
          onReset={handleReset}
          minDate={MIN_DATE}
          maxDate={MAX_DATE}
        />
        
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* World Map - Takes 8 columns */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-md p-5">
              <h2 className="text-lg font-semibold text-slate-700 mb-4">Global Stance Distribution</h2>
              <WorldMap
                data={filteredData.countryData}
                selectedCountry={selectedCountry}
                onCountrySelect={setSelectedCountry}
                selectedStances={selectedStances}
              />
            </div>
          </div>
          
          {/* Summary Panel - Takes 4 columns */}
          <div className="lg:col-span-4">
            <SummaryPanel
              totals={filteredData.totals}
              temporalData={filteredData.temporalChartData}
              dailyData={filteredData.dailyChartData}
              selectedStances={selectedStances}
              dateRange={dateRange}
              selectedCountryData={selectedCountryData}
              onCloseCountry={() => setSelectedCountry(null)}
              countryData={filteredData.countryData}
            />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 py-4 px-6 mt-8">
        <div className="max-w-[1600px] mx-auto text-center text-sm">
          <p>Data visualization for Advanced Data Visualization Course (4DV806)</p>
          <p className="text-slate-500 mt-1">Dataset: 44,416,753 tweets across 70 countries</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
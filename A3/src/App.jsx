import React, { useState, useMemo } from 'react';
import WorldMap from './components/WorldMap';
import ControlPanel from './components/ControlPanel';
import MapLegend from './components/MapLegend';
import StreamGraph from './components/StreamGraph';
import HashtagCloud from './components/HashtagCloud';
import { countryStanceSummary, temporalStanceSummary, countryStanceTemporal, countryNames, events, temporalHashtagData, countryHashtagMultipliers } from './data';

// Date range constants
const MIN_DATE = new Date(2022, 1, 1); // Feb 2022
const MAX_DATE = new Date(2023, 4, 31); // May 2023

function App() {
  // Filter state
  const [dateRange, setDateRange] = useState([MIN_DATE, MAX_DATE]);
  const [selectedStances, setSelectedStances] = useState(['pro_nato', 'pro_russia', 'neutral']);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected country for detail panel
  const [selectedCountry, setSelectedCountry] = useState(null);
  
  // Full temporal data for StreamGraph (not filtered by date, only by stance)
  const fullTemporalData = useMemo(() => {
    // Aggregate all temporal data by month (user-based), filtered only by stance
    const temporalByMonth = {};
    temporalStanceSummary.forEach(d => {
      if (!selectedStances.includes(d.stance)) return;
      const key = `${d.year}-${String(d.month).padStart(2, '0')}`;
      if (!temporalByMonth[key]) {
        temporalByMonth[key] = { date: key, pro_nato: 0, pro_russia: 0, neutral: 0 };
      }
      temporalByMonth[key][d.stance] += d.user_count;
    });
    
    return Object.values(temporalByMonth).sort((a, b) => a.date.localeCompare(b.date));
  }, [selectedStances]);
  
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
          total_tweets: 0
        };
      }
      countryData[d.country_code][d.stance] += d.user_count;
      countryData[d.country_code].total += d.user_count;
      countryData[d.country_code].total_tweets += d.total_tweets;
    });
    
    // Calculate dominant stance for each country
    Object.values(countryData).forEach(country => {
      const stances = { pro_nato: country.pro_nato, pro_russia: country.pro_russia, neutral: country.neutral };
      const maxStance = Object.entries(stances).reduce((a, b) => a[1] > b[1] ? a : b);
      country.dominant_stance = maxStance[0];
      country.dominant_percentage = country.total > 0 ? (maxStance[1] / country.total * 100) : 0;
    });
    
    // Calculate totals (now user-based)
    const totals = {
      users: filteredTemporal.reduce((sum, d) => sum + d.user_count, 0),
      tweets: filteredTemporal.reduce((sum, d) => sum + d.total_tweets, 0),
      countries: Object.keys(countryData).length,
      // Users by stance
      pro_nato: filteredTemporal.filter(d => d.stance === 'pro_nato').reduce((sum, d) => sum + d.user_count, 0),
      pro_russia: filteredTemporal.filter(d => d.stance === 'pro_russia').reduce((sum, d) => sum + d.user_count, 0),
      neutral: filteredTemporal.filter(d => d.stance === 'neutral').reduce((sum, d) => sum + d.user_count, 0),
      // Tweets by stance
      pro_nato_tweets: filteredTemporal.filter(d => d.stance === 'pro_nato').reduce((sum, d) => sum + d.total_tweets, 0),
      pro_russia_tweets: filteredTemporal.filter(d => d.stance === 'pro_russia').reduce((sum, d) => sum + d.total_tweets, 0),
      neutral_tweets: filteredTemporal.filter(d => d.stance === 'neutral').reduce((sum, d) => sum + d.total_tweets, 0)
    };
    
    // Aggregate temporal data by month for the chart (user-based)
    const temporalByMonth = {};
    filteredTemporal.forEach(d => {
      const key = `${d.year}-${String(d.month).padStart(2, '0')}`;
      if (!temporalByMonth[key]) {
        temporalByMonth[key] = { date: key, pro_nato: 0, pro_russia: 0, neutral: 0 };
      }
      temporalByMonth[key][d.stance] += d.user_count;
    });
    
    const temporalChartData = Object.values(temporalByMonth).sort((a, b) => a.date.localeCompare(b.date));
    
    return {
      countryData: Object.values(countryData),
      temporalChartData,
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
    
    // Aggregate by month for timeline (user-based)
    const timeline = {};
    temporalData.forEach(d => {
      const key = `${d.year}-${String(d.month).padStart(2, '0')}`;
      if (!timeline[key]) {
        timeline[key] = { date: key, pro_nato: 0, pro_russia: 0, neutral: 0 };
      }
      timeline[key][d.stance] += d.user_count;
    });
    
    // Calculate totals from temporal data (user-based)
    const totals = {
      // Users by stance
      pro_nato: temporalData.filter(d => d.stance === 'pro_nato').reduce((sum, d) => sum + d.user_count, 0),
      pro_russia: temporalData.filter(d => d.stance === 'pro_russia').reduce((sum, d) => sum + d.user_count, 0),
      neutral: temporalData.filter(d => d.stance === 'neutral').reduce((sum, d) => sum + d.user_count, 0),
      // Tweets by stance
      pro_nato_tweets: temporalData.filter(d => d.stance === 'pro_nato').reduce((sum, d) => sum + (d.total_tweets || 0), 0),
      pro_russia_tweets: temporalData.filter(d => d.stance === 'pro_russia').reduce((sum, d) => sum + (d.total_tweets || 0), 0),
      neutral_tweets: temporalData.filter(d => d.stance === 'neutral').reduce((sum, d) => sum + (d.total_tweets || 0), 0),
      total_tweets: temporalData.reduce((sum, d) => sum + (d.total_tweets || 0), 0),
    };
    totals.total = totals.pro_nato + totals.pro_russia + totals.neutral;
    
    return {
      country_code: selectedCountry,
      country_name: countryNames[selectedCountry] || selectedCountry,
      totals,
      timeline: Object.values(timeline).sort((a, b) => a.date.localeCompare(b.date))
    };
  }, [selectedCountry, dateRange, selectedStances]);
  
  // Filter countries by search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return filteredData.countryData
      .filter(c => c.country_name.toLowerCase().includes(query))
      .slice(0, 5);
  }, [searchQuery, filteredData.countryData]);
  
  // Reset all filters
  const handleReset = () => {
    setDateRange([MIN_DATE, MAX_DATE]);
    setSelectedStances(['pro_nato', 'pro_russia', 'neutral']);
    setSelectedCountry(null);
    setSearchQuery('');
  };
  
  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-100 flex">
      {/* Left: Control Panel + Hashtag Cloud stacked */}
      <div className="w-[320px] flex-shrink-0 flex flex-col bg-white border-r-2 border-slate-300 shadow-md z-10 overflow-y-auto">
        {/* Control Panel - takes only needed space */}
        <ControlPanel
          dateRange={dateRange}
          setDateRange={setDateRange}
          selectedStances={selectedStances}
          setSelectedStances={setSelectedStances}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          onCountrySelect={setSelectedCountry}
          selectedCountry={selectedCountry}
          selectedCountryData={selectedCountryData}
          onCloseCountry={() => setSelectedCountry(null)}
          countryData={filteredData.countryData}
          totals={filteredData.totals}
          onReset={handleReset}
          minDate={MIN_DATE}
          maxDate={MAX_DATE}
          showTrendChart={false}
        />
        
        {/* Hashtag Cloud - Right below Control Panel */}
        <div>
          <HashtagCloud
            hashtagData={temporalHashtagData}
            dateRange={dateRange}
            selectedStances={selectedStances}
            selectedCountry={selectedCountry}
            countryMultipliers={countryHashtagMultipliers}
          />
        </div>
      </div>
      
      {/* Right: Map + Trend Chart stacked vertically */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Map Container - Bounded region */}
        <div className="flex-1 relative bg-slate-50 border border-slate-300 m-2 mb-1 rounded-lg overflow-hidden">
          <WorldMap
            data={filteredData.countryData}
            selectedCountry={selectedCountry}
            onCountrySelect={setSelectedCountry}
            selectedStances={selectedStances}
            fullscreen={true}
          />
          
          {/* Map Legend - Top Right */}
          <div className="absolute top-4 right-4 z-10">
            <MapLegend />
          </div>
        </div>
        
        {/* Bottom: Trend Chart */}
        <div className="h-[200px] flex-shrink-0 mx-2 mb-2 mt-1">
          <div className="h-full bg-white border border-slate-300 rounded-lg" style={{ overflow: 'visible' }}>
            <StreamGraph
              temporalData={fullTemporalData}
              events={events}
              selectedStances={selectedStances}
              setSelectedStances={setSelectedStances}
              selectedCountry={selectedCountry}
              countryTemporalData={null}
              dateRange={dateRange}
              setDateRange={setDateRange}
              countryStanceData={countryStanceTemporal}
              minDate={MIN_DATE}
              maxDate={MAX_DATE}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
import React, { useState, useMemo } from 'react';
import WorldMap from './components/WorldMap';
import ControlPanel from './components/ControlPanel';
import MapLegend from './components/MapLegend';
import { countryStanceSummary, temporalStanceSummary, countryStanceTemporal, countryNames } from './data';

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
    
    // Aggregate by month for timeline
    const timeline = {};
    temporalData.forEach(d => {
      const key = `${d.year}-${String(d.month).padStart(2, '0')}`;
      if (!timeline[key]) {
        timeline[key] = { date: key, pro_nato: 0, pro_russia: 0, neutral: 0 };
      }
      timeline[key][d.stance] += d.tweet_count;
    });
    
    // Calculate totals from temporal data
    const totals = {
      pro_nato: temporalData.filter(d => d.stance === 'pro_nato').reduce((sum, d) => sum + d.tweet_count, 0),
      pro_russia: temporalData.filter(d => d.stance === 'pro_russia').reduce((sum, d) => sum + d.tweet_count, 0),
      neutral: temporalData.filter(d => d.stance === 'neutral').reduce((sum, d) => sum + d.tweet_count, 0),
      unique_users: temporalData.reduce((sum, d) => sum + (d.unique_users || 0), 0),
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
    <div className="h-screen w-screen overflow-hidden relative bg-slate-200">
      {/* Full-screen Map Background */}
      <div className="absolute inset-0">
        <WorldMap
          data={filteredData.countryData}
          selectedCountry={selectedCountry}
          onCountrySelect={setSelectedCountry}
          selectedStances={selectedStances}
          fullscreen={true}
        />
      </div>
      
      {/* Floating Control Panel - Left Side */}
      <div className="absolute top-4 left-4 z-10">
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
          temporalChartData={filteredData.temporalChartData}
        />
      </div>
      
      {/* Floating Map Legend - Top Right */}
      <div className="absolute top-4 right-16 z-10">
        <MapLegend />
      </div>
    </div>
  );
}

export default App;
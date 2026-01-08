// Country stance temporal data - monthly stance distribution per country
// This generates monthly breakdowns for each country with realistic temporal shifts

import countryStanceSummary from './countryStanceSummary';

// Seeded random for consistent data
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateCountryTemporalData() {
  const data = [];
  const countries = [...new Set(countryStanceSummary.map(d => d.country_code))];
  const stances = ['pro_nato', 'neutral', 'pro_russia'];
  
  // Time period: Feb 2022 - May 2023 (16 months)
  const months = [];
  for (let year = 2022; year <= 2023; year++) {
    const startMonth = year === 2022 ? 2 : 1;
    const endMonth = year === 2023 ? 5 : 12;
    for (let month = startMonth; month <= endMonth; month++) {
      months.push({ year, month });
    }
  }
  
  // Base distribution weights by month
  const monthlyWeights = {
    '2022-2': 0.15,  // Initial surge
    '2022-3': 0.12,
    '2022-4': 0.10,  // Bucha effect
    '2022-5': 0.08,
    '2022-6': 0.06,
    '2022-7': 0.05,
    '2022-8': 0.055,
    '2022-9': 0.06,  // Mobilization
    '2022-10': 0.065,
    '2022-11': 0.06, // Kherson
    '2022-12': 0.05,
    '2023-1': 0.045,
    '2023-2': 0.055, // Anniversary
    '2023-3': 0.04,
    '2023-4': 0.035,
    '2023-5': 0.035
  };
  
  // Stance shift patterns over time (multipliers that change by month)
  // Early 2022: More Pro-Russia activity, then shifts toward Neutral/Pro-NATO
  const stanceShiftPatterns = {
    '2022-2': { pro_nato: 0.7, neutral: 0.9, pro_russia: 1.8 },  // Early - more pro-Russia
    '2022-3': { pro_nato: 0.8, neutral: 0.95, pro_russia: 1.5 },
    '2022-4': { pro_nato: 1.2, neutral: 1.0, pro_russia: 0.8 },  // Bucha - pro-NATO surge
    '2022-5': { pro_nato: 1.3, neutral: 1.0, pro_russia: 0.6 },
    '2022-6': { pro_nato: 1.2, neutral: 1.1, pro_russia: 0.5 },
    '2022-7': { pro_nato: 1.1, neutral: 1.15, pro_russia: 0.6 },
    '2022-8': { pro_nato: 1.0, neutral: 1.2, pro_russia: 0.7 },
    '2022-9': { pro_nato: 1.3, neutral: 0.9, pro_russia: 0.9 },  // Mobilization
    '2022-10': { pro_nato: 1.2, neutral: 1.0, pro_russia: 0.8 },
    '2022-11': { pro_nato: 1.4, neutral: 0.9, pro_russia: 0.6 }, // Kherson liberation
    '2022-12': { pro_nato: 1.1, neutral: 1.1, pro_russia: 0.7 },
    '2023-1': { pro_nato: 1.0, neutral: 1.2, pro_russia: 0.8 },
    '2023-2': { pro_nato: 1.3, neutral: 1.0, pro_russia: 0.7 },  // Anniversary
    '2023-3': { pro_nato: 1.1, neutral: 1.1, pro_russia: 0.8 },
    '2023-4': { pro_nato: 1.0, neutral: 1.15, pro_russia: 0.85 },
    '2023-5': { pro_nato: 1.0, neutral: 1.1, pro_russia: 0.9 }
  };
  
  // Countries with specific behavior patterns
  const countryPatterns = {
    // Pro-Russia leaning countries - opposite shift pattern
    'RU': { reverseShift: true, amplify: 2.0 },
    'BY': { reverseShift: true, amplify: 1.5 },
    'RS': { reverseShift: true, amplify: 1.3 },
    'IN': { reverseShift: true, amplify: 1.2 },
    'CN': { reverseShift: true, amplify: 1.4 },
    // Strong NATO supporters - amplify the shift
    'UA': { reverseShift: false, amplify: 1.8 },
    'PL': { reverseShift: false, amplify: 1.5 },
    'GB': { reverseShift: false, amplify: 1.4 },
    'US': { reverseShift: false, amplify: 1.3 },
    'DE': { reverseShift: false, amplify: 1.2 },
    'FR': { reverseShift: false, amplify: 1.2 },
    'EE': { reverseShift: false, amplify: 1.6 },
    'LV': { reverseShift: false, amplify: 1.6 },
    'LT': { reverseShift: false, amplify: 1.6 },
  };
  
  let seed = 42;
  
  countries.forEach(countryCode => {
    const countryData = countryStanceSummary.filter(d => d.country_code === countryCode);
    const pattern = countryPatterns[countryCode] || { reverseShift: false, amplify: 1.0 };
    
    stances.forEach(stance => {
      const stanceData = countryData.find(d => d.stance === stance);
      if (!stanceData) return;
      
      const totalTweets = stanceData.tweet_count;
      const totalUsers = stanceData.unique_users;
      
      months.forEach(({ year, month }, monthIndex) => {
        const key = `${year}-${month}`;
        const baseWeight = monthlyWeights[key] || 0.05;
        
        // Get stance shift for this month
        let stanceShift = stanceShiftPatterns[key][stance];
        
        // Reverse the shift for pro-Russia leaning countries
        if (pattern.reverseShift) {
          if (stance === 'pro_nato') {
            stanceShift = stanceShiftPatterns[key]['pro_russia'];
          } else if (stance === 'pro_russia') {
            stanceShift = stanceShiftPatterns[key]['pro_nato'];
          }
        }
        
        // Amplify the shift based on country pattern
        stanceShift = 1 + (stanceShift - 1) * pattern.amplify;
        
        // Add seeded random variation
        seed++;
        const variation = 0.7 + seededRandom(seed) * 0.6;
        
        const weight = baseWeight * stanceShift * variation;
        
        const tweetCount = Math.round(totalTweets * weight);
        const uniqueUsers = Math.round(totalUsers * weight);
        
        data.push({
          country_code: countryCode,
          stance,
          year,
          month,
          tweet_count: tweetCount,
          unique_users: uniqueUsers
        });
      });
    });
  });
  
  return data;
}

const countryStanceTemporal = generateCountryTemporalData();

export default countryStanceTemporal;

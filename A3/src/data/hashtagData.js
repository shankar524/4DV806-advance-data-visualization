// Sample hashtag data with stance classification and temporal distribution
// In a real scenario, this would come from your database

// Base hashtag data
const baseHashtags = [
  // Pro-NATO hashtags (blue)
  { tag: '#StandWithUkraine', baseCount: 2450000, stance: 'pro_nato' },
  { tag: '#SlavaUkraini', baseCount: 1890000, stance: 'pro_nato' },
  { tag: '#UkraineWillWin', baseCount: 1250000, stance: 'pro_nato' },
  { tag: '#StopPutin', baseCount: 980000, stance: 'pro_nato' },
  { tag: '#SupportUkraine', baseCount: 870000, stance: 'pro_nato' },
  { tag: '#NATO', baseCount: 750000, stance: 'pro_nato' },
  { tag: '#RussiaIsATerroristState', baseCount: 680000, stance: 'pro_nato' },
  { tag: '#ArmUkraine', baseCount: 520000, stance: 'pro_nato' },
  { tag: '#FreeUkraine', baseCount: 480000, stance: 'pro_nato' },
  { tag: '#UkraineStrong', baseCount: 420000, stance: 'pro_nato' },
  { tag: '#HelpUkraine', baseCount: 380000, stance: 'pro_nato' },
  { tag: '#StopRussianAggression', baseCount: 340000, stance: 'pro_nato' },
  { tag: '#Zelensky', baseCount: 310000, stance: 'pro_nato' },
  { tag: '#Kyiv', baseCount: 290000, stance: 'pro_nato' },
  { tag: '#UkraineFreedom', baseCount: 250000, stance: 'pro_nato' },
  
  // Neutral hashtags (grey)
  { tag: '#Ukraine', baseCount: 3200000, stance: 'neutral' },
  { tag: '#Russia', baseCount: 2100000, stance: 'neutral' },
  { tag: '#UkraineRussiaWar', baseCount: 1450000, stance: 'neutral' },
  { tag: '#BreakingNews', baseCount: 980000, stance: 'neutral' },
  { tag: '#War', baseCount: 890000, stance: 'neutral' },
  { tag: '#Peace', baseCount: 720000, stance: 'neutral' },
  { tag: '#Europe', baseCount: 580000, stance: 'neutral' },
  { tag: '#Sanctions', baseCount: 490000, stance: 'neutral' },
  { tag: '#Refugees', baseCount: 420000, stance: 'neutral' },
  { tag: '#Diplomacy', baseCount: 350000, stance: 'neutral' },
  { tag: '#Conflict', baseCount: 280000, stance: 'neutral' },
  { tag: '#Crisis', baseCount: 240000, stance: 'neutral' },
  
  // Pro-Russia hashtags (red)
  { tag: '#IStandWithRussia', baseCount: 180000, stance: 'pro_russia' },
  { tag: '#RussiaStrong', baseCount: 120000, stance: 'pro_russia' },
  { tag: '#NATOExpansion', baseCount: 95000, stance: 'pro_russia' },
  { tag: '#Denazification', baseCount: 78000, stance: 'pro_russia' },
  { tag: '#SpecialMilitaryOperation', baseCount: 65000, stance: 'pro_russia' },
  { tag: '#StopNATO', baseCount: 52000, stance: 'pro_russia' },
  { tag: '#TruthAboutUkraine', baseCount: 45000, stance: 'pro_russia' },
  { tag: '#WesternPropaganda', baseCount: 38000, stance: 'pro_russia' },
  { tag: '#Donbass', baseCount: 32000, stance: 'pro_russia' },
  { tag: '#LPR', baseCount: 28000, stance: 'pro_russia' },
  { tag: '#DPR', baseCount: 25000, stance: 'pro_russia' },
  { tag: '#Crimea', baseCount: 22000, stance: 'pro_russia' }
];

// Monthly weights for temporal distribution (Feb 2022 - May 2023)
const monthlyWeights = {
  '2022-02': 0.15,  // Initial surge
  '2022-03': 0.12,
  '2022-04': 0.10,  // Bucha effect
  '2022-05': 0.08,
  '2022-06': 0.06,
  '2022-07': 0.05,
  '2022-08': 0.055,
  '2022-09': 0.06,  // Mobilization
  '2022-10': 0.065,
  '2022-11': 0.06,  // Kherson
  '2022-12': 0.05,
  '2023-01': 0.045,
  '2023-02': 0.055, // Anniversary
  '2023-03': 0.04,
  '2023-04': 0.035,
  '2023-05': 0.035
};

// Country-specific hashtag preferences (multipliers)
const countryMultipliers = {
  US: { pro_nato: 1.3, neutral: 1.0, pro_russia: 0.4 },
  GB: { pro_nato: 1.4, neutral: 1.0, pro_russia: 0.3 },
  PL: { pro_nato: 1.6, neutral: 0.9, pro_russia: 0.2 },
  DE: { pro_nato: 1.2, neutral: 1.1, pro_russia: 0.4 },
  FR: { pro_nato: 1.1, neutral: 1.2, pro_russia: 0.5 },
  UA: { pro_nato: 2.0, neutral: 0.8, pro_russia: 0.1 },
  RU: { pro_nato: 0.2, neutral: 0.6, pro_russia: 2.5 },
  IN: { pro_nato: 0.7, neutral: 1.3, pro_russia: 1.0 },
  BR: { pro_nato: 0.8, neutral: 1.2, pro_russia: 0.8 },
  TR: { pro_nato: 0.6, neutral: 1.4, pro_russia: 0.7 },
  default: { pro_nato: 1.0, neutral: 1.0, pro_russia: 1.0 }
};

// Seeded random for consistent data
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate temporal hashtag data
function generateTemporalHashtagData() {
  const data = [];
  const months = Object.keys(monthlyWeights);
  
  baseHashtags.forEach((hashtag, hashIdx) => {
    months.forEach((month, monthIdx) => {
      const [year, monthNum] = month.split('-').map(Number);
      const weight = monthlyWeights[month];
      const seed = hashIdx * 100 + monthIdx;
      const variance = 0.7 + seededRandom(seed) * 0.6; // 0.7 to 1.3 variance
      
      const count = Math.round(hashtag.baseCount * weight * variance);
      
      data.push({
        tag: hashtag.tag,
        stance: hashtag.stance,
        year,
        month: monthNum,
        count
      });
    });
  });
  
  return data;
}

// Legacy format for backward compatibility
const hashtagData = baseHashtags.map(h => ({
  tag: h.tag,
  count: h.baseCount,
  stance: h.stance
}));

// Export temporal data and helper
export const temporalHashtagData = generateTemporalHashtagData();
export const countryHashtagMultipliers = countryMultipliers;
export default hashtagData;

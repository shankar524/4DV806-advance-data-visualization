// Temporal stance summary data - daily aggregated stance distribution (USER-BASED)
// Shows daily user counts by dominant stance
// user_count: Number of unique users with this dominant stance that day
// total_tweets: Total tweets by these users that day
// Time Period: February 2022 - May 2023

function generateTemporalData() {
  const data = [];
  const startDate = new Date(2022, 1, 24); // Feb 24, 2022 - Conflict start
  const endDate = new Date(2023, 4, 31); // May 31, 2023
  
  // Base user counts per stance (primary metric now)
  const baseCounts = {
    pro_nato: 5000,
    neutral: 18000,
    pro_russia: 200
  };
  
  // Key events that spike activity
  const keyEvents = {
    '2022-02-24': { multiplier: 8, description: 'Invasion starts' },
    '2022-02-25': { multiplier: 10, description: 'First day after invasion' },
    '2022-02-26': { multiplier: 12, description: 'Peak initial response' },
    '2022-02-27': { multiplier: 10, description: 'Continued response' },
    '2022-02-28': { multiplier: 8, description: 'End of first week' },
    '2022-03-01': { multiplier: 7, description: 'March begins' },
    '2022-03-02': { multiplier: 6.5, description: 'Sanctions announced' },
    '2022-03-16': { multiplier: 4, description: 'Mariupol siege intensifies' },
    '2022-04-03': { multiplier: 5, description: 'Bucha massacre revealed' },
    '2022-04-04': { multiplier: 6, description: 'Bucha response' },
    '2022-04-05': { multiplier: 5.5, description: 'Bucha continued' },
    '2022-05-09': { multiplier: 4, description: 'Russia Victory Day' },
    '2022-05-20': { multiplier: 3.5, description: 'Mariupol falls' },
    '2022-06-23': { multiplier: 3, description: 'EU candidate status for Ukraine' },
    '2022-08-24': { multiplier: 4, description: 'Ukraine Independence Day' },
    '2022-09-21': { multiplier: 4.5, description: 'Russian mobilization' },
    '2022-09-30': { multiplier: 4, description: 'Annexation announcements' },
    '2022-10-08': { multiplier: 4.5, description: 'Crimean bridge explosion' },
    '2022-10-10': { multiplier: 5, description: 'Massive missile strikes' },
    '2022-11-11': { multiplier: 4.5, description: 'Kherson liberation' },
    '2022-12-21': { multiplier: 3.5, description: 'Zelensky US visit' },
    '2023-01-25': { multiplier: 3.5, description: 'Tank deliveries announced' },
    '2023-02-24': { multiplier: 5, description: 'One year anniversary' },
    '2023-05-06': { multiplier: 3, description: 'Drone attack on Kremlin' }
  };
  
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    
    // Calculate multiplier based on events and time decay
    let multiplier = 1;
    
    // Check for key events
    if (keyEvents[dateStr]) {
      multiplier = keyEvents[dateStr].multiplier;
    } else {
      // General decay over time (attention span decreases)
      const daysSinceStart = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
      multiplier = Math.max(0.8, 3 * Math.exp(-daysSinceStart / 60));
      
      // Add some random variation
      multiplier *= (0.8 + Math.random() * 0.4);
      
      // Weekend effect (slightly less activity)
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        multiplier *= 0.85;
      }
    }
    
    // Generate data for each stance
    ['pro_nato', 'neutral', 'pro_russia'].forEach(stance => {
      const baseCount = baseCounts[stance];
      const userCount = Math.round(baseCount * multiplier * (0.9 + Math.random() * 0.2));
      const totalTweets = Math.round(userCount * (2.5 + Math.random() * 1.5)); // Each user averages 2.5-4 tweets
      
      data.push({
        year,
        month,
        day,
        stance,
        user_count: userCount,
        total_tweets: totalTweets
      });
    });
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
}

const temporalStanceSummary = generateTemporalData();

export default temporalStanceSummary;

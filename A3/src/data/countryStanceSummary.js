// Country stance summary data - aggregated stance distribution by country (USER-BASED)
// Shows user counts by dominant stance per country
// user_count: Number of unique users with this dominant stance
// total_tweets: Total tweets by these users

const countryStanceSummary = [
  // United States - Major NATO supporter
  { country_code: "US", stance: "pro_nato", user_count: 1234567, total_tweets: 4521340, avg_tweets_per_user: 3.66, total_retweets: 12345678, total_favorites: 23456789, avg_retweets: 2.73, avg_favorites: 5.19 },
  { country_code: "US", stance: "neutral", user_count: 2345678, total_tweets: 8234567, avg_tweets_per_user: 3.51, total_retweets: 15678901, total_favorites: 28901234, avg_retweets: 1.90, avg_favorites: 3.51 },
  { country_code: "US", stance: "pro_russia", user_count: 23456, total_tweets: 45678, avg_tweets_per_user: 1.95, total_retweets: 98765, total_favorites: 123456, avg_retweets: 2.16, avg_favorites: 2.70 },
  
  // United Kingdom
  { country_code: "GB", stance: "pro_nato", user_count: 567890, total_tweets: 1876543, avg_tweets_per_user: 3.30, total_retweets: 4567890, total_favorites: 8901234, avg_retweets: 2.43, avg_favorites: 4.74 },
  { country_code: "GB", stance: "neutral", user_count: 678901, total_tweets: 2345678, avg_tweets_per_user: 3.46, total_retweets: 5678901, total_favorites: 9012345, avg_retweets: 2.42, avg_favorites: 3.84 },
  { country_code: "GB", stance: "pro_russia", user_count: 5678, total_tweets: 12345, avg_tweets_per_user: 2.17, total_retweets: 23456, total_favorites: 34567, avg_retweets: 1.90, avg_favorites: 2.80 },
  
  // Poland - Strong Pro-NATO
  { country_code: "PL", stance: "pro_nato", user_count: 234567, total_tweets: 987654, avg_tweets_per_user: 4.21, total_retweets: 2345678, total_favorites: 4567890, avg_retweets: 2.38, avg_favorites: 4.63 },
  { country_code: "PL", stance: "neutral", user_count: 156789, total_tweets: 654321, avg_tweets_per_user: 4.17, total_retweets: 1234567, total_favorites: 2345678, avg_retweets: 1.89, avg_favorites: 3.59 },
  { country_code: "PL", stance: "pro_russia", user_count: 2345, total_tweets: 5678, avg_tweets_per_user: 2.42, total_retweets: 9876, total_favorites: 12345, avg_retweets: 1.74, avg_favorites: 2.17 },
  
  // Germany
  { country_code: "DE", stance: "pro_nato", user_count: 345678, total_tweets: 1234567, avg_tweets_per_user: 3.57, total_retweets: 3456789, total_favorites: 6789012, avg_retweets: 2.80, avg_favorites: 5.50 },
  { country_code: "DE", stance: "neutral", user_count: 567890, total_tweets: 2567890, avg_tweets_per_user: 4.52, total_retweets: 4567890, total_favorites: 7890123, avg_retweets: 1.78, avg_favorites: 3.07 },
  { country_code: "DE", stance: "pro_russia", user_count: 12345, total_tweets: 34567, avg_tweets_per_user: 2.80, total_retweets: 56789, total_favorites: 78901, avg_retweets: 1.64, avg_favorites: 2.28 },
  
  // France
  { country_code: "FR", stance: "pro_nato", user_count: 234567, total_tweets: 876543, avg_tweets_per_user: 3.74, total_retweets: 2345678, total_favorites: 4567890, avg_retweets: 2.68, avg_favorites: 5.21 },
  { country_code: "FR", stance: "neutral", user_count: 456789, total_tweets: 1987654, avg_tweets_per_user: 4.35, total_retweets: 3456789, total_favorites: 5678901, avg_retweets: 1.74, avg_favorites: 2.86 },
  { country_code: "FR", stance: "pro_russia", user_count: 9876, total_tweets: 23456, avg_tweets_per_user: 2.37, total_retweets: 45678, total_favorites: 56789, avg_retweets: 1.95, avg_favorites: 2.42 },
  
  // Canada
  { country_code: "CA", stance: "pro_nato", user_count: 178901, total_tweets: 654321, avg_tweets_per_user: 0, total_retweets: 1567890, total_favorites: 2890123, avg_retweets: 2.40, avg_favorites: 4.42 },
  { country_code: "CA", stance: "neutral", user_count: 267890, total_tweets: 987654, avg_tweets_per_user: 0, total_retweets: 1890123, total_favorites: 3012345, avg_retweets: 1.91, avg_favorites: 3.05 },
  { country_code: "CA", stance: "pro_russia", user_count: 3456, total_tweets: 8765, avg_tweets_per_user: 0, total_retweets: 15678, total_favorites: 23456, avg_retweets: 1.79, avg_favorites: 2.68 },
  
  // India - More neutral/mixed stance
  { country_code: "IN", stance: "pro_nato", user_count: 78901, total_tweets: 234567, avg_tweets_per_user: 0, total_retweets: 567890, total_favorites: 890123, avg_retweets: 2.42, avg_favorites: 3.79 },
  { country_code: "IN", stance: "neutral", user_count: 456789, total_tweets: 1876543, avg_tweets_per_user: 0, total_retweets: 3456789, total_favorites: 5678901, avg_retweets: 1.84, avg_favorites: 3.03 },
  { country_code: "IN", stance: "pro_russia", user_count: 18901, total_tweets: 45678, avg_tweets_per_user: 0, total_retweets: 89012, total_favorites: 123456, avg_retweets: 1.95, avg_favorites: 2.70 },
  
  // Australia
  { country_code: "AU", stance: "pro_nato", user_count: 145678, total_tweets: 543210, avg_tweets_per_user: 0, total_retweets: 1234567, total_favorites: 2345678, avg_retweets: 2.27, avg_favorites: 4.32 },
  { country_code: "AU", stance: "neutral", user_count: 198765, total_tweets: 765432, avg_tweets_per_user: 0, total_retweets: 1456789, total_favorites: 2567890, avg_retweets: 1.90, avg_favorites: 3.35 },
  { country_code: "AU", stance: "pro_russia", user_count: 2789, total_tweets: 6543, avg_tweets_per_user: 0, total_retweets: 12345, total_favorites: 18901, avg_retweets: 1.89, avg_favorites: 2.89 },
  
  // Netherlands
  { country_code: "NL", stance: "pro_nato", user_count: 89012, total_tweets: 345678, avg_tweets_per_user: 0, total_retweets: 789012, total_favorites: 1234567, avg_retweets: 2.28, avg_favorites: 3.57 },
  { country_code: "NL", stance: "neutral", user_count: 112345, total_tweets: 456789, avg_tweets_per_user: 0, total_retweets: 876543, total_favorites: 1345678, avg_retweets: 1.92, avg_favorites: 2.95 },
  { country_code: "NL", stance: "pro_russia", user_count: 1890, total_tweets: 4567, avg_tweets_per_user: 0, total_retweets: 8901, total_favorites: 12345, avg_retweets: 1.95, avg_favorites: 2.70 },
  
  // Spain
  { country_code: "ES", stance: "pro_nato", user_count: 67890, total_tweets: 234567, avg_tweets_per_user: 0, total_retweets: 567890, total_favorites: 890123, avg_retweets: 2.42, avg_favorites: 3.79 },
  { country_code: "ES", stance: "neutral", user_count: 134567, total_tweets: 543210, avg_tweets_per_user: 0, total_retweets: 987654, total_favorites: 1567890, avg_retweets: 1.82, avg_favorites: 2.89 },
  { country_code: "ES", stance: "pro_russia", user_count: 3456, total_tweets: 8765, avg_tweets_per_user: 0, total_retweets: 15678, total_favorites: 23456, avg_retweets: 1.79, avg_favorites: 2.68 },
  
  // Italy
  { country_code: "IT", stance: "pro_nato", user_count: 89012, total_tweets: 345678, avg_tweets_per_user: 0, total_retweets: 678901, total_favorites: 1012345, avg_retweets: 1.96, avg_favorites: 2.93 },
  { country_code: "IT", stance: "neutral", user_count: 167890, total_tweets: 654321, avg_tweets_per_user: 0, total_retweets: 1234567, total_favorites: 1890123, avg_retweets: 1.89, avg_favorites: 2.89 },
  { country_code: "IT", stance: "pro_russia", user_count: 4567, total_tweets: 12345, avg_tweets_per_user: 0, total_retweets: 23456, total_favorites: 34567, avg_retweets: 1.90, avg_favorites: 2.80 },
  
  // Japan
  { country_code: "JP", stance: "pro_nato", user_count: 123456, total_tweets: 456789, avg_tweets_per_user: 0, total_retweets: 890123, total_favorites: 1345678, avg_retweets: 1.95, avg_favorites: 2.95 },
  { country_code: "JP", stance: "neutral", user_count: 234567, total_tweets: 876543, avg_tweets_per_user: 0, total_retweets: 1567890, total_favorites: 2345678, avg_retweets: 1.79, avg_favorites: 2.68 },
  { country_code: "JP", stance: "pro_russia", user_count: 2345, total_tweets: 5678, avg_tweets_per_user: 0, total_retweets: 10123, total_favorites: 15678, avg_retweets: 1.78, avg_favorites: 2.76 },
  
  // Brazil
  { country_code: "BR", stance: "pro_nato", user_count: 45678, total_tweets: 123456, avg_tweets_per_user: 0, total_retweets: 234567, total_favorites: 345678, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "BR", stance: "neutral", user_count: 198765, total_tweets: 765432, avg_tweets_per_user: 0, total_retweets: 1234567, total_favorites: 1890123, avg_retweets: 1.61, avg_favorites: 2.47 },
  { country_code: "BR", stance: "pro_russia", user_count: 8901, total_tweets: 23456, avg_tweets_per_user: 0, total_retweets: 45678, total_favorites: 67890, avg_retweets: 1.95, avg_favorites: 2.89 },
  
  // Turkey
  { country_code: "TR", stance: "pro_nato", user_count: 45678, total_tweets: 156789, avg_tweets_per_user: 0, total_retweets: 312345, total_favorites: 456789, avg_retweets: 1.99, avg_favorites: 2.91 },
  { country_code: "TR", stance: "neutral", user_count: 89012, total_tweets: 345678, avg_tweets_per_user: 0, total_retweets: 567890, total_favorites: 890123, avg_retweets: 1.64, avg_favorites: 2.58 },
  { country_code: "TR", stance: "pro_russia", user_count: 12345, total_tweets: 34567, avg_tweets_per_user: 0, total_retweets: 67890, total_favorites: 98765, avg_retweets: 1.96, avg_favorites: 2.86 },
  
  // Ukraine - Strong Pro-NATO
  { country_code: "UA", stance: "pro_nato", user_count: 145678, total_tweets: 567890, avg_tweets_per_user: 0, total_retweets: 1234567, total_favorites: 2345678, avg_retweets: 2.17, avg_favorites: 4.13 },
  { country_code: "UA", stance: "neutral", user_count: 34567, total_tweets: 123456, avg_tweets_per_user: 0, total_retweets: 234567, total_favorites: 345678, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "UA", stance: "pro_russia", user_count: 987, total_tweets: 2345, avg_tweets_per_user: 0, total_retweets: 4567, total_favorites: 6789, avg_retweets: 1.95, avg_favorites: 2.90 },
  
  // Russia
  { country_code: "RU", stance: "pro_nato", user_count: 4567, total_tweets: 12345, avg_tweets_per_user: 0, total_retweets: 23456, total_favorites: 34567, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "RU", stance: "neutral", user_count: 67890, total_tweets: 234567, avg_tweets_per_user: 0, total_retweets: 456789, total_favorites: 678901, avg_retweets: 1.95, avg_favorites: 2.89 },
  { country_code: "RU", stance: "pro_russia", user_count: 23456, total_tweets: 78901, avg_tweets_per_user: 0, total_retweets: 156789, total_favorites: 234567, avg_retweets: 1.99, avg_favorites: 2.97 },
  
  // Sweden
  { country_code: "SE", stance: "pro_nato", user_count: 67890, total_tweets: 234567, avg_tweets_per_user: 0, total_retweets: 456789, total_favorites: 678901, avg_retweets: 1.95, avg_favorites: 2.89 },
  { country_code: "SE", stance: "neutral", user_count: 89012, total_tweets: 345678, avg_tweets_per_user: 0, total_retweets: 567890, total_favorites: 890123, avg_retweets: 1.64, avg_favorites: 2.58 },
  { country_code: "SE", stance: "pro_russia", user_count: 1234, total_tweets: 3456, avg_tweets_per_user: 0, total_retweets: 6789, total_favorites: 9012, avg_retweets: 1.96, avg_favorites: 2.61 },
  
  // Norway
  { country_code: "NO", stance: "pro_nato", user_count: 45678, total_tweets: 156789, avg_tweets_per_user: 0, total_retweets: 312345, total_favorites: 456789, avg_retweets: 1.99, avg_favorites: 2.91 },
  { country_code: "NO", stance: "neutral", user_count: 56789, total_tweets: 198765, avg_tweets_per_user: 0, total_retweets: 345678, total_favorites: 567890, avg_retweets: 1.74, avg_favorites: 2.86 },
  { country_code: "NO", stance: "pro_russia", user_count: 890, total_tweets: 2345, avg_tweets_per_user: 0, total_retweets: 4567, total_favorites: 6789, avg_retweets: 1.95, avg_favorites: 2.90 },
  
  // Finland
  { country_code: "FI", stance: "pro_nato", user_count: 56789, total_tweets: 187654, avg_tweets_per_user: 0, total_retweets: 378901, total_favorites: 567890, avg_retweets: 2.02, avg_favorites: 3.03 },
  { country_code: "FI", stance: "neutral", user_count: 45678, total_tweets: 156789, avg_tweets_per_user: 0, total_retweets: 289012, total_favorites: 423456, avg_retweets: 1.84, avg_favorites: 2.70 },
  { country_code: "FI", stance: "pro_russia", user_count: 678, total_tweets: 1890, avg_tweets_per_user: 0, total_retweets: 3456, total_favorites: 5123, avg_retweets: 1.83, avg_favorites: 2.71 },
  
  // Czech Republic
  { country_code: "CZ", stance: "pro_nato", user_count: 42345, total_tweets: 145678, avg_tweets_per_user: 0, total_retweets: 289012, total_favorites: 423456, avg_retweets: 1.98, avg_favorites: 2.91 },
  { country_code: "CZ", stance: "neutral", user_count: 34567, total_tweets: 123456, avg_tweets_per_user: 0, total_retweets: 234567, total_favorites: 345678, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "CZ", stance: "pro_russia", user_count: 901, total_tweets: 2345, avg_tweets_per_user: 0, total_retweets: 4567, total_favorites: 6789, avg_retweets: 1.95, avg_favorites: 2.90 },
  
  // Romania
  { country_code: "RO", stance: "pro_nato", user_count: 36789, total_tweets: 123456, avg_tweets_per_user: 0, total_retweets: 245678, total_favorites: 367890, avg_retweets: 1.99, avg_favorites: 2.98 },
  { country_code: "RO", stance: "neutral", user_count: 28901, total_tweets: 98765, avg_tweets_per_user: 0, total_retweets: 187654, total_favorites: 276543, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "RO", stance: "pro_russia", user_count: 789, total_tweets: 2123, avg_tweets_per_user: 0, total_retweets: 4123, total_favorites: 6012, avg_retweets: 1.94, avg_favorites: 2.83 },
  
  // Belgium
  { country_code: "BE", stance: "pro_nato", user_count: 39012, total_tweets: 134567, avg_tweets_per_user: 0, total_retweets: 267890, total_favorites: 401234, avg_retweets: 1.99, avg_favorites: 2.98 },
  { country_code: "BE", stance: "neutral", user_count: 45678, total_tweets: 156789, avg_tweets_per_user: 0, total_retweets: 289012, total_favorites: 423456, avg_retweets: 1.84, avg_favorites: 2.70 },
  { country_code: "BE", stance: "pro_russia", user_count: 978, total_tweets: 2678, avg_tweets_per_user: 0, total_retweets: 5123, total_favorites: 7456, avg_retweets: 1.91, avg_favorites: 2.78 },
  
  // Portugal
  { country_code: "PT", stance: "pro_nato", user_count: 28901, total_tweets: 98765, avg_tweets_per_user: 0, total_retweets: 187654, total_favorites: 276543, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "PT", stance: "neutral", user_count: 39012, total_tweets: 134567, avg_tweets_per_user: 0, total_retweets: 245678, total_favorites: 367890, avg_retweets: 1.83, avg_favorites: 2.73 },
  { country_code: "PT", stance: "pro_russia", user_count: 567, total_tweets: 1567, avg_tweets_per_user: 0, total_retweets: 2890, total_favorites: 4234, avg_retweets: 1.84, avg_favorites: 2.70 },
  
  // Greece
  { country_code: "GR", stance: "pro_nato", user_count: 19012, total_tweets: 67890, avg_tweets_per_user: 0, total_retweets: 123456, total_favorites: 187654, avg_retweets: 1.82, avg_favorites: 2.76 },
  { country_code: "GR", stance: "neutral", user_count: 28901, total_tweets: 98765, avg_tweets_per_user: 0, total_retweets: 178901, total_favorites: 267890, avg_retweets: 1.81, avg_favorites: 2.71 },
  { country_code: "GR", stance: "pro_russia", user_count: 1234, total_tweets: 3456, avg_tweets_per_user: 0, total_retweets: 6789, total_favorites: 9876, avg_retweets: 1.96, avg_favorites: 2.86 },
  
  // Austria
  { country_code: "AT", stance: "pro_nato", user_count: 22345, total_tweets: 78901, avg_tweets_per_user: 0, total_retweets: 145678, total_favorites: 218765, avg_retweets: 1.85, avg_favorites: 2.77 },
  { country_code: "AT", stance: "neutral", user_count: 32456, total_tweets: 112345, avg_tweets_per_user: 0, total_retweets: 203456, total_favorites: 301234, avg_retweets: 1.81, avg_favorites: 2.68 },
  { country_code: "AT", stance: "pro_russia", user_count: 1012, total_tweets: 2890, avg_tweets_per_user: 0, total_retweets: 5456, total_favorites: 7890, avg_retweets: 1.89, avg_favorites: 2.73 },
  
  // Ireland
  { country_code: "IE", stance: "pro_nato", user_count: 42345, total_tweets: 145678, avg_tweets_per_user: 0, total_retweets: 278901, total_favorites: 412345, avg_retweets: 1.91, avg_favorites: 2.83 },
  { country_code: "IE", stance: "neutral", user_count: 48901, total_tweets: 167890, avg_tweets_per_user: 0, total_retweets: 312345, total_favorites: 467890, avg_retweets: 1.86, avg_favorites: 2.79 },
  { country_code: "IE", stance: "pro_russia", user_count: 789, total_tweets: 2123, avg_tweets_per_user: 0, total_retweets: 4012, total_favorites: 5890, avg_retweets: 1.89, avg_favorites: 2.78 },
  
  // Switzerland
  { country_code: "CH", stance: "pro_nato", user_count: 25678, total_tweets: 89012, avg_tweets_per_user: 0, total_retweets: 167890, total_favorites: 251234, avg_retweets: 1.89, avg_favorites: 2.82 },
  { country_code: "CH", stance: "neutral", user_count: 39012, total_tweets: 134567, avg_tweets_per_user: 0, total_retweets: 245678, total_favorites: 367890, avg_retweets: 1.83, avg_favorites: 2.73 },
  { country_code: "CH", stance: "pro_russia", user_count: 645, total_tweets: 1789, avg_tweets_per_user: 0, total_retweets: 3345, total_favorites: 4901, avg_retweets: 1.87, avg_favorites: 2.74 },
  
  // Mexico
  { country_code: "MX", stance: "pro_nato", user_count: 22345, total_tweets: 78901, avg_tweets_per_user: 0, total_retweets: 145678, total_favorites: 218765, avg_retweets: 1.85, avg_favorites: 2.77 },
  { country_code: "MX", stance: "neutral", user_count: 67890, total_tweets: 234567, avg_tweets_per_user: 0, total_retweets: 423456, total_favorites: 634567, avg_retweets: 1.80, avg_favorites: 2.70 },
  { country_code: "MX", stance: "pro_russia", user_count: 2012, total_tweets: 5678, avg_tweets_per_user: 0, total_retweets: 10789, total_favorites: 15678, avg_retweets: 1.90, avg_favorites: 2.76 },
  
  // Argentina
  { country_code: "AR", stance: "pro_nato", user_count: 12890, total_tweets: 45678, avg_tweets_per_user: 0, total_retweets: 87654, total_favorites: 130987, avg_retweets: 1.92, avg_favorites: 2.87 },
  { country_code: "AR", stance: "neutral", user_count: 45678, total_tweets: 156789, avg_tweets_per_user: 0, total_retweets: 289012, total_favorites: 423456, avg_retweets: 1.84, avg_favorites: 2.70 },
  { country_code: "AR", stance: "pro_russia", user_count: 1623, total_tweets: 4567, avg_tweets_per_user: 0, total_retweets: 8765, total_favorites: 12890, avg_retweets: 1.92, avg_favorites: 2.82 },
  
  // South Korea
  { country_code: "KR", stance: "pro_nato", user_count: 35678, total_tweets: 123456, avg_tweets_per_user: 0, total_retweets: 234567, total_favorites: 356789, avg_retweets: 1.90, avg_favorites: 2.89 },
  { country_code: "KR", stance: "neutral", user_count: 56789, total_tweets: 198765, avg_tweets_per_user: 0, total_retweets: 367890, total_favorites: 545678, avg_retweets: 1.85, avg_favorites: 2.75 },
  { country_code: "KR", stance: "pro_russia", user_count: 845, total_tweets: 2345, avg_tweets_per_user: 0, total_retweets: 4456, total_favorites: 6567, avg_retweets: 1.90, avg_favorites: 2.80 },
  
  // South Africa
  { country_code: "ZA", stance: "pro_nato", user_count: 9876, total_tweets: 34567, avg_tweets_per_user: 0, total_retweets: 65432, total_favorites: 98765, avg_retweets: 1.89, avg_favorites: 2.86 },
  { country_code: "ZA", stance: "neutral", user_count: 25432, total_tweets: 87654, avg_tweets_per_user: 0, total_retweets: 156789, total_favorites: 234567, avg_retweets: 1.79, avg_favorites: 2.68 },
  { country_code: "ZA", stance: "pro_russia", user_count: 1023, total_tweets: 2890, avg_tweets_per_user: 0, total_retweets: 5456, total_favorites: 8012, avg_retweets: 1.89, avg_favorites: 2.77 },
  
  // Nigeria
  { country_code: "NG", stance: "pro_nato", user_count: 6789, total_tweets: 23456, avg_tweets_per_user: 0, total_retweets: 43210, total_favorites: 65432, avg_retweets: 1.84, avg_favorites: 2.79 },
  { country_code: "NG", stance: "neutral", user_count: 16543, total_tweets: 56789, avg_tweets_per_user: 0, total_retweets: 101234, total_favorites: 151234, avg_retweets: 1.78, avg_favorites: 2.66 },
  { country_code: "NG", stance: "pro_russia", user_count: 678, total_tweets: 1890, avg_tweets_per_user: 0, total_retweets: 3567, total_favorites: 5234, avg_retweets: 1.89, avg_favorites: 2.77 },
  
  // Israel
  { country_code: "IL", stance: "pro_nato", user_count: 25432, total_tweets: 87654, avg_tweets_per_user: 0, total_retweets: 167890, total_favorites: 251234, avg_retweets: 1.92, avg_favorites: 2.87 },
  { country_code: "IL", stance: "neutral", user_count: 32456, total_tweets: 112345, avg_tweets_per_user: 0, total_retweets: 201234, total_favorites: 298765, avg_retweets: 1.79, avg_favorites: 2.66 },
  { country_code: "IL", stance: "pro_russia", user_count: 856, total_tweets: 2345, avg_tweets_per_user: 0, total_retweets: 4456, total_favorites: 6543, avg_retweets: 1.90, avg_favorites: 2.79 },
  
  // Saudi Arabia
  { country_code: "SA", stance: "pro_nato", user_count: 6789, total_tweets: 23456, avg_tweets_per_user: 0, total_retweets: 43210, total_favorites: 65432, avg_retweets: 1.84, avg_favorites: 2.79 },
  { country_code: "SA", stance: "neutral", user_count: 28901, total_tweets: 98765, avg_tweets_per_user: 0, total_retweets: 178901, total_favorites: 265432, avg_retweets: 1.81, avg_favorites: 2.69 },
  { country_code: "SA", stance: "pro_russia", user_count: 1234, total_tweets: 3456, avg_tweets_per_user: 0, total_retweets: 6543, total_favorites: 9567, avg_retweets: 1.89, avg_favorites: 2.77 },
  
  // United Arab Emirates
  { country_code: "AE", stance: "pro_nato", user_count: 9876, total_tweets: 34567, avg_tweets_per_user: 0, total_retweets: 65432, total_favorites: 98765, avg_retweets: 1.89, avg_favorites: 2.86 },
  { country_code: "AE", stance: "neutral", user_count: 19543, total_tweets: 67890, avg_tweets_per_user: 0, total_retweets: 121234, total_favorites: 178901, avg_retweets: 1.79, avg_favorites: 2.63 },
  { country_code: "AE", stance: "pro_russia", user_count: 567, total_tweets: 1567, avg_tweets_per_user: 0, total_retweets: 2890, total_favorites: 4234, avg_retweets: 1.84, avg_favorites: 2.70 },
  
  // Singapore
  { country_code: "SG", stance: "pro_nato", user_count: 12890, total_tweets: 45678, avg_tweets_per_user: 0, total_retweets: 87654, total_favorites: 130987, avg_retweets: 1.92, avg_favorites: 2.87 },
  { country_code: "SG", stance: "neutral", user_count: 19543, total_tweets: 67890, avg_tweets_per_user: 0, total_retweets: 121234, total_favorites: 178901, avg_retweets: 1.79, avg_favorites: 2.63 },
  { country_code: "SG", stance: "pro_russia", user_count: 445, total_tweets: 1234, avg_tweets_per_user: 0, total_retweets: 2345, total_favorites: 3456, avg_retweets: 1.90, avg_favorites: 2.80 },
  
  // New Zealand
  { country_code: "NZ", stance: "pro_nato", user_count: 19543, total_tweets: 67890, avg_tweets_per_user: 0, total_retweets: 128765, total_favorites: 192345, avg_retweets: 1.90, avg_favorites: 2.83 },
  { country_code: "NZ", stance: "neutral", user_count: 25678, total_tweets: 89012, avg_tweets_per_user: 0, total_retweets: 162345, total_favorites: 241234, avg_retweets: 1.82, avg_favorites: 2.71 },
  { country_code: "NZ", stance: "pro_russia", user_count: 523, total_tweets: 1456, avg_tweets_per_user: 0, total_retweets: 2756, total_favorites: 4012, avg_retweets: 1.89, avg_favorites: 2.76 },
  
  // Denmark
  { country_code: "DK", stance: "pro_nato", user_count: 28543, total_tweets: 98765, avg_tweets_per_user: 0, total_retweets: 187654, total_favorites: 278901, avg_retweets: 1.90, avg_favorites: 2.82 },
  { country_code: "DK", stance: "neutral", user_count: 32456, total_tweets: 112345, avg_tweets_per_user: 0, total_retweets: 201234, total_favorites: 298765, avg_retweets: 1.79, avg_favorites: 2.66 },
  { country_code: "DK", stance: "pro_russia", user_count: 612, total_tweets: 1678, avg_tweets_per_user: 0, total_retweets: 3156, total_favorites: 4623, avg_retweets: 1.88, avg_favorites: 2.76 },
  
  // Hungary
  { country_code: "HU", stance: "pro_nato", user_count: 9876, total_tweets: 34567, avg_tweets_per_user: 0, total_retweets: 65432, total_favorites: 98765, avg_retweets: 1.89, avg_favorites: 2.86 },
  { country_code: "HU", stance: "neutral", user_count: 19543, total_tweets: 67890, avg_tweets_per_user: 0, total_retweets: 121234, total_favorites: 178901, avg_retweets: 1.79, avg_favorites: 2.63 },
  { country_code: "HU", stance: "pro_russia", user_count: 3234, total_tweets: 8901, avg_tweets_per_user: 0, total_retweets: 16890, total_favorites: 24567, avg_retweets: 1.90, avg_favorites: 2.76 },
  
  // Serbia - More Pro-Russia
  { country_code: "RS", stance: "pro_nato", user_count: 3567, total_tweets: 12345, avg_tweets_per_user: 0, total_retweets: 23456, total_favorites: 34567, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "RS", stance: "neutral", user_count: 9876, total_tweets: 34567, avg_tweets_per_user: 0, total_retweets: 62345, total_favorites: 92345, avg_retweets: 1.80, avg_favorites: 2.67 },
  { country_code: "RS", stance: "pro_russia", user_count: 5678, total_tweets: 15678, avg_tweets_per_user: 0, total_retweets: 29876, total_favorites: 43567, avg_retweets: 1.90, avg_favorites: 2.78 },
  
  // China
  { country_code: "CN", stance: "pro_nato", user_count: 1623, total_tweets: 5678, avg_tweets_per_user: 0, total_retweets: 10789, total_favorites: 15890, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "CN", stance: "neutral", user_count: 45678, total_tweets: 156789, avg_tweets_per_user: 0, total_retweets: 289012, total_favorites: 423456, avg_retweets: 1.84, avg_favorites: 2.70 },
  { country_code: "CN", stance: "pro_russia", user_count: 8567, total_tweets: 23456, avg_tweets_per_user: 0, total_retweets: 44567, total_favorites: 65432, avg_retweets: 1.90, avg_favorites: 2.79 },
  
  // Pakistan
  { country_code: "PK", stance: "pro_nato", user_count: 3567, total_tweets: 12345, avg_tweets_per_user: 0, total_retweets: 23456, total_favorites: 34567, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "PK", stance: "neutral", user_count: 22876, total_tweets: 78901, avg_tweets_per_user: 0, total_retweets: 143567, total_favorites: 212345, avg_retweets: 1.82, avg_favorites: 2.69 },
  { country_code: "PK", stance: "pro_russia", user_count: 2456, total_tweets: 6789, avg_tweets_per_user: 0, total_retweets: 12890, total_favorites: 18901, avg_retweets: 1.90, avg_favorites: 2.78 },
  
  // Philippines
  { country_code: "PH", stance: "pro_nato", user_count: 13234, total_tweets: 45678, avg_tweets_per_user: 0, total_retweets: 87654, total_favorites: 129876, avg_retweets: 1.92, avg_favorites: 2.84 },
  { country_code: "PH", stance: "neutral", user_count: 25432, total_tweets: 87654, avg_tweets_per_user: 0, total_retweets: 156789, total_favorites: 231234, avg_retweets: 1.79, avg_favorites: 2.64 },
  { country_code: "PH", stance: "pro_russia", user_count: 856, total_tweets: 2345, avg_tweets_per_user: 0, total_retweets: 4456, total_favorites: 6543, avg_retweets: 1.90, avg_favorites: 2.79 },
  
  // Indonesia
  { country_code: "ID", stance: "pro_nato", user_count: 6789, total_tweets: 23456, avg_tweets_per_user: 0, total_retweets: 44567, total_favorites: 65890, avg_retweets: 1.90, avg_favorites: 2.81 },
  { country_code: "ID", stance: "neutral", user_count: 32678, total_tweets: 112345, avg_tweets_per_user: 0, total_retweets: 203456, total_favorites: 301234, avg_retweets: 1.81, avg_favorites: 2.68 },
  { country_code: "ID", stance: "pro_russia", user_count: 1256, total_tweets: 3456, avg_tweets_per_user: 0, total_retweets: 6567, total_favorites: 9567, avg_retweets: 1.90, avg_favorites: 2.77 },
  
  // Malaysia
  { country_code: "MY", stance: "pro_nato", user_count: 6789, total_tweets: 23456, avg_tweets_per_user: 0, total_retweets: 44567, total_favorites: 65890, avg_retweets: 1.90, avg_favorites: 2.81 },
  { country_code: "MY", stance: "neutral", user_count: 16432, total_tweets: 56789, avg_tweets_per_user: 0, total_retweets: 101234, total_favorites: 149876, avg_retweets: 1.78, avg_favorites: 2.64 },
  { country_code: "MY", stance: "pro_russia", user_count: 767, total_tweets: 2123, avg_tweets_per_user: 0, total_retweets: 4012, total_favorites: 5876, avg_retweets: 1.89, avg_favorites: 2.77 },
  
  // Thailand
  { country_code: "TH", stance: "pro_nato", user_count: 6789, total_tweets: 23456, avg_tweets_per_user: 0, total_retweets: 44567, total_favorites: 65890, avg_retweets: 1.90, avg_favorites: 2.81 },
  { country_code: "TH", stance: "neutral", user_count: 19654, total_tweets: 67890, avg_tweets_per_user: 0, total_retweets: 121234, total_favorites: 178901, avg_retweets: 1.79, avg_favorites: 2.63 },
  { country_code: "TH", stance: "pro_russia", user_count: 687, total_tweets: 1890, avg_tweets_per_user: 0, total_retweets: 3567, total_favorites: 5234, avg_retweets: 1.89, avg_favorites: 2.77 },
  
  // Vietnam
  { country_code: "VN", stance: "pro_nato", user_count: 3567, total_tweets: 12345, avg_tweets_per_user: 0, total_retweets: 23456, total_favorites: 34567, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "VN", stance: "neutral", user_count: 13234, total_tweets: 45678, avg_tweets_per_user: 0, total_retweets: 82345, total_favorites: 121234, avg_retweets: 1.80, avg_favorites: 2.65 },
  { country_code: "VN", stance: "pro_russia", user_count: 856, total_tweets: 2345, avg_tweets_per_user: 0, total_retweets: 4456, total_favorites: 6543, avg_retweets: 1.90, avg_favorites: 2.79 },
  
  // Egypt
  { country_code: "EG", stance: "pro_nato", user_count: 3567, total_tweets: 12345, avg_tweets_per_user: 0, total_retweets: 23456, total_favorites: 34567, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "EG", stance: "neutral", user_count: 16432, total_tweets: 56789, avg_tweets_per_user: 0, total_retweets: 101234, total_favorites: 149876, avg_retweets: 1.78, avg_favorites: 2.64 },
  { country_code: "EG", stance: "pro_russia", user_count: 1256, total_tweets: 3456, avg_tweets_per_user: 0, total_retweets: 6567, total_favorites: 9567, avg_retweets: 1.90, avg_favorites: 2.77 },
  
  // Colombia
  { country_code: "CO", stance: "pro_nato", user_count: 6789, total_tweets: 23456, avg_tweets_per_user: 0, total_retweets: 44567, total_favorites: 65890, avg_retweets: 1.90, avg_favorites: 2.81 },
  { country_code: "CO", stance: "neutral", user_count: 19654, total_tweets: 67890, avg_tweets_per_user: 0, total_retweets: 121234, total_favorites: 178901, avg_retweets: 1.79, avg_favorites: 2.63 },
  { country_code: "CO", stance: "pro_russia", user_count: 687, total_tweets: 1890, avg_tweets_per_user: 0, total_retweets: 3567, total_favorites: 5234, avg_retweets: 1.89, avg_favorites: 2.77 },
  
  // Chile
  { country_code: "CL", stance: "pro_nato", user_count: 6789, total_tweets: 23456, avg_tweets_per_user: 0, total_retweets: 44567, total_favorites: 65890, avg_retweets: 1.90, avg_favorites: 2.81 },
  { country_code: "CL", stance: "neutral", user_count: 13234, total_tweets: 45678, avg_tweets_per_user: 0, total_retweets: 82345, total_favorites: 121234, avg_retweets: 1.80, avg_favorites: 2.65 },
  { country_code: "CL", stance: "pro_russia", user_count: 567, total_tweets: 1567, avg_tweets_per_user: 0, total_retweets: 2890, total_favorites: 4234, avg_retweets: 1.84, avg_favorites: 2.70 },
  
  // Peru
  { country_code: "PE", stance: "pro_nato", user_count: 3567, total_tweets: 12345, avg_tweets_per_user: 0, total_retweets: 23456, total_favorites: 34567, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "PE", stance: "neutral", user_count: 9876, total_tweets: 34567, avg_tweets_per_user: 0, total_retweets: 62345, total_favorites: 92345, avg_retweets: 1.80, avg_favorites: 2.67 },
  { country_code: "PE", stance: "pro_russia", user_count: 445, total_tweets: 1234, avg_tweets_per_user: 0, total_retweets: 2345, total_favorites: 3456, avg_retweets: 1.90, avg_favorites: 2.80 },
  
  // Kenya
  { country_code: "KE", stance: "pro_nato", user_count: 3567, total_tweets: 12345, avg_tweets_per_user: 0, total_retweets: 23456, total_favorites: 34567, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "KE", stance: "neutral", user_count: 9876, total_tweets: 34567, avg_tweets_per_user: 0, total_retweets: 62345, total_favorites: 92345, avg_retweets: 1.80, avg_favorites: 2.67 },
  { country_code: "KE", stance: "pro_russia", user_count: 445, total_tweets: 1234, avg_tweets_per_user: 0, total_retweets: 2345, total_favorites: 3456, avg_retweets: 1.90, avg_favorites: 2.80 },
  
  // Ghana
  { country_code: "GH", stance: "pro_nato", user_count: 2567, total_tweets: 8901, avg_tweets_per_user: 0, total_retweets: 16890, total_favorites: 24567, avg_retweets: 1.90, avg_favorites: 2.76 },
  { country_code: "GH", stance: "neutral", user_count: 6789, total_tweets: 23456, avg_tweets_per_user: 0, total_retweets: 42345, total_favorites: 62345, avg_retweets: 1.80, avg_favorites: 2.66 },
  { country_code: "GH", stance: "pro_russia", user_count: 323, total_tweets: 890, avg_tweets_per_user: 0, total_retweets: 1678, total_favorites: 2456, avg_retweets: 1.89, avg_favorites: 2.76 },
  
  // Morocco
  { country_code: "MA", stance: "pro_nato", user_count: 3567, total_tweets: 12345, avg_tweets_per_user: 0, total_retweets: 23456, total_favorites: 34567, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "MA", stance: "neutral", user_count: 9876, total_tweets: 34567, avg_tweets_per_user: 0, total_retweets: 62345, total_favorites: 92345, avg_retweets: 1.80, avg_favorites: 2.67 },
  { country_code: "MA", stance: "pro_russia", user_count: 567, total_tweets: 1567, avg_tweets_per_user: 0, total_retweets: 2890, total_favorites: 4234, avg_retweets: 1.84, avg_favorites: 2.70 },
  
  // Algeria
  { country_code: "DZ", stance: "pro_nato", user_count: 1623, total_tweets: 5678, avg_tweets_per_user: 0, total_retweets: 10789, total_favorites: 15890, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "DZ", stance: "neutral", user_count: 6789, total_tweets: 23456, avg_tweets_per_user: 0, total_retweets: 42345, total_favorites: 62345, avg_retweets: 1.80, avg_favorites: 2.66 },
  { country_code: "DZ", stance: "pro_russia", user_count: 856, total_tweets: 2345, avg_tweets_per_user: 0, total_retweets: 4456, total_favorites: 6543, avg_retweets: 1.90, avg_favorites: 2.79 },
  
  // Tunisia
  { country_code: "TN", stance: "pro_nato", user_count: 1623, total_tweets: 5678, avg_tweets_per_user: 0, total_retweets: 10789, total_favorites: 15890, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "TN", stance: "neutral", user_count: 3567, total_tweets: 12345, avg_tweets_per_user: 0, total_retweets: 22345, total_favorites: 33456, avg_retweets: 1.81, avg_favorites: 2.71 },
  { country_code: "TN", stance: "pro_russia", user_count: 323, total_tweets: 890, avg_tweets_per_user: 0, total_retweets: 1678, total_favorites: 2456, avg_retweets: 1.89, avg_favorites: 2.76 },
  
  // Latvia
  { country_code: "LV", stance: "pro_nato", user_count: 13234, total_tweets: 45678, avg_tweets_per_user: 0, total_retweets: 87654, total_favorites: 129876, avg_retweets: 1.92, avg_favorites: 2.84 },
  { country_code: "LV", stance: "neutral", user_count: 9876, total_tweets: 34567, avg_tweets_per_user: 0, total_retweets: 62345, total_favorites: 92345, avg_retweets: 1.80, avg_favorites: 2.67 },
  { country_code: "LV", stance: "pro_russia", user_count: 323, total_tweets: 890, avg_tweets_per_user: 0, total_retweets: 1678, total_favorites: 2456, avg_retweets: 1.89, avg_favorites: 2.76 },
  
  // Lithuania
  { country_code: "LT", stance: "pro_nato", user_count: 16432, total_tweets: 56789, avg_tweets_per_user: 0, total_retweets: 108901, total_favorites: 161234, avg_retweets: 1.92, avg_favorites: 2.84 },
  { country_code: "LT", stance: "neutral", user_count: 9876, total_tweets: 34567, avg_tweets_per_user: 0, total_retweets: 62345, total_favorites: 92345, avg_retweets: 1.80, avg_favorites: 2.67 },
  { country_code: "LT", stance: "pro_russia", user_count: 245, total_tweets: 678, avg_tweets_per_user: 0, total_retweets: 1278, total_favorites: 1876, avg_retweets: 1.89, avg_favorites: 2.77 },
  
  // Estonia
  { country_code: "EE", stance: "pro_nato", user_count: 19654, total_tweets: 67890, avg_tweets_per_user: 0, total_retweets: 128901, total_favorites: 192345, avg_retweets: 1.90, avg_favorites: 2.83 },
  { country_code: "EE", stance: "neutral", user_count: 9876, total_tweets: 34567, avg_tweets_per_user: 0, total_retweets: 62345, total_favorites: 92345, avg_retweets: 1.80, avg_favorites: 2.67 },
  { country_code: "EE", stance: "pro_russia", user_count: 205, total_tweets: 567, avg_tweets_per_user: 0, total_retweets: 1067, total_favorites: 1567, avg_retweets: 1.88, avg_favorites: 2.76 },
  
  // Slovakia
  { country_code: "SK", stance: "pro_nato", user_count: 9876, total_tweets: 34567, avg_tweets_per_user: 0, total_retweets: 65432, total_favorites: 98765, avg_retweets: 1.89, avg_favorites: 2.86 },
  { country_code: "SK", stance: "neutral", user_count: 13234, total_tweets: 45678, avg_tweets_per_user: 0, total_retweets: 82345, total_favorites: 121234, avg_retweets: 1.80, avg_favorites: 2.65 },
  { country_code: "SK", stance: "pro_russia", user_count: 856, total_tweets: 2345, avg_tweets_per_user: 0, total_retweets: 4456, total_favorites: 6543, avg_retweets: 1.90, avg_favorites: 2.79 },
  
  // Slovenia
  { country_code: "SI", stance: "pro_nato", user_count: 6789, total_tweets: 23456, avg_tweets_per_user: 0, total_retweets: 44567, total_favorites: 65890, avg_retweets: 1.90, avg_favorites: 2.81 },
  { country_code: "SI", stance: "neutral", user_count: 9876, total_tweets: 34567, avg_tweets_per_user: 0, total_retweets: 62345, total_favorites: 92345, avg_retweets: 1.80, avg_favorites: 2.67 },
  { country_code: "SI", stance: "pro_russia", user_count: 323, total_tweets: 890, avg_tweets_per_user: 0, total_retweets: 1678, total_favorites: 2456, avg_retweets: 1.89, avg_favorites: 2.76 },
  
  // Croatia
  { country_code: "HR", stance: "pro_nato", user_count: 9876, total_tweets: 34567, avg_tweets_per_user: 0, total_retweets: 65432, total_favorites: 98765, avg_retweets: 1.89, avg_favorites: 2.86 },
  { country_code: "HR", stance: "neutral", user_count: 13234, total_tweets: 45678, avg_tweets_per_user: 0, total_retweets: 82345, total_favorites: 121234, avg_retweets: 1.80, avg_favorites: 2.65 },
  { country_code: "HR", stance: "pro_russia", user_count: 445, total_tweets: 1234, avg_tweets_per_user: 0, total_retweets: 2345, total_favorites: 3456, avg_retweets: 1.90, avg_favorites: 2.80 },
  
  // Bulgaria
  { country_code: "BG", stance: "pro_nato", user_count: 6789, total_tweets: 23456, avg_tweets_per_user: 0, total_retweets: 44567, total_favorites: 65890, avg_retweets: 1.90, avg_favorites: 2.81 },
  { country_code: "BG", stance: "neutral", user_count: 13234, total_tweets: 45678, avg_tweets_per_user: 0, total_retweets: 82345, total_favorites: 121234, avg_retweets: 1.80, avg_favorites: 2.65 },
  { country_code: "BG", stance: "pro_russia", user_count: 1256, total_tweets: 3456, avg_tweets_per_user: 0, total_retweets: 6567, total_favorites: 9567, avg_retweets: 1.90, avg_favorites: 2.77 },
  
  // Iceland
  { country_code: "IS", stance: "pro_nato", user_count: 3567, total_tweets: 12345, avg_tweets_per_user: 0, total_retweets: 23456, total_favorites: 34567, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "IS", stance: "neutral", user_count: 2567, total_tweets: 8901, avg_tweets_per_user: 0, total_retweets: 16012, total_favorites: 23567, avg_retweets: 1.80, avg_favorites: 2.65 },
  { country_code: "IS", stance: "pro_russia", user_count: 85, total_tweets: 234, avg_tweets_per_user: 0, total_retweets: 445, total_favorites: 654, avg_retweets: 1.90, avg_favorites: 2.79 },
  
  // Luxembourg
  { country_code: "LU", stance: "pro_nato", user_count: 2567, total_tweets: 8901, avg_tweets_per_user: 0, total_retweets: 16890, total_favorites: 24567, avg_retweets: 1.90, avg_favorites: 2.76 },
  { country_code: "LU", stance: "neutral", user_count: 1954, total_tweets: 6789, avg_tweets_per_user: 0, total_retweets: 12234, total_favorites: 17890, avg_retweets: 1.80, avg_favorites: 2.63 },
  { country_code: "LU", stance: "pro_russia", user_count: 65, total_tweets: 178, avg_tweets_per_user: 0, total_retweets: 334, total_favorites: 489, avg_retweets: 1.88, avg_favorites: 2.75 },
  
  // Malta
  { country_code: "MT", stance: "pro_nato", user_count: 1623, total_tweets: 5678, avg_tweets_per_user: 0, total_retweets: 10789, total_favorites: 15890, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "MT", stance: "neutral", user_count: 1312, total_tweets: 4567, avg_tweets_per_user: 0, total_retweets: 8234, total_favorites: 12123, avg_retweets: 1.80, avg_favorites: 2.65 },
  { country_code: "MT", stance: "pro_russia", user_count: 45, total_tweets: 123, avg_tweets_per_user: 0, total_retweets: 234, total_favorites: 345, avg_retweets: 1.90, avg_favorites: 2.80 },
  
  // Cyprus
  { country_code: "CY", stance: "pro_nato", user_count: 2567, total_tweets: 8901, avg_tweets_per_user: 0, total_retweets: 16890, total_favorites: 24567, avg_retweets: 1.90, avg_favorites: 2.76 },
  { country_code: "CY", stance: "neutral", user_count: 3567, total_tweets: 12345, avg_tweets_per_user: 0, total_retweets: 22345, total_favorites: 33456, avg_retweets: 1.81, avg_favorites: 2.71 },
  { country_code: "CY", stance: "pro_russia", user_count: 165, total_tweets: 456, avg_tweets_per_user: 0, total_retweets: 867, total_favorites: 1267, avg_retweets: 1.90, avg_favorites: 2.78 }
];

export default countryStanceSummary;

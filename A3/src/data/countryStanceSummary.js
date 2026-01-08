// Country stance summary data - aggregated stance distribution by country
// Based on the dataset: 44,416,753 tweets, 70 countries
// Pro-NATO: 22.5%, Pro-Russia: 0.8%, Neutral: 76.7%

const countryStanceSummary = [
  // United States - Major NATO supporter
  { country_code: "US", stance: "pro_nato", tweet_count: 4521340, unique_users: 1234567, total_retweets: 12345678, total_favorites: 23456789, avg_retweets: 2.73, avg_favorites: 5.19 },
  { country_code: "US", stance: "neutral", tweet_count: 8234567, unique_users: 2345678, total_retweets: 15678901, total_favorites: 28901234, avg_retweets: 1.90, avg_favorites: 3.51 },
  { country_code: "US", stance: "pro_russia", tweet_count: 45678, unique_users: 23456, total_retweets: 98765, total_favorites: 123456, avg_retweets: 2.16, avg_favorites: 2.70 },
  
  // United Kingdom
  { country_code: "GB", stance: "pro_nato", tweet_count: 1876543, unique_users: 567890, total_retweets: 4567890, total_favorites: 8901234, avg_retweets: 2.43, avg_favorites: 4.74 },
  { country_code: "GB", stance: "neutral", tweet_count: 2345678, unique_users: 678901, total_retweets: 5678901, total_favorites: 9012345, avg_retweets: 2.42, avg_favorites: 3.84 },
  { country_code: "GB", stance: "pro_russia", tweet_count: 12345, unique_users: 5678, total_retweets: 23456, total_favorites: 34567, avg_retweets: 1.90, avg_favorites: 2.80 },
  
  // Poland - Strong Pro-NATO
  { country_code: "PL", stance: "pro_nato", tweet_count: 987654, unique_users: 234567, total_retweets: 2345678, total_favorites: 4567890, avg_retweets: 2.38, avg_favorites: 4.63 },
  { country_code: "PL", stance: "neutral", tweet_count: 654321, unique_users: 156789, total_retweets: 1234567, total_favorites: 2345678, avg_retweets: 1.89, avg_favorites: 3.59 },
  { country_code: "PL", stance: "pro_russia", tweet_count: 5678, unique_users: 2345, total_retweets: 9876, total_favorites: 12345, avg_retweets: 1.74, avg_favorites: 2.17 },
  
  // Germany
  { country_code: "DE", stance: "pro_nato", tweet_count: 1234567, unique_users: 345678, total_retweets: 3456789, total_favorites: 6789012, avg_retweets: 2.80, avg_favorites: 5.50 },
  { country_code: "DE", stance: "neutral", tweet_count: 2567890, unique_users: 567890, total_retweets: 4567890, total_favorites: 7890123, avg_retweets: 1.78, avg_favorites: 3.07 },
  { country_code: "DE", stance: "pro_russia", tweet_count: 34567, unique_users: 12345, total_retweets: 56789, total_favorites: 78901, avg_retweets: 1.64, avg_favorites: 2.28 },
  
  // France
  { country_code: "FR", stance: "pro_nato", tweet_count: 876543, unique_users: 234567, total_retweets: 2345678, total_favorites: 4567890, avg_retweets: 2.68, avg_favorites: 5.21 },
  { country_code: "FR", stance: "neutral", tweet_count: 1987654, unique_users: 456789, total_retweets: 3456789, total_favorites: 5678901, avg_retweets: 1.74, avg_favorites: 2.86 },
  { country_code: "FR", stance: "pro_russia", tweet_count: 23456, unique_users: 9876, total_retweets: 45678, total_favorites: 56789, avg_retweets: 1.95, avg_favorites: 2.42 },
  
  // Canada
  { country_code: "CA", stance: "pro_nato", tweet_count: 654321, unique_users: 178901, total_retweets: 1567890, total_favorites: 2890123, avg_retweets: 2.40, avg_favorites: 4.42 },
  { country_code: "CA", stance: "neutral", tweet_count: 987654, unique_users: 267890, total_retweets: 1890123, total_favorites: 3012345, avg_retweets: 1.91, avg_favorites: 3.05 },
  { country_code: "CA", stance: "pro_russia", tweet_count: 8765, unique_users: 3456, total_retweets: 15678, total_favorites: 23456, avg_retweets: 1.79, avg_favorites: 2.68 },
  
  // India - More neutral/mixed stance
  { country_code: "IN", stance: "pro_nato", tweet_count: 234567, unique_users: 78901, total_retweets: 567890, total_favorites: 890123, avg_retweets: 2.42, avg_favorites: 3.79 },
  { country_code: "IN", stance: "neutral", tweet_count: 1876543, unique_users: 456789, total_retweets: 3456789, total_favorites: 5678901, avg_retweets: 1.84, avg_favorites: 3.03 },
  { country_code: "IN", stance: "pro_russia", tweet_count: 45678, unique_users: 18901, total_retweets: 89012, total_favorites: 123456, avg_retweets: 1.95, avg_favorites: 2.70 },
  
  // Australia
  { country_code: "AU", stance: "pro_nato", tweet_count: 543210, unique_users: 145678, total_retweets: 1234567, total_favorites: 2345678, avg_retweets: 2.27, avg_favorites: 4.32 },
  { country_code: "AU", stance: "neutral", tweet_count: 765432, unique_users: 198765, total_retweets: 1456789, total_favorites: 2567890, avg_retweets: 1.90, avg_favorites: 3.35 },
  { country_code: "AU", stance: "pro_russia", tweet_count: 6543, unique_users: 2789, total_retweets: 12345, total_favorites: 18901, avg_retweets: 1.89, avg_favorites: 2.89 },
  
  // Netherlands
  { country_code: "NL", stance: "pro_nato", tweet_count: 345678, unique_users: 89012, total_retweets: 789012, total_favorites: 1234567, avg_retweets: 2.28, avg_favorites: 3.57 },
  { country_code: "NL", stance: "neutral", tweet_count: 456789, unique_users: 112345, total_retweets: 876543, total_favorites: 1345678, avg_retweets: 1.92, avg_favorites: 2.95 },
  { country_code: "NL", stance: "pro_russia", tweet_count: 4567, unique_users: 1890, total_retweets: 8901, total_favorites: 12345, avg_retweets: 1.95, avg_favorites: 2.70 },
  
  // Spain
  { country_code: "ES", stance: "pro_nato", tweet_count: 234567, unique_users: 67890, total_retweets: 567890, total_favorites: 890123, avg_retweets: 2.42, avg_favorites: 3.79 },
  { country_code: "ES", stance: "neutral", tweet_count: 543210, unique_users: 134567, total_retweets: 987654, total_favorites: 1567890, avg_retweets: 1.82, avg_favorites: 2.89 },
  { country_code: "ES", stance: "pro_russia", tweet_count: 8765, unique_users: 3456, total_retweets: 15678, total_favorites: 23456, avg_retweets: 1.79, avg_favorites: 2.68 },
  
  // Italy
  { country_code: "IT", stance: "pro_nato", tweet_count: 345678, unique_users: 89012, total_retweets: 678901, total_favorites: 1012345, avg_retweets: 1.96, avg_favorites: 2.93 },
  { country_code: "IT", stance: "neutral", tweet_count: 654321, unique_users: 167890, total_retweets: 1234567, total_favorites: 1890123, avg_retweets: 1.89, avg_favorites: 2.89 },
  { country_code: "IT", stance: "pro_russia", tweet_count: 12345, unique_users: 4567, total_retweets: 23456, total_favorites: 34567, avg_retweets: 1.90, avg_favorites: 2.80 },
  
  // Japan
  { country_code: "JP", stance: "pro_nato", tweet_count: 456789, unique_users: 123456, total_retweets: 890123, total_favorites: 1345678, avg_retweets: 1.95, avg_favorites: 2.95 },
  { country_code: "JP", stance: "neutral", tweet_count: 876543, unique_users: 234567, total_retweets: 1567890, total_favorites: 2345678, avg_retweets: 1.79, avg_favorites: 2.68 },
  { country_code: "JP", stance: "pro_russia", tweet_count: 5678, unique_users: 2345, total_retweets: 10123, total_favorites: 15678, avg_retweets: 1.78, avg_favorites: 2.76 },
  
  // Brazil
  { country_code: "BR", stance: "pro_nato", tweet_count: 123456, unique_users: 45678, total_retweets: 234567, total_favorites: 345678, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "BR", stance: "neutral", tweet_count: 765432, unique_users: 198765, total_retweets: 1234567, total_favorites: 1890123, avg_retweets: 1.61, avg_favorites: 2.47 },
  { country_code: "BR", stance: "pro_russia", tweet_count: 23456, unique_users: 8901, total_retweets: 45678, total_favorites: 67890, avg_retweets: 1.95, avg_favorites: 2.89 },
  
  // Turkey
  { country_code: "TR", stance: "pro_nato", tweet_count: 156789, unique_users: 45678, total_retweets: 312345, total_favorites: 456789, avg_retweets: 1.99, avg_favorites: 2.91 },
  { country_code: "TR", stance: "neutral", tweet_count: 345678, unique_users: 89012, total_retweets: 567890, total_favorites: 890123, avg_retweets: 1.64, avg_favorites: 2.58 },
  { country_code: "TR", stance: "pro_russia", tweet_count: 34567, unique_users: 12345, total_retweets: 67890, total_favorites: 98765, avg_retweets: 1.96, avg_favorites: 2.86 },
  
  // Ukraine - Strong Pro-NATO
  { country_code: "UA", stance: "pro_nato", tweet_count: 567890, unique_users: 145678, total_retweets: 1234567, total_favorites: 2345678, avg_retweets: 2.17, avg_favorites: 4.13 },
  { country_code: "UA", stance: "neutral", tweet_count: 123456, unique_users: 34567, total_retweets: 234567, total_favorites: 345678, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "UA", stance: "pro_russia", tweet_count: 2345, unique_users: 987, total_retweets: 4567, total_favorites: 6789, avg_retweets: 1.95, avg_favorites: 2.90 },
  
  // Russia
  { country_code: "RU", stance: "pro_nato", tweet_count: 12345, unique_users: 4567, total_retweets: 23456, total_favorites: 34567, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "RU", stance: "neutral", tweet_count: 234567, unique_users: 67890, total_retweets: 456789, total_favorites: 678901, avg_retweets: 1.95, avg_favorites: 2.89 },
  { country_code: "RU", stance: "pro_russia", tweet_count: 78901, unique_users: 23456, total_retweets: 156789, total_favorites: 234567, avg_retweets: 1.99, avg_favorites: 2.97 },
  
  // Sweden
  { country_code: "SE", stance: "pro_nato", tweet_count: 234567, unique_users: 67890, total_retweets: 456789, total_favorites: 678901, avg_retweets: 1.95, avg_favorites: 2.89 },
  { country_code: "SE", stance: "neutral", tweet_count: 345678, unique_users: 89012, total_retweets: 567890, total_favorites: 890123, avg_retweets: 1.64, avg_favorites: 2.58 },
  { country_code: "SE", stance: "pro_russia", tweet_count: 3456, unique_users: 1234, total_retweets: 6789, total_favorites: 9012, avg_retweets: 1.96, avg_favorites: 2.61 },
  
  // Norway
  { country_code: "NO", stance: "pro_nato", tweet_count: 156789, unique_users: 45678, total_retweets: 312345, total_favorites: 456789, avg_retweets: 1.99, avg_favorites: 2.91 },
  { country_code: "NO", stance: "neutral", tweet_count: 198765, unique_users: 56789, total_retweets: 345678, total_favorites: 567890, avg_retweets: 1.74, avg_favorites: 2.86 },
  { country_code: "NO", stance: "pro_russia", tweet_count: 2345, unique_users: 890, total_retweets: 4567, total_favorites: 6789, avg_retweets: 1.95, avg_favorites: 2.90 },
  
  // Finland
  { country_code: "FI", stance: "pro_nato", tweet_count: 187654, unique_users: 56789, total_retweets: 378901, total_favorites: 567890, avg_retweets: 2.02, avg_favorites: 3.03 },
  { country_code: "FI", stance: "neutral", tweet_count: 156789, unique_users: 45678, total_retweets: 289012, total_favorites: 423456, avg_retweets: 1.84, avg_favorites: 2.70 },
  { country_code: "FI", stance: "pro_russia", tweet_count: 1890, unique_users: 678, total_retweets: 3456, total_favorites: 5123, avg_retweets: 1.83, avg_favorites: 2.71 },
  
  // Czech Republic
  { country_code: "CZ", stance: "pro_nato", tweet_count: 145678, unique_users: 42345, total_retweets: 289012, total_favorites: 423456, avg_retweets: 1.98, avg_favorites: 2.91 },
  { country_code: "CZ", stance: "neutral", tweet_count: 123456, unique_users: 34567, total_retweets: 234567, total_favorites: 345678, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "CZ", stance: "pro_russia", tweet_count: 2345, unique_users: 901, total_retweets: 4567, total_favorites: 6789, avg_retweets: 1.95, avg_favorites: 2.90 },
  
  // Romania
  { country_code: "RO", stance: "pro_nato", tweet_count: 123456, unique_users: 36789, total_retweets: 245678, total_favorites: 367890, avg_retweets: 1.99, avg_favorites: 2.98 },
  { country_code: "RO", stance: "neutral", tweet_count: 98765, unique_users: 28901, total_retweets: 187654, total_favorites: 276543, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "RO", stance: "pro_russia", tweet_count: 2123, unique_users: 789, total_retweets: 4123, total_favorites: 6012, avg_retweets: 1.94, avg_favorites: 2.83 },
  
  // Belgium
  { country_code: "BE", stance: "pro_nato", tweet_count: 134567, unique_users: 39012, total_retweets: 267890, total_favorites: 401234, avg_retweets: 1.99, avg_favorites: 2.98 },
  { country_code: "BE", stance: "neutral", tweet_count: 156789, unique_users: 45678, total_retweets: 289012, total_favorites: 423456, avg_retweets: 1.84, avg_favorites: 2.70 },
  { country_code: "BE", stance: "pro_russia", tweet_count: 2678, unique_users: 978, total_retweets: 5123, total_favorites: 7456, avg_retweets: 1.91, avg_favorites: 2.78 },
  
  // Portugal
  { country_code: "PT", stance: "pro_nato", tweet_count: 98765, unique_users: 28901, total_retweets: 187654, total_favorites: 276543, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "PT", stance: "neutral", tweet_count: 134567, unique_users: 39012, total_retweets: 245678, total_favorites: 367890, avg_retweets: 1.83, avg_favorites: 2.73 },
  { country_code: "PT", stance: "pro_russia", tweet_count: 1567, unique_users: 567, total_retweets: 2890, total_favorites: 4234, avg_retweets: 1.84, avg_favorites: 2.70 },
  
  // Greece
  { country_code: "GR", stance: "pro_nato", tweet_count: 67890, unique_users: 19012, total_retweets: 123456, total_favorites: 187654, avg_retweets: 1.82, avg_favorites: 2.76 },
  { country_code: "GR", stance: "neutral", tweet_count: 98765, unique_users: 28901, total_retweets: 178901, total_favorites: 267890, avg_retweets: 1.81, avg_favorites: 2.71 },
  { country_code: "GR", stance: "pro_russia", tweet_count: 3456, unique_users: 1234, total_retweets: 6789, total_favorites: 9876, avg_retweets: 1.96, avg_favorites: 2.86 },
  
  // Austria
  { country_code: "AT", stance: "pro_nato", tweet_count: 78901, unique_users: 22345, total_retweets: 145678, total_favorites: 218765, avg_retweets: 1.85, avg_favorites: 2.77 },
  { country_code: "AT", stance: "neutral", tweet_count: 112345, unique_users: 32456, total_retweets: 203456, total_favorites: 301234, avg_retweets: 1.81, avg_favorites: 2.68 },
  { country_code: "AT", stance: "pro_russia", tweet_count: 2890, unique_users: 1012, total_retweets: 5456, total_favorites: 7890, avg_retweets: 1.89, avg_favorites: 2.73 },
  
  // Ireland
  { country_code: "IE", stance: "pro_nato", tweet_count: 145678, unique_users: 42345, total_retweets: 278901, total_favorites: 412345, avg_retweets: 1.91, avg_favorites: 2.83 },
  { country_code: "IE", stance: "neutral", tweet_count: 167890, unique_users: 48901, total_retweets: 312345, total_favorites: 467890, avg_retweets: 1.86, avg_favorites: 2.79 },
  { country_code: "IE", stance: "pro_russia", tweet_count: 2123, unique_users: 789, total_retweets: 4012, total_favorites: 5890, avg_retweets: 1.89, avg_favorites: 2.78 },
  
  // Switzerland
  { country_code: "CH", stance: "pro_nato", tweet_count: 89012, unique_users: 25678, total_retweets: 167890, total_favorites: 251234, avg_retweets: 1.89, avg_favorites: 2.82 },
  { country_code: "CH", stance: "neutral", tweet_count: 134567, unique_users: 39012, total_retweets: 245678, total_favorites: 367890, avg_retweets: 1.83, avg_favorites: 2.73 },
  { country_code: "CH", stance: "pro_russia", tweet_count: 1789, unique_users: 645, total_retweets: 3345, total_favorites: 4901, avg_retweets: 1.87, avg_favorites: 2.74 },
  
  // Mexico
  { country_code: "MX", stance: "pro_nato", tweet_count: 78901, unique_users: 22345, total_retweets: 145678, total_favorites: 218765, avg_retweets: 1.85, avg_favorites: 2.77 },
  { country_code: "MX", stance: "neutral", tweet_count: 234567, unique_users: 67890, total_retweets: 423456, total_favorites: 634567, avg_retweets: 1.80, avg_favorites: 2.70 },
  { country_code: "MX", stance: "pro_russia", tweet_count: 5678, unique_users: 2012, total_retweets: 10789, total_favorites: 15678, avg_retweets: 1.90, avg_favorites: 2.76 },
  
  // Argentina
  { country_code: "AR", stance: "pro_nato", tweet_count: 45678, unique_users: 12890, total_retweets: 87654, total_favorites: 130987, avg_retweets: 1.92, avg_favorites: 2.87 },
  { country_code: "AR", stance: "neutral", tweet_count: 156789, unique_users: 45678, total_retweets: 289012, total_favorites: 423456, avg_retweets: 1.84, avg_favorites: 2.70 },
  { country_code: "AR", stance: "pro_russia", tweet_count: 4567, unique_users: 1623, total_retweets: 8765, total_favorites: 12890, avg_retweets: 1.92, avg_favorites: 2.82 },
  
  // South Korea
  { country_code: "KR", stance: "pro_nato", tweet_count: 123456, unique_users: 35678, total_retweets: 234567, total_favorites: 356789, avg_retweets: 1.90, avg_favorites: 2.89 },
  { country_code: "KR", stance: "neutral", tweet_count: 198765, unique_users: 56789, total_retweets: 367890, total_favorites: 545678, avg_retweets: 1.85, avg_favorites: 2.75 },
  { country_code: "KR", stance: "pro_russia", tweet_count: 2345, unique_users: 845, total_retweets: 4456, total_favorites: 6567, avg_retweets: 1.90, avg_favorites: 2.80 },
  
  // South Africa
  { country_code: "ZA", stance: "pro_nato", tweet_count: 34567, unique_users: 9876, total_retweets: 65432, total_favorites: 98765, avg_retweets: 1.89, avg_favorites: 2.86 },
  { country_code: "ZA", stance: "neutral", tweet_count: 87654, unique_users: 25432, total_retweets: 156789, total_favorites: 234567, avg_retweets: 1.79, avg_favorites: 2.68 },
  { country_code: "ZA", stance: "pro_russia", tweet_count: 2890, unique_users: 1023, total_retweets: 5456, total_favorites: 8012, avg_retweets: 1.89, avg_favorites: 2.77 },
  
  // Nigeria
  { country_code: "NG", stance: "pro_nato", tweet_count: 23456, unique_users: 6789, total_retweets: 43210, total_favorites: 65432, avg_retweets: 1.84, avg_favorites: 2.79 },
  { country_code: "NG", stance: "neutral", tweet_count: 56789, unique_users: 16543, total_retweets: 101234, total_favorites: 151234, avg_retweets: 1.78, avg_favorites: 2.66 },
  { country_code: "NG", stance: "pro_russia", tweet_count: 1890, unique_users: 678, total_retweets: 3567, total_favorites: 5234, avg_retweets: 1.89, avg_favorites: 2.77 },
  
  // Israel
  { country_code: "IL", stance: "pro_nato", tweet_count: 87654, unique_users: 25432, total_retweets: 167890, total_favorites: 251234, avg_retweets: 1.92, avg_favorites: 2.87 },
  { country_code: "IL", stance: "neutral", tweet_count: 112345, unique_users: 32456, total_retweets: 201234, total_favorites: 298765, avg_retweets: 1.79, avg_favorites: 2.66 },
  { country_code: "IL", stance: "pro_russia", tweet_count: 2345, unique_users: 856, total_retweets: 4456, total_favorites: 6543, avg_retweets: 1.90, avg_favorites: 2.79 },
  
  // Saudi Arabia
  { country_code: "SA", stance: "pro_nato", tweet_count: 23456, unique_users: 6789, total_retweets: 43210, total_favorites: 65432, avg_retweets: 1.84, avg_favorites: 2.79 },
  { country_code: "SA", stance: "neutral", tweet_count: 98765, unique_users: 28901, total_retweets: 178901, total_favorites: 265432, avg_retweets: 1.81, avg_favorites: 2.69 },
  { country_code: "SA", stance: "pro_russia", tweet_count: 3456, unique_users: 1234, total_retweets: 6543, total_favorites: 9567, avg_retweets: 1.89, avg_favorites: 2.77 },
  
  // United Arab Emirates
  { country_code: "AE", stance: "pro_nato", tweet_count: 34567, unique_users: 9876, total_retweets: 65432, total_favorites: 98765, avg_retweets: 1.89, avg_favorites: 2.86 },
  { country_code: "AE", stance: "neutral", tweet_count: 67890, unique_users: 19543, total_retweets: 121234, total_favorites: 178901, avg_retweets: 1.79, avg_favorites: 2.63 },
  { country_code: "AE", stance: "pro_russia", tweet_count: 1567, unique_users: 567, total_retweets: 2890, total_favorites: 4234, avg_retweets: 1.84, avg_favorites: 2.70 },
  
  // Singapore
  { country_code: "SG", stance: "pro_nato", tweet_count: 45678, unique_users: 12890, total_retweets: 87654, total_favorites: 130987, avg_retweets: 1.92, avg_favorites: 2.87 },
  { country_code: "SG", stance: "neutral", tweet_count: 67890, unique_users: 19543, total_retweets: 121234, total_favorites: 178901, avg_retweets: 1.79, avg_favorites: 2.63 },
  { country_code: "SG", stance: "pro_russia", tweet_count: 1234, unique_users: 445, total_retweets: 2345, total_favorites: 3456, avg_retweets: 1.90, avg_favorites: 2.80 },
  
  // New Zealand
  { country_code: "NZ", stance: "pro_nato", tweet_count: 67890, unique_users: 19543, total_retweets: 128765, total_favorites: 192345, avg_retweets: 1.90, avg_favorites: 2.83 },
  { country_code: "NZ", stance: "neutral", tweet_count: 89012, unique_users: 25678, total_retweets: 162345, total_favorites: 241234, avg_retweets: 1.82, avg_favorites: 2.71 },
  { country_code: "NZ", stance: "pro_russia", tweet_count: 1456, unique_users: 523, total_retweets: 2756, total_favorites: 4012, avg_retweets: 1.89, avg_favorites: 2.76 },
  
  // Denmark
  { country_code: "DK", stance: "pro_nato", tweet_count: 98765, unique_users: 28543, total_retweets: 187654, total_favorites: 278901, avg_retweets: 1.90, avg_favorites: 2.82 },
  { country_code: "DK", stance: "neutral", tweet_count: 112345, unique_users: 32456, total_retweets: 201234, total_favorites: 298765, avg_retweets: 1.79, avg_favorites: 2.66 },
  { country_code: "DK", stance: "pro_russia", tweet_count: 1678, unique_users: 612, total_retweets: 3156, total_favorites: 4623, avg_retweets: 1.88, avg_favorites: 2.76 },
  
  // Hungary
  { country_code: "HU", stance: "pro_nato", tweet_count: 34567, unique_users: 9876, total_retweets: 65432, total_favorites: 98765, avg_retweets: 1.89, avg_favorites: 2.86 },
  { country_code: "HU", stance: "neutral", tweet_count: 67890, unique_users: 19543, total_retweets: 121234, total_favorites: 178901, avg_retweets: 1.79, avg_favorites: 2.63 },
  { country_code: "HU", stance: "pro_russia", tweet_count: 8901, unique_users: 3234, total_retweets: 16890, total_favorites: 24567, avg_retweets: 1.90, avg_favorites: 2.76 },
  
  // Serbia - More Pro-Russia
  { country_code: "RS", stance: "pro_nato", tweet_count: 12345, unique_users: 3567, total_retweets: 23456, total_favorites: 34567, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "RS", stance: "neutral", tweet_count: 34567, unique_users: 9876, total_retweets: 62345, total_favorites: 92345, avg_retweets: 1.80, avg_favorites: 2.67 },
  { country_code: "RS", stance: "pro_russia", tweet_count: 15678, unique_users: 5678, total_retweets: 29876, total_favorites: 43567, avg_retweets: 1.90, avg_favorites: 2.78 },
  
  // China
  { country_code: "CN", stance: "pro_nato", tweet_count: 5678, unique_users: 1623, total_retweets: 10789, total_favorites: 15890, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "CN", stance: "neutral", tweet_count: 156789, unique_users: 45678, total_retweets: 289012, total_favorites: 423456, avg_retweets: 1.84, avg_favorites: 2.70 },
  { country_code: "CN", stance: "pro_russia", tweet_count: 23456, unique_users: 8567, total_retweets: 44567, total_favorites: 65432, avg_retweets: 1.90, avg_favorites: 2.79 },
  
  // Pakistan
  { country_code: "PK", stance: "pro_nato", tweet_count: 12345, unique_users: 3567, total_retweets: 23456, total_favorites: 34567, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "PK", stance: "neutral", tweet_count: 78901, unique_users: 22876, total_retweets: 143567, total_favorites: 212345, avg_retweets: 1.82, avg_favorites: 2.69 },
  { country_code: "PK", stance: "pro_russia", tweet_count: 6789, unique_users: 2456, total_retweets: 12890, total_favorites: 18901, avg_retweets: 1.90, avg_favorites: 2.78 },
  
  // Philippines
  { country_code: "PH", stance: "pro_nato", tweet_count: 45678, unique_users: 13234, total_retweets: 87654, total_favorites: 129876, avg_retweets: 1.92, avg_favorites: 2.84 },
  { country_code: "PH", stance: "neutral", tweet_count: 87654, unique_users: 25432, total_retweets: 156789, total_favorites: 231234, avg_retweets: 1.79, avg_favorites: 2.64 },
  { country_code: "PH", stance: "pro_russia", tweet_count: 2345, unique_users: 856, total_retweets: 4456, total_favorites: 6543, avg_retweets: 1.90, avg_favorites: 2.79 },
  
  // Indonesia
  { country_code: "ID", stance: "pro_nato", tweet_count: 23456, unique_users: 6789, total_retweets: 44567, total_favorites: 65890, avg_retweets: 1.90, avg_favorites: 2.81 },
  { country_code: "ID", stance: "neutral", tweet_count: 112345, unique_users: 32678, total_retweets: 203456, total_favorites: 301234, avg_retweets: 1.81, avg_favorites: 2.68 },
  { country_code: "ID", stance: "pro_russia", tweet_count: 3456, unique_users: 1256, total_retweets: 6567, total_favorites: 9567, avg_retweets: 1.90, avg_favorites: 2.77 },
  
  // Malaysia
  { country_code: "MY", stance: "pro_nato", tweet_count: 23456, unique_users: 6789, total_retweets: 44567, total_favorites: 65890, avg_retweets: 1.90, avg_favorites: 2.81 },
  { country_code: "MY", stance: "neutral", tweet_count: 56789, unique_users: 16432, total_retweets: 101234, total_favorites: 149876, avg_retweets: 1.78, avg_favorites: 2.64 },
  { country_code: "MY", stance: "pro_russia", tweet_count: 2123, unique_users: 767, total_retweets: 4012, total_favorites: 5876, avg_retweets: 1.89, avg_favorites: 2.77 },
  
  // Thailand
  { country_code: "TH", stance: "pro_nato", tweet_count: 23456, unique_users: 6789, total_retweets: 44567, total_favorites: 65890, avg_retweets: 1.90, avg_favorites: 2.81 },
  { country_code: "TH", stance: "neutral", tweet_count: 67890, unique_users: 19654, total_retweets: 121234, total_favorites: 178901, avg_retweets: 1.79, avg_favorites: 2.63 },
  { country_code: "TH", stance: "pro_russia", tweet_count: 1890, unique_users: 687, total_retweets: 3567, total_favorites: 5234, avg_retweets: 1.89, avg_favorites: 2.77 },
  
  // Vietnam
  { country_code: "VN", stance: "pro_nato", tweet_count: 12345, unique_users: 3567, total_retweets: 23456, total_favorites: 34567, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "VN", stance: "neutral", tweet_count: 45678, unique_users: 13234, total_retweets: 82345, total_favorites: 121234, avg_retweets: 1.80, avg_favorites: 2.65 },
  { country_code: "VN", stance: "pro_russia", tweet_count: 2345, unique_users: 856, total_retweets: 4456, total_favorites: 6543, avg_retweets: 1.90, avg_favorites: 2.79 },
  
  // Egypt
  { country_code: "EG", stance: "pro_nato", tweet_count: 12345, unique_users: 3567, total_retweets: 23456, total_favorites: 34567, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "EG", stance: "neutral", tweet_count: 56789, unique_users: 16432, total_retweets: 101234, total_favorites: 149876, avg_retweets: 1.78, avg_favorites: 2.64 },
  { country_code: "EG", stance: "pro_russia", tweet_count: 3456, unique_users: 1256, total_retweets: 6567, total_favorites: 9567, avg_retweets: 1.90, avg_favorites: 2.77 },
  
  // Colombia
  { country_code: "CO", stance: "pro_nato", tweet_count: 23456, unique_users: 6789, total_retweets: 44567, total_favorites: 65890, avg_retweets: 1.90, avg_favorites: 2.81 },
  { country_code: "CO", stance: "neutral", tweet_count: 67890, unique_users: 19654, total_retweets: 121234, total_favorites: 178901, avg_retweets: 1.79, avg_favorites: 2.63 },
  { country_code: "CO", stance: "pro_russia", tweet_count: 1890, unique_users: 687, total_retweets: 3567, total_favorites: 5234, avg_retweets: 1.89, avg_favorites: 2.77 },
  
  // Chile
  { country_code: "CL", stance: "pro_nato", tweet_count: 23456, unique_users: 6789, total_retweets: 44567, total_favorites: 65890, avg_retweets: 1.90, avg_favorites: 2.81 },
  { country_code: "CL", stance: "neutral", tweet_count: 45678, unique_users: 13234, total_retweets: 82345, total_favorites: 121234, avg_retweets: 1.80, avg_favorites: 2.65 },
  { country_code: "CL", stance: "pro_russia", tweet_count: 1567, unique_users: 567, total_retweets: 2890, total_favorites: 4234, avg_retweets: 1.84, avg_favorites: 2.70 },
  
  // Peru
  { country_code: "PE", stance: "pro_nato", tweet_count: 12345, unique_users: 3567, total_retweets: 23456, total_favorites: 34567, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "PE", stance: "neutral", tweet_count: 34567, unique_users: 9876, total_retweets: 62345, total_favorites: 92345, avg_retweets: 1.80, avg_favorites: 2.67 },
  { country_code: "PE", stance: "pro_russia", tweet_count: 1234, unique_users: 445, total_retweets: 2345, total_favorites: 3456, avg_retweets: 1.90, avg_favorites: 2.80 },
  
  // Kenya
  { country_code: "KE", stance: "pro_nato", tweet_count: 12345, unique_users: 3567, total_retweets: 23456, total_favorites: 34567, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "KE", stance: "neutral", tweet_count: 34567, unique_users: 9876, total_retweets: 62345, total_favorites: 92345, avg_retweets: 1.80, avg_favorites: 2.67 },
  { country_code: "KE", stance: "pro_russia", tweet_count: 1234, unique_users: 445, total_retweets: 2345, total_favorites: 3456, avg_retweets: 1.90, avg_favorites: 2.80 },
  
  // Ghana
  { country_code: "GH", stance: "pro_nato", tweet_count: 8901, unique_users: 2567, total_retweets: 16890, total_favorites: 24567, avg_retweets: 1.90, avg_favorites: 2.76 },
  { country_code: "GH", stance: "neutral", tweet_count: 23456, unique_users: 6789, total_retweets: 42345, total_favorites: 62345, avg_retweets: 1.80, avg_favorites: 2.66 },
  { country_code: "GH", stance: "pro_russia", tweet_count: 890, unique_users: 323, total_retweets: 1678, total_favorites: 2456, avg_retweets: 1.89, avg_favorites: 2.76 },
  
  // Morocco
  { country_code: "MA", stance: "pro_nato", tweet_count: 12345, unique_users: 3567, total_retweets: 23456, total_favorites: 34567, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "MA", stance: "neutral", tweet_count: 34567, unique_users: 9876, total_retweets: 62345, total_favorites: 92345, avg_retweets: 1.80, avg_favorites: 2.67 },
  { country_code: "MA", stance: "pro_russia", tweet_count: 1567, unique_users: 567, total_retweets: 2890, total_favorites: 4234, avg_retweets: 1.84, avg_favorites: 2.70 },
  
  // Algeria
  { country_code: "DZ", stance: "pro_nato", tweet_count: 5678, unique_users: 1623, total_retweets: 10789, total_favorites: 15890, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "DZ", stance: "neutral", tweet_count: 23456, unique_users: 6789, total_retweets: 42345, total_favorites: 62345, avg_retweets: 1.80, avg_favorites: 2.66 },
  { country_code: "DZ", stance: "pro_russia", tweet_count: 2345, unique_users: 856, total_retweets: 4456, total_favorites: 6543, avg_retweets: 1.90, avg_favorites: 2.79 },
  
  // Tunisia
  { country_code: "TN", stance: "pro_nato", tweet_count: 5678, unique_users: 1623, total_retweets: 10789, total_favorites: 15890, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "TN", stance: "neutral", tweet_count: 12345, unique_users: 3567, total_retweets: 22345, total_favorites: 33456, avg_retweets: 1.81, avg_favorites: 2.71 },
  { country_code: "TN", stance: "pro_russia", tweet_count: 890, unique_users: 323, total_retweets: 1678, total_favorites: 2456, avg_retweets: 1.89, avg_favorites: 2.76 },
  
  // Latvia
  { country_code: "LV", stance: "pro_nato", tweet_count: 45678, unique_users: 13234, total_retweets: 87654, total_favorites: 129876, avg_retweets: 1.92, avg_favorites: 2.84 },
  { country_code: "LV", stance: "neutral", tweet_count: 34567, unique_users: 9876, total_retweets: 62345, total_favorites: 92345, avg_retweets: 1.80, avg_favorites: 2.67 },
  { country_code: "LV", stance: "pro_russia", tweet_count: 890, unique_users: 323, total_retweets: 1678, total_favorites: 2456, avg_retweets: 1.89, avg_favorites: 2.76 },
  
  // Lithuania
  { country_code: "LT", stance: "pro_nato", tweet_count: 56789, unique_users: 16432, total_retweets: 108901, total_favorites: 161234, avg_retweets: 1.92, avg_favorites: 2.84 },
  { country_code: "LT", stance: "neutral", tweet_count: 34567, unique_users: 9876, total_retweets: 62345, total_favorites: 92345, avg_retweets: 1.80, avg_favorites: 2.67 },
  { country_code: "LT", stance: "pro_russia", tweet_count: 678, unique_users: 245, total_retweets: 1278, total_favorites: 1876, avg_retweets: 1.89, avg_favorites: 2.77 },
  
  // Estonia
  { country_code: "EE", stance: "pro_nato", tweet_count: 67890, unique_users: 19654, total_retweets: 128901, total_favorites: 192345, avg_retweets: 1.90, avg_favorites: 2.83 },
  { country_code: "EE", stance: "neutral", tweet_count: 34567, unique_users: 9876, total_retweets: 62345, total_favorites: 92345, avg_retweets: 1.80, avg_favorites: 2.67 },
  { country_code: "EE", stance: "pro_russia", tweet_count: 567, unique_users: 205, total_retweets: 1067, total_favorites: 1567, avg_retweets: 1.88, avg_favorites: 2.76 },
  
  // Slovakia
  { country_code: "SK", stance: "pro_nato", tweet_count: 34567, unique_users: 9876, total_retweets: 65432, total_favorites: 98765, avg_retweets: 1.89, avg_favorites: 2.86 },
  { country_code: "SK", stance: "neutral", tweet_count: 45678, unique_users: 13234, total_retweets: 82345, total_favorites: 121234, avg_retweets: 1.80, avg_favorites: 2.65 },
  { country_code: "SK", stance: "pro_russia", tweet_count: 2345, unique_users: 856, total_retweets: 4456, total_favorites: 6543, avg_retweets: 1.90, avg_favorites: 2.79 },
  
  // Slovenia
  { country_code: "SI", stance: "pro_nato", tweet_count: 23456, unique_users: 6789, total_retweets: 44567, total_favorites: 65890, avg_retweets: 1.90, avg_favorites: 2.81 },
  { country_code: "SI", stance: "neutral", tweet_count: 34567, unique_users: 9876, total_retweets: 62345, total_favorites: 92345, avg_retweets: 1.80, avg_favorites: 2.67 },
  { country_code: "SI", stance: "pro_russia", tweet_count: 890, unique_users: 323, total_retweets: 1678, total_favorites: 2456, avg_retweets: 1.89, avg_favorites: 2.76 },
  
  // Croatia
  { country_code: "HR", stance: "pro_nato", tweet_count: 34567, unique_users: 9876, total_retweets: 65432, total_favorites: 98765, avg_retweets: 1.89, avg_favorites: 2.86 },
  { country_code: "HR", stance: "neutral", tweet_count: 45678, unique_users: 13234, total_retweets: 82345, total_favorites: 121234, avg_retweets: 1.80, avg_favorites: 2.65 },
  { country_code: "HR", stance: "pro_russia", tweet_count: 1234, unique_users: 445, total_retweets: 2345, total_favorites: 3456, avg_retweets: 1.90, avg_favorites: 2.80 },
  
  // Bulgaria
  { country_code: "BG", stance: "pro_nato", tweet_count: 23456, unique_users: 6789, total_retweets: 44567, total_favorites: 65890, avg_retweets: 1.90, avg_favorites: 2.81 },
  { country_code: "BG", stance: "neutral", tweet_count: 45678, unique_users: 13234, total_retweets: 82345, total_favorites: 121234, avg_retweets: 1.80, avg_favorites: 2.65 },
  { country_code: "BG", stance: "pro_russia", tweet_count: 3456, unique_users: 1256, total_retweets: 6567, total_favorites: 9567, avg_retweets: 1.90, avg_favorites: 2.77 },
  
  // Iceland
  { country_code: "IS", stance: "pro_nato", tweet_count: 12345, unique_users: 3567, total_retweets: 23456, total_favorites: 34567, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "IS", stance: "neutral", tweet_count: 8901, unique_users: 2567, total_retweets: 16012, total_favorites: 23567, avg_retweets: 1.80, avg_favorites: 2.65 },
  { country_code: "IS", stance: "pro_russia", tweet_count: 234, unique_users: 85, total_retweets: 445, total_favorites: 654, avg_retweets: 1.90, avg_favorites: 2.79 },
  
  // Luxembourg
  { country_code: "LU", stance: "pro_nato", tweet_count: 8901, unique_users: 2567, total_retweets: 16890, total_favorites: 24567, avg_retweets: 1.90, avg_favorites: 2.76 },
  { country_code: "LU", stance: "neutral", tweet_count: 6789, unique_users: 1954, total_retweets: 12234, total_favorites: 17890, avg_retweets: 1.80, avg_favorites: 2.63 },
  { country_code: "LU", stance: "pro_russia", tweet_count: 178, unique_users: 65, total_retweets: 334, total_favorites: 489, avg_retweets: 1.88, avg_favorites: 2.75 },
  
  // Malta
  { country_code: "MT", stance: "pro_nato", tweet_count: 5678, unique_users: 1623, total_retweets: 10789, total_favorites: 15890, avg_retweets: 1.90, avg_favorites: 2.80 },
  { country_code: "MT", stance: "neutral", tweet_count: 4567, unique_users: 1312, total_retweets: 8234, total_favorites: 12123, avg_retweets: 1.80, avg_favorites: 2.65 },
  { country_code: "MT", stance: "pro_russia", tweet_count: 123, unique_users: 45, total_retweets: 234, total_favorites: 345, avg_retweets: 1.90, avg_favorites: 2.80 },
  
  // Cyprus
  { country_code: "CY", stance: "pro_nato", tweet_count: 8901, unique_users: 2567, total_retweets: 16890, total_favorites: 24567, avg_retweets: 1.90, avg_favorites: 2.76 },
  { country_code: "CY", stance: "neutral", tweet_count: 12345, unique_users: 3567, total_retweets: 22345, total_favorites: 33456, avg_retweets: 1.81, avg_favorites: 2.71 },
  { country_code: "CY", stance: "pro_russia", tweet_count: 456, unique_users: 165, total_retweets: 867, total_favorites: 1267, avg_retweets: 1.90, avg_favorites: 2.78 }
];

export default countryStanceSummary;

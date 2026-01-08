# Twitter Stance Analysis: Russia-Ukraine Conflict
## Interactive Visualization Dashboard

---

## 📋 Table of Contents
- [Problem Statement](#problem-statement)
- [Dataset Overview](#dataset-overview)
- [Data Tables](#data-tables)
- [Visualization Goals](#visualization-goals)
- [Dashboard Features](#dashboard-features)
- [User Interactions](#user-interactions)
- [Technical Implementation](#technical-implementation)
- [Getting Started](#getting-started)

---

## 🎯 Problem Statement

The Russia-Ukraine conflict has generated massive discourse on social media platforms, particularly Twitter. Understanding public sentiment and stance distribution across different countries and time periods is crucial for:

- Analyzing geopolitical sentiment patterns
- Understanding information warfare and narrative spread
- Identifying regional bias and stance clustering
- Tracking temporal evolution of public opinion

This project aims to create an interactive visualization dashboard that allows users to explore Twitter data related to the Russia-Ukraine conflict, with a focus on geographical and temporal stance distribution.

---

## 📊 Dataset Overview

### Raw Data Statistics
- **Total Records**: 44,416,753 tweets
- **Time Period**: February 2022 - May 2023
- **Countries**: 70 distinct countries
- **Stance Categories**: 
  - Pro-NATO: 9,994,853 tweets (22.5%)
  - Pro-Russia: 353,985 tweets (0.8%)
  - Neutral: 34,067,915 tweets (76.7%)

### Data Fields
- **User Information**: userid, username, location, followers, following
- **Tweet Content**: text, hashtags, language, coordinates
- **Engagement Metrics**: retweetcount, favorite_count
- **Classification**: stance (pro_nato, pro_russia, neutral)
- **Geographic**: country_code (ISO 2-letter codes)
- **Temporal**: year, month, day, tweetcreatedts

---

## 🗄️ Data Tables

All tables are pre-aggregated in AWS Athena for performance optimization.
database: `adv_viz`

### 1. `country_stance_summary`
Aggregated stance distribution by country.

**Schema**:
```sql
country_code        VARCHAR  -- ISO 2-letter country code (e.g., 'US', 'PL')
stance              VARCHAR  -- 'pro_nato', 'pro_russia', 'neutral'
tweet_count         BIGINT   -- Total number of tweets
unique_users        BIGINT   -- Number of unique users
total_retweets      BIGINT   -- Sum of all retweets
total_favorites     BIGINT   -- Sum of all favorites
avg_retweets        DOUBLE   -- Average retweets per tweet
avg_favorites       DOUBLE   -- Average favorites per tweet
```

**Example Query**:
```sql
SELECT * FROM country_stance_summary WHERE country_code = 'US';
```

**Use Case**: Powers the world map choropleth and country detail panel.

---

### 2. `temporal_stance_summary`
Daily aggregated stance distribution across all countries.

**Schema**:
```sql
year                INT      -- Year (e.g., 2022, 2023)
month               INT      -- Month (1-12)
day                 INT      -- Day (1-31)
stance              VARCHAR  -- 'pro_nato', 'pro_russia', 'neutral'
tweet_count         BIGINT   -- Number of tweets for this day
unique_users        BIGINT   -- Unique users for this day
```

**Example Query**:
```sql
SELECT year, month, stance, SUM(tweet_count) as total
FROM temporal_stance_summary
WHERE year = 2022 AND month >= 3 AND month <= 6
GROUP BY year, month, stance
ORDER BY year, month;
```

**Use Case**: Powers the temporal trend stacked area chart in summary statistics.

---

### 3. `country_stance_temporal`
Monthly stance distribution per country.

**Schema**:
```sql
country_code        VARCHAR  -- ISO 2-letter country code
stance              VARCHAR  -- 'pro_nato', 'pro_russia', 'neutral'
year                INT      -- Year
month               INT      -- Month (1-12)
tweet_count         BIGINT   -- Number of tweets
unique_users        BIGINT   -- Unique users
```

**Example Query**:
```sql
SELECT year, month, stance, tweet_count
FROM country_stance_temporal
WHERE country_code = 'PL'
ORDER BY year, month;
```

**Use Case**: Powers the country-specific timeline in the detail panel.

---

### 4. `hashtag_aggregated`
Hashtag usage by country, stance, and time (for future enhancements).

**Schema**:
```sql
hashtag             VARCHAR  -- Hashtag text (lowercase, no #)
stance              VARCHAR  -- 'pro_nato', 'pro_russia', 'neutral'
country_code        VARCHAR  -- ISO 2-letter country code
year                INT      -- Year
month               INT      -- Month (1-12)
hashtag_count       BIGINT   -- Number of times hashtag used
unique_users_using  BIGINT   -- Number of unique users using hashtag
```

**Note**: Currently not used in the dashboard but available for future hashtag analysis features.

---

## 🎯 Visualization Goals

### Primary Objectives
1. **Geographic Stance Distribution**: Visualize which countries lean pro-NATO, pro-Russia, or neutral
2. **Tweet Volume Analysis**: Show which countries have the most discourse activity
3. **Temporal Trends**: Track how stance distribution evolved over time
4. **Country Deep-Dive**: Allow detailed exploration of individual countries

### Design Principles
- **Overview First**: Start with a global view of all data
- **Zoom and Filter**: Allow users to narrow down by time and stance
- **Details on Demand**: Provide detailed breakdowns when users click countries
- **Interactive Updates**: All components update dynamically based on filters

---

## 🖥️ Dashboard Features

### 1. **Interactive World Map (Choropleth)**
- **Color Hue**: Represents dominant stance
  - Blue = Pro-NATO majority
  - Red = Pro-Russia majority
  - Gray = Neutral majority
- **Color Intensity**: Represents tweet volume
  - Darker colors = Higher tweet volume
  - Lighter colors = Lower tweet volume
- **Mixed Stances**: Striped pattern or gradient for countries without clear majority

### 2. **Filter Panel**
- **Date Range Slider**: Select specific time periods (Feb 2022 - May 2023)
- **Stance Checkboxes**: Filter by stance type (Pro-NATO, Pro-Russia, Neutral)
- **Reset Button**: Clear all filters and return to initial state

### 3. **Summary Statistics Panel**
- **Key Metrics**: Total tweets, number of countries, stance distribution
- **Temporal Trend Chart**: Stacked area chart showing tweet volume over time by stance
- **Dynamic Updates**: All statistics recalculate based on active filters

### 4. **Country Detail Panel**
Opens when a country is clicked, showing:
- Stance breakdown (percentages and counts)
- Engagement metrics (avg retweets, favorites)
- Country-specific timeline (how stance evolved monthly)

---

## 🔄 User Interactions

### Default State (No Filters)
```
✓ All countries visible on map
✓ Full date range: Feb 2022 - May 2023
✓ All stances shown: Pro-NATO, Pro-Russia, Neutral
✓ Summary shows: 44,416,753 total tweets across 70 countries
✓ Temporal trend displays complete timeline
```

### Interaction Flow

#### 1️⃣ Hovering Over a Country
```
User Action: Mouse hovers over Poland
Dashboard Response:
  → Tooltip appears showing:
     🇵🇱 Poland
     ─────────────────
     Total: 1,234,567
     Pro-NATO: 45.2%
     Neutral: 42.1%
     Pro-Russia: 12.7%
     ─────────────────
     Click for details
```

#### 2️⃣ Clicking a Country
```
User Action: Click on Poland
Dashboard Response:
  → Country detail panel opens at bottom
  → Shows detailed stance breakdown with exact counts
  → Displays country-specific timeline chart
  → Shows engagement metrics (avg retweets, favorites)
  
User Action: Click on another country (e.g., United States)
Dashboard Response:
  → Detail panel updates with US data
  → Previous country (Poland) is deselected
  
User Action: Click [✕ Close] button
Dashboard Response:
  → Detail panel closes
  → Map returns to overview mode
```

#### 3️⃣ Adjusting Date Range
```
User Action: Move date slider to Mar 2022 - Aug 2022
Dashboard Response:
  → Map updates: Countries with no data in this period become white
  → Map colors/intensity recalculate based on filtered data
  → Summary stats update:
     • Total tweets changes
     • Stance percentages recalculate
  → Temporal trend zooms to selected period
  → If country detail is open, its data updates too
```

#### 4️⃣ Filtering by Stance
```
User Action: Uncheck "Pro-Russia" checkbox
Dashboard Response:
  → Map removes red coloring
  → Countries now show only Pro-NATO vs Neutral
  → Summary stats recalculate without Pro-Russia tweets
  → Temporal trend removes red layer
  → Country detail panel (if open) excludes Pro-Russia data
  
User Action: Check only "Pro-NATO"
Dashboard Response:
  → Map shows only blue-colored countries
  → Only countries with Pro-NATO tweets visible
  → All other countries become white (no data)
```

#### 5️⃣ Combined Filters
```
User Action: 
  - Date: Jun 2022 - Dec 2022
  - Stance: Only "Pro-NATO" and "Neutral"
  
Dashboard Response:
  → Map shows filtered view
  → Summary: "Showing 15,234,567 tweets from 68 countries"
  → All charts and stats reflect combined filters
  → Country details respect all active filters
```

#### 6️⃣ Resetting Filters
```
User Action: Click "Reset All Filters"
Dashboard Response:
  → Date range returns to full period
  → All stance checkboxes become checked
  → Map returns to initial state
  → Summary stats show complete dataset
  → Detail panel (if open) shows unfiltered data
```

---

## 🛠️ Technical Implementation

### Technology Stack
- **Frontend Framework**: React with Hooks (useState, useEffect)
- **Visualization Libraries**:
  - D3.js for world map choropleth
  - Recharts for temporal charts and bar charts
- **Styling**: Tailwind CSS (core utility classes only)
- **Data Format**: JSON (exported from Athena tables)

### Component Architecture
```
App
├── FilterPanel
│   ├── DateRangeSlider
│   └── StanceCheckboxes
├── Dashboard
│   ├── WorldMap (D3.js)
│   └── SummaryPanel
│       ├── MetricsCards
│       └── TemporalTrendChart (Recharts)
└── CountryDetailPanel
    ├── StanceBreakdownChart
    └── CountryTimelineChart
```

### State Management
```javascript
// Main application state
const [filters, setFilters] = useState({
  dateRange: [minDate, maxDate],
  stances: ['pro_nato', 'pro_russia', 'neutral']
});

const [selectedCountry, setSelectedCountry] = useState(null);
const [filteredData, setFilteredData] = useState(null);

// Derived data computed from filters
useEffect(() => {
  const filtered = applyFilters(rawData, filters);
  setFilteredData(filtered);
}, [filters]);
```

### Data Loading Strategy
1. Load all pre-aggregated tables on initialization
2. Perform filtering in browser (data is small after aggregation)
3. No need for repeated server queries
4. Fast, responsive interactions

---

## 🚀 Getting Started

### Prerequisites
1. Export data from Athena tables to JSON format:
   ```sql
   -- Export country_stance_summary
   UNLOAD (SELECT * FROM country_stance_summary)
   TO 's3://your-bucket/country_stance_summary.json'
   FORMAT JSON;
   
   -- Repeat for other tables
   ```

2. Place JSON files in the project data directory

### Data Format Expected

**country_stance_summary.json**:
```json
[
  {
    "country_code": "US",
    "stance": "pro_nato",
    "tweet_count": 1234567,
    "unique_users": 456789,
    "total_retweets": 9876543,
    "total_favorites": 12345678,
    "avg_retweets": 8.0,
    "avg_favorites": 10.0
  },
  ...
]
```

**temporal_stance_summary.json**:
```json
[
  {
    "year": 2022,
    "month": 3,
    "day": 1,
    "stance": "pro_nato",
    "tweet_count": 45678,
    "unique_users": 23456
  },
  ...
]
```

**country_stance_temporal.json**:
```json
[
  {
    "country_code": "PL",
    "stance": "pro_nato",
    "year": 2022,
    "month": 3,
    "tweet_count": 12345,
    "unique_users": 5678
  },
  ...
]
```

### Running the Dashboard
1. Place the JSON files in the appropriate location
2. Load the React artifact
3. Interact with the dashboard using the described interaction patterns

---

## 📈 Future Enhancements

Potential features for future iterations:
- Hashtag cloud/analysis using `hashtag_aggregated` table
- Region-based filtering (Europe, Asia, Americas, etc.)
- Network analysis of retweet patterns
- Sentiment analysis integration
- Export filtered data functionality
- Comparison mode (compare two countries side-by-side)

---

## 📝 Notes

- **Country Codes**: Standard ISO 3166-1 alpha-2 codes (e.g., US, GB, PL, DE)
- **Date Format**: All dates are in YYYY-MM-DD format
- **Stance Classification**: Tweets are pre-classified using ML/rule-based methods
- **Performance**: Dashboard is optimized for 70 countries and ~1.5 years of daily data
- **Browser Support**: Modern browsers with ES6+ support (Chrome, Firefox, Safari, Edge)

---

## 🤝 Contributing

This visualization is designed to be extensible. Key areas for contribution:
- Enhanced map projections and styling
- Additional chart types for deeper analysis
- Performance optimization for larger datasets
- Accessibility improvements (ARIA labels, keyboard navigation)

---

## 📄 License

[Specify your license here]

---

## 📧 Contact

[Add contact information or links to project repository]

---

**Last Updated**: January 2026
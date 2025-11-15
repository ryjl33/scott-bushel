// Mock dining hall data service
// Simulates real-time occupancy based on typical dining patterns

export type BusynessLevel = 'low' | 'moderate' | 'busy' | 'packed';

export interface OccupancyData {
  current: number;
  capacity: number;
  percentage: number;
  level: BusynessLevel;
  timestamp: Date;
}

export interface HourlyPrediction {
  hour: number;
  occupancy: number;
  level: BusynessLevel;
}

export interface HistoricalData {
  hour: number;
  avgOccupancy: number;
  day?: string;
}

const CAPACITY = 500;

// Typical dining hall patterns
const WEEKDAY_PATTERN = {
  7: 0.15,  // 7am - light breakfast
  8: 0.25,
  9: 0.20,
  10: 0.10,
  11: 0.35,  // 11am - lunch rush starts
  12: 0.65,  // noon - peak lunch
  13: 0.55,
  14: 0.30,
  15: 0.15,
  16: 0.20,
  17: 0.45,  // 5pm - dinner starts
  18: 0.75,  // 6pm - peak dinner
  19: 0.65,  // 7pm - still busy
  20: 0.40,
  21: 0.20,
  22: 0.10,
};

const WEEKEND_PATTERN = {
  9: 0.20,   // brunch
  10: 0.35,
  11: 0.45,
  12: 0.55,  // peak brunch
  13: 0.40,
  14: 0.25,
  15: 0.15,
  16: 0.20,
  17: 0.40,
  18: 0.60,  // dinner
  19: 0.50,
  20: 0.30,
  21: 0.15,
};

function getBusynessLevel(percentage: number): BusynessLevel {
  if (percentage < 0.3) return 'low';
  if (percentage < 0.6) return 'moderate';
  if (percentage < 0.8) return 'busy';
  return 'packed';
}

function getPattern(date: Date = new Date()) {
  const day = date.getDay();
  return (day === 0 || day === 6) ? WEEKEND_PATTERN : WEEKDAY_PATTERN;
}

export function getCurrentOccupancy(): OccupancyData {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  
  const pattern = getPattern(now);
  const baseOccupancy = (pattern[hour as keyof typeof pattern] || 0.1) * CAPACITY;
  
  // Add some randomness and time-based variation
  const minuteVariation = Math.sin((minutes / 60) * Math.PI) * 0.15;
  const randomVariation = (Math.random() - 0.5) * 0.2;
  
  const current = Math.round(baseOccupancy * (1 + minuteVariation + randomVariation));
  const percentage = current / CAPACITY;
  
  return {
    current: Math.max(0, Math.min(CAPACITY, current)),
    capacity: CAPACITY,
    percentage,
    level: getBusynessLevel(percentage),
    timestamp: now,
  };
}

export function getTodayPredictions(): HourlyPrediction[] {
  const now = new Date();
  const currentHour = now.getHours();
  const pattern = getPattern(now);
  
  const predictions: HourlyPrediction[] = [];
  
  // Generate predictions for remaining hours of the day
  for (let hour = currentHour; hour <= 22; hour++) {
    const occupancy = Math.round((pattern[hour as keyof typeof pattern] || 0.1) * CAPACITY);
    predictions.push({
      hour,
      occupancy,
      level: getBusynessLevel(occupancy / CAPACITY),
    });
  }
  
  return predictions;
}

export function getHistoricalTrends(view: 'hourly' | 'daily' | 'weekly' = 'hourly'): HistoricalData[] {
  if (view === 'hourly') {
    // Average occupancy by hour across all days
    return Object.entries(WEEKDAY_PATTERN).map(([hour, percentage]) => ({
      hour: parseInt(hour),
      avgOccupancy: Math.round(percentage * CAPACITY),
    }));
  }
  
  if (view === 'daily') {
    // Average by day of week
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map((day, index) => {
      const isWeekend = index === 0 || index === 6;
      const pattern = isWeekend ? WEEKEND_PATTERN : WEEKDAY_PATTERN;
      const avgPercentage = Object.values(pattern).reduce((a, b) => a + b, 0) / Object.values(pattern).length;
      return {
        hour: index,
        day,
        avgOccupancy: Math.round(avgPercentage * CAPACITY),
      };
    });
  }
  
  // Weekly view - last 7 days
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const pattern = isWeekend ? WEEKEND_PATTERN : WEEKDAY_PATTERN;
    const avgPercentage = Object.values(pattern).reduce((a, b) => a + b, 0) / Object.values(pattern).length;
    
    return {
      hour: i,
      day: date.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
      avgOccupancy: Math.round(avgPercentage * CAPACITY * (0.9 + Math.random() * 0.2)),
    };
  });
}

export function getInsights(): string[] {
  const now = new Date();
  const day = now.getDay();
  const isWeekend = day === 0 || day === 6;
  
  return [
    isWeekend 
      ? "🥞 Weekend brunch hits peak from 11am-1pm"
      : "🍕 Scott is usually busiest from 6-7pm on weekdays",
    "😌 Best time to visit? Try 2-4pm for a chill experience",
    "🐂 Stampede hours are 12-1pm (lunch) and 6-7pm (dinner)",
    isWeekend
      ? "☕ Quietest times: before 9am and after 8pm"
      : "🌅 Early birds (7-9am) avoid the crowds",
    "📊 Average visit duration: 35 minutes",
    `${isWeekend ? '🎉' : '📚'} ${isWeekend ? 'Weekends' : 'Weekdays'} average ${isWeekend ? '180' : '220'} daily visits`,
  ];
}

export function formatTime(hour: number): string {
  if (hour === 0) return '12am';
  if (hour === 12) return '12pm';
  if (hour < 12) return `${hour}am`;
  return `${hour - 12}pm`;
}

// Mock dining hall data service
// Simulates real-time occupancy based on typical dining patterns

export type DiningHall = 'scott' | 'morrill' | 'kennedy';
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

export interface MenuItem {
  name: string;
  station: string;
  category: 'entree' | 'side' | 'dessert' | 'drink' | 'salad';
  dietary?: string[];
}

export interface MenuData {
  meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Late Night';
  items: MenuItem[];
  lastUpdated: Date;
}

export interface StationStatus {
  station: string;
  waitTime: number; // in minutes
  foodLevel: 'full' | 'moderate' | 'low';
  outOfStock: string[];
}

const CAPACITIES: Record<DiningHall, number> = {
  scott: 500,
  morrill: 450,
  kennedy: 400,
};

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

// Mock menu data
export const BREAKFAST_MENU: MenuItem[] = [
  { name: "Scrambled Eggs", station: "Hot Bar", category: "entree" },
  { name: "French Toast", station: "Hot Bar", category: "entree" },
  { name: "Turkey Sausage", station: "Hot Bar", category: "entree" },
  { name: "Hash Browns", station: "Hot Bar", category: "side" },
  { name: "Fresh Fruit", station: "Salad Bar", category: "side", dietary: ["V", "VG"] },
  { name: "Yogurt Parfait", station: "Salad Bar", category: "dessert", dietary: ["V"] },
  { name: "Orange Juice", station: "Beverage", category: "drink", dietary: ["V", "VG"] },
];

export const LUNCH_MENU: MenuItem[] = [
  { name: "Grilled Chicken Breast", station: "Grill", category: "entree" },
  { name: "Veggie Burger", station: "Grill", category: "entree", dietary: ["V", "VG"] },
  { name: "Pasta Marinara", station: "Italian", category: "entree", dietary: ["V"] },
  { name: "Pizza (Pepperoni)", station: "Pizza", category: "entree" },
  { name: "Caesar Salad", station: "Salad Bar", category: "salad", dietary: ["V"] },
  { name: "Sweet Potato Fries", station: "Sides", category: "side", dietary: ["V", "VG"] },
  { name: "Chocolate Chip Cookies", station: "Dessert", category: "dessert", dietary: ["V"] },
  { name: "Iced Tea", station: "Beverage", category: "drink", dietary: ["V", "VG"] },
];

export const DINNER_MENU: MenuItem[] = [
  { name: "Beef Stir Fry", station: "Asian Station", category: "entree" },
  { name: "Tofu Stir Fry", station: "Asian Station", category: "entree", dietary: ["V", "VG"] },
  { name: "Meatloaf", station: "Hot Bar", category: "entree" },
  { name: "Mashed Potatoes", station: "Hot Bar", category: "side", dietary: ["V"] },
  { name: "Steamed Broccoli", station: "Hot Bar", category: "side", dietary: ["V", "VG"] },
  { name: "Mixed Greens Salad", station: "Salad Bar", category: "salad", dietary: ["V", "VG"] },
  { name: "Brownie", station: "Dessert", category: "dessert", dietary: ["V"] },
  { name: "Lemonade", station: "Beverage", category: "drink", dietary: ["V", "VG"] },
];

export const LATE_NIGHT_MENU: MenuItem[] = [
  { name: "Chicken Tenders", station: "Late Night", category: "entree" },
  { name: "Mozzarella Sticks", station: "Late Night", category: "side", dietary: ["V"] },
  { name: "French Fries", station: "Late Night", category: "side", dietary: ["V", "VG"] },
  { name: "Soft Serve Ice Cream", station: "Dessert", category: "dessert", dietary: ["V"] },
];

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

export function getCurrentOccupancy(hall: DiningHall = 'scott'): OccupancyData {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  
  const capacity = CAPACITIES[hall];
  const pattern = getPattern(now);
  const baseOccupancy = (pattern[hour as keyof typeof pattern] || 0.1) * capacity;
  
  // Add some randomness and time-based variation
  const minuteVariation = Math.sin((minutes / 60) * Math.PI) * 0.15;
  const randomVariation = (Math.random() - 0.5) * 0.2;
  
  // Different halls have slightly different patterns
  const hallModifier = hall === 'scott' ? 1 : hall === 'morrill' ? 0.9 : 0.85;
  
  const current = Math.round(baseOccupancy * hallModifier * (1 + minuteVariation + randomVariation));
  const percentage = current / capacity;
  
  return {
    current: Math.max(0, Math.min(capacity, current)),
    capacity,
    percentage,
    level: getBusynessLevel(percentage),
    timestamp: now,
  };
}

export function getTodayPredictions(hall: DiningHall = 'scott'): HourlyPrediction[] {
  const now = new Date();
  const currentHour = now.getHours();
  const pattern = getPattern(now);
  const capacity = CAPACITIES[hall];
  const hallModifier = hall === 'scott' ? 1 : hall === 'morrill' ? 0.9 : 0.85;
  
  const predictions: HourlyPrediction[] = [];
  
  // Generate predictions for remaining hours of the day
  for (let hour = currentHour; hour <= 22; hour++) {
    const occupancy = Math.round((pattern[hour as keyof typeof pattern] || 0.1) * capacity * hallModifier);
    predictions.push({
      hour,
      occupancy,
      level: getBusynessLevel(occupancy / capacity),
    });
  }
  
  return predictions;
}

export function getHistoricalTrends(view: 'hourly' | 'daily' | 'weekly' = 'hourly', hall: DiningHall = 'scott'): HistoricalData[] {
  const capacity = CAPACITIES[hall];
  const hallModifier = hall === 'scott' ? 1 : hall === 'morrill' ? 0.9 : 0.85;
  
  if (view === 'hourly') {
    // Average occupancy by hour across all days
    return Object.entries(WEEKDAY_PATTERN).map(([hour, percentage]) => ({
      hour: parseInt(hour),
      avgOccupancy: Math.round(percentage * capacity * hallModifier),
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
        avgOccupancy: Math.round(avgPercentage * capacity * hallModifier),
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
      avgOccupancy: Math.round(avgPercentage * capacity * hallModifier * (0.9 + Math.random() * 0.2)),
    };
  });
}

export function getCurrentMenu(): MenuData {
  const now = new Date();
  const hour = now.getHours();
  
  let meal: MenuData['meal'];
  let items: MenuItem[];
  
  // Breakfast: until 11 AM
  // Lunch: 11 AM - 4 PM
  // Dinner: 4 PM - Closing (10 PM)
  // Late Night: After 10 PM
  if (hour >= 7 && hour < 11) {
    meal = 'Breakfast';
    items = BREAKFAST_MENU;
  } else if (hour >= 11 && hour < 16) {
    meal = 'Lunch';
    items = LUNCH_MENU;
  } else if (hour >= 16 && hour < 22) {
    meal = 'Dinner';
    items = DINNER_MENU;
  } else {
    meal = 'Late Night';
    items = LATE_NIGHT_MENU;
  }
  
  return {
    meal,
    items,
    lastUpdated: now,
  };
}

export function getStationStatus(hall: DiningHall = 'scott'): StationStatus[] {
  const occupancy = getCurrentOccupancy(hall);
  const menu = getCurrentMenu();
  
  // Simulate station wait times based on current occupancy
  const baseWaitMultiplier = occupancy.level === 'low' ? 0.5 : 
                             occupancy.level === 'moderate' ? 1 : 
                             occupancy.level === 'busy' ? 1.5 : 2;
  
  const stations = Array.from(new Set(menu.items.map(item => item.station)));
  
  return stations.map(station => {
    const stationItems = menu.items.filter(item => item.station === station);
    const waitTime = Math.round((2 + Math.random() * 3) * baseWaitMultiplier);
    
    // Simulate food levels
    const foodLevel: 'full' | 'moderate' | 'low' = 
      occupancy.percentage < 0.3 ? 'full' :
      occupancy.percentage < 0.7 ? 'moderate' : 'low';
    
    // Simulate out of stock items (more likely when busy)
    const outOfStock: string[] = [];
    if (occupancy.level === 'busy' || occupancy.level === 'packed') {
      const randomItems = stationItems.filter(() => Math.random() < 0.2);
      outOfStock.push(...randomItems.map(item => item.name));
    }
    
    return {
      station,
      waitTime,
      foodLevel,
      outOfStock,
    };
  });
}

export function getInsights(hall: DiningHall = 'scott'): string[] {
  const now = new Date();
  const day = now.getDay();
  const isWeekend = day === 0 || day === 6;
  const occupancy = getCurrentOccupancy(hall);
  const stationStatus = getStationStatus(hall);
  
  const insights: string[] = [];
  
  // Current wait time insights
  const avgWaitTime = Math.round(
    stationStatus.reduce((sum, s) => sum + s.waitTime, 0) / stationStatus.length
  );
  
  if (avgWaitTime < 3) {
    insights.push(`Lightning fast! Average wait time is ${avgWaitTime} min across all stations`);
  } else if (avgWaitTime < 5) {
    insights.push(`Quick service today - average ${avgWaitTime} min wait times`);
  } else {
    insights.push(`Be patient - wait times averaging ${avgWaitTime} min due to ${occupancy.level} crowd`);
  }
  
  // Station-specific insights
  const fastestStation = stationStatus.reduce((min, s) => s.waitTime < min.waitTime ? s : min);
  const slowestStation = stationStatus.reduce((max, s) => s.waitTime > max.waitTime ? s : max);
  
  if (slowestStation.waitTime > fastestStation.waitTime + 3) {
    insights.push(`Skip the line at ${fastestStation.station} (${fastestStation.waitTime} min) vs ${slowestStation.station} (${slowestStation.waitTime} min)`);
  }
  
  // Food availability insights
  const lowStations = stationStatus.filter(s => s.foodLevel === 'low');
  if (lowStations.length > 0) {
    insights.push(`${lowStations.map(s => s.station).join(', ')} running low - grab it while you can!`);
  }
  
  // Out of stock items
  const allOutOfStock = stationStatus.flatMap(s => s.outOfStock);
  if (allOutOfStock.length > 0) {
    insights.push(`Currently out: ${allOutOfStock.slice(0, 3).join(', ')}${allOutOfStock.length > 3 ? '...' : ''}`);
  } else {
    insights.push(`Everything in stock! All menu items available right now`);
  }
  
  // Peak time insights
  insights.push(
    isWeekend 
      ? "Weekend brunch peak: 11am-1pm"
      : "Typical dinner rush: 6-7pm on weekdays"
  );
  
  insights.push(
    isWeekend
      ? "☕ Quietest: before 9am and after 8pm"
      : "🌅 Beat the crowd: visit between 2-4pm"
  );
  
  return insights;
}

export function formatTime(hour: number): string {
  if (hour === 0) return '12am';
  if (hour === 12) return '12pm';
  if (hour < 12) return `${hour}am`;
  return `${hour - 12}pm`;
}

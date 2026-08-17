export const COMMODITIES = [
  "Onion", "Tomato", "Wheat", "Rice (Paddy)", "Potato",
  "Tur Dal (Arhar)", "Soybean", "Sugarcane"
];

export const STATE_DISTRICTS = {
  Maharashtra: ["Nashik", "Pune", "Ahmednagar", "Solapur"],
  "Uttar Pradesh": ["Agra", "Lucknow", "Kanpur", "Meerut"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Ujjain", "Mandsaur"],
  Karnataka: ["Bengaluru Rural", "Hubballi", "Belagavi", "Kolar"],
  Punjab: ["Ludhiana", "Amritsar", "Patiala", "Bathinda"],
  Gujarat: ["Rajkot", "Ahmedabad", "Surat", "Bhavnagar"],
  Rajasthan: ["Jaipur", "Kota", "Alwar", "Sri Ganganagar"],
  "West Bengal": ["Bardhaman", "Hooghly", "Nadia", "Malda"],
  Bihar: ["Patna", "Muzaffarpur", "Gaya", "Bhagalpur"],
  "Tamil Nadu": ["Coimbatore", "Salem", "Madurai", "Erode"]
};

export const STATES = Object.keys(STATE_DISTRICTS);
export const MARKETS = ["Main Mandi", "APMC Yard", "Wholesale Market", "Regulated Market Committee"];

export const MAP_STATES = [
  { name: "Jammu & Kashmir", top: 4, left: 33 }, { name: "Punjab", top: 15, left: 30 },
  { name: "Haryana", top: 21, left: 33 }, { name: "Rajasthan", top: 32, left: 21 },
  { name: "Uttar Pradesh", top: 26, left: 47 }, { name: "Gujarat", top: 47, left: 14 },
  { name: "Madhya Pradesh", top: 43, left: 41 }, { name: "Bihar", top: 31, left: 62 },
  { name: "West Bengal", top: 39, left: 70 }, { name: "Maharashtra", top: 57, left: 34 },
  { name: "Odisha", top: 51, left: 61 }, { name: "Telangana", top: 63, left: 49 },
  { name: "Karnataka", top: 72, left: 37 }, { name: "Andhra Pradesh", top: 70, left: 55 },
  { name: "Tamil Nadu", top: 86, left: 44 }, { name: "Kerala", top: 89, left: 34 }
];

export const NAV = [
  { key: "dashboard", label: "Dashboard", iconName: "LayoutDashboard" },
  { key: "forecast", label: "Price Forecast", iconName: "TrendingUp" },
  { key: "transport", label: "Transportation Analysis", iconName: "Truck" },
  { key: "weather", label: "Weather Data", iconName: "CloudRain" },
  { key: "buffer", label: "Buffer Stock", iconName: "Package" },
  { key: "procurement", label: "Procurement", iconName: "ShoppingCart" },
  { key: "alerts", label: "Alerts", iconName: "Bell" },
  { key: "reports", label: "Reports", iconName: "FileText" },
  { key: "settings", label: "Settings", iconName: "SettingsIcon" }
];

export const DEFAULT_FORM = {
  commodity: "Onion", state: "Maharashtra", district: "Nashik", market: "Main Mandi",
  sowingArea: 120, production: 480, yield: 4.0, arrivalQty: 320,
  rainfall: 62, temperature: 29, humidity: 58,
  currentPrice: 2150, lastWeekPrice: 2050, lastMonthPrice: 1890,
  demand: 640, festival: false
};

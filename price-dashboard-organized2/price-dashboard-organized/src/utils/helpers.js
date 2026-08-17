import { RISK } from "../theme/theme";

export function hashNum(str, salt = 0) {
  let h = salt;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export function seededRand(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function riskFor(seed) {
  const r = seededRand(seed);
  if (r < 0.45) return RISK.safe;
  if (r < 0.7) return RISK.watch;
  if (r < 0.9) return RISK.spike;
  return RISK.critical;
}

export function fmtINR(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function todayStr() {
  return new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric"
  });
}

export function buildHistory(base, days = 30, volatility = 0.03, driftPerDay = 0) {
  const out = [];
  let v = base * (1 - driftPerDay * days * 0.5);
  for (let i = 0; i < days; i++) {
    const seed = base + i * 7.13;
    const noise = (seededRand(seed) - 0.5) * 2 * volatility;
    v = v * (1 + noise + driftPerDay);
    out.push({ day: `D-${days - i}`, price: Math.round(v) });
  }
  return out;
}

export function buildForecast(base, days, growthPct) {
  const out = [];
  let v = base;
  for (let i = 1; i <= days; i++) {
    const seed = base + i * 3.7 + growthPct * 11;
    const noise = (seededRand(seed) - 0.5) * 0.01;
    v = v * (1 + growthPct / 100 / days + noise);
    out.push({ day: `D+${i}`, price: Math.round(v) });
  }
  return out;
}

export function autoFetchForm(setForm) {
  const seed = Date.now() % 1000;
  setForm(f => ({
    ...f,
    sowingArea: Math.round(80 + seededRand(seed) * 200),
    production: Math.round(300 + seededRand(seed + 1) * 400),
    yield: +(2.5 + seededRand(seed + 2) * 3).toFixed(1),
    arrivalQty: Math.round(200 + seededRand(seed + 3) * 400),
    rainfall: Math.round(20 + seededRand(seed + 4) * 100),
    temperature: Math.round(20 + seededRand(seed + 5) * 18),
    humidity: Math.round(30 + seededRand(seed + 6) * 60),
    currentPrice: Math.round(1500 + seededRand(seed + 7) * 2000),
    lastWeekPrice: Math.round(1500 + seededRand(seed + 8) * 2000),
    lastMonthPrice: Math.round(1500 + seededRand(seed + 9) * 2000),
    demand: Math.round(300 + seededRand(seed + 10) * 600)
  }));
}

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  LayoutDashboard, TrendingUp, Truck, CloudRain, Package, ShoppingCart, Bell,
  FileText, Settings as SettingsIcon, Menu, X, Sun, Moon, MapPin, AlertTriangle,
  CheckCircle2, Info, Download, Printer, RefreshCw, ArrowUp, ArrowDown, Sprout,
  Warehouse, Calendar, ChevronRight, ChevronDown, Gauge, Search, BarChart3,
  Wallet, Fuel, Users, Boxes, ShieldAlert, ShieldCheck, Clock, Building2,
  ClipboardList, Percent, Droplets, Thermometer, Wind, ChevronLeft,
  MessageCircle, Sparkles, Send
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadialBarChart, RadialBar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  Legend, ResponsiveContainer, ComposedChart
} from "recharts";
import * as XLSX from "xlsx";

/* ============================================================
   DESIGN TOKENS
   A government agri-market intelligence portal. Blue = trust /
   institutional authority. Green = agriculture / growth. A thin
   tricolour rule under the header nods to the Indian-government
   context (saffron / navy / green) without being kitsch, and a
   circular "seal" mark stands in for an official emblem.
   ============================================================ */
const PALETTE = {
  light: {
    bg: "#EEF3F8", surface: "#FFFFFF", surfaceAlt: "#F5F9FC",
    ink: "#0F1E33", inkSoft: "#5B6E85", inkFaint: "#8DA0B5",
    border: "#DCE6EF", borderSoft: "#E9F0F6",
    primary: "#0B5FA5", primaryDeep: "#08477E", primarySoft: "#E5EFF9",
    green: "#0E9D6E", greenSoft: "#E1F6EE", greenDeep: "#087551",
    shadow: "0 1px 2px rgba(15,30,51,0.04), 0 10px 30px rgba(15,30,51,0.07)"
  },
  dark: {
    bg: "#08111F", surface: "#0F1C2E", surfaceAlt: "#0B1626",
    ink: "#E8F1FA", inkSoft: "#93A8C0", inkFaint: "#5D7089",
    border: "#1D2C42", borderSoft: "#162335",
    primary: "#5AA9E6", primaryDeep: "#8CC5F0", primarySoft: "#122844",
    green: "#3FD6A3", greenSoft: "#0E2A22", greenDeep: "#6EE7BE",
    shadow: "0 1px 2px rgba(0,0,0,0.4), 0 10px 30px rgba(0,0,0,0.45)"
  }
};
const RISK = {
  safe: { key: "safe", label: "Normal", c: "#16A34A", bgL: "#E7F7ED", bgD: "#0E2A1C" },
  watch: { key: "watch", label: "Watch", c: "#D97706", bgL: "#FDF1DE", bgD: "#2E2109" },
  spike: { key: "spike", label: "Price Spike Expected", c: "#EA580C", bgL: "#FDE9DD", bgD: "#331C0C" },
  critical: { key: "critical", label: "Immediate Intervention Required", c: "#DC2626", bgL: "#FCE4E4", bgD: "#330F0F" }
};
const FONT_LINK = "https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap";

/* ============================================================
   MOCK REFERENCE DATA
   ============================================================ */
const COMMODITIES = ["Onion", "Tomato", "Wheat", "Rice (Paddy)", "Potato", "Tur Dal (Arhar)", "Soybean", "Sugarcane"];
const STATE_DISTRICTS = {
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
const STATES = Object.keys(STATE_DISTRICTS);
const MARKETS = ["Main Mandi", "APMC Yard", "Wholesale Market", "Regulated Market Committee"];
const MAP_STATES = [
  { name: "Jammu & Kashmir", top: 4, left: 33 }, { name: "Punjab", top: 15, left: 30 },
  { name: "Haryana", top: 21, left: 33 }, { name: "Rajasthan", top: 32, left: 21 },
  { name: "Uttar Pradesh", top: 26, left: 47 }, { name: "Gujarat", top: 47, left: 14 },
  { name: "Madhya Pradesh", top: 43, left: 41 }, { name: "Bihar", top: 31, left: 62 },
  { name: "West Bengal", top: 39, left: 70 }, { name: "Maharashtra", top: 57, left: 34 },
  { name: "Odisha", top: 51, left: 61 }, { name: "Telangana", top: 63, left: 49 },
  { name: "Karnataka", top: 72, left: 37 }, { name: "Andhra Pradesh", top: 70, left: 55 },
  { name: "Tamil Nadu", top: 86, left: 44 }, { name: "Kerala", top: 89, left: 34 }
];

function hashNum(str, salt = 0) {
  let h = salt;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}
function seededRand(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
function riskFor(seed) {
  const r = seededRand(seed) ;
  if (r < 0.45) return RISK.safe;
  if (r < 0.7) return RISK.watch;
  if (r < 0.9) return RISK.spike;
  return RISK.critical;
}
function fmtINR(n) {
  return "\u20B9" + Math.round(n).toLocaleString("en-IN");
}
function todayStr() {
  return new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

/* Build a deterministic 30-day price history around a base price */
function buildHistory(base, days = 30, volatility = 0.03, driftPerDay = 0) {
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
function buildForecast(base, days, growthPct) {
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

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */
function Card({ t, style, className = "", children, hover = true }) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${hover ? "hover:-translate-y-0.5" : ""} ${className}`}
      style={{ background: t.surface, borderColor: t.border, boxShadow: t.shadow, ...style }}
    >
      {children}
    </div>
  );
}
function SectionHeading({ t, eyebrow, title, desc, icon: Icon, right }) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
      <div>
        {eyebrow && (
          <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: t.primary, fontFamily: "Manrope" }}>
            {eyebrow}
          </div>
        )}
        <div className="flex items-center gap-2.5">
          {Icon && (
            <span className="grid place-items-center w-9 h-9 rounded-xl" style={{ background: t.primarySoft, color: t.primary }}>
              <Icon size={18} />
            </span>
          )}
          <h2 className="text-xl font-bold" style={{ color: t.ink, fontFamily: "Manrope" }}>{title}</h2>
        </div>
        {desc && <p className="text-sm mt-1.5 max-w-2xl" style={{ color: t.inkSoft }}>{desc}</p>}
      </div>
      {right}
    </div>
  );
}
function StatCard({ t, label, value, sub, icon: Icon, trend, accent }) {
  return (
    <Card t={t} className="p-5 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: t.inkSoft }}>{label}</div>
        {Icon && <span className="grid place-items-center w-8 h-8 rounded-lg" style={{ background: (accent ? accent + "22" : t.primarySoft), color: accent || t.primary }}><Icon size={15} /></span>}
      </div>
      <div className="mt-2 text-2xl font-extrabold" style={{ color: t.ink, fontFamily: "IBM Plex Mono" }}>{value}</div>
      {(sub || trend) && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium">
          {trend != null && (
            <span className="flex items-center gap-0.5" style={{ color: trend >= 0 ? "#DC2626" : "#16A34A" }}>
              {trend >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {Math.abs(trend).toFixed(1)}%
            </span>
          )}
          {sub && <span style={{ color: t.inkFaint }}>{sub}</span>}
        </div>
      )}
    </Card>
  );
}
function Field({ t, label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold mb-1.5" style={{ color: t.inkSoft }}>{label}</span>
      {children}
    </label>
  );
}
const inputCls = "w-full px-3 py-2 rounded-xl text-sm outline-none transition-colors focus:ring-2";
function TInput({ t, ...props }) {
  return <input {...props} className={inputCls} style={{ background: t.surfaceAlt, border: `1px solid ${t.border}`, color: t.ink }} />;
}
function TSelect({ t, children, ...props }) {
  return <select {...props} className={inputCls} style={{ background: t.surfaceAlt, border: `1px solid ${t.border}`, color: t.ink }}>{children}</select>;
}
function Badge({ c, bg, children, icon: Icon }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ color: c, background: bg }}>
      {Icon && <Icon size={12} />} {children}
    </span>
  );
}
function Button({ t, variant = "primary", children, ...props }) {
  const styles = {
    primary: { background: t.primary, color: "#fff", border: "none" },
    green: { background: t.green, color: "#fff", border: "none" },
    ghost: { background: "transparent", color: t.ink, border: `1px solid ${t.border}` },
    soft: { background: t.primarySoft, color: t.primary, border: "none" }
  };
  return (
    <button
      {...props}
      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 hover:brightness-105 disabled:opacity-50"
      style={styles[variant]}
    >
      {children}
    </button>
  );
}
function Skeleton({ t, h = "1rem", w = "100%", className = "" }) {
  return <div className={`rounded-lg animate-pulse ${className}`} style={{ height: h, width: w, background: t.borderSoft }} />;
}
function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap"
          style={{ background: "#0F1E33", color: "#fff", boxShadow: "0 8px 20px rgba(0,0,0,0.25)" }}>
          {text}
        </span>
      )}
    </span>
  );
}

/* ============================================================
   NAVIGATION
   ============================================================ */
const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "forecast", label: "Price Forecast", icon: TrendingUp },
  { key: "transport", label: "Transportation Analysis", icon: Truck },
  { key: "weather", label: "Weather Data", icon: CloudRain },
  { key: "buffer", label: "Buffer Stock", icon: Package },
  { key: "procurement", label: "Procurement", icon: ShoppingCart },
  { key: "alerts", label: "Alerts", icon: Bell },
  { key: "reports", label: "Reports", icon: FileText },
  { key: "settings", label: "Settings", icon: SettingsIcon }
];

function Sidebar({ t, dark, page, setPage, collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 flex flex-col transition-all duration-300
          ${collapsed ? "w-[76px]" : "w-[260px]"} ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ background: t.surface, borderRight: `1px solid ${t.border}` }}
      >
        <div className="h-16 flex items-center gap-2.5 px-4 shrink-0" style={{ borderBottom: `1px solid ${t.border}` }}>
          <div className="w-9 h-9 rounded-full grid place-items-center shrink-0" style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.green})` }}>
            <Sprout size={17} color="#fff" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-[13px] font-extrabold leading-tight truncate" style={{ color: t.ink, fontFamily: "Manrope" }}>AgriPrice Intel</div>
              <div className="text-[10px] font-semibold tracking-wide uppercase truncate" style={{ color: t.inkFaint }}>Buffer Stock DSS</div>
            </div>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1">
          {NAV.map(item => {
            const active = page === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => { setPage(item.key); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors relative"
                style={{
                  background: active ? t.primarySoft : "transparent",
                  color: active ? t.primary : t.inkSoft
                }}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full" style={{ background: t.primary }} />}
              </button>
            );
          })}
        </nav>
        <div className="p-2.5 shrink-0" style={{ borderTop: `1px solid ${t.border}` }}>
          <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold" style={{ color: t.inkSoft, background: t.surfaceAlt }}>
            {collapsed ? <ChevronRight size={15} /> : <><ChevronLeft size={15} /> Collapse</>}
          </button>
        </div>
      </aside>
    </>
  );
}

function Topbar({ t, dark, setDark, setMobileOpen, pageLabel }) {
  return (
    <div className="sticky top-0 z-30" style={{ background: t.surface, borderBottom: `1px solid ${t.border}` }}>
      <div className="h-0.5 w-full flex">
        <div className="flex-1" style={{ background: "#F59E0B" }} />
        <div className="flex-1" style={{ background: t.primary }} />
        <div className="flex-1" style={{ background: t.green }} />
      </div>
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg" style={{ color: t.ink, background: t.surfaceAlt }}>
            <Menu size={18} />
          </button>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: t.inkFaint }}>Ministry-grade Analytics Console</div>
            <h1 className="text-base sm:text-lg font-bold truncate" style={{ color: t.ink, fontFamily: "Manrope" }}>{pageLabel}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-xl" style={{ color: t.inkSoft, background: t.surfaceAlt }}>
            <Calendar size={14} /> {todayStr()}
          </div>
          <Tooltip text="Live system status: nominal">
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl" style={{ color: "#16A34A", background: dark ? "#0E2A1C" : "#E7F7ED" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#16A34A" }} /> Live
            </span>
          </Tooltip>
          <button onClick={() => setDark(!dark)} className="p-2.5 rounded-xl" style={{ color: t.ink, background: t.surfaceAlt }}>
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD PAGE
   ============================================================ */
function Dashboard({ t, dark, form, prediction, onNavigate, setMapState, mapState }) {
  const base = Number(form.currentPrice) || 2400;
  const hist = useMemo(() => buildHistory(base, 30, 0.035, 0.001), [base]);
  const predTrend = prediction ? prediction.trend30 : buildForecast(base, 30, 4);
  const rainVsPrice = useMemo(() => hist.map((h, i) => ({
    day: h.day, price: h.price, rainfall: Math.round(20 + 60 * seededRand(base + i * 4.2))
  })), [hist, base]);
  const demandSupply = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({
    week: `W${i + 1}`,
    demand: Math.round(400 + 200 * seededRand(base + i * 9.1)),
    supply: Math.round(380 + 220 * seededRand(base + i * 5.6 + 3))
  })), [base]);

  const riskLevel = prediction ? prediction.risk : RISK.safe;
  const riskBg = dark ? riskLevel.bgD : riskLevel.bgL;

  return (
    <div className="space-y-6">
      <SectionHeading t={t} eyebrow="Overview" title="National Price Intelligence Dashboard" icon={LayoutDashboard}
        desc="Consolidated view of the selected commodity, market conditions, and AI-generated forecasts." />

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
        <StatCard t={t} label="Commodity" value={form.commodity} icon={Sprout} accent={t.green} />
        <StatCard t={t} label="State / District" value={form.district} sub={form.state} icon={MapPin} />
        <StatCard t={t} label="Current Price" value={fmtINR(base) + "/qtl"} icon={Wallet} />
        <StatCard t={t} label="Predicted Price" value={fmtINR(prediction ? prediction.today : base * 1.04) + "/qtl"}
          trend={prediction ? prediction.changePct : 4.0} icon={TrendingUp} accent={t.primary} />
        <StatCard t={t} label="Buffer Stock" value={(3200).toLocaleString("en-IN") + " T"} sub="Central + State pool" icon={Warehouse} />
        <StatCard t={t} label="Risk Level" value={riskLevel.label.split(" ")[0]} icon={ShieldAlert} accent={riskLevel.c} />
        <StatCard t={t} label="Today's Date" value={new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} sub={new Date().getFullYear()} icon={Calendar} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card t={t} className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm" style={{ color: t.ink, fontFamily: "Manrope" }}>Historical Price (30 Days)</h3>
            <Badge c={t.primary} bg={t.primarySoft}>{form.commodity}</Badge>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={hist}>
              <defs>
                <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={t.primary} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={t.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={t.borderSoft} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: t.inkFaint }} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: t.inkFaint }} width={45} />
              <RTooltip contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, fontSize: 12 }} />
              <Area type="monotone" dataKey="price" stroke={t.primary} strokeWidth={2} fill="url(#histGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card t={t} className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm" style={{ color: t.ink, fontFamily: "Manrope" }}>Predicted Price Trend (Next 30 Days)</h3>
            <Badge c={t.green} bg={t.greenSoft}>AI Forecast</Badge>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={predTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.borderSoft} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: t.inkFaint }} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: t.inkFaint }} width={45} />
              <RTooltip contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, fontSize: 12 }} />
              <Line type="monotone" dataKey="price" stroke={t.green} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card t={t} className="p-5">
          <h3 className="font-bold text-sm mb-3" style={{ color: t.ink, fontFamily: "Manrope" }}>Rainfall vs Price</h3>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={rainVsPrice}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.borderSoft} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: t.inkFaint }} interval={4} />
              <YAxis yAxisId="l" tick={{ fontSize: 10, fill: t.inkFaint }} width={40} />
              <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 10, fill: t.inkFaint }} width={40} />
              <RTooltip contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, fontSize: 12 }} />
              <Bar yAxisId="r" dataKey="rainfall" fill={dark ? "#274257" : "#CFE3F5"} radius={[4, 4, 0, 0]} barSize={10} />
              <Line yAxisId="l" type="monotone" dataKey="price" stroke={t.primary} strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        <Card t={t} className="p-5">
          <h3 className="font-bold text-sm mb-3" style={{ color: t.ink, fontFamily: "Manrope" }}>Demand vs Supply</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={demandSupply}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.borderSoft} />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: t.inkFaint }} />
              <YAxis tick={{ fontSize: 10, fill: t.inkFaint }} width={40} />
              <RTooltip contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="demand" fill={t.primary} radius={[4, 4, 0, 0]} />
              <Bar dataKey="supply" fill={t.green} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* India risk map */}
      <Card t={t} className="p-5">
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <div>
            <h3 className="font-bold text-sm" style={{ color: t.ink, fontFamily: "Manrope" }}>State-wise Price Risk Map</h3>
            <p className="text-xs mt-0.5" style={{ color: t.inkFaint }}>Schematic layout &middot; tap a state for its outlook</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {Object.values(RISK).map(r => (
              <span key={r.key} className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: t.inkSoft }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.c }} /> {r.label.split(" ")[0]}
              </span>
            ))}
          </div>
        </div>
        <div className="relative w-full mt-3" style={{ height: 340, background: t.surfaceAlt, borderRadius: 16, border: `1px dashed ${t.border}` }}>
          {MAP_STATES.map(s => {
            const seed = hashNum(s.name);
            const r = riskFor(seed);
            const selected = mapState === s.name;
            return (
              <button
                key={s.name}
                onClick={() => setMapState(selected ? null : s.name)}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 group"
                style={{ top: `${s.top}%`, left: `${s.left}%` }}
              >
                <span
                  className="w-4 h-4 rounded-full border-2 transition-transform group-hover:scale-125"
                  style={{ background: r.c, borderColor: dark ? "#0F1C2E" : "#fff", boxShadow: selected ? `0 0 0 4px ${r.c}44` : "none" }}
                />
                <span className="text-[9px] font-semibold px-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity" style={{ color: t.ink, background: t.surface }}>
                  {s.name}
                </span>
              </button>
            );
          })}
          {mapState && (() => {
            const seed = hashNum(mapState);
            const r = riskFor(seed);
            const price = Math.round(1800 + seed % 2500);
            const pred = Math.round(price * (1 + (seededRand(seed + 1) - 0.3) * 0.15));
            const transportCost = Math.round(80 + seed % 220);
            const stock = Math.round(500 + seed % 4000);
            return (
              <div className="absolute right-3 top-3 w-64 p-4 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.border}`, boxShadow: t.shadow }}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm" style={{ color: t.ink }}>{mapState}</h4>
                  <button onClick={() => setMapState(null)}><X size={14} color={t.inkFaint} /></button>
                </div>
                <Badge c={r.c} bg={dark ? r.bgD : r.bgL}>{r.label}</Badge>
                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between"><span style={{ color: t.inkFaint }}>Current Price</span><span className="font-semibold" style={{ color: t.ink }}>{fmtINR(price)}</span></div>
                  <div className="flex justify-between"><span style={{ color: t.inkFaint }}>Predicted Price</span><span className="font-semibold" style={{ color: t.ink }}>{fmtINR(pred)}</span></div>
                  <div className="flex justify-between"><span style={{ color: t.inkFaint }}>Transport Cost</span><span className="font-semibold" style={{ color: t.ink }}>{fmtINR(transportCost)}/qtl</span></div>
                  <div className="flex justify-between"><span style={{ color: t.inkFaint }}>Risk Score</span><span className="font-semibold" style={{ color: r.c }}>{(seed % 100)}/100</span></div>
                  <div className="flex justify-between"><span style={{ color: t.inkFaint }}>Buffer Stock</span><span className="font-semibold" style={{ color: t.ink }}>{stock.toLocaleString("en-IN")} T</span></div>
                </div>
              </div>
            );
          })()}
        </div>
      </Card>
    </div>
  );
}

/* ============================================================
   PRICE FORECAST PAGE (Input Panel + AI Prediction + XAI)
   ============================================================ */
const DEFAULT_FORM = {
  commodity: "Onion", state: "Maharashtra", district: "Nashik", market: "Main Mandi",
  sowingArea: 120, production: 480, yield: 4.0, arrivalQty: 320,
  rainfall: 62, temperature: 29, humidity: 58,
  currentPrice: 2150, lastWeekPrice: 2050, lastMonthPrice: 1890,
  demand: 640, festival: false
};

function InputPanel({ t, form, setForm, onPredict, loading }) {
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const districts = STATE_DISTRICTS[form.state] || [];

  return (
    <Card t={t} className="p-5 sm:p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.primary }}>Commodity Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Field t={t} label="Commodity">
              <TSelect t={t} value={form.commodity} onChange={e => set("commodity", e.target.value)}>
                {COMMODITIES.map(c => <option key={c}>{c}</option>)}
              </TSelect>
            </Field>
            <Field t={t} label="State">
              <TSelect t={t} value={form.state} onChange={e => { set("state", e.target.value); set("district", STATE_DISTRICTS[e.target.value][0]); }}>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </TSelect>
            </Field>
            <Field t={t} label="District">
              <TSelect t={t} value={form.district} onChange={e => set("district", e.target.value)}>
                {districts.map(d => <option key={d}>{d}</option>)}
              </TSelect>
            </Field>
            <Field t={t} label="Market / Mandi">
              <TSelect t={t} value={form.market} onChange={e => set("market", e.target.value)}>
                {MARKETS.map(m => <option key={m}>{m}</option>)}
              </TSelect>
            </Field>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.primary }}>Agricultural Inputs</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Field t={t} label="Crop Sowing Area (ha)"><TInput t={t} type="number" value={form.sowingArea} onChange={e => set("sowingArea", e.target.value)} /></Field>
            <Field t={t} label="Production Estimate (T)"><TInput t={t} type="number" value={form.production} onChange={e => set("production", e.target.value)} /></Field>
            <Field t={t} label="Expected Yield (T/ha)"><TInput t={t} type="number" value={form.yield} onChange={e => set("yield", e.target.value)} /></Field>
            <Field t={t} label="Arrival Quantity (qtl)"><TInput t={t} type="number" value={form.arrivalQty} onChange={e => set("arrivalQty", e.target.value)} /></Field>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.primary }}>Weather Inputs</h3>
          <div className="grid grid-cols-3 gap-3">
            <Field t={t} label="Rainfall (mm)"><TInput t={t} type="number" value={form.rainfall} onChange={e => set("rainfall", e.target.value)} /></Field>
            <Field t={t} label="Temperature (\u00B0C)"><TInput t={t} type="number" value={form.temperature} onChange={e => set("temperature", e.target.value)} /></Field>
            <Field t={t} label="Humidity (%)"><TInput t={t} type="number" value={form.humidity} onChange={e => set("humidity", e.target.value)} /></Field>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.primary }}>Market Inputs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field t={t} label="Current Price (\u20B9/qtl)"><TInput t={t} type="number" value={form.currentPrice} onChange={e => set("currentPrice", e.target.value)} /></Field>
            <Field t={t} label="Last Week Price (\u20B9/qtl)"><TInput t={t} type="number" value={form.lastWeekPrice} onChange={e => set("lastWeekPrice", e.target.value)} /></Field>
            <Field t={t} label="Last Month Price (\u20B9/qtl)"><TInput t={t} type="number" value={form.lastMonthPrice} onChange={e => set("lastMonthPrice", e.target.value)} /></Field>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.primary }}>Demand Inputs</h3>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1"><Field t={t} label="Consumer Demand (qtl/day)"><TInput t={t} type="number" value={form.demand} onChange={e => set("demand", e.target.value)} /></Field></div>
            <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer" style={{ background: t.surfaceAlt, border: `1px solid ${t.border}` }}>
              <input type="checkbox" checked={form.festival} onChange={e => set("festival", e.target.checked)} />
              <span className="text-sm font-medium" style={{ color: t.ink }}>Festival Season</span>
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2" style={{ borderTop: `1px solid ${t.border}` }}>
          <Button t={t} variant="primary" onClick={onPredict} disabled={loading}>
            {loading ? <RefreshCw size={15} className="animate-spin" /> : <TrendingUp size={15} />}
            {loading ? "Predicting..." : "Predict Price"}
          </Button>
          <Button t={t} variant="ghost" onClick={() => setForm(DEFAULT_FORM)}><X size={15} /> Reset</Button>
          <Button t={t} variant="soft" onClick={() => autoFetchForm(setForm)}><RefreshCw size={15} /> Auto Fetch Data</Button>
        </div>
      </div>
    </Card>
  );
}

function computePrediction(form) {
  const base = Number(form.currentPrice) || 2000;
  const rainfall = Number(form.rainfall) || 50;
  const demand = Number(form.demand) || 500;
  const arrival = Number(form.arrivalQty) || 300;
  const lastMonth = Number(form.lastMonthPrice) || base;
  const festivalBoost = form.festival ? 6 : 0;
  const supplyPressure = (arrival - demand) / Math.max(demand, 1);
  const rainEffect = (rainfall - 60) / 100 * -4;
  const momentum = ((base - lastMonth) / Math.max(lastMonth, 1)) * 100 * 0.4;
  const changePct = +(festivalBoost + rainEffect + momentum - supplyPressure * 8 + 2).toFixed(1);
  const today = Math.round(base * (1 + changePct / 100));
  const confidence = Math.max(62, Math.min(96, Math.round(78 - Math.abs(changePct) * 1.2 + seededRand(base) * 8)));

  const trend7 = buildForecast(base, 7, changePct);
  const trend30 = buildForecast(base, 30, changePct * 1.3);

  let riskLevel = RISK.safe;
  if (Math.abs(changePct) >= 18) riskLevel = RISK.critical;
  else if (Math.abs(changePct) >= 11) riskLevel = RISK.spike;
  else if (Math.abs(changePct) >= 5) riskLevel = RISK.watch;

  const rawFactors = [
    { label: "Rainfall", v: Math.abs(rainEffect) + 8 },
    { label: "Transportation Cost", v: 14 + seededRand(base + 1) * 6 },
    { label: "Demand", v: Math.abs(demand / 20) * 0.6 + 10 },
    { label: "Supply", v: Math.abs(supplyPressure) * 40 + 9 },
    { label: "Buffer Stock", v: 8 + seededRand(base + 2) * 6 },
    { label: "Festival Season", v: form.festival ? 16 : 4 },
    { label: "Government Policies", v: 7 + seededRand(base + 3) * 5 }
  ];
  const total = rawFactors.reduce((s, f) => s + f.v, 0);
  const factors = rawFactors.map(f => ({ label: f.label, pct: +(f.v / total * 100).toFixed(1) }))
    .sort((a, b) => b.pct - a.pct);

  return { today, changePct, confidence, trend7, trend30, risk: riskLevel, factors, base };
}

function PredictionCard({ t, dark, prediction }) {
  if (!prediction) return null;
  const p = prediction;
  const day7 = p.trend7[p.trend7.length - 1].price;
  const day30 = p.trend30[p.trend30.length - 1].price;
  const gaugeData = [{ name: "conf", value: p.confidence, fill: t.green }];

  return (
    <Card t={t} className="p-5 sm:p-6" style={{ background: `linear-gradient(135deg, ${t.primarySoft}, ${t.surface} 55%)` }}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <Badge c={t.primary} bg={t.surface} icon={TrendingUp}>AI Price Prediction</Badge>
        <Badge c={p.risk.c} bg={dark ? p.risk.bgD : p.risk.bgL} icon={ShieldAlert}>{p.risk.label}</Badge>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <div className="text-xs font-semibold" style={{ color: t.inkSoft }}>Today's Predicted Price</div>
          <div className="text-2xl font-extrabold mt-1" style={{ color: t.ink, fontFamily: "IBM Plex Mono" }}>{fmtINR(p.today)}</div>
        </div>
        <div>
          <div className="text-xs font-semibold" style={{ color: t.inkSoft }}>7-Day Forecast</div>
          <div className="text-2xl font-extrabold mt-1" style={{ color: t.ink, fontFamily: "IBM Plex Mono" }}>{fmtINR(day7)}</div>
        </div>
        <div>
          <div className="text-xs font-semibold" style={{ color: t.inkSoft }}>30-Day Forecast</div>
          <div className="text-2xl font-extrabold mt-1" style={{ color: t.ink, fontFamily: "IBM Plex Mono" }}>{fmtINR(day30)}</div>
        </div>
        <div>
          <div className="text-xs font-semibold" style={{ color: t.inkSoft }}>Price Change</div>
          <div className="text-2xl font-extrabold mt-1 flex items-center gap-1" style={{ color: p.changePct >= 0 ? "#DC2626" : "#16A34A", fontFamily: "IBM Plex Mono" }}>
            {p.changePct >= 0 ? <ArrowUp size={18} /> : <ArrowDown size={18} />}{Math.abs(p.changePct)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
        <div className="lg:col-span-2">
          <div className="text-xs font-semibold mb-2" style={{ color: t.inkSoft }}>30-Day Animated Trend</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={p.trend30}>
              <defs>
                <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={t.green} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={t.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" hide />
              <YAxis hide domain={["dataMin - 50", "dataMax + 50"]} />
              <RTooltip contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, fontSize: 12 }} />
              <Area type="monotone" dataKey="price" stroke={t.green} strokeWidth={2.5} fill="url(#predGrad)" isAnimationActive animationDuration={1200} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="text-xs font-semibold mb-1" style={{ color: t.inkSoft }}>Prediction Confidence</div>
          <ResponsiveContainer width="100%" height={140}>
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={gaugeData} startAngle={90} endAngle={-270}>
              <RadialBar background dataKey="value" cornerRadius={20} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="-mt-24 text-2xl font-extrabold" style={{ color: t.ink, fontFamily: "IBM Plex Mono" }}>{p.confidence}%</div>
        </div>
      </div>
    </Card>
  );
}

function ExplainableAI({ t, prediction }) {
  if (!prediction) return null;
  return (
    <Card t={t} className="p-5 sm:p-6">
      <SectionHeading t={t} title="Explainable AI" icon={Info} desc="Why the model made this prediction — relative contribution of each factor." />
      <div className="space-y-3.5">
        {prediction.factors.map(f => (
          <div key={f.label}>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span style={{ color: t.ink }}>{f.label}</span>
              <span style={{ color: t.primary }}>{f.pct}%</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: t.borderSoft }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${f.pct * 2.2}%`, background: `linear-gradient(90deg, ${t.primary}, ${t.green})` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ForecastPage({ t, dark, form, setForm, prediction, setPrediction, loading, setLoading }) {
  const handlePredict = () => {
    setLoading(true);
    setTimeout(() => {
      setPrediction(computePrediction(form));
      setLoading(false);
    }, 900);
  };
  return (
    <div className="space-y-6">
      <SectionHeading t={t} eyebrow="Price Forecast" title="Commodity Price Prediction" icon={TrendingUp}
        desc="Provide agricultural, weather, market and demand inputs to generate an AI-backed price forecast." />
      <InputPanel t={t} form={form} setForm={setForm} onPredict={handlePredict} loading={loading} />
      {loading && (
        <Card t={t} className="p-6 space-y-3">
          <Skeleton t={t} h="1.5rem" w="40%" />
          <Skeleton t={t} h="8rem" />
        </Card>
      )}
      {!loading && prediction && (
        <>
          <PredictionCard t={t} dark={dark} prediction={prediction} />
          <ExplainableAI t={t} prediction={prediction} />
        </>
      )}
      {!loading && !prediction && (
        <Card t={t} className="p-8 text-center">
          <Gauge size={28} className="mx-auto mb-2" color={t.inkFaint} />
          <p className="text-sm" style={{ color: t.inkSoft }}>Fill in the inputs above and click <b>Predict Price</b> to generate a forecast.</p>
        </Card>
      )}
    </div>
  );
}

/* ============================================================
   TRANSPORTATION ANALYSIS
   ============================================================ */
function TransportPage({ t, dark }) {
  const [f, setF] = useState({
    source: "Nashik Warehouse", destination: "Mumbai APMC", distance: 180, mode: "Truck",
    fuelPrice: 96, tollCharges: 850, labourCharges: 1200, loadingCharges: 600, quantityQtl: 300
  });
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));

  const mileage = f.mode === "Truck" ? 4.2 : f.mode === "Rail" ? 20 : 12;
  const fuelCost = Math.round((Number(f.distance) / mileage) * Number(f.fuelPrice));
  const tollCost = Number(f.tollCharges) || 0;
  const labourCost = Number(f.labourCharges) || 0;
  const loadingCost = Number(f.loadingCharges) || 0;
  const total = fuelCost + tollCost + labourCost + loadingCost;
  const perKg = f.quantityQtl > 0 ? (total / (Number(f.quantityQtl) * 100)) : 0;

  const breakdown = [
    { name: "Fuel", value: fuelCost, color: t.primary },
    { name: "Toll", value: tollCost, color: t.green },
    { name: "Labour", value: labourCost, color: "#D97706" },
    { name: "Loading", value: loadingCost, color: "#8B5CF6" }
  ];

  return (
    <div className="space-y-6">
      <SectionHeading t={t} eyebrow="Logistics" title="Transportation Cost Analysis" icon={Truck}
        desc="Model end-to-end transport cost from warehouse to market for the selected mode of transport." />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card t={t} className="p-5 xl:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field t={t} label="Source Warehouse"><TInput t={t} value={f.source} onChange={e => set("source", e.target.value)} /></Field>
            <Field t={t} label="Destination Market"><TInput t={t} value={f.destination} onChange={e => set("destination", e.target.value)} /></Field>
            <Field t={t} label="Distance (km)"><TInput t={t} type="number" value={f.distance} onChange={e => set("distance", e.target.value)} /></Field>
            <Field t={t} label="Transport Mode">
              <TSelect t={t} value={f.mode} onChange={e => set("mode", e.target.value)}>
                <option>Truck</option><option>Rail</option><option>Ship</option>
              </TSelect>
            </Field>
            <Field t={t} label="Fuel Price (\u20B9/L)"><TInput t={t} type="number" value={f.fuelPrice} onChange={e => set("fuelPrice", e.target.value)} /></Field>
            <Field t={t} label="Toll Charges (\u20B9)"><TInput t={t} type="number" value={f.tollCharges} onChange={e => set("tollCharges", e.target.value)} /></Field>
            <Field t={t} label="Labour Charges (\u20B9)"><TInput t={t} type="number" value={f.labourCharges} onChange={e => set("labourCharges", e.target.value)} /></Field>
            <Field t={t} label="Loading Charges (\u20B9)"><TInput t={t} type="number" value={f.loadingCharges} onChange={e => set("loadingCharges", e.target.value)} /></Field>
            <Field t={t} label="Quantity (Quintal)"><TInput t={t} type="number" value={f.quantityQtl} onChange={e => set("quantityQtl", e.target.value)} /></Field>
          </div>
        </Card>

        <div className="space-y-4">
          <Card t={t} className="p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.primary }}>Auto-Calculated Costs</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="flex items-center gap-1.5" style={{ color: t.inkSoft }}><Fuel size={14} /> Fuel Cost</span><span className="font-semibold" style={{ color: t.ink }}>{fmtINR(fuelCost)}</span></div>
              <div className="flex justify-between"><span className="flex items-center gap-1.5" style={{ color: t.inkSoft }}><MapPin size={14} /> Toll Cost</span><span className="font-semibold" style={{ color: t.ink }}>{fmtINR(tollCost)}</span></div>
              <div className="flex justify-between"><span className="flex items-center gap-1.5" style={{ color: t.inkSoft }}><Users size={14} /> Labour Cost</span><span className="font-semibold" style={{ color: t.ink }}>{fmtINR(labourCost)}</span></div>
              <div className="flex justify-between"><span className="flex items-center gap-1.5" style={{ color: t.inkSoft }}><Boxes size={14} /> Loading Cost</span><span className="font-semibold" style={{ color: t.ink }}>{fmtINR(loadingCost)}</span></div>
            </div>
          </Card>
          <Card t={t} className="p-5" style={{ background: t.primarySoft }}>
            <div className="text-xs font-semibold" style={{ color: t.primary }}>Total Transportation Cost</div>
            <div className="text-2xl font-extrabold mt-1" style={{ color: t.ink, fontFamily: "IBM Plex Mono" }}>{fmtINR(total)}</div>
            <div className="text-xs font-semibold mt-3" style={{ color: t.primary }}>Cost per KG</div>
            <div className="text-lg font-bold mt-0.5" style={{ color: t.ink, fontFamily: "IBM Plex Mono" }}>{"\u20B9" + perKg.toFixed(2)}/kg</div>
          </Card>
        </div>
      </div>

      <Card t={t} className="p-5">
        <h3 className="font-bold text-sm mb-3" style={{ color: t.ink, fontFamily: "Manrope" }}>Cost Breakdown</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={breakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {breakdown.map((b, i) => <Cell key={i} fill={b.color} />)}
              </Pie>
              <RTooltip contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {breakdown.map(b => (
              <div key={b.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2" style={{ color: t.inkSoft }}><span className="w-2.5 h-2.5 rounded-full" style={{ background: b.color }} />{b.name}</span>
                <span className="font-semibold" style={{ color: t.ink }}>{fmtINR(b.value)} &middot; {total ? Math.round(b.value / total * 100) : 0}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ============================================================
   WEATHER DATA
   ============================================================ */
function WeatherPage({ t, dark, form }) {
  const base = Number(form.currentPrice) || 2200;
  const rainSeries = useMemo(() => Array.from({ length: 14 }).map((_, i) => ({
    day: `D${i + 1}`, rainfall: Math.round(10 + seededRand(base + i * 3.3) * 90), price: Math.round(base * (1 + (seededRand(base + i * 6) - 0.5) * 0.08))
  })), [base]);
  const tempSeries = useMemo(() => Array.from({ length: 14 }).map((_, i) => ({
    day: `D${i + 1}`, temperature: Math.round(20 + seededRand(base + i * 2.1 + 5) * 16), humidity: Math.round(30 + seededRand(base + i * 1.7 + 9) * 55)
  })), [base]);

  return (
    <div className="space-y-6">
      <SectionHeading t={t} eyebrow="Climate" title="Weather Data & Market Impact" icon={CloudRain}
        desc="Rainfall, temperature and humidity readings feeding the price prediction model." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard t={t} label="Rainfall" value={form.rainfall + " mm"} icon={Droplets} accent={t.primary} />
        <StatCard t={t} label="Temperature" value={form.temperature + " \u00B0C"} icon={Thermometer} accent="#EA580C" />
        <StatCard t={t} label="Humidity" value={form.humidity + " %"} icon={Wind} accent={t.green} />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card t={t} className="p-5">
          <h3 className="font-bold text-sm mb-3" style={{ color: t.ink, fontFamily: "Manrope" }}>Rainfall Trend (14 Days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={rainSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.borderSoft} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: t.inkFaint }} />
              <YAxis tick={{ fontSize: 10, fill: t.inkFaint }} width={35} />
              <RTooltip contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="rainfall" fill={t.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card t={t} className="p-5">
          <h3 className="font-bold text-sm mb-3" style={{ color: t.ink, fontFamily: "Manrope" }}>Temperature vs Humidity</h3>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={tempSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.borderSoft} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: t.inkFaint }} />
              <YAxis tick={{ fontSize: 10, fill: t.inkFaint }} width={35} />
              <RTooltip contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="temperature" stroke="#EA580C" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="humidity" stroke={t.green} strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
        <Card t={t} className="p-5 xl:col-span-2">
          <h3 className="font-bold text-sm mb-3" style={{ color: t.ink, fontFamily: "Manrope" }}>Rainfall vs Price Correlation</h3>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={rainSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.borderSoft} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: t.inkFaint }} />
              <YAxis yAxisId="l" tick={{ fontSize: 10, fill: t.inkFaint }} width={40} />
              <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 10, fill: t.inkFaint }} width={40} />
              <RTooltip contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, fontSize: 12 }} />
              <Bar yAxisId="l" dataKey="rainfall" fill={dark ? "#274257" : "#CFE3F5"} radius={[4, 4, 0, 0]} />
              <Line yAxisId="r" type="monotone" dataKey="price" stroke={t.primary} strokeWidth={2.5} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

/* ============================================================
   BUFFER STOCK DECISION SUPPORT
   ============================================================ */
function BufferPage({ t, dark, prediction }) {
  const currentStock = 3200;
  const changePct = prediction ? prediction.changePct : 4;
  const predictedShortage = Math.max(0, Math.round(changePct * 22));
  let status = "Maintain Current Stock", statusColor = t.green, releaseQty = 0, procureQty = 0;
  if (changePct >= 12) { status = "Release Buffer Stock"; releaseQty = Math.round(changePct * 55); statusColor = "#DC2626"; }
  else if (changePct >= 5) { status = "Increase Procurement"; procureQty = Math.round(changePct * 40); statusColor = "#D97706"; }
  else if (changePct <= -6) { status = "Do Not Release"; statusColor = t.primary; }

  return (
    <div className="space-y-6">
      <SectionHeading t={t} eyebrow="Government Decision Panel" title="Buffer Stock Decision Support" icon={Package}
        desc="Recommended release / procurement action based on the latest AI price forecast." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard t={t} label="Current Buffer Stock" value={currentStock.toLocaleString("en-IN") + " T"} icon={Warehouse} />
        <StatCard t={t} label="Predicted Shortage" value={predictedShortage.toLocaleString("en-IN") + " T"} icon={AlertTriangle} accent="#EA580C" />
        <StatCard t={t} label="Recommended Release" value={releaseQty ? releaseQty.toLocaleString("en-IN") + " T" : "\u2014"} icon={ArrowUp} accent="#DC2626" />
        <StatCard t={t} label="Recommended Procurement" value={procureQty ? procureQty.toLocaleString("en-IN") + " T" : "\u2014"} icon={ShoppingCart} accent={t.green} />
      </div>

      <Card t={t} className="p-6" style={{ borderLeft: `5px solid ${statusColor}` }}>
        <div className="flex items-center gap-2 mb-2">
          <ClipboardList size={18} color={statusColor} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: statusColor }}>Recommendation Status</span>
        </div>
        <h3 className="text-xl font-extrabold" style={{ color: t.ink, fontFamily: "Manrope" }}>
          {status}{releaseQty ? ` \u2014 ${releaseQty.toLocaleString("en-IN")} Tons` : ""}
        </h3>
        <div className="mt-4 p-4 rounded-xl flex gap-3" style={{ background: t.surfaceAlt }}>
          <Info size={16} className="shrink-0 mt-0.5" color={t.primary} />
          <p className="text-sm" style={{ color: t.inkSoft }}>
            {prediction
              ? `The model forecasts a ${changePct >= 0 ? "rise" : "fall"} of ${Math.abs(changePct)}% over the next cycle, driven primarily by ${prediction.factors[0].label.toLowerCase()} (${prediction.factors[0].pct}%) and ${prediction.factors[1].label.toLowerCase()} (${prediction.factors[1].pct}%). This action is recommended to stabilise mandi prices and protect both consumers and farmers.`
              : "Run a prediction on the Price Forecast page to generate a tailored AI explanation for this recommendation."}
          </p>
        </div>
      </Card>
    </div>
  );
}

/* ============================================================
   PROCUREMENT RECOMMENDATIONS
   ============================================================ */
function ProcurementPage({ t, dark }) {
  const rows = COMMODITIES.slice(0, 6).map((c, i) => {
    const seed = hashNum(c);
    const priority = ["Low", "Medium", "High", "Critical"][seed % 4];
    const pc = { Low: t.green, Medium: "#D97706", High: "#EA580C", Critical: "#DC2626" }[priority];
    return {
      commodity: c,
      state: STATES[seed % STATES.length],
      window: ["Oct \u2013 Nov", "Nov \u2013 Dec", "Dec \u2013 Jan", "Jan \u2013 Feb"][seed % 4],
      cost: Math.round(1500 + (seed % 3000)),
      supplier: ["FPO Cluster A", "Regional Cooperative", "State Civil Supplies", "Direct Farmer Group"][seed % 4],
      priority, pc
    };
  });
  return (
    <div className="space-y-6">
      <SectionHeading t={t} eyebrow="Sourcing Strategy" title="Procurement Recommendations" icon={ShoppingCart}
        desc="AI-ranked procurement opportunities across commodities, regions and sourcing windows." />
      <Card t={t} className="overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr style={{ background: t.surfaceAlt }}>
              {["Commodity", "Best State", "Procurement Window", "Est. Cost / qtl", "Supplier / Region", "Priority"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: t.inkSoft }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.commodity} style={{ borderTop: `1px solid ${t.border}` }}>
                <td className="px-4 py-3 font-semibold flex items-center gap-2" style={{ color: t.ink }}><Sprout size={14} color={t.green} />{r.commodity}</td>
                <td className="px-4 py-3" style={{ color: t.inkSoft }}>{r.state}</td>
                <td className="px-4 py-3" style={{ color: t.inkSoft }}>{r.window}</td>
                <td className="px-4 py-3 font-semibold" style={{ color: t.ink, fontFamily: "IBM Plex Mono" }}>{fmtINR(r.cost)}</td>
                <td className="px-4 py-3 flex items-center gap-1.5" style={{ color: t.inkSoft }}><Building2 size={14} />{r.supplier}</td>
                <td className="px-4 py-3"><Badge c={r.pc} bg={r.pc + "22"}>{r.priority}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ============================================================
   ALERTS / EARLY WARNING SYSTEM
   ============================================================ */
function AlertsPage({ t, dark, prediction }) {
  const items = [
    { r: RISK.safe, commodity: "Rice (Paddy)", increase: "0 \u2013 2%", reason: "Stable arrivals and adequate buffer stock.", action: "Continue routine monitoring." },
    { r: RISK.watch, commodity: "Wheat", increase: "4 \u2013 7%", reason: "Slightly lower rainfall in key growing districts.", action: "Increase market surveillance frequency." },
    { r: RISK.spike, commodity: form_commodity(prediction), increase: (prediction ? Math.abs(prediction.changePct) : 12) + "%", reason: "Falling supply against rising festival-season demand.", action: "Prepare buffer stock release order." },
    { r: RISK.critical, commodity: "Onion", increase: "18 \u2013 22%", reason: "Crop damage from unseasonal rainfall in Nashik belt.", action: "Immediate government intervention & import review." }
  ];
  function form_commodity(p) { return p ? "Selected Commodity" : "Tomato"; }
  return (
    <div className="space-y-6">
      <SectionHeading t={t} eyebrow="Early Warning System" title="Market Alerts" icon={Bell}
        desc="Colour-coded alerts flag commodities that require monitoring or intervention." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {items.map((it, i) => (
          <Card key={i} t={t} className="p-5" style={{ borderLeft: `5px solid ${it.r.c}` }}>
            <div className="flex items-center justify-between mb-3">
              <Badge c={it.r.c} bg={dark ? it.r.bgD : it.r.bgL} icon={it.r.key === "safe" ? CheckCircle2 : AlertTriangle}>{it.r.label}</Badge>
              <span className="text-xs font-semibold" style={{ color: t.inkFaint }}>{it.commodity}</span>
            </div>
            <div className="space-y-2 text-sm">
              <div><span className="font-semibold" style={{ color: t.ink }}>Reason: </span><span style={{ color: t.inkSoft }}>{it.reason}</span></div>
              <div><span className="font-semibold" style={{ color: t.ink }}>Affected Commodity: </span><span style={{ color: t.inkSoft }}>{it.commodity}</span></div>
              <div><span className="font-semibold" style={{ color: t.ink }}>Expected Price Increase: </span><span style={{ color: it.r.c, fontWeight: 700 }}>{it.increase}</span></div>
              <div><span className="font-semibold" style={{ color: t.ink }}>Recommended Action: </span><span style={{ color: t.inkSoft }}>{it.action}</span></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   REPORTS
   ============================================================ */
function ReportsPage({ t, dark, form, prediction }) {
  const [generated, setGenerated] = useState(false);

  const summaryRows = [
    ["Commodity", form.commodity],
    ["State / District", `${form.state} / ${form.district}`],
    ["Current Price", fmtINR(Number(form.currentPrice) || 0)],
    ["Predicted Price", prediction ? fmtINR(prediction.today) : "\u2014"],
    ["Price Change", prediction ? prediction.changePct + "%" : "\u2014"],
    ["Confidence", prediction ? prediction.confidence + "%" : "\u2014"],
    ["Risk Level", prediction ? prediction.risk.label : RISK.safe.label],
    ["Report Generated", todayStr()]
  ];

  const downloadExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([["Field", "Value"], ...summaryRows]);
    XLSX.utils.book_append_sheet(wb, ws, "Prediction Summary");
    if (prediction) {
      const ws2 = XLSX.utils.aoa_to_sheet([["Factor", "Contribution %"], ...prediction.factors.map(f => [f.label, f.pct])]);
      XLSX.utils.book_append_sheet(wb, ws2, "AI Insights");
    }
    XLSX.writeFile(wb, "price-intelligence-report.xlsx");
  };
  const downloadPdf = () => { window.print(); };
  const printReport = () => { window.print(); };

  return (
    <div className="space-y-6">
      <SectionHeading t={t} eyebrow="Documentation" title="Reports" icon={FileText}
        desc="Generate a consolidated report covering the prediction, transportation, buffer stock and AI insights." />
      <div className="flex flex-wrap gap-3">
        <Button t={t} variant="primary" onClick={() => setGenerated(true)}><FileText size={15} /> Generate Report</Button>
        <Button t={t} variant="soft" onClick={downloadPdf}><Download size={15} /> Download PDF</Button>
        <Button t={t} variant="soft" onClick={downloadExcel}><Download size={15} /> Download Excel</Button>
        <Button t={t} variant="ghost" onClick={printReport}><Printer size={15} /> Print Report</Button>
      </div>

      {generated && (
        <Card t={t} className="p-6 sm:p-8" id="report-area">
          <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: `1px solid ${t.border}` }}>
            <div className="w-10 h-10 rounded-full grid place-items-center" style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.green})` }}>
              <Sprout size={18} color="#fff" />
            </div>
            <div>
              <h3 className="font-extrabold" style={{ color: t.ink, fontFamily: "Manrope" }}>AI-Enabled Predictive Price Intelligence Report</h3>
              <p className="text-xs" style={{ color: t.inkFaint }}>Buffer Stock Decision Support System &middot; {todayStr()}</p>
            </div>
          </div>

          <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: t.primary }}>Prediction Summary</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {summaryRows.map(([k, v]) => (
              <div key={k} className="p-3 rounded-xl" style={{ background: t.surfaceAlt }}>
                <div className="text-[10px] font-semibold uppercase" style={{ color: t.inkFaint }}>{k}</div>
                <div className="text-sm font-bold mt-0.5" style={{ color: t.ink }}>{v}</div>
              </div>
            ))}
          </div>

          <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: t.primary }}>Transportation Analysis</h4>
          <p className="text-sm mb-6" style={{ color: t.inkSoft }}>See the Transportation Analysis page for a full route-level cost breakdown (fuel, toll, labour, loading) for the current shipment configuration.</p>

          <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: t.primary }}>Buffer Stock Recommendation</h4>
          <p className="text-sm mb-6" style={{ color: t.inkSoft }}>Based on the current forecast, the system recommends reviewing buffer stock levels on the Buffer Stock page; action changes automatically as new predictions are generated.</p>

          <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: t.primary }}>Market Trends</h4>
          <p className="text-sm mb-6" style={{ color: t.inkSoft }}>Historical and predicted price trends are available on the Dashboard, alongside rainfall and demand-supply overlays.</p>

          <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: t.primary }}>AI Insights</h4>
          {prediction ? (
            <ul className="text-sm space-y-1" style={{ color: t.inkSoft }}>
              {prediction.factors.map(f => <li key={f.label}>&bull; {f.label}: {f.pct}% contribution</li>)}
            </ul>
          ) : <p className="text-sm" style={{ color: t.inkSoft }}>Run a prediction on the Price Forecast page to populate AI insights.</p>}
        </Card>
      )}
    </div>
  );
}

/* ============================================================
   SETTINGS
   ============================================================ */
function SettingsPage({ t, dark, setDark, form, setForm }) {
  return (
    <div className="space-y-6">
      <SectionHeading t={t} eyebrow="Preferences" title="Settings" icon={SettingsIcon} desc="Personalise the console appearance and default selections." />
      <Card t={t} className="p-6 max-w-xl">
        <div className="flex items-center justify-between py-3" style={{ borderBottom: `1px solid ${t.border}` }}>
          <div>
            <div className="text-sm font-semibold" style={{ color: t.ink }}>Appearance</div>
            <div className="text-xs mt-0.5" style={{ color: t.inkFaint }}>Switch between light and dark mode</div>
          </div>
          <button onClick={() => setDark(!dark)} className="w-14 h-8 rounded-full p-1 transition-colors" style={{ background: dark ? t.primary : t.border }}>
            <div className="w-6 h-6 rounded-full bg-white transition-transform" style={{ transform: dark ? "translateX(24px)" : "translateX(0)" }} />
          </button>
        </div>
        <div className="py-3" style={{ borderBottom: `1px solid ${t.border}` }}>
          <div className="text-sm font-semibold mb-2" style={{ color: t.ink }}>Default Commodity</div>
          <TSelect t={t} value={form.commodity} onChange={e => setForm(f => ({ ...f, commodity: e.target.value }))}>
            {COMMODITIES.map(c => <option key={c}>{c}</option>)}
          </TSelect>
        </div>
        <div className="pt-3">
          <div className="text-sm font-semibold mb-2" style={{ color: t.ink }}>Default State</div>
          <TSelect t={t} value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value, district: STATE_DISTRICTS[e.target.value][0] }))}>
            {STATES.map(s => <option key={s}>{s}</option>)}
          </TSelect>
        </div>
      </Card>
    </div>
  );
}

/* ============================================================
   ASK AI — structured-form assistant
   Instead of free-text chat, the user fills the same structured
   fields as the prediction form (commodity/state/district/market,
   agricultural, weather, market, demand inputs) and the panel
   sends them to the real Claude API, which returns a written
   assessment. Shares the app's `form` state so it always reflects
   what's selected elsewhere in the console.
   ============================================================ */
function autoFetchForm(setForm) {
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

function AskAIPanel({ t, dark, open, setOpen, form, setForm }) {
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const districts = STATE_DISTRICTS[form.state] || [];

  const handlePredict = async () => {
    setLoading(true);
    setAnswer(null);
    const context = `Commodity Information:
- Commodity: ${form.commodity}
- State: ${form.state}
- District: ${form.district}
- Market/Mandi: ${form.market}

Agricultural Inputs:
- Crop Sowing Area: ${form.sowingArea} ha
- Production Estimate: ${form.production} T
- Expected Yield: ${form.yield} T/ha
- Arrival Quantity: ${form.arrivalQty} qtl

Weather Inputs:
- Rainfall: ${form.rainfall} mm
- Temperature: ${form.temperature} C
- Humidity: ${form.humidity}%

Market Inputs:
- Current Price: Rs ${form.currentPrice}/qtl
- Last Week Price: Rs ${form.lastWeekPrice}/qtl
- Last Month Price: Rs ${form.lastMonthPrice}/qtl

Demand Inputs:
- Consumer Demand: ${form.demand} qtl/day
- Festival Season: ${form.festival ? "Yes" : "No"}`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: "You are the built-in AI analyst inside \"AI-Enabled Predictive Price Intelligence & Buffer Stock Decision Support System\", a government agricultural market platform. Given the structured commodity, agricultural, weather, market and demand inputs the user provides, write a concise price assessment: your read on where the price is headed, the main drivers, a risk level (Normal / Watch / Price Spike Expected / Immediate Intervention Required), and one recommended action for a government market officer. Keep it under 150 words, plain language, cite rupee figures where useful.",
          messages: [{ role: "user", content: context }]
        })
      });
      const data = await response.json();
      const textBlock = (data.content || []).find(b => b.type === "text");
      setAnswer(textBlock ? textBlock.text : "Sorry, I couldn't generate a response just now. Please try again.");
    } catch (e) {
      setAnswer("Something went wrong reaching the AI service. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setForm(DEFAULT_FORM); setAnswer(null); };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full grid place-items-center transition-transform hover:scale-105 active:scale-95"
        style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.green})`, boxShadow: t.shadow }}
        aria-label="Ask AI"
      >
        {open ? <X size={22} color="#fff" /> : <Sparkles size={22} color="#fff" />}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-5 z-50 w-[94vw] max-w-md h-[78vh] max-h-[680px] rounded-2xl flex flex-col overflow-hidden"
          style={{ background: t.surface, border: `1px solid ${t.border}`, boxShadow: t.shadow }}
        >
          <div className="px-4 py-3 flex items-center gap-2.5 shrink-0" style={{ borderBottom: `1px solid ${t.border}`, background: t.primarySoft }}>
            <span className="w-8 h-8 rounded-full grid place-items-center shrink-0" style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.green})` }}>
              <Sparkles size={15} color="#fff" />
            </span>
            <div className="min-w-0">
              <div className="text-sm font-bold truncate" style={{ color: t.ink, fontFamily: "Manrope" }}>Ask AI</div>
              <div className="text-[11px]" style={{ color: t.inkFaint }}>Fill the inputs, get an AI assessment</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: t.primary }}>Commodity Information</h3>
              <div className="grid grid-cols-2 gap-2.5">
                <Field t={t} label="Commodity">
                  <TSelect t={t} value={form.commodity} onChange={e => set("commodity", e.target.value)}>
                    {COMMODITIES.map(c => <option key={c}>{c}</option>)}
                  </TSelect>
                </Field>
                <Field t={t} label="State">
                  <TSelect t={t} value={form.state} onChange={e => { set("state", e.target.value); set("district", STATE_DISTRICTS[e.target.value][0]); }}>
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </TSelect>
                </Field>
                <Field t={t} label="District">
                  <TSelect t={t} value={form.district} onChange={e => set("district", e.target.value)}>
                    {districts.map(d => <option key={d}>{d}</option>)}
                  </TSelect>
                </Field>
                <Field t={t} label="Market / Mandi">
                  <TSelect t={t} value={form.market} onChange={e => set("market", e.target.value)}>
                    {MARKETS.map(m => <option key={m}>{m}</option>)}
                  </TSelect>
                </Field>
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: t.primary }}>Agricultural Inputs</h3>
              <div className="grid grid-cols-2 gap-2.5">
                <Field t={t} label="Crop Sowing Area (ha)"><TInput t={t} type="number" value={form.sowingArea} onChange={e => set("sowingArea", e.target.value)} /></Field>
                <Field t={t} label="Production Estimate (T)"><TInput t={t} type="number" value={form.production} onChange={e => set("production", e.target.value)} /></Field>
                <Field t={t} label="Expected Yield (T/ha)"><TInput t={t} type="number" value={form.yield} onChange={e => set("yield", e.target.value)} /></Field>
                <Field t={t} label="Arrival Quantity (qtl)"><TInput t={t} type="number" value={form.arrivalQty} onChange={e => set("arrivalQty", e.target.value)} /></Field>
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: t.primary }}>Weather Inputs</h3>
              <div className="grid grid-cols-3 gap-2.5">
                <Field t={t} label="Rainfall (mm)"><TInput t={t} type="number" value={form.rainfall} onChange={e => set("rainfall", e.target.value)} /></Field>
                <Field t={t} label="Temp (\u00B0C)"><TInput t={t} type="number" value={form.temperature} onChange={e => set("temperature", e.target.value)} /></Field>
                <Field t={t} label="Humidity (%)"><TInput t={t} type="number" value={form.humidity} onChange={e => set("humidity", e.target.value)} /></Field>
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: t.primary }}>Market Inputs</h3>
              <div className="grid grid-cols-1 gap-2.5">
                <Field t={t} label="Current Price (\u20B9/qtl)"><TInput t={t} type="number" value={form.currentPrice} onChange={e => set("currentPrice", e.target.value)} /></Field>
                <div className="grid grid-cols-2 gap-2.5">
                  <Field t={t} label="Last Week Price"><TInput t={t} type="number" value={form.lastWeekPrice} onChange={e => set("lastWeekPrice", e.target.value)} /></Field>
                  <Field t={t} label="Last Month Price"><TInput t={t} type="number" value={form.lastMonthPrice} onChange={e => set("lastMonthPrice", e.target.value)} /></Field>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: t.primary }}>Demand Inputs</h3>
              <div className="flex items-end gap-2.5">
                <div className="flex-1"><Field t={t} label="Consumer Demand (qtl/day)"><TInput t={t} type="number" value={form.demand} onChange={e => set("demand", e.target.value)} /></Field></div>
                <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer shrink-0" style={{ background: t.surfaceAlt, border: `1px solid ${t.border}` }}>
                  <input type="checkbox" checked={form.festival} onChange={e => set("festival", e.target.checked)} />
                  <span className="text-xs font-medium whitespace-nowrap" style={{ color: t.ink }}>Festival</span>
                </label>
              </div>
            </div>

            {loading && (
              <div className="space-y-2 p-3 rounded-xl" style={{ background: t.surfaceAlt }}>
                <Skeleton t={t} h="0.9rem" w="70%" />
                <Skeleton t={t} h="0.9rem" w="95%" />
                <Skeleton t={t} h="0.9rem" w="60%" />
              </div>
            )}
            {!loading && answer && (
              <div className="p-3.5 rounded-xl text-sm leading-relaxed whitespace-pre-wrap" style={{ background: t.primarySoft, color: t.ink }}>
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: t.primary }}>
                  <Sparkles size={12} /> AI Assessment
                </div>
                {answer}
              </div>
            )}
          </div>

          <div className="p-3 flex flex-wrap gap-2 shrink-0" style={{ borderTop: `1px solid ${t.border}` }}>
            <Button t={t} variant="primary" onClick={handlePredict} disabled={loading}>
              {loading ? <RefreshCw size={14} className="animate-spin" /> : <TrendingUp size={14} />}
              {loading ? "Predicting..." : "Predict Price"}
            </Button>
            <Button t={t} variant="ghost" onClick={handleReset}><X size={14} /> Reset</Button>
            <Button t={t} variant="soft" onClick={() => autoFetchForm(setForm)}><RefreshCw size={14} /> Auto Fetch Data</Button>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   APP ROOT
   ============================================================ */
export default function App() {
  const [dark, setDark] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapState, setMapState] = useState(null);
  const [askOpen, setAskOpen] = useState(false);

  const t = dark ? PALETTE.dark : PALETTE.light;
  const pageLabel = NAV.find(n => n.key === page)?.label || "Dashboard";

  return (
    <div style={{ background: t.bg, minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('${FONT_LINK}');
        * { box-sizing: border-box; }
        ::selection { background: ${t.primary}33; }
        input:focus, select:focus { box-shadow: 0 0 0 3px ${t.primary}33; border-color: ${t.primary} !important; }
        @media print {
          aside, header, .no-print { display: none !important; }
        }
      `}</style>
      <div className="flex">
        <Sidebar t={t} dark={dark} page={page} setPage={setPage} collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <div className="flex-1 min-w-0">
          <Topbar t={t} dark={dark} setDark={setDark} setMobileOpen={setMobileOpen} pageLabel={pageLabel} />
          <main className="p-4 sm:p-6 max-w-[1600px] mx-auto">
            {page === "dashboard" && <Dashboard t={t} dark={dark} form={form} prediction={prediction} mapState={mapState} setMapState={setMapState} />}
            {page === "forecast" && <ForecastPage t={t} dark={dark} form={form} setForm={setForm} prediction={prediction} setPrediction={setPrediction} loading={loading} setLoading={setLoading} />}
            {page === "transport" && <TransportPage t={t} dark={dark} />}
            {page === "weather" && <WeatherPage t={t} dark={dark} form={form} />}
            {page === "buffer" && <BufferPage t={t} dark={dark} prediction={prediction} />}
            {page === "procurement" && <ProcurementPage t={t} dark={dark} />}
            {page === "alerts" && <AlertsPage t={t} dark={dark} prediction={prediction} />}
            {page === "reports" && <ReportsPage t={t} dark={dark} form={form} prediction={prediction} />}
            {page === "settings" && <SettingsPage t={t} dark={dark} setDark={setDark} form={form} setForm={setForm} />}
          </main>
        </div>
      </div>
      <AskAIPanel t={t} dark={dark} open={askOpen} setOpen={setAskOpen} form={form} setForm={setForm} />
    </div>
  );
}

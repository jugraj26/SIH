import React, { useMemo } from "react";
import { LayoutDashboard, Sprout, MapPin, Wallet, TrendingUp, Warehouse, ShieldAlert, Calendar, X } from "lucide-react";
import { AreaChart, Area, LineChart, Line, ComposedChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, Legend, ResponsiveContainer } from "recharts";
import { RISK } from "../theme/theme";
import { MAP_STATES } from "../data/constants";
import { buildHistory, buildForecast, hashNum, riskFor, seededRand, fmtINR } from "../utils/helpers";
import { Card, SectionHeading, StatCard, Badge } from "../components/UI";

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

export default Dashboard;

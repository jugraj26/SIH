import React, { useMemo } from "react";
import { CloudRain, Droplets, Thermometer, Wind } from "lucide-react";
import { BarChart, Bar, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, Legend, ResponsiveContainer } from "recharts";
import { StatCard, Card, SectionHeading } from "../components/UI";
import { seededRand } from "../utils/helpers";

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

export default WeatherPage;

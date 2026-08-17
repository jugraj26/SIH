import React, { useState } from "react";
import { Truck, Fuel, MapPin, Users, Boxes } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip as RTooltip, ResponsiveContainer } from "recharts";
import { Card, SectionHeading, Field, TInput, TSelect } from "../components/UI";
import { fmtINR } from "../utils/helpers";

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

export default TransportPage;

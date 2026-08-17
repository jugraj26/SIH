import React from "react";
import { ShoppingCart, Sprout, Building2 } from "lucide-react";
import { COMMODITIES, STATES } from "../data/constants";
import { hashNum, fmtINR } from "../utils/helpers";
import { Card, SectionHeading, Badge } from "../components/UI";

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

export default ProcurementPage;

import React from "react";
import { Package, Warehouse, AlertTriangle, ArrowUp, ShoppingCart, ClipboardList, Info } from "lucide-react";
import { Card, SectionHeading, StatCard } from "../components/UI";

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

export default BufferPage;

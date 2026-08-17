import React from "react";
import { Bell, CheckCircle2, AlertTriangle } from "lucide-react";
import { RISK } from "../theme/theme";
import { Card, SectionHeading, Badge } from "../components/UI";

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

export default AlertsPage;

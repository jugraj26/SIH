import React, { useState } from "react";
import { FileText, Download, Printer, Sprout } from "lucide-react";
import * as XLSX from "xlsx";
import { RISK } from "../theme/theme";
import { Card, SectionHeading, Button } from "../components/UI";
import { fmtINR, todayStr } from "../utils/helpers";

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

export default ReportsPage;

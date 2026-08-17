import React, { useState } from "react";
import { Sprout } from "lucide-react";
import { PALETTE, FONT_LINK } from "./theme/theme";
import { DEFAULT_FORM, NAV } from "./data/constants";
import { Sidebar, Topbar } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ForecastPage from "./pages/Forecast";
import TransportPage from "./pages/Transport";
import WeatherPage from "./pages/Weather";
import BufferPage from "./pages/Buffer";
import ProcurementPage from "./pages/Procurement";
import AlertsPage from "./pages/Alerts";
import ReportsPage from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import AskAIPanel from "./pages/AskAI";

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
        @media print { aside, header, .no-print { display: none !important; } }
      `}</style>

      <div className="flex">
        <Sidebar t={t} page={page} setPage={setPage} collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
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

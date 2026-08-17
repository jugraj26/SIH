import React from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { COMMODITIES, STATES, STATE_DISTRICTS } from "../data/constants";
import { Card, SectionHeading, TSelect } from "../components/UI";

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

export default SettingsPage;

import React, { useState } from "react";
import { X, Sparkles, TrendingUp, RefreshCw } from "lucide-react";
import { COMMODITIES, STATES, STATE_DISTRICTS, MARKETS, DEFAULT_FORM } from "../data/constants";
import { autoFetchForm } from "../utils/helpers";
import { Card, Field, TInput, TSelect, Button, Skeleton } from "../components/UI";

/* ============================================================
   ASK AI — structured-form assistant
   Instead of free-text chat, the user fills the same structured
   fields as the prediction form (commodity/state/district/market,
   agricultural, weather, market, demand inputs) and the panel
   sends them to the real Claude API, which returns a written
   assessment. Shares the app's `form` state so it always reflects
   what's selected elsewhere in the console.
   ============================================================ */
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

export default AskAIPanel;

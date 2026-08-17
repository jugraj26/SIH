import React from "react";
import { TrendingUp, X, RefreshCw, Gauge, ArrowUp, ArrowDown, ShieldAlert, Info } from "lucide-react";
import { AreaChart, Area, RadialBarChart, RadialBar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer } from "recharts";
import { COMMODITIES, STATES, STATE_DISTRICTS, MARKETS, DEFAULT_FORM } from "../data/constants";
import { RISK } from "../theme/theme";
import { buildForecast, seededRand, fmtINR, autoFetchForm } from "../utils/helpers";
import { Card, SectionHeading, Field, TInput, TSelect, Badge, Button, Skeleton } from "../components/UI";

/* ============================================================
   PRICE FORECAST PAGE (Input Panel + AI Prediction + XAI)
   ============================================================ */


function InputPanel({ t, form, setForm, onPredict, loading }) {
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const districts = STATE_DISTRICTS[form.state] || [];

  return (
    <Card t={t} className="p-5 sm:p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.primary }}>Commodity Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.primary }}>Agricultural Inputs</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Field t={t} label="Crop Sowing Area (ha)"><TInput t={t} type="number" value={form.sowingArea} onChange={e => set("sowingArea", e.target.value)} /></Field>
            <Field t={t} label="Production Estimate (T)"><TInput t={t} type="number" value={form.production} onChange={e => set("production", e.target.value)} /></Field>
            <Field t={t} label="Expected Yield (T/ha)"><TInput t={t} type="number" value={form.yield} onChange={e => set("yield", e.target.value)} /></Field>
            <Field t={t} label="Arrival Quantity (qtl)"><TInput t={t} type="number" value={form.arrivalQty} onChange={e => set("arrivalQty", e.target.value)} /></Field>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.primary }}>Weather Inputs</h3>
          <div className="grid grid-cols-3 gap-3">
            <Field t={t} label="Rainfall (mm)"><TInput t={t} type="number" value={form.rainfall} onChange={e => set("rainfall", e.target.value)} /></Field>
            <Field t={t} label="Temperature (\u00B0C)"><TInput t={t} type="number" value={form.temperature} onChange={e => set("temperature", e.target.value)} /></Field>
            <Field t={t} label="Humidity (%)"><TInput t={t} type="number" value={form.humidity} onChange={e => set("humidity", e.target.value)} /></Field>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.primary }}>Market Inputs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field t={t} label="Current Price (\u20B9/qtl)"><TInput t={t} type="number" value={form.currentPrice} onChange={e => set("currentPrice", e.target.value)} /></Field>
            <Field t={t} label="Last Week Price (\u20B9/qtl)"><TInput t={t} type="number" value={form.lastWeekPrice} onChange={e => set("lastWeekPrice", e.target.value)} /></Field>
            <Field t={t} label="Last Month Price (\u20B9/qtl)"><TInput t={t} type="number" value={form.lastMonthPrice} onChange={e => set("lastMonthPrice", e.target.value)} /></Field>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.primary }}>Demand Inputs</h3>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1"><Field t={t} label="Consumer Demand (qtl/day)"><TInput t={t} type="number" value={form.demand} onChange={e => set("demand", e.target.value)} /></Field></div>
            <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer" style={{ background: t.surfaceAlt, border: `1px solid ${t.border}` }}>
              <input type="checkbox" checked={form.festival} onChange={e => set("festival", e.target.checked)} />
              <span className="text-sm font-medium" style={{ color: t.ink }}>Festival Season</span>
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2" style={{ borderTop: `1px solid ${t.border}` }}>
          <Button t={t} variant="primary" onClick={onPredict} disabled={loading}>
            {loading ? <RefreshCw size={15} className="animate-spin" /> : <TrendingUp size={15} />}
            {loading ? "Predicting..." : "Predict Price"}
          </Button>
          <Button t={t} variant="ghost" onClick={() => setForm(DEFAULT_FORM)}><X size={15} /> Reset</Button>
          <Button t={t} variant="soft" onClick={() => autoFetchForm(setForm)}><RefreshCw size={15} /> Auto Fetch Data</Button>
        </div>
      </div>
    </Card>
  );
}

function computePrediction(form) {
  const base = Number(form.currentPrice) || 2000;
  const rainfall = Number(form.rainfall) || 50;
  const demand = Number(form.demand) || 500;
  const arrival = Number(form.arrivalQty) || 300;
  const lastMonth = Number(form.lastMonthPrice) || base;
  const festivalBoost = form.festival ? 6 : 0;
  const supplyPressure = (arrival - demand) / Math.max(demand, 1);
  const rainEffect = (rainfall - 60) / 100 * -4;
  const momentum = ((base - lastMonth) / Math.max(lastMonth, 1)) * 100 * 0.4;
  const changePct = +(festivalBoost + rainEffect + momentum - supplyPressure * 8 + 2).toFixed(1);
  const today = Math.round(base * (1 + changePct / 100));
  const confidence = Math.max(62, Math.min(96, Math.round(78 - Math.abs(changePct) * 1.2 + seededRand(base) * 8)));

  const trend7 = buildForecast(base, 7, changePct);
  const trend30 = buildForecast(base, 30, changePct * 1.3);

  let riskLevel = RISK.safe;
  if (Math.abs(changePct) >= 18) riskLevel = RISK.critical;
  else if (Math.abs(changePct) >= 11) riskLevel = RISK.spike;
  else if (Math.abs(changePct) >= 5) riskLevel = RISK.watch;

  const rawFactors = [
    { label: "Rainfall", v: Math.abs(rainEffect) + 8 },
    { label: "Transportation Cost", v: 14 + seededRand(base + 1) * 6 },
    { label: "Demand", v: Math.abs(demand / 20) * 0.6 + 10 },
    { label: "Supply", v: Math.abs(supplyPressure) * 40 + 9 },
    { label: "Buffer Stock", v: 8 + seededRand(base + 2) * 6 },
    { label: "Festival Season", v: form.festival ? 16 : 4 },
    { label: "Government Policies", v: 7 + seededRand(base + 3) * 5 }
  ];
  const total = rawFactors.reduce((s, f) => s + f.v, 0);
  const factors = rawFactors.map(f => ({ label: f.label, pct: +(f.v / total * 100).toFixed(1) }))
    .sort((a, b) => b.pct - a.pct);

  return { today, changePct, confidence, trend7, trend30, risk: riskLevel, factors, base };
}

function PredictionCard({ t, dark, prediction }) {
  if (!prediction) return null;
  const p = prediction;
  const day7 = p.trend7[p.trend7.length - 1].price;
  const day30 = p.trend30[p.trend30.length - 1].price;
  const gaugeData = [{ name: "conf", value: p.confidence, fill: t.green }];

  return (
    <Card t={t} className="p-5 sm:p-6" style={{ background: `linear-gradient(135deg, ${t.primarySoft}, ${t.surface} 55%)` }}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <Badge c={t.primary} bg={t.surface} icon={TrendingUp}>AI Price Prediction</Badge>
        <Badge c={p.risk.c} bg={dark ? p.risk.bgD : p.risk.bgL} icon={ShieldAlert}>{p.risk.label}</Badge>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <div className="text-xs font-semibold" style={{ color: t.inkSoft }}>Today's Predicted Price</div>
          <div className="text-2xl font-extrabold mt-1" style={{ color: t.ink, fontFamily: "IBM Plex Mono" }}>{fmtINR(p.today)}</div>
        </div>
        <div>
          <div className="text-xs font-semibold" style={{ color: t.inkSoft }}>7-Day Forecast</div>
          <div className="text-2xl font-extrabold mt-1" style={{ color: t.ink, fontFamily: "IBM Plex Mono" }}>{fmtINR(day7)}</div>
        </div>
        <div>
          <div className="text-xs font-semibold" style={{ color: t.inkSoft }}>30-Day Forecast</div>
          <div className="text-2xl font-extrabold mt-1" style={{ color: t.ink, fontFamily: "IBM Plex Mono" }}>{fmtINR(day30)}</div>
        </div>
        <div>
          <div className="text-xs font-semibold" style={{ color: t.inkSoft }}>Price Change</div>
          <div className="text-2xl font-extrabold mt-1 flex items-center gap-1" style={{ color: p.changePct >= 0 ? "#DC2626" : "#16A34A", fontFamily: "IBM Plex Mono" }}>
            {p.changePct >= 0 ? <ArrowUp size={18} /> : <ArrowDown size={18} />}{Math.abs(p.changePct)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
        <div className="lg:col-span-2">
          <div className="text-xs font-semibold mb-2" style={{ color: t.inkSoft }}>30-Day Animated Trend</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={p.trend30}>
              <defs>
                <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={t.green} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={t.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" hide />
              <YAxis hide domain={["dataMin - 50", "dataMax + 50"]} />
              <RTooltip contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, fontSize: 12 }} />
              <Area type="monotone" dataKey="price" stroke={t.green} strokeWidth={2.5} fill="url(#predGrad)" isAnimationActive animationDuration={1200} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="text-xs font-semibold mb-1" style={{ color: t.inkSoft }}>Prediction Confidence</div>
          <ResponsiveContainer width="100%" height={140}>
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={gaugeData} startAngle={90} endAngle={-270}>
              <RadialBar background dataKey="value" cornerRadius={20} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="-mt-24 text-2xl font-extrabold" style={{ color: t.ink, fontFamily: "IBM Plex Mono" }}>{p.confidence}%</div>
        </div>
      </div>
    </Card>
  );
}

function ExplainableAI({ t, prediction }) {
  if (!prediction) return null;
  return (
    <Card t={t} className="p-5 sm:p-6">
      <SectionHeading t={t} title="Explainable AI" icon={Info} desc="Why the model made this prediction — relative contribution of each factor." />
      <div className="space-y-3.5">
        {prediction.factors.map(f => (
          <div key={f.label}>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span style={{ color: t.ink }}>{f.label}</span>
              <span style={{ color: t.primary }}>{f.pct}%</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: t.borderSoft }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${f.pct * 2.2}%`, background: `linear-gradient(90deg, ${t.primary}, ${t.green})` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ForecastPage({ t, dark, form, setForm, prediction, setPrediction, loading, setLoading }) {
  const handlePredict = () => {
    setLoading(true);
    setTimeout(() => {
      setPrediction(computePrediction(form));
      setLoading(false);
    }, 900);
  };
  return (
    <div className="space-y-6">
      <SectionHeading t={t} eyebrow="Price Forecast" title="Commodity Price Prediction" icon={TrendingUp}
        desc="Provide agricultural, weather, market and demand inputs to generate an AI-backed price forecast." />
      <InputPanel t={t} form={form} setForm={setForm} onPredict={handlePredict} loading={loading} />
      {loading && (
        <Card t={t} className="p-6 space-y-3">
          <Skeleton t={t} h="1.5rem" w="40%" />
          <Skeleton t={t} h="8rem" />
        </Card>
      )}
      {!loading && prediction && (
        <>
          <PredictionCard t={t} dark={dark} prediction={prediction} />
          <ExplainableAI t={t} prediction={prediction} />
        </>
      )}
      {!loading && !prediction && (
        <Card t={t} className="p-8 text-center">
          <Gauge size={28} className="mx-auto mb-2" color={t.inkFaint} />
          <p className="text-sm" style={{ color: t.inkSoft }}>Fill in the inputs above and click <b>Predict Price</b> to generate a forecast.</p>
        </Card>
      )}
    </div>
  );
}

export default ForecastPage;

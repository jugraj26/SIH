import React, { useState } from "react";

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */
export function Card({ t, style, className = "", children, hover = true }) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${hover ? "hover:-translate-y-0.5" : ""} ${className}`}
      style={{ background: t.surface, borderColor: t.border, boxShadow: t.shadow, ...style }}
    >
      {children}
    </div>
  );
}
export function SectionHeading({ t, eyebrow, title, desc, icon: Icon, right }) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
      <div>
        {eyebrow && (
          <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: t.primary, fontFamily: "Manrope" }}>
            {eyebrow}
          </div>
        )}
        <div className="flex items-center gap-2.5">
          {Icon && (
            <span className="grid place-items-center w-9 h-9 rounded-xl" style={{ background: t.primarySoft, color: t.primary }}>
              <Icon size={18} />
            </span>
          )}
          <h2 className="text-xl font-bold" style={{ color: t.ink, fontFamily: "Manrope" }}>{title}</h2>
        </div>
        {desc && <p className="text-sm mt-1.5 max-w-2xl" style={{ color: t.inkSoft }}>{desc}</p>}
      </div>
      {right}
    </div>
  );
}
export function StatCard({ t, label, value, sub, icon: Icon, trend, accent }) {
  return (
    <Card t={t} className="p-5 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: t.inkSoft }}>{label}</div>
        {Icon && <span className="grid place-items-center w-8 h-8 rounded-lg" style={{ background: (accent ? accent + "22" : t.primarySoft), color: accent || t.primary }}><Icon size={15} /></span>}
      </div>
      <div className="mt-2 text-2xl font-extrabold" style={{ color: t.ink, fontFamily: "IBM Plex Mono" }}>{value}</div>
      {(sub || trend) && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium">
          {trend != null && (
            <span className="flex items-center gap-0.5" style={{ color: trend >= 0 ? "#DC2626" : "#16A34A" }}>
              {trend >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {Math.abs(trend).toFixed(1)}%
            </span>
          )}
          {sub && <span style={{ color: t.inkFaint }}>{sub}</span>}
        </div>
      )}
    </Card>
  );
}
export function Field({ t, label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold mb-1.5" style={{ color: t.inkSoft }}>{label}</span>
      {children}
    </label>
  );
}
const inputCls = "w-full px-3 py-2 rounded-xl text-sm outline-none transition-colors focus:ring-2";
export function TInput({ t, ...props }) {
  return <input {...props} className={inputCls} style={{ background: t.surfaceAlt, border: `1px solid ${t.border}`, color: t.ink }} />;
}
export function TSelect({ t, children, ...props }) {
  return <select {...props} className={inputCls} style={{ background: t.surfaceAlt, border: `1px solid ${t.border}`, color: t.ink }}>{children}</select>;
}
export function Badge({ c, bg, children, icon: Icon }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ color: c, background: bg }}>
      {Icon && <Icon size={12} />} {children}
    </span>
  );
}
export function Button({ t, variant = "primary", children, ...props }) {
  const styles = {
    primary: { background: t.primary, color: "#fff", border: "none" },
    green: { background: t.green, color: "#fff", border: "none" },
    ghost: { background: "transparent", color: t.ink, border: `1px solid ${t.border}` },
    soft: { background: t.primarySoft, color: t.primary, border: "none" }
  };
  return (
    <button
      {...props}
      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 hover:brightness-105 disabled:opacity-50"
      style={styles[variant]}
    >
      {children}
    </button>
  );
}
export function Skeleton({ t, h = "1rem", w = "100%", className = "" }) {
  return <div className={`rounded-lg animate-pulse ${className}`} style={{ height: h, width: w, background: t.borderSoft }} />;
}
export function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap"
          style={{ background: "#0F1E33", color: "#fff", boxShadow: "0 8px 20px rgba(0,0,0,0.25)" }}>
          {text}
        </span>
      )}
    </span>
  );
}

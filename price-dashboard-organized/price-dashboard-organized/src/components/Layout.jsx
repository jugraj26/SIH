import React from "react";
import { Menu, X, Sun, Moon, Calendar, ChevronRight, ChevronLeft, Sprout, LayoutDashboard, TrendingUp, Truck, CloudRain, Package, ShoppingCart, Bell, FileText, Settings as SettingsIcon } from "lucide-react";
import { NAV } from "../data/constants";
import { todayStr } from "../utils/helpers";
import { Tooltip } from "./UI";

const ICONS = { LayoutDashboard, TrendingUp, Truck, CloudRain, Package, ShoppingCart, Bell, FileText, SettingsIcon };
/* ============================================================
   NAVIGATION
   ============================================================ */
const NAV_ITEMS = NAV.map(item => ({ ...item, icon: ICONS[item.iconName] }));

export function Sidebar({ t, dark, page, setPage, collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 flex flex-col transition-all duration-300
          ${collapsed ? "w-[76px]" : "w-[260px]"} ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ background: t.surface, borderRight: `1px solid ${t.border}` }}
      >
        <div className="h-16 flex items-center gap-2.5 px-4 shrink-0" style={{ borderBottom: `1px solid ${t.border}` }}>
          <div className="w-9 h-9 rounded-full grid place-items-center shrink-0" style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.green})` }}>
            <Sprout size={17} color="#fff" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-[13px] font-extrabold leading-tight truncate" style={{ color: t.ink, fontFamily: "Manrope" }}>AgriPrice Intel</div>
              <div className="text-[10px] font-semibold tracking-wide uppercase truncate" style={{ color: t.inkFaint }}>Buffer Stock DSS</div>
            </div>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1">
          {NAV_ITEMS.map(item => {
            const active = page === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => { setPage(item.key); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors relative"
                style={{
                  background: active ? t.primarySoft : "transparent",
                  color: active ? t.primary : t.inkSoft
                }}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full" style={{ background: t.primary }} />}
              </button>
            );
          })}
        </nav>
        <div className="p-2.5 shrink-0" style={{ borderTop: `1px solid ${t.border}` }}>
          <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold" style={{ color: t.inkSoft, background: t.surfaceAlt }}>
            {collapsed ? <ChevronRight size={15} /> : <><ChevronLeft size={15} /> Collapse</>}
          </button>
        </div>
      </aside>
    </>
  );
}

export function Topbar({ t, dark, setDark, setMobileOpen, pageLabel }) {
  return (
    <div className="sticky top-0 z-30" style={{ background: t.surface, borderBottom: `1px solid ${t.border}` }}>
      <div className="h-0.5 w-full flex">
        <div className="flex-1" style={{ background: "#F59E0B" }} />
        <div className="flex-1" style={{ background: t.primary }} />
        <div className="flex-1" style={{ background: t.green }} />
      </div>
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg" style={{ color: t.ink, background: t.surfaceAlt }}>
            <Menu size={18} />
          </button>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: t.inkFaint }}>Ministry-grade Analytics Console</div>
            <h1 className="text-base sm:text-lg font-bold truncate" style={{ color: t.ink, fontFamily: "Manrope" }}>{pageLabel}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-xl" style={{ color: t.inkSoft, background: t.surfaceAlt }}>
            <Calendar size={14} /> {todayStr()}
          </div>
          <Tooltip text="Live system status: nominal">
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl" style={{ color: "#16A34A", background: dark ? "#0E2A1C" : "#E7F7ED" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#16A34A" }} /> Live
            </span>
          </Tooltip>
          <button onClick={() => setDark(!dark)} className="p-2.5 rounded-xl" style={{ color: t.ink, background: t.surfaceAlt }}>
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </div>
  );

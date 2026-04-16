"use client";

import { useState } from "react";

/**
 * Glass-morphism card with a collapse toggle.
 * Uses CSS grid trick for smooth height animation at any content size.
 */
export default function CollapsibleCard({
  title,
  icon,
  headerRight,
  defaultCollapsed = false,
  onClose,
  children,
  className = "",
  accentColor = "cyan", // 'cyan' | 'emerald' | 'indigo'
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const accentMap = {
    cyan:    "border-cyan-500/20   hover:border-cyan-500/35",
    emerald: "border-emerald-500/20 hover:border-emerald-500/35",
    indigo:  "border-indigo-500/20  hover:border-indigo-500/35",
  };
  const accent = accentMap[accentColor] ?? accentMap.cyan;

  return (
    <div
      className={`
        relative rounded-xl overflow-hidden border transition-colors duration-300
        bg-slate-900/92
        ${accent}
        ${className}
      `}
    >
      {/* ── HUD corner brackets ── */}
      <HudCorners color={accentColor} />

      {/* ── Header / toggle + drag handle ── */}
      <button
        data-drag-handle="true"
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.03] transition-colors group cursor-grab active:cursor-grabbing select-none"
        aria-expanded={!collapsed}
      >
        <div className="flex items-center gap-2 min-w-0">
          {/* Drag indicator dots */}
          <span className="text-slate-600 text-xs leading-none select-none shrink-0" style={{ letterSpacing: "-1px" }}>
            ⠿
          </span>
          {icon && (
            <span className="text-lg shrink-0 select-none">{icon}</span>
          )}
          <span className="text-sm font-semibold text-slate-200 truncate">{title}</span>
          {headerRight && <span className="shrink-0">{headerRight}</span>}
        </div>

        {/* Chevron */}
        <svg
          className={`w-4 h-4 shrink-0 ml-2 transition-transform duration-300 ${
            collapsed ? "rotate-0 text-slate-600" : "rotate-180 text-slate-400"
          } group-hover:text-slate-300`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ── Close button (only when onClose provided) ── */}
      {onClose && (
        <button
          data-no-drag="true"
          onClick={onClose}
          className="absolute top-2.5 right-8 w-5 h-5 flex items-center justify-center rounded text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
          aria-label="Fechar"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* ── Collapsible content (grid trick for smooth height) ── */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

/** Tiny AR-style corner brackets rendered as absolute spans */
function HudCorners({ color }) {
  const colorMap = {
    cyan:    "border-cyan-500/30",
    emerald: "border-emerald-500/30",
    indigo:  "border-indigo-500/30",
  };
  const c = colorMap[color] ?? colorMap.cyan;
  const base = `absolute w-3 h-3 ${c}`;
  return (
    <>
      <span className={`${base} top-1 left-1   border-t border-l`} />
      <span className={`${base} top-1 right-1  border-t border-r`} />
      <span className={`${base} bottom-1 left-1  border-b border-l`} />
      <span className={`${base} bottom-1 right-1 border-b border-r`} />
    </>
  );
}

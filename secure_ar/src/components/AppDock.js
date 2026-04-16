"use client";

import { useState } from "react";
import Link from "next/link";

// Apps que abrem/fecham painéis na tela
const PANEL_APPS = [
  { key: "session",  icon: "🧑", label: "Sessão",      bg: "#06b6d4" },
  { key: "security", icon: "⚡", label: "Segurança",   bg: "#10b981" },
  { key: "device",   icon: "🥽", label: "Dispositivo", bg: "#6366f1" },
  { key: "chat",     icon: "🤖", label: "Assistente",  bg: "#8b5cf6" },
];

// Apps fixos (link ou visual)
const STATIC_APPS = [
  { key: "logs",  icon: "📋", label: "Logs",  bg: "#475569", href: "/logs" },
  { key: "scada", icon: "📡", label: "SCADA", bg: "#0ea5e9" },
  { key: "sap",   icon: "📊", label: "SAP",   bg: "#f59e0b" },
];

export default function AppDock({ panels = {}, onToggle }) {
  const [hovered, setHovered] = useState(null);

  const renderApp = (app, i, isOpen) => {
    const isHovered = hovered === app.key;

    const tooltip = isHovered && (
      <span
        className="absolute -top-8 left-1/2 text-xs text-white bg-slate-800 border border-slate-700 rounded-lg px-2 py-0.5 whitespace-nowrap pointer-events-none z-10"
        style={{ transform: "translateX(-50%)" }}
      >
        {app.label}
      </span>
    );

    const iconEl = (
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-lg transition-all duration-150"
        style={{
          background:  isOpen ? `${app.bg}dd` : `${app.bg}22`,
          border:     `1px solid ${isOpen ? app.bg + "88" : app.bg + "44"}`,
          boxShadow:   isOpen ? `0 0 14px ${app.bg}55` : "none",
        }}
      >
        {app.icon}
      </div>
    );

    const dot = (
      <div
        className="w-1 h-1 rounded-full transition-all duration-150"
        style={{ background: isOpen ? app.bg : "transparent" }}
      />
    );

    const wrapperStyle = {
      transform: isHovered ? "translateY(-10px) scale(1.22)" : "translateY(0) scale(1)",
    };

    // Link-type app
    if (app.href) {
      return (
        <Link
          key={app.key}
          href={app.href}
          onMouseEnter={() => setHovered(app.key)}
          onMouseLeave={() => setHovered(null)}
          className="relative flex flex-col items-center gap-1 transition-all duration-150"
          style={wrapperStyle}
        >
          {tooltip}{iconEl}{dot}
        </Link>
      );
    }

    // Panel-toggle app
    return (
      <button
        key={app.key}
        onMouseEnter={() => setHovered(app.key)}
        onMouseLeave={() => setHovered(null)}
        onClick={() => onToggle?.(app.key)}
        className="relative flex flex-col items-center gap-1 transition-all duration-150"
        style={wrapperStyle}
      >
        {tooltip}{iconEl}{dot}
      </button>
    );
  };

  return (
    <div
      className="fixed bottom-5 left-1/2 z-40 flex items-end gap-2 px-4 py-2.5 rounded-2xl border border-slate-700/50 bg-slate-900/90"
      style={{ transform: "translateX(-50%)" }}
    >
      {/* Separator visual */}
      {PANEL_APPS.map((app) => renderApp(app, 0, !!panels[app.key]))}

      <div className="w-px h-8 bg-slate-700/60 mx-1 self-center" />

      {STATIC_APPS.map((app) => renderApp(app, 0, false))}
    </div>
  );
}

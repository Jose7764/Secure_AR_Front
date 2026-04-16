"use client";

import { useState } from "react";
import { useSession } from "@/context/SessionContext";
import { LOG_STATUS_LABELS, LOG_EVENT_LABELS } from "@/data/mockLogs";
import Badge from "./ui/Badge";

const FILTERS = ["todos", "success", "info", "warning", "error"];

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function AuditLogPanel() {
  const { logs } = useSession();
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");

  const filtered = logs.filter((log) => {
    const matchFilter = filter === "todos" || log.status === filter;
    const matchSearch =
      !search ||
      log.description.toLowerCase().includes(search.toLowerCase()) ||
      log.event.toLowerCase().includes(search.toLowerCase()) ||
      (log.user ?? "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const variantMap = { success: "success", info: "info", warning: "warning", error: "danger" };

  return (
    <div className="flex flex-col h-full">
      {/* Search + Filters */}
      <div className="space-y-3 mb-4">
        <input
          type="text"
          placeholder="Buscar evento, usuário..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
        />
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => {
            const active = filter === f;
            const cfg = LOG_STATUS_LABELS[f];
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  active
                    ? f === "todos"
                      ? "bg-slate-700 text-slate-100 border-slate-500"
                      : `${cfg.bg} ${cfg.color} ${cfg.border}`
                    : "bg-transparent text-slate-500 border-slate-700 hover:border-slate-500"
                }`}
              >
                {f === "todos" ? "Todos" : cfg.label}
                {active && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({filtered.length})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Log list */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-600 text-sm">
            Nenhum evento encontrado.
          </div>
        )}
        {filtered.map((log, idx) => {
          const cfg = LOG_STATUS_LABELS[log.status] ?? LOG_STATUS_LABELS.info;
          const eventLabel = LOG_EVENT_LABELS[log.event] ?? log.event;
          return (
            <div
              key={log.id}
              className={`flex gap-3 p-3 rounded-lg border ${cfg.bg} ${cfg.border} animate-fade-in-up`}
              style={{ animationDelay: `${Math.min(idx * 20, 200)}ms` }}
            >
              {/* Time */}
              <div className="shrink-0 text-right">
                <p className="text-xs font-mono text-slate-400">{formatTime(log.timestamp)}</p>
                <p className="text-xs text-slate-600">{formatDate(log.timestamp)}</p>
              </div>

              {/* Divider */}
              <div className={`w-px shrink-0 rounded ${cfg.border.replace("border-", "bg-")}`} />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <Badge variant={variantMap[log.status] ?? "info"}>
                    {eventLabel}
                  </Badge>
                  <span className="text-xs text-slate-600 truncate">{log.source}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{log.description}</p>
                {log.user && (
                  <p className="text-xs text-slate-600 mt-0.5">Usuário: {log.user}</p>
                )}
              </div>

              {/* Log ID */}
              <div className="shrink-0">
                <span className="text-xs font-mono text-slate-700">{log.id}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer count */}
      <div className="pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-600">
        <span>{filtered.length} de {logs.length} eventos</span>
        <span>Ordenado por: mais recente</span>
      </div>
    </div>
  );
}

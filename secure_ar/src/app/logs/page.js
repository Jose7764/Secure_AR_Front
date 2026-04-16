"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/context/SessionContext";
import AuditLogPanel from "@/components/AuditLogPanel";
import SecurityStatus from "@/components/SecurityStatus";
import SessionCard from "@/components/SessionCard";
import Badge from "@/components/ui/Badge";

export default function LogsPage() {
  const router = useRouter();
  const { sessionState, logs } = useSession();

  // Guard
  useEffect(() => {
    if (sessionState === "unauthenticated") router.replace("/auth");
    if (sessionState === "locked")          router.replace("/session-lock");
  }, [sessionState, router]);

  const successCount = logs.filter((l) => l.status === "success").length;
  const warnCount    = logs.filter((l) => l.status === "warning").length;
  const errorCount   = logs.filter((l) => l.status === "error").length;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* ── Header ── */}
      <header className="bg-slate-900/80 border-b border-slate-800 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/assistant"
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </Link>
            <div className="w-px h-5 bg-slate-700" />
            <div className="flex items-center gap-2">
              <span className="text-base">📋</span>
              <h1 className="text-sm font-semibold text-slate-200">Logs de Auditoria</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="success">{successCount} sucesso</Badge>
            {warnCount > 0  && <Badge variant="warning">{warnCount} aviso</Badge>}
            {errorCount > 0 && <Badge variant="danger">{errorCount} erro</Badge>}
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 flex gap-5">
        {/* Sidebar */}
        <aside className="w-72 shrink-0 space-y-4 hidden lg:block">
          <SessionCard />
          <SecurityStatus />

          {/* Summary card */}
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Resumo</p>
            <div className="space-y-2">
              {[
                { label: "Total de eventos", value: logs.length, color: "text-slate-300" },
                { label: "Êxito",            value: successCount, color: "text-emerald-400" },
                { label: "Avisos",           value: warnCount,    color: "text-yellow-400" },
                { label: "Erros",            value: errorCount,   color: "text-red-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">{label}</span>
                  <span className={`font-semibold ${color}`}>{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <p className="text-xs text-slate-600 mb-1">Retenção</p>
              <p className="text-xs text-slate-500">90 dias — imutável</p>
              <p className="text-xs text-slate-600 mt-2 mb-1">Conformidade</p>
              <p className="text-xs text-slate-500">PBR-GOV-2024 / ISO 27001</p>
            </div>
          </div>
        </aside>

        {/* Log Panel */}
        <main className="flex-1 min-h-0 flex flex-col">
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-5 flex-1 flex flex-col" style={{ minHeight: "600px" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-200">Trilha de Auditoria</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Todos os eventos de segurança registrados nesta sessão
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Tempo real
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <AuditLogPanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { PIPELINE_STEPS } from "@/data/mockResponses";

// step state: 'waiting' | 'running' | 'done' | 'blocked'
export default function ProcessingPipeline({ stepStates, blocked = false, blockedAt = null }) {
  if (!stepStates || stepStates.length === 0) return null;

  return (
    <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          Pipeline de Segurança
        </p>
      </div>

      <div className="space-y-2">
        {PIPELINE_STEPS.map((step, i) => {
          const state = stepStates[i] ?? "waiting";
          const isBlocked = blocked && blockedAt === step.id;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                state === "running"
                  ? "bg-cyan-500/10 border border-cyan-500/20"
                  : state === "done"
                  ? "bg-emerald-500/5 border border-emerald-500/10"
                  : isBlocked
                  ? "bg-red-500/10 border border-red-500/20"
                  : "border border-transparent"
              }`}
            >
              {/* Icon */}
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                {state === "waiting" && (
                  <span className="w-4 h-4 rounded-full border border-slate-700 block" />
                )}
                {state === "running" && (
                  <svg className="animate-spin w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {state === "done" && (
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {(state === "blocked" || isBlocked) && (
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>

              {/* Label */}
              <div className="flex-1 min-w-0">
                <span
                  className={`text-xs font-medium ${
                    state === "running"  ? "text-cyan-300"    :
                    state === "done"     ? "text-emerald-400" :
                    state === "blocked" || isBlocked ? "text-red-400" :
                    "text-slate-600"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Source tag */}
              <span className="text-xs text-slate-600 shrink-0">{step.source}</span>
            </div>
          );
        })}
      </div>

      {blocked && (
        <div className="mt-3 px-3 py-2.5 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-xs font-semibold text-red-400">
            🚫 Acesso negado por política de segurança
          </p>
          <p className="text-xs text-red-400/70 mt-0.5">
            A consulta foi bloqueada pelo filtro DLP antes de chegar à IA.
          </p>
        </div>
      )}
    </div>
  );
}

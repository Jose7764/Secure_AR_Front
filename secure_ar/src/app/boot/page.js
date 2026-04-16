"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { mockDevice, bootSteps, mdmStatusConfig } from "@/data/mockDevice";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import VRBackground from "@/components/VRBackground";

const STEP_DURATION = 700; // ms per step

export default function BootPage() {
  const router = useRouter();
  const { validateDevice } = useSession();

  const [currentStep, setCurrentStep] = useState(-1);
  const [done, setDone] = useState(false);

  const cfg = mdmStatusConfig[mockDevice.mdmStatus];
  const progress = done ? 100 : Math.round(((currentStep + 1) / bootSteps.length) * 100);

  useEffect(() => {
    let step = 0;
    const tick = () => {
      setCurrentStep(step);
      step++;
      if (step < bootSteps.length) {
        setTimeout(tick, STEP_DURATION);
      } else {
        setTimeout(() => {
          setDone(true);
          validateDevice();
        }, STEP_DURATION);
      }
    };
    const init = setTimeout(tick, 600);
    return () => clearTimeout(init);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleContinue = () => router.push("/auth");

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6">
      <VRBackground />

      <div className="relative z-10 w-full max-w-lg space-y-6">
        {/* Logo / Branding */}
        <div className="glass rounded-2xl px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/20 shrink-0">
            🥽
          </div>
          <div>
            <h1 className="text-base font-bold text-gradient leading-tight">SecureAR</h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest">Petrobras — Acesso Corporativo</p>
          </div>
        </div>

        {/* Device Info Card */}
        <div className="glass rounded-2xl p-5 glow-cyan">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-base font-semibold text-slate-100">{mockDevice.name}</p>
              <p className="text-xs text-slate-500 font-mono">{mockDevice.serial}</p>
            </div>
            <Badge
              variant={
                mockDevice.mdmStatus === "homologado" ? "success" :
                mockDevice.mdmStatus === "bloqueado"  ? "danger"  : "warning"
              }
              dot
            >
              {cfg.label}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              ["Firmware",     mockDevice.firmwareVersion],
              ["Organização",  mockDevice.organization],
              ["Localização",  mockDevice.location],
              ["IP",           mockDevice.ipAddress],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-slate-600 mb-0.5">{k}</p>
                <p className="text-slate-300 font-medium">{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Boot Steps Card */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-300">Inicialização do Sistema</p>
            <span className="text-xs text-cyan-400 font-mono">{progress}%</span>
          </div>

          <ProgressBar
            value={progress}
            max={100}
            variant={done ? "success" : "primary"}
            height="h-1"
            animate
          />

          <div className="mt-4 space-y-2.5">
            {bootSteps.map((step, i) => {
              const completed = i <= currentStep;
              const running   = i === currentStep + 1 && !done;

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 transition-all duration-500 ${
                    completed ? "opacity-100" : running ? "opacity-70" : "opacity-25"
                  }`}
                >
                  {/* Status icon */}
                  <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                    {completed ? (
                      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : running ? (
                      <svg className="animate-spin w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-700 block" />
                    )}
                  </div>

                  <span className={`text-sm ${completed ? "text-slate-300" : "text-slate-600"}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* MDM Status */}
        {done && (
          <div className="glass rounded-2xl px-4 py-3 animate-fade-in-up">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot} animate-pulse`} />
              <span className="text-sm font-semibold text-slate-200">
                MDM/UEM — {cfg.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 ml-4">{cfg.description}</p>
          </div>
        )}

        {/* Continue Button */}
        {done && mockDevice.mdmStatus === "homologado" && (
          <button
            onClick={handleContinue}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-cyan-500/20 animate-fade-in-up"
          >
            Continuar para Autenticação →
          </button>
        )}

        {/* Blocked state */}
        {done && mockDevice.mdmStatus !== "homologado" && (
          <div className="w-full py-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
            <p className="text-red-400 font-semibold text-sm">Acesso bloqueado pelo MDM/UEM</p>
            <p className="text-xs text-red-400/70 mt-1">Entre em contato com a equipe de TI.</p>
          </div>
        )}
      </div>
    </div>
  );
}

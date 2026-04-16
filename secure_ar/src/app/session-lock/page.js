"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { mockCredentials } from "@/data/mockUser";
import VRBackground from "@/components/VRBackground";

const PIN_LENGTH = 4;

export default function SessionLockPage() {
  const router = useRouter();
  const { sessionState, user, unlockSession, logout } = useSession();

  const [pin, setPin] = useState("");
  const [status, setStatus] = useState("idle"); // idle | error | success
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (sessionState === "unauthenticated") router.replace("/auth");
    if (sessionState === "authenticated")   router.replace("/assistant");
  }, [sessionState, router]);

  const appendDigit = (d) => {
    if (pin.length >= PIN_LENGTH) return;
    const next = pin + d;
    setPin(next);
    if (next.length === PIN_LENGTH) validate(next);
  };

  const backspace = () => setPin((p) => p.slice(0, -1));

  const validate = (code) => {
    if (code === mockCredentials.pin) {
      setStatus("success");
      unlockSession();
      setTimeout(() => router.push("/assistant"), 900);
    } else {
      setStatus("error");
      setShake(true);
      setTimeout(() => {
        setPin("");
        setStatus("idle");
        setShake(false);
      }, 900);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/boot");
  };

  const KEYS = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [null, "0", "⌫"],
  ];

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6">
      <VRBackground />

      <div className="relative z-10 w-full max-w-xs">
        <div className="glass rounded-2xl overflow-hidden animate-fade-in-up">

          {/* ── Card header ── */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-700/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-100">Sessão Bloqueada</h1>
                <p className="text-xs text-slate-500">Reautenticação necessária</p>
              </div>
            </div>

            {user && (
              <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-slate-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {user.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.role}</p>
                </div>
              </div>
            )}
          </div>

          {/* ── PIN content ── */}
          <div className="p-6 space-y-4">

            {/* PIN dots */}
            <div className={`flex justify-center gap-4 py-1 ${shake ? "animate-pulse" : ""}`}>
              {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                    status === "error"
                      ? "border-red-500 bg-red-500"
                      : status === "success"
                      ? "border-emerald-500 bg-emerald-500"
                      : i < pin.length
                      ? "border-cyan-400 bg-cyan-400"
                      : "border-slate-600 bg-transparent"
                  }`}
                />
              ))}
            </div>

            {/* Status message */}
            <div className="h-4 text-center">
              {status === "error" && (
                <p className="text-xs text-red-400 animate-fade-in">PIN incorreto. Tente novamente.</p>
              )}
              {status === "success" && (
                <p className="text-xs text-emerald-400 animate-fade-in">✓ PIN validado — desbloqueando...</p>
              )}
              {status === "idle" && pin.length === 0 && (
                <p className="text-xs text-slate-600">Digite o PIN de 4 dígitos</p>
              )}
            </div>

            {/* PIN Pad */}
            <div className="grid grid-cols-3 gap-2.5">
              {KEYS.flat().map((key, i) => {
                if (key === null) return <div key={i} />;
                return (
                  <button
                    key={i}
                    onClick={() => key === "⌫" ? backspace() : appendDigit(key)}
                    className={`h-12 rounded-xl text-base font-semibold transition-all duration-150 active:scale-95 ${
                      key === "⌫"
                        ? "bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700"
                        : "bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-slate-600"
                    }`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-slate-700 text-center">
              PIN de teste: <span className="text-slate-600 font-mono">1234</span>
            </p>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl border border-slate-700 text-slate-500 text-sm hover:border-slate-600 hover:text-slate-400 transition-all"
            >
              Retornar ao Login completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

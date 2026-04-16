"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { mockCredentials } from "@/data/mockUser";

const PIN_LENGTH = 4;

export default function SessionLockPage() {
  const router = useRouter();
  const { sessionState, user, unlockSession, logout } = useSession();

  const [pin, setPin] = useState("");
  const [status, setStatus] = useState("idle"); // idle | error | success
  const [shake, setShake] = useState(false);

  // Guard: if not locked, redirect
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      {/* Blurred background overlay */}
      <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm pointer-events-none" />

      <div className="relative z-10 w-full max-w-xs space-y-6">
        {/* Lock icon */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-100">Sessão Bloqueada</h1>
          <p className="text-xs text-slate-500 mt-1">Dispositivo removido — reautenticação necessária</p>
        </div>

        {/* User info */}
        {user && (
          <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
              {user.initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.role}</p>
            </div>
          </div>
        )}

        {/* PIN dots */}
        <div className={`flex justify-center gap-4 py-2 ${shake ? "animate-pulse" : ""}`}>
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

        {/* Status messages */}
        <div className="h-5 text-center">
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
        <div className="grid grid-cols-3 gap-3">
          {KEYS.flat().map((key, i) => {
            if (key === null) return <div key={i} />;
            return (
              <button
                key={i}
                onClick={() => key === "⌫" ? backspace() : appendDigit(key)}
                className={`h-14 rounded-xl text-lg font-semibold transition-all duration-150 active:scale-95 ${
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

        {/* Back to login */}
        <button
          onClick={handleLogout}
          className="w-full py-2.5 rounded-xl border border-slate-700 text-slate-500 text-sm hover:border-slate-600 hover:text-slate-400 transition-all"
        >
          Retornar ao Login completo
        </button>
      </div>
    </div>
  );
}

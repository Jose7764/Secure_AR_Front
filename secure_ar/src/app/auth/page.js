"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { mockCredentials } from "@/data/mockUser";

// Auth step: 'credentials' | 'biometric' | 'mfa' | 'success' | 'error'
export default function AuthPage() {
  const router = useRouter();
  const { login } = useSession();

  const [step, setStep] = useState("credentials");
  const [username, setUsername] = useState("c.mendes");
  const [password, setPassword] = useState("");
  const [bioStatus, setBioStatus] = useState("idle"); // idle | scanning | ok | fail
  const [mfaCode, setMfaCode] = useState("");
  const [mfaError, setMfaError] = useState(false);
  const [error, setError] = useState("");

  // ── Step 1: validate credentials ──────────────────────────────────
  const handleCredentials = () => {
    if (!username.trim() || !password.trim()) {
      setError("Preencha usuário e senha.");
      return;
    }
    setError("");
    setStep("biometric");
  };

  // ── Step 2: simulate biometric scan ───────────────────────────────
  const handleBiometric = () => {
    setBioStatus("scanning");
    setTimeout(() => {
      setBioStatus("ok");
      setTimeout(() => setStep("mfa"), 600);
    }, 2200);
  };

  // ── Step 3: validate MFA ──────────────────────────────────────────
  const handleMfa = () => {
    if (mfaCode === mockCredentials.mfaCode) {
      setStep("success");
      login(username);
      setTimeout(() => router.push("/assistant"), 1400);
    } else {
      setMfaError(true);
      setMfaCode("");
      setTimeout(() => setMfaError(false), 2000);
    }
  };

  const handleMfaKey = (e) => {
    if (e.key === "Enter") handleMfa();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="w-full max-w-sm space-y-5">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-3xl mx-auto mb-4 shadow-xl shadow-cyan-500/20">
            🔐
          </div>
          <h1 className="text-2xl font-bold text-gradient">SecureAR</h1>
          <p className="text-sm text-slate-500 mt-1">Acesso Corporativo — Petrobras S.A.</p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {["credentials", "biometric", "mfa"].map((s, i) => {
            const steps = ["credentials", "biometric", "mfa", "success"];
            const current = steps.indexOf(step);
            const done = current > i;
            const active = current === i;
            return (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    done   ? "bg-emerald-400" :
                    active ? "bg-cyan-400 ring-2 ring-cyan-400/30" :
                    "bg-slate-700"
                  }`}
                />
                {i < 2 && <div className={`w-8 h-px ${done ? "bg-emerald-500/50" : "bg-slate-700"}`} />}
              </div>
            );
          })}
        </div>

        {/* ── Step: Credentials ── */}
        {step === "credentials" && (
          <div className="glass rounded-2xl p-6 space-y-4 animate-fade-in-up">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Etapa 1 de 3</p>
              <h2 className="text-lg font-semibold text-slate-100">Credenciais</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Usuário corporativo</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/70 transition-colors"
                  placeholder="usuario.nome"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCredentials()}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/70 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              onClick={handleCredentials}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Continuar →
            </button>

            <p className="text-xs text-slate-600 text-center">
              Dica: use <span className="text-slate-500 font-mono">c.mendes</span> + qualquer senha
            </p>
          </div>
        )}

        {/* ── Step: Biometric ── */}
        {step === "biometric" && (
          <div className="glass rounded-2xl p-6 space-y-5 animate-fade-in-up">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Etapa 2 de 3</p>
              <h2 className="text-lg font-semibold text-slate-100">Verificação Biométrica</h2>
              <p className="text-xs text-slate-500 mt-1">Olhe diretamente para os sensores do ML2</p>
            </div>

            {/* Biometric sensor visual */}
            <div className="flex justify-center py-4">
              <div className={`relative w-28 h-28 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                bioStatus === "scanning" ? "border-cyan-500 glow-cyan" :
                bioStatus === "ok"       ? "border-emerald-500 glow-green" :
                "border-slate-700"
              }`}>
                {bioStatus === "scanning" && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping" />
                    <div className="absolute inset-3 rounded-full border border-cyan-500/20 animate-scan overflow-hidden">
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                    </div>
                  </>
                )}
                <span className="text-4xl">
                  {bioStatus === "ok" ? "✅" : "👁"}
                </span>
              </div>
            </div>

            {bioStatus === "idle" && (
              <button
                onClick={handleBiometric}
                className="w-full py-3 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-semibold text-sm hover:bg-indigo-500/30 active:scale-[0.98] transition-all"
              >
                ⊙ Validar Biometria
              </button>
            )}

            {bioStatus === "scanning" && (
              <div className="text-center">
                <p className="text-sm text-cyan-400 animate-pulse-slow">Escaneando iris...</p>
                <p className="text-xs text-slate-600 mt-1">Aguarde a validação</p>
              </div>
            )}

            {bioStatus === "ok" && (
              <div className="text-center py-2">
                <p className="text-sm text-emerald-400 font-semibold">✓ Biometria validada com sucesso</p>
                <p className="text-xs text-slate-600 mt-1">Avançando para MFA...</p>
              </div>
            )}
          </div>
        )}

        {/* ── Step: MFA ── */}
        {step === "mfa" && (
          <div className="glass rounded-2xl p-6 space-y-5 animate-fade-in-up">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Etapa 3 de 3</p>
              <h2 className="text-lg font-semibold text-slate-100">Autenticação de Dois Fatores</h2>
              <p className="text-xs text-slate-500 mt-1">Informe o código do seu autenticador TOTP</p>
            </div>

            {/* OTP visual display */}
            <div className="flex justify-center gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-10 h-12 rounded-lg border flex items-center justify-center text-lg font-bold font-mono transition-all ${
                    mfaError
                      ? "border-red-500/50 bg-red-500/10 text-red-400"
                      : mfaCode[i]
                      ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300"
                      : "border-slate-700 bg-slate-800 text-transparent"
                  }`}
                >
                  {mfaCode[i] ?? "·"}
                </div>
              ))}
            </div>

            <div>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                onKeyDown={handleMfaKey}
                className={`w-full bg-slate-800 border rounded-lg px-3 py-2.5 text-sm text-center font-mono tracking-widest focus:outline-none transition-colors ${
                  mfaError
                    ? "border-red-500/50 text-red-400"
                    : "border-slate-700 text-slate-200 focus:border-cyan-500/70"
                }`}
                placeholder="000000"
                autoFocus
              />
              {mfaError && (
                <p className="text-xs text-red-400 mt-1.5 text-center">
                  Código inválido. Tente novamente.
                </p>
              )}
            </div>

            <button
              onClick={handleMfa}
              disabled={mfaCode.length < 6}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Verificar Código →
            </button>

            <p className="text-xs text-slate-600 text-center">
              Código de teste: <span className="text-slate-500 font-mono">123456</span>
            </p>
          </div>
        )}

        {/* ── Step: Success ── */}
        {step === "success" && (
          <div className="glass rounded-2xl p-8 text-center space-y-4 animate-fade-in-up glow-green">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-400">Acesso Autorizado</p>
              <p className="text-sm text-slate-400 mt-1">Bem-vindo, Carlos Eduardo</p>
              <p className="text-xs text-slate-600 mt-1">Redirecionando para o assistente...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

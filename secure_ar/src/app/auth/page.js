"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { mockCredentials } from "@/data/mockUser";
import VRBackground from "@/components/VRBackground";

export default function AuthPage() {
  const router = useRouter();
  const { login } = useSession();

  const [step, setStep]           = useState("biometric");
  const [username, setUsername]   = useState("c.mendes");
  const [password, setPassword]   = useState("");
  const [bioStatus, setBioStatus] = useState("idle");
  const [mfaCode, setMfaCode]     = useState("");
  const [mfaError, setMfaError]   = useState(false);
  const [error, setError]         = useState("");

  const handleBiometric = () => {
    setBioStatus("scanning");
    setTimeout(() => { setBioStatus("ok"); setTimeout(() => setStep("credentials"), 600); }, 2200);
  };

  const handleCredentials = () => {
    if (!username.trim() || !password.trim()) { setError("Preencha usuário e senha."); return; }
    setError("");
    setStep("mfa");
  };

  const handleMfa = () => {
    if (mfaCode === mockCredentials.mfaCode) {
      setStep("success"); login(username); setTimeout(() => router.push("/assistant"), 1400);
    } else {
      setMfaError(true); setMfaCode(""); setTimeout(() => setMfaError(false), 2000);
    }
  };

  const STEPS   = ["biometric", "credentials", "mfa", "success"];
  const current = STEPS.indexOf(step);

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6">
      <VRBackground />

      <div className="relative z-10 w-full max-w-sm">
        <div className="glass rounded-2xl overflow-hidden animate-fade-in-up">

          {/* ── Card header: logo + title + progress ── */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-700/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/20 shrink-0">
                🔐
              </div>
              <div>
                <h1 className="text-base font-bold text-gradient leading-tight">SecureAR</h1>
                <p className="text-xs text-slate-500">Acesso Corporativo — Petrobras S.A.</p>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex items-center gap-2">
              {["biometric", "credentials", "mfa"].map((s, i) => {
                const done   = current > i;
                const active = current === i;
                return (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      done ? "bg-emerald-400" : active ? "bg-cyan-400 ring-2 ring-cyan-400/30" : "bg-slate-700"
                    }`} />
                    {i < 2 && <div className={`w-8 h-px ${done ? "bg-emerald-500/50" : "bg-slate-700"}`} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Step content ── */}
          <div className="p-6">

            {/* Step 1: Biometric */}
            {step === "biometric" && (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Etapa 1 de 3</p>
                    <h2 className="text-base font-semibold text-slate-100">Verificação Biométrica</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Olhe diretamente para os sensores do ML2</p>
                  </div>
                  <AuthProtocolBadge protocol="FIDO2" sub="WebAuthn" color="indigo" />
                </div>

                <div className="flex justify-center py-3">
                  <div className={`relative w-24 h-24 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                    bioStatus === "scanning" ? "border-cyan-500 glow-cyan" :
                    bioStatus === "ok"       ? "border-emerald-500 glow-green" : "border-slate-700"
                  }`}>
                    {bioStatus === "scanning" && (
                      <>
                        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping" />
                        <div className="absolute inset-3 rounded-full border border-cyan-500/20 animate-scan overflow-hidden">
                          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                        </div>
                      </>
                    )}
                    <span className="text-3xl">{bioStatus === "ok" ? "✅" : "👁"}</span>
                  </div>
                </div>

                {bioStatus === "idle" && (
                  <button onClick={handleBiometric} className="w-full py-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-semibold text-sm hover:bg-indigo-500/30 active:scale-[0.98] transition-all">
                    ⊙ Validar Biometria
                  </button>
                )}
                {bioStatus === "scanning" && <p className="text-center text-sm text-cyan-400 animate-pulse-slow">Escaneando iris...</p>}
                {bioStatus === "ok"       && <p className="text-center text-sm text-emerald-400 font-semibold">✓ Biometria validada — avançando...</p>}
              </div>
            )}

            {/* Step 2: Credentials */}
            {step === "credentials" && (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Etapa 2 de 3</p>
                    <h2 className="text-base font-semibold text-slate-100">Credenciais</h2>
                  </div>
                  <AuthProtocolBadge protocol="LDAP" sub="Active Directory" color="cyan" />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Usuário corporativo</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/70 transition-colors"
                      placeholder="usuario.nome" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Senha</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCredentials()}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/70 transition-colors"
                      placeholder="••••••••" />
                  </div>
                </div>

                {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

                <button onClick={handleCredentials} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all">
                  Continuar →
                </button>
                <p className="text-xs text-slate-600 text-center">Dica: <span className="font-mono text-slate-500">c.mendes</span> + qualquer senha</p>
              </div>
            )}

            {/* Step 3: MFA */}
            {step === "mfa" && (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Etapa 3 de 3</p>
                    <h2 className="text-base font-semibold text-slate-100">Autenticação de Dois Fatores</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Código do autenticador TOTP</p>
                  </div>
                  <AuthProtocolBadge protocol="TOTP" sub="RFC 6238" color="emerald" />
                </div>

                <div className="flex justify-center gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className={`w-9 h-11 rounded-lg border flex items-center justify-center text-base font-bold font-mono transition-all ${
                      mfaError ? "border-red-500/50 bg-red-500/10 text-red-400"
                      : mfaCode[i] ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300"
                      : "border-slate-700 bg-slate-800 text-transparent"
                    }`}>{mfaCode[i] ?? "·"}</div>
                  ))}
                </div>

                <input type="text" inputMode="numeric" maxLength={6} value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  onKeyDown={(e) => e.key === "Enter" && handleMfa()}
                  className={`w-full bg-slate-800 border rounded-lg px-3 py-2.5 text-sm text-center font-mono tracking-widest focus:outline-none transition-colors ${
                    mfaError ? "border-red-500/50 text-red-400" : "border-slate-700 text-slate-200 focus:border-cyan-500/70"
                  }`} placeholder="000000" autoFocus />
                {mfaError && <p className="text-xs text-red-400 text-center">Código inválido. Tente novamente.</p>}

                <button onClick={handleMfa} disabled={mfaCode.length < 6}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  Verificar Código →
                </button>
                <p className="text-xs text-slate-600 text-center">Código de teste: <span className="font-mono text-slate-500">123456</span></p>
              </div>
            )}

            {/* Success */}
            {step === "success" && (
              <div className="text-center space-y-3 py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-base font-bold text-emerald-400">Acesso Autorizado</p>
                <p className="text-sm text-slate-400">Bem-vindo, Carlos Eduardo</p>
                <p className="text-xs text-slate-600">Redirecionando para o assistente...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const COLORS = {
  indigo:  { bg: "bg-indigo-500/10",  border: "border-indigo-500/30",  text: "text-indigo-300",  dot: "bg-indigo-400"  },
  cyan:    { bg: "bg-cyan-500/10",    border: "border-cyan-500/30",    text: "text-cyan-300",    dot: "bg-cyan-400"    },
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-300", dot: "bg-emerald-400" },
};

function AuthProtocolBadge({ protocol, sub, color = "cyan" }) {
  const c = COLORS[color] ?? COLORS.cyan;
  return (
    <div className={`shrink-0 flex flex-col items-end gap-0.5 px-2 py-1.5 rounded-xl border ${c.bg} ${c.border}`}>
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`} />
        <span className={`text-xs font-bold font-mono tracking-wider ${c.text}`}>{protocol}</span>
      </div>
      <span className="text-xs text-slate-600 font-mono">{sub}</span>
    </div>
  );
}

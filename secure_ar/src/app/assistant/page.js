"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/context/SessionContext";
import { getResponse, PIPELINE_STEPS } from "@/data/mockResponses";
import { mockDevice } from "@/data/mockDevice";
import VRBackground from "@/components/VRBackground";
import DeviceStatusCard from "@/components/DeviceStatusCard";
import SecurityStatus from "@/components/SecurityStatus";
import SessionCard from "@/components/SessionCard";
import ProcessingPipeline from "@/components/ProcessingPipeline";
import AIResponseCard from "@/components/AIResponseCard";
import StatusDot from "@/components/ui/StatusDot";
import Badge from "@/components/ui/Badge";

const STEP_DELAY = 380;

const SUGGESTED = [
  "Qual a produção atual da REDUC?",
  "Quais ordens de manutenção estão abertas?",
  "Status de segurança e SSO da refinaria",
  "Relatório operacional de janeiro/2024",
];

export default function AssistantPage() {
  const router = useRouter();
  const { sessionState, user, lockSession, logout, logQuery } = useSession();
  const chatEndRef = useRef(null);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [stepStates, setStepStates] = useState([]);
  const [blocked, setBlocked] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);

  useEffect(() => {
    if (sessionState === "unauthenticated") router.replace("/auth");
    if (sessionState === "locked")          router.replace("/session-lock");
  }, [sessionState, router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, processing]);

  const handleLock = () => {
    lockSession();
    router.push("/session-lock");
  };

  const handleLogout = () => {
    logout();
    router.push("/boot");
  };

  const simulateVoice = () => {
    setVoiceActive(true);
    setTimeout(() => {
      setVoiceActive(false);
      setInput(SUGGESTED[Math.floor(Math.random() * SUGGESTED.length)]);
    }, 2000);
  };

  const runPipeline = async (query) => {
    const response = getResponse(query);
    const isForbidden = response.forbidden === true;
    const stopAt = isForbidden ? 5 : PIPELINE_STEPS.length;

    const states = Array(PIPELINE_STEPS.length).fill("waiting");
    setStepStates([...states]);
    setBlocked(false);

    for (let i = 0; i < stopAt; i++) {
      states[i] = "running";
      setStepStates([...states]);
      await delay(STEP_DELAY);

      states[i] = isForbidden && i === stopAt - 1 ? "blocked" : "done";
      setStepStates([...states]);
    }

    if (isForbidden) {
      setBlocked(true);
      setMessages((prev) => [...prev, { type: "blocked", query }]);
      logQuery(query, true);
    } else {
      setMessages((prev) => [...prev, { type: "response", query, response }]);
      logQuery(query, false);
    }

    setProcessing(false);
  };

  const handleSend = () => {
    const q = input.trim();
    if (!q || processing) return;
    setInput("");
    setProcessing(true);
    setStepStates(Array(PIPELINE_STEPS.length).fill("waiting"));
    runPipeline(q);
  };

  if (!user) return null;

  return (
    // Root: transparent so VR background shows through
    <div className="min-h-screen relative bg-transparent">

      {/* ── VR Panoramic Background + Parallax ── */}
      <VRBackground />

      {/* ── All content above the VR layer ── */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* ── Top Navigation Bar ── */}
        <header className="bg-slate-900/60 backdrop-blur-md border-b border-slate-700/40 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

            {/* Brand */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-base shadow-lg shadow-cyan-500/20">
                🥽
              </div>
              <div>
                <span className="text-sm font-bold text-gradient">SecureAR</span>
                <span className="text-xs text-slate-600 ml-2 hidden sm:inline">Petrobras</span>
              </div>
            </div>

            {/* Security badges */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <Badge variant="info" dot>mTLS</Badge>
              <Badge variant="success" dot>Sessão JWT</Badge>
              <Badge variant="success" dot>Autorizado</Badge>
              <span className="text-xs text-slate-600 font-mono hidden md:block">
                {mockDevice.serial.slice(0, 14)}…
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/logs"
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 border border-slate-700/60 hover:border-slate-600 rounded-lg transition-all bg-slate-800/40 backdrop-blur"
              >
                📋 Logs
              </Link>
              <button
                onClick={handleLock}
                className="px-3 py-1.5 text-xs text-yellow-400 border border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20 rounded-lg transition-all backdrop-blur"
              >
                🔒 Bloquear
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-red-400 border border-slate-700/60 hover:border-red-500/30 rounded-lg transition-all bg-slate-800/40 backdrop-blur"
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        {/* ── Main Layout ── */}
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 flex gap-4">

          {/* ── Left Sidebar — floating collapsible panels ── */}
          <aside className="w-68 shrink-0 space-y-3 hidden lg:flex lg:flex-col" style={{ width: "272px" }}>
            <SessionCard />
            <SecurityStatus />
            <DeviceStatusCard />
          </aside>

          {/* ── Chat / Main Panel ── */}
          <main className="flex-1 flex flex-col min-h-0 min-w-0 gap-3">

            {/* Chat container — floating glass panel */}
            <div
              className="flex-1 rounded-xl border border-slate-700/40 bg-slate-900/65 backdrop-blur-md flex flex-col overflow-hidden"
              style={{ minHeight: "500px" }}
            >
              {/* Panel header */}
              <div className="px-5 py-3 border-b border-slate-700/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusDot status="active" pulse />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Assistente Corporativo
                  </span>
                </div>
                <span className="text-xs text-slate-600">
                  {user.clearanceLevel}
                </span>
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">

                {/* Welcome state */}
                {messages.length === 0 && !processing && (
                  <div className="flex-1 flex flex-col items-center justify-center py-10 text-center animate-fade-in">
                    <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-600/20 border border-cyan-500/20 flex items-center justify-center text-4xl mb-5 p-4">
                      🤖
                    </div>
                    <h2 className="text-lg font-semibold text-slate-200 mb-2">
                      Olá, {user.shortName.split(" ")[0]}!
                    </h2>
                    <p className="text-sm text-slate-500 max-w-sm mb-7">
                      Assistente seguro ativo. Consultas filtradas pelo DLP e registradas em auditoria.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                      {SUGGESTED.map((s) => (
                        <button
                          key={s}
                          onClick={() => setInput(s)}
                          className="text-left px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-sm text-slate-400 hover:text-slate-200 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all backdrop-blur"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Messages */}
                {messages.map((msg, i) => (
                  <div key={i}>
                    {msg.type === "response" && (
                      <AIResponseCard query={msg.query} response={msg.response} />
                    )}
                    {msg.type === "blocked" && (
                      <div className="space-y-3 animate-fade-in-up">
                        <div className="flex justify-end">
                          <div className="max-w-[75%] bg-cyan-500/10 border border-cyan-500/20 rounded-2xl rounded-tr-sm px-4 py-2.5 backdrop-blur">
                            <p className="text-sm text-cyan-100">{msg.query}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5">🚫</div>
                          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl rounded-tl-sm px-4 py-3 backdrop-blur">
                            <p className="text-sm font-semibold text-red-400">Acesso negado por política de segurança</p>
                            <p className="text-xs text-red-400/70 mt-1.5 leading-relaxed">
                              Consulta bloqueada pelo filtro DLP. Evento registrado nos logs de auditoria.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Pipeline */}
                {processing && (
                  <ProcessingPipeline stepStates={stepStates} blocked={blocked} />
                )}

                <div ref={chatEndRef} />
              </div>
            </div>

            {/* ── Input Bar — floating glass ── */}
            <div className="rounded-xl border border-slate-700/40 bg-slate-900/65 backdrop-blur-md px-4 py-3 space-y-2">
              {voiceActive && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg animate-fade-in">
                  <StatusDot status="danger" pulse />
                  <span className="text-xs text-red-400 animate-pulse-slow">Gravando voz... fale sua pergunta</span>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={processing || voiceActive}
                  placeholder="Pergunte algo ao assistente corporativo..."
                  className="flex-1 bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors disabled:opacity-50 backdrop-blur"
                />
                <button
                  onClick={simulateVoice}
                  disabled={processing || voiceActive}
                  title="Entrada de voz (simulado)"
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all text-base ${
                    voiceActive
                      ? "bg-red-500/20 border-red-500/40 text-red-400"
                      : "bg-slate-800/60 border-slate-700/60 text-slate-500 hover:border-slate-600 hover:text-slate-300"
                  } disabled:opacity-40`}
                >🎙</button>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || processing}
                  title="Enviar"
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>

              <p className="text-xs text-slate-700 text-center">
                Consultas monitoradas — PBR-SEC-2024 / ISO 27001
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

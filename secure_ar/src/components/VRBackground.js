"use client";

import { useEffect, useRef } from "react";

/**
 * Full-screen parallax VR background.
 *
 * ✅ Funciona SEM imagem — usa cenário de escritório feito em CSS puro.
 * ✅ Se você colocar a imagem em /public/office-bg.jpg ela substitui automaticamente.
 *
 * Mouse movement aplica parallax suave (lerp) simulando rastreamento de cabeça.
 */
export default function VRBackground() {
  const bgRef = useRef(null);

  useEffect(() => {
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let rafId;

    const MAX_X = 18;
    const MAX_Y = 12;

    const onMouseMove = (e) => {
      targetX = ((e.clientX / window.innerWidth) - 0.5) * MAX_X * 2;
      targetY = ((e.clientY / window.innerHeight) - 0.5) * MAX_Y * 2;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      if (bgRef.current) {
        bgRef.current.style.transform =
          `translate(calc(-50% + ${currentX.toFixed(2)}px), calc(-50% + ${currentY.toFixed(2)}px)) scale(1.07)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(animate);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>

      {/* ── Environment layer (imagem real OU cenário CSS) ── */}
      <div
        ref={bgRef}
        className="absolute top-1/2 left-1/2 w-[110%] h-[110%]"
        style={{
          willChange: "transform",
          /*
           * Camadas (de cima pra baixo):
           * 1. Foto real (se /public/office-bg.jpg existir, cobre tudo abaixo)
           * 2-4. Painéis de luz de teto (luminárias embutidas)
           * 5. Reflexo de janela / luz lateral
           * 6. Gradiente de profundidade do ambiente (piso → teto)
           */
          backgroundImage: [
            "url('/office-bg.jpg')",

            // Luminária central (teto)
            "radial-gradient(ellipse 28% 14% at 50% 2%, rgba(255, 253, 240, 0.96) 0%, rgba(255,253,240,0.4) 40%, transparent 100%)",
            // Luminária esquerda
            "radial-gradient(ellipse 16% 9%  at 22% 3%, rgba(255, 253, 240, 0.88) 0%, transparent 100%)",
            // Luminária direita
            "radial-gradient(ellipse 16% 9%  at 78% 3%, rgba(255, 253, 240, 0.88) 0%, transparent 100%)",

            // Reflexo de janela lateral direita (luz natural)
            "radial-gradient(ellipse 18% 60% at 96% 45%, rgba(210, 225, 240, 0.25) 0%, transparent 100%)",

            // Gradiente base do ambiente: teto claro → parede → piso escuro
            `linear-gradient(180deg,
              #c5cad3 0%,
              #b8bec9 18%,
              #a8aeba 38%,
              #8d94a5 58%,
              #6b7282 78%,
              #4a5060 100%
            )`,
          ].join(", "),

          backgroundSize: [
            "cover",           // foto
            "100% 100%",       // luminária central
            "100% 100%",       // luminária esquerda
            "100% 100%",       // luminária direita
            "100% 100%",       // janela lateral
            "100% 100%",       // gradiente base
          ].join(", "),

          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* ── Overlay escuro: reduz brilho do ambiente para legibilidade da UI ── */}
      <div className="absolute inset-0 bg-slate-950/48" />

      {/* ── Vinheta VR: escurece bordas como lentes de óculos ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 74% 64% at 50% 50%, transparent 42%, rgba(2, 6, 23, 0.94) 100%)",
        }}
      />

      {/* ── Reflexo interno de lente (círculo central levemente mais claro) ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 42% at 50% 50%, rgba(255,255,255,0.018) 0%, transparent 100%)",
        }}
      />

      {/* ── Frame AR: borda fina simulando limite do display ── */}
      <div
        className="absolute inset-3 rounded-[2rem] pointer-events-none"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(6, 182, 212, 0.1)",
        }}
      />

      {/* ── Scanlines levíssimas ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.022,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,1) 3px, rgba(255,255,255,1) 4px)",
        }}
      />
    </div>
  );
}

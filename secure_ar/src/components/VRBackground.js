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
          `translate(calc(-50% + ${currentX.toFixed(2)}px), calc(-50% + ${currentY.toFixed(2)}px)) scale(1.02)`;
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
        className="absolute top-1/2 left-1/2 w-[104%] h-[104%]"
        style={{
          willChange: "transform",
          /*
           * Camadas (de cima pra baixo):
           * 1. Foto real (se /public/office-bg.jpg existir, cobre tudo abaixo)
           * 2-4. Painéis de luz de teto (luminárias embutidas)
           * 5. Reflexo de janela / luz lateral
           * 6. Gradiente de profundidade do ambiente (piso → teto)
           */
          backgroundImage: "url('/officie.jpg')",

          backgroundSize: "cover",

          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
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

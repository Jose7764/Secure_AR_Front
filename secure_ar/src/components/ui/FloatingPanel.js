"use client";

import { useState, useRef, useEffect, useCallback } from "react";

let _z = 40;
const MIN_W = 260;
const MIN_H = 120;
const NAV_H = 56;

/**
 * Floating panel with:
 *  - Drag via header handle
 *  - Resize via 8 edge/corner handles
 *  - Minimize (collapses content, only header visible)
 *  - Z-index auto-stacking on click
 */
export default function FloatingPanel({
  children,
  title,
  titleRight,
  onClose,
  initialX = 20,
  initialY = NAV_H + 10,
  initialWidth = 360,
  initialHeight = 500,
  className = "",
}) {
  const [rect, setRect] = useState({
    x: initialX,
    y: initialY,
    w: initialWidth,
    h: initialHeight,
  });
  const [minimized, setMinimized] = useState(false);
  const [zIndex, setZIndex] = useState(_z);

  const rectRef = useRef({ x: initialX, y: initialY, w: initialWidth, h: initialHeight });
  const dragRef = useRef(null); // { type, sx, sy, sr: snapshot of rect }

  const bringToFront = useCallback(() => {
    _z += 1;
    setZIndex(_z);
  }, []);

  const startDrag = useCallback((e, type) => {
    bringToFront();
    dragRef.current = {
      type,
      sx: e.clientX,
      sy: e.clientY,
      sr: { ...rectRef.current },
    };
    document.body.style.userSelect = "none";
    if (type === "move") document.body.style.cursor = "grabbing";
    e.preventDefault();
    e.stopPropagation();
  }, [bringToFront]);

  const onMouseMove = useCallback((e) => {
    if (!dragRef.current) return;
    const { type, sx, sy, sr } = dragRef.current;
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;

    let { x, y, w, h } = sr;

    switch (type) {
      case "move":
        x = sr.x + dx;
        y = Math.max(NAV_H, sr.y + dy);
        break;
      case "r":
        w = Math.max(MIN_W, sr.w + dx);
        break;
      case "l":
        w = Math.max(MIN_W, sr.w - dx);
        x = sr.x + (sr.w - w);
        break;
      case "b":
        h = Math.max(MIN_H, sr.h + dy);
        break;
      case "t":
        h = Math.max(MIN_H, sr.h - dy);
        y = Math.max(NAV_H, sr.y + (sr.h - h));
        break;
      case "tr":
        w = Math.max(MIN_W, sr.w + dx);
        h = Math.max(MIN_H, sr.h - dy);
        y = Math.max(NAV_H, sr.y + (sr.h - h));
        break;
      case "tl":
        w = Math.max(MIN_W, sr.w - dx);
        x = sr.x + (sr.w - w);
        h = Math.max(MIN_H, sr.h - dy);
        y = Math.max(NAV_H, sr.y + (sr.h - h));
        break;
      case "br":
        w = Math.max(MIN_W, sr.w + dx);
        h = Math.max(MIN_H, sr.h + dy);
        break;
      case "bl":
        w = Math.max(MIN_W, sr.w - dx);
        x = sr.x + (sr.w - w);
        h = Math.max(MIN_H, sr.h + dy);
        break;
    }

    const next = { x, y, w, h };
    rectRef.current = next;
    setRect(next);
  }, []);

  const onMouseUp = useCallback(() => {
    if (!dragRef.current) return;
    dragRef.current = null;
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  const handlePanelClick = useCallback(() => bringToFront(), [bringToFront]);

  const handleHeight = minimized ? 0 : rect.h - 48; // 48px = header

  return (
    <div
      onMouseDown={handlePanelClick}
      style={{
        position: "fixed",
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: minimized ? 48 : rect.h,
        zIndex,
        transition: "height 0.25s ease",
      }}
      className={`rounded-xl border border-slate-700/40 bg-slate-900/92 ${className}`}
    >
      {/* ── Resize handles (only when not minimized) ── */}
      {!minimized && (
        <>
          {/* Edges */}
          <div onMouseDown={(e) => startDrag(e, "r")}  style={edge("r")}  />
          <div onMouseDown={(e) => startDrag(e, "l")}  style={edge("l")}  />
          <div onMouseDown={(e) => startDrag(e, "b")}  style={edge("b")}  />
          <div onMouseDown={(e) => startDrag(e, "t")}  style={edge("t")}  />
          {/* Corners */}
          <div onMouseDown={(e) => startDrag(e, "tr")} style={corner("tr")} />
          <div onMouseDown={(e) => startDrag(e, "tl")} style={corner("tl")} />
          <div onMouseDown={(e) => startDrag(e, "br")} style={corner("br")} />
          <div onMouseDown={(e) => startDrag(e, "bl")} style={corner("bl")} />
        </>
      )}

      {/* ── Header / drag handle ── */}
      <div
        onMouseDown={(e) => startDrag(e, "move")}
        style={{ height: 48 }}
        className="flex items-center justify-between px-4 border-b border-slate-700/40 rounded-t-xl cursor-grab active:cursor-grabbing select-none shrink-0 bg-slate-900/40"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-slate-600 text-xs shrink-0" style={{ letterSpacing: "-1px" }}>⠿</span>
          {title && (
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">
              {title}
            </span>
          )}
          {titleRight && <span className="shrink-0 ml-2">{titleRight}</span>}
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          {/* Minimize button */}
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setMinimized((m) => !m)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-700/40 transition-all"
            aria-label={minimized ? "Expandir" : "Minimizar"}
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-250 ${minimized ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Close button */}
          {onClose && (
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
              aria-label="Fechar"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Content (hidden when minimized) ── */}
      <div
        style={{
          height: minimized ? 0 : rect.h - 48,
          overflow: "hidden",
          transition: "height 0.25s ease",
          borderRadius: "0 0 0.75rem 0.75rem",
        }}
        className="flex flex-col"
      >
        {children}
      </div>
    </div>
  );
}

// ── Resize handle style helpers ────────────────────────────────────────────────

const EDGE_W = 6;
const CORNER_SZ = 14;

function edge(side) {
  const base = { position: "absolute", zIndex: 10 };
  if (side === "r") return { ...base, right: -EDGE_W / 2, top: CORNER_SZ, bottom: CORNER_SZ, width: EDGE_W, cursor: "ew-resize" };
  if (side === "l") return { ...base, left: -EDGE_W / 2, top: CORNER_SZ, bottom: CORNER_SZ, width: EDGE_W, cursor: "ew-resize" };
  if (side === "b") return { ...base, bottom: -EDGE_W / 2, left: CORNER_SZ, right: CORNER_SZ, height: EDGE_W, cursor: "ns-resize" };
  if (side === "t") return { ...base, top: -EDGE_W / 2, left: CORNER_SZ, right: CORNER_SZ, height: EDGE_W, cursor: "ns-resize" };
  return base;
}

function corner(pos) {
  const base = { position: "absolute", width: CORNER_SZ, height: CORNER_SZ, zIndex: 11 };
  const cursors = { tr: "ne-resize", tl: "nw-resize", br: "se-resize", bl: "sw-resize" };
  const positions = {
    tr: { top: -EDGE_W / 2, right: -EDGE_W / 2 },
    tl: { top: -EDGE_W / 2, left:  -EDGE_W / 2 },
    br: { bottom: -EDGE_W / 2, right: -EDGE_W / 2 },
    bl: { bottom: -EDGE_W / 2, left:  -EDGE_W / 2 },
  };
  return { ...base, ...positions[pos], cursor: cursors[pos] };
}

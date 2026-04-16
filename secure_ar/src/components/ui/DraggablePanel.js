"use client";

import { useState, useRef, useEffect, useCallback } from "react";

let _zTop = 30;

const NON_DRAG  = "input,textarea,select,button,a,[data-no-drag]";
const THRESHOLD = 5;
const MIN_W     = 180;
const MIN_H     = 60;
const EDGE_W    = 6;
const CORNER_SZ = 14;

/**
 * Floating draggable + resizable panel.
 * - Drag: data-drag-handle elements OR any non-interactive area (5px threshold)
 * - Resize: 8 handles on edges and corners, same as FloatingPanel
 */
export default function DraggablePanel({
  children,
  initialX = 20,
  initialY = 70,
  className = "",
  style = {},
}) {
  const initW = style.width  ?? null;
  const initH = style.height ?? null;

  const [pos,    setPos]    = useState({ x: initialX, y: initialY });
  const [size,   setSize]   = useState({ w: initW, h: initH });
  const [zIndex, setZIdx]   = useState(30);

  const posRef     = useRef({ x: initialX, y: initialY });
  const sizeRef    = useRef({ w: initW, h: initH });
  const elRef      = useRef(null);

  // drag state
  const pending    = useRef(null); // { startX, startY, offX, offY } — for move
  const dragging   = useRef(false);

  // resize state
  const resizeRef  = useRef(null); // { type, sx, sy, sp: pos snap, ss: size snap }

  // ── Shared mouseup ────────────────────────────────────────────────
  const onMouseUp = useCallback(() => {
    pending.current   = null;
    resizeRef.current = null;
    if (dragging.current) {
      dragging.current = false;
      document.body.style.cursor = "";
    }
    document.body.style.userSelect = "";
  }, []);

  // ── Mousemove: handles both drag and resize ────────────────────────
  const onMouseMove = useCallback((e) => {
    // ── Resize ──
    if (resizeRef.current) {
      const { type, sx, sy, sp, ss } = resizeRef.current;
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      let { x, y } = sp;
      let { w, h } = ss;

      switch (type) {
        case "r":  w = Math.max(MIN_W, ss.w + dx); break;
        case "l":  w = Math.max(MIN_W, ss.w - dx); x = sp.x + (ss.w - w); break;
        case "b":  h = Math.max(MIN_H, ss.h + dy); break;
        case "t":  h = Math.max(MIN_H, ss.h - dy); y = Math.max(56, sp.y + (ss.h - h)); break;
        case "br": w = Math.max(MIN_W, ss.w + dx); h = Math.max(MIN_H, ss.h + dy); break;
        case "bl": w = Math.max(MIN_W, ss.w - dx); x = sp.x + (ss.w - w); h = Math.max(MIN_H, ss.h + dy); break;
        case "tr": w = Math.max(MIN_W, ss.w + dx); h = Math.max(MIN_H, ss.h - dy); y = Math.max(56, sp.y + (ss.h - h)); break;
        case "tl": w = Math.max(MIN_W, ss.w - dx); x = sp.x + (ss.w - w); h = Math.max(MIN_H, ss.h - dy); y = Math.max(56, sp.y + (ss.h - h)); break;
      }

      posRef.current  = { x, y };
      sizeRef.current = { w, h };
      setPos({ x, y });
      setSize({ w, h });
      return;
    }

    // ── Drag ──
    if (!pending.current) return;
    if (!dragging.current) {
      const ddx = Math.abs(e.clientX - pending.current.startX);
      const ddy = Math.abs(e.clientY - pending.current.startY);
      if (ddx > THRESHOLD || ddy > THRESHOLD) {
        dragging.current = true;
        document.body.style.cursor = "grabbing";
      }
    }
    if (!dragging.current) return;
    const x = e.clientX - pending.current.offX;
    const y = Math.max(56, e.clientY - pending.current.offY);
    posRef.current = { x, y };
    setPos({ x, y });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  // ── Start drag (move) ─────────────────────────────────────────────
  const onMouseDown = useCallback((e) => {
    _zTop += 1;
    setZIdx(_zTop);

    const isDragHandle = !!e.target.closest("[data-drag-handle]");
    if (!isDragHandle && e.target.closest(NON_DRAG)) return;

    pending.current = {
      startX: e.clientX,
      startY: e.clientY,
      offX: e.clientX - posRef.current.x,
      offY: e.clientY - posRef.current.y,
    };
    e.preventDefault();
  }, []);

  // ── Start resize ──────────────────────────────────────────────────
  const startResize = useCallback((e, type) => {
    e.stopPropagation();
    e.preventDefault();
    _zTop += 1;
    setZIdx(_zTop);

    // If height is currently auto, snapshot the actual rendered height
    const currentH = sizeRef.current.h ?? elRef.current?.offsetHeight ?? MIN_H;
    const currentW = sizeRef.current.w ?? elRef.current?.offsetWidth  ?? MIN_W;
    sizeRef.current = { w: currentW, h: currentH };
    setSize({ w: currentW, h: currentH });

    resizeRef.current = {
      type,
      sx: e.clientX,
      sy: e.clientY,
      sp: { ...posRef.current },
      ss: { w: currentW, h: currentH },
    };
    document.body.style.userSelect = "none";
  }, []);

  const { w, h } = size;

  return (
    <div
      ref={elRef}
      onMouseDown={onMouseDown}
      style={{
        position: "fixed",
        left:   pos.x,
        top:    pos.y,
        zIndex,
        width:  w ?? undefined,
        height: h ?? undefined,
        cursor: "grab",
        ...style,
        // override style.width/height with our state
        ...(w != null ? { width:  w } : {}),
        ...(h != null ? { height: h } : {}),
      }}
      className={className}
    >
      {/* ── Resize handles ── */}
      <div onMouseDown={(e) => startResize(e, "r")}  style={edgeStyle("r")}  />
      <div onMouseDown={(e) => startResize(e, "l")}  style={edgeStyle("l")}  />
      <div onMouseDown={(e) => startResize(e, "b")}  style={edgeStyle("b")}  />
      <div onMouseDown={(e) => startResize(e, "t")}  style={edgeStyle("t")}  />
      <div onMouseDown={(e) => startResize(e, "br")} style={cornerStyle("br")} />
      <div onMouseDown={(e) => startResize(e, "bl")} style={cornerStyle("bl")} />
      <div onMouseDown={(e) => startResize(e, "tr")} style={cornerStyle("tr")} />
      <div onMouseDown={(e) => startResize(e, "tl")} style={cornerStyle("tl")} />

      {children}
    </div>
  );
}

function edgeStyle(side) {
  const base = { position: "absolute", zIndex: 10 };
  if (side === "r") return { ...base, right: -EDGE_W/2, top: CORNER_SZ, bottom: CORNER_SZ, width: EDGE_W, cursor: "ew-resize" };
  if (side === "l") return { ...base, left:  -EDGE_W/2, top: CORNER_SZ, bottom: CORNER_SZ, width: EDGE_W, cursor: "ew-resize" };
  if (side === "b") return { ...base, bottom:-EDGE_W/2, left: CORNER_SZ, right: CORNER_SZ, height: EDGE_W, cursor: "ns-resize" };
  if (side === "t") return { ...base, top:   -EDGE_W/2, left: CORNER_SZ, right: CORNER_SZ, height: EDGE_W, cursor: "ns-resize" };
  return base;
}

function cornerStyle(pos) {
  const base = { position: "absolute", width: CORNER_SZ, height: CORNER_SZ, zIndex: 11 };
  const cursors  = { tr: "ne-resize", tl: "nw-resize", br: "se-resize", bl: "sw-resize" };
  const positions = {
    tr: { top:    -EDGE_W/2, right: -EDGE_W/2 },
    tl: { top:    -EDGE_W/2, left:  -EDGE_W/2 },
    br: { bottom: -EDGE_W/2, right: -EDGE_W/2 },
    bl: { bottom: -EDGE_W/2, left:  -EDGE_W/2 },
  };
  return { ...base, ...positions[pos], cursor: cursors[pos] };
}

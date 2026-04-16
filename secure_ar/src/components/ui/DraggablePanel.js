"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// Module-level counter — the last clicked panel always has the highest z-index
let _zTop = 30;

/**
 * Floating draggable panel with fixed positioning.
 *
 * Any child element with   data-drag-handle="true"   acts as the drag trigger.
 * Clicking any panel brings it to the front automatically.
 */
export default function DraggablePanel({
  children,
  initialX = 20,
  initialY = 70,
  className = "",
  style = {},
}) {
  const [pos, setPos]     = useState({ x: initialX, y: initialY });
  const [zIndex, setZIdx] = useState(30);

  const posRef     = useRef({ x: initialX, y: initialY });
  const dragging   = useRef(false);
  const offsetRef  = useRef({ x: 0, y: 0 });

  // ── Global move / up listeners ─────────────────────────────────────────────
  const onMouseMove = useCallback((e) => {
    if (!dragging.current) return;
    const x = e.clientX - offsetRef.current.x;
    const y = Math.max(56, e.clientY - offsetRef.current.y); // never above nav bar
    posRef.current = { x, y };
    setPos({ x, y });
  }, []);

  const onMouseUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
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

  // ── Panel mousedown — only starts drag on [data-drag-handle] ──────────────
  const onMouseDown = useCallback((e) => {
    // Bring to front on any click inside this panel
    _zTop += 1;
    setZIdx(_zTop);

    // Only start dragging when clicking a designated handle
    if (!e.target.closest("[data-drag-handle]")) return;

    dragging.current = true;
    offsetRef.current = {
      x: e.clientX - posRef.current.x,
      y: e.clientY - posRef.current.y,
    };
    document.body.style.cursor = "grabbing";
    e.preventDefault();
  }, []);

  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        zIndex,
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
}

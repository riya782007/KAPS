"use client";
import { useRef, ReactNode, MouseEvent as ReactMouseEvent } from "react";

/** 3D mouse-tilt wrapper — subtle depth + cursor shine. Pure CSS transforms, no deps. */
export function Tilt({ children, className = "", max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * max * 2;
    const ry = (px - 0.5) * max * 2;
    el.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(8px)`;
    el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
    el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
  };
  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0px)";
  };

  return (
    <div className="scene h-full">
      <div ref={ref} onMouseMove={onMove} onMouseLeave={reset} className={`tilt relative h-full ${className}`}>
        {children}
        <span className="tilt-shine" />
      </div>
    </div>
  );
}

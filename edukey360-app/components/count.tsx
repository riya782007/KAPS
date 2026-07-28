"use client";
import { useEffect, useRef, useState } from "react";

export function CountUp({ to, dur = 900, prefix = "", suffix = "", decimals = 0 }: {
  to: number; dur?: number; prefix?: string; suffix?: string; decimals?: number;
}) {
  const [v, setV] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return; started.current = true;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setV(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to, dur]);
  const num = decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString("en-IN");
  return <span className="num">{prefix}{num}{suffix}</span>;
}

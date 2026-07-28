"use client";
import { useEffect, useRef, useState } from "react";

/* Animated gradient area + line chart (pure SVG, no deps) */
export function AreaChart({ data, labels, height = 150, color = "var(--brand)" }: {
  data: number[]; labels?: string[]; height?: number; color?: string;
}) {
  const w = 520, h = height, pad = 8;
  const max = Math.max(...data) * 1.15 || 1;
  const min = Math.min(...data, 0);
  const x = (i: number) => pad + (i * (w - pad * 2)) / (data.length - 1);
  const y = (v: number) => h - pad - ((v - min) / (max - min)) * (h - pad * 2);
  const line = data.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L ${x(data.length - 1)} ${h - pad} L ${x(0)} ${h - pad} Z`;
  const [len, setLen] = useState(0);
  const ref = useRef<SVGPathElement>(null);
  useEffect(() => { if (ref.current) setLen(ref.current.getTotalLength()); }, []);
  const id = "g" + Math.round(Math.random() * 1e6);
  return (
    <svg viewBox={`0 0 ${w} ${h + 18}`} width="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} style={{ animation: "fadeIn .9s .3s both" }} />
      <path ref={ref} d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
        style={{ strokeDasharray: len, strokeDashoffset: len, animation: len ? "draw 1.1s cubic-bezier(.22,.9,.3,1) forwards" : undefined }} />
      {data.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r="3" fill="var(--panel)" stroke={color} strokeWidth="2"
          style={{ animation: `fadeIn .4s ${0.6 + i * 0.08}s both` }} />
      ))}
      {labels && labels.map((l, i) => (
        <text key={i} x={x(i)} y={h + 12} textAnchor="middle" fontSize="9" fill="var(--muted)">{l}</text>
      ))}
      <style>{`@keyframes draw{to{stroke-dashoffset:0}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </svg>
  );
}

/* Animated donut */
export function Donut({ segments, size = 160 }: { segments: { label: string; value: number; color: string }[]; size?: number; }) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const r = size / 2 - 14, c = 2 * Math.PI * r, cx = size / 2;
  let acc = 0;
  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--line)" strokeWidth="14" />
        {segments.map((s, i) => {
          const frac = s.value / total, dash = frac * c, off = -acc * c; acc += frac;
          return (
            <circle key={i} cx={cx} cy={cx} r={r} fill="none" stroke={s.color} strokeWidth="14"
              strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={off} transform={`rotate(-90 ${cx} ${cx})`}
              style={{ strokeDasharray: `0 ${c}`, animation: `seg${i} 1s ${0.15 * i + 0.2}s cubic-bezier(.22,.9,.3,1) forwards` }}>
              <style>{`@keyframes seg${i}{to{stroke-dasharray:${dash} ${c - dash}}}`}</style>
            </circle>
          );
        })}
        <text x={cx} y={cx - 2} textAnchor="middle" fontSize="22" fontWeight="800" fill="var(--ink)">{total}</text>
        <text x={cx} y={cx + 16} textAnchor="middle" fontSize="10" fill="var(--muted)">in pipeline</text>
      </svg>
      <div className="space-y-1.5">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-[12px]">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
            <span className="muted flex-1">{s.label}</span><b>{s.value}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

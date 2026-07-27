import { ReactNode } from "react";

export function Kpi({ icon, value, label, delta, hint }: { icon: ReactNode; value: ReactNode; label: string; delta?: string; hint?: string; }) {
  return (
    <div className="kpi">
      <div className="flex items-start justify-between">
        <div className="text-[22px] leading-none font-extrabold" style={{ color: "var(--brand-d)" }}>{value}</div>
        <div className="opacity-60">{icon}</div>
      </div>
      <div className="text-xs font-semibold mt-2 muted">{label}</div>
      {delta && <div className="text-[11px] font-bold mt-1.5" style={{ color: "var(--brand)" }}>{delta}</div>}
      {hint && <div className="text-[10.5px] muted mt-1">{hint}</div>}
    </div>
  );
}

export function Card({ children, className = "", pad = true }: { children: ReactNode; className?: string; pad?: boolean; }) {
  return <div className={`card ${pad ? "p-4 sm:p-5" : ""} ${className}`}>{children}</div>;
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="h-sec">{children}</div>
      {right}
    </div>
  );
}

export function Avatar({ name, hue = 200, size = 34 }: { name: string; hue?: number; size?: number }) {
  const init = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="grid place-items-center rounded-xl font-extrabold text-white shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.4, background: `hsl(${hue} 55% 45%)` }}>
      {init}
    </div>
  );
}

export function PriorityTag({ p }: { p: "High" | "Medium" | "Low" }) {
  const map = { High: "#e05b5b", Medium: "#e8a13a", Low: "#5b6b66" };
  const bg = { High: "rgba(224,91,91,.14)", Medium: "rgba(232,161,58,.16)", Low: "rgba(91,107,102,.14)" };
  return <span className="text-[10px] font-extrabold rounded-full px-2 py-0.5" style={{ color: map[p], background: bg[p] }}>{p}</span>;
}

export function Bar({ pct, color = "var(--brand)" }: { pct: number; color?: string }) {
  return (
    <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--line)", width: 90 }}>
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color, transition: "width .6s cubic-bezier(.22,.9,.3,1)" }} />
    </div>
  );
}

export function Ring({ pct, size = 52, color = "var(--brand)" }: { pct: number; size?: number; color?: string }) {
  return (
    <div className="grid place-items-center rounded-full" style={{ width: size, height: size, background: `conic-gradient(${color} ${pct}%, var(--line) 0)` }}>
      <div className="grid place-items-center rounded-full font-extrabold" style={{ width: size * 0.72, height: size * 0.72, background: "var(--panel)", fontSize: size * 0.26, color: "var(--brand-d)" }}>{pct}</div>
    </div>
  );
}

export function AiBadge({ children = "AI" }: { children?: ReactNode }) {
  return <span className="chip" style={{ background: "linear-gradient(120deg, rgba(18,165,140,.14), rgba(61,123,214,.12))" }}>✨ {children}</span>;
}

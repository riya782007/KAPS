"use client";
import { ReactNode, useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { Play, RotateCcw, Check, ShieldCheck, FileClock, Sparkles, BadgeCheck } from "lucide-react";

export interface HowStep { icon: ReactNode; label: string; detail: string; proof: string; }

export function HowItWorks({ title, subtitle, steps, trust, accuracy }: {
  title: string; subtitle: string; steps: HowStep[]; trust: string[]; accuracy: string;
}) {
  const [active, setActive] = useState(-1);          // index currently running
  const [playing, setPlaying] = useState(false);
  const [log, setLog] = useState<{ t: string; text: string }[]>([]);

  const play = () => { setLog([]); setActive(0); setPlaying(true); };
  useEffect(() => { const t = setTimeout(play, 400); return () => clearTimeout(t); }, []); // auto-play once

  useEffect(() => {
    if (!playing || active < 0) return;
    if (active >= steps.length) { setPlaying(false); return; }
    const s = steps[active];
    const to = setTimeout(() => {
      setLog((l) => [...l, { t: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }), text: s.proof }]);
      setActive((a) => a + 1);
    }, 1400);
    return () => clearTimeout(to);
  }, [active, playing, steps]);

  const done = active >= steps.length && !playing && log.length === steps.length;
  const pct = Math.round((Math.min(Math.max(active, 0), steps.length) / steps.length) * 100);

  return (
    <Card className="ai-glow" pad={false}>
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2"><Sparkles size={16} style={{ color: "var(--brand)" }} /><h3 className="font-extrabold text-[16px]">{title}</h3></div>
            <p className="muted text-[13px] mt-1">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="chip" style={{ background: "rgba(22,196,127,.14)", color: "#0f8a53" }}><BadgeCheck size={12} /> {accuracy} accuracy</span>
            <button className="btn btn-line !py-1.5 !px-3 !text-[12px]" onClick={play}><RotateCcw size={13} /> Replay</button>
          </div>
        </div>

        {/* progress */}
        <div className="h-1.5 rounded-full mt-4 overflow-hidden" style={{ background: "var(--line)" }}>
          <div className="h-full rounded-full" style={{ width: pct + "%", background: "linear-gradient(90deg,var(--brand),var(--cyan))", transition: "width .5s cubic-bezier(.22,.9,.3,1)" }} />
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mt-4">
          {/* pipeline */}
          <div className="space-y-2">
            {steps.map((s, i) => {
              const st = i < active ? "done" : i === active && playing ? "run" : "idle";
              return (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl transition"
                  style={{ border: "1px solid var(--line)", background: st === "run" ? "var(--brand-l)" : "var(--panel)", opacity: st === "idle" ? 0.5 : 1 }}>
                  <div className="w-8 h-8 rounded-lg grid place-items-center shrink-0 text-white" style={{ background: st === "done" ? "var(--success)" : st === "run" ? "var(--brand)" : "var(--disabled)" }}>
                    {st === "done" ? <Check size={15} /> : st === "run" ? <span className="dot-live" style={{ background: "#fff" }} /> : s.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-bold flex items-center gap-1.5">{s.label}{st === "run" && <span className="text-[10px] font-semibold" style={{ color: "var(--brand-d)" }}>· running</span>}</div>
                    <div className="muted text-[12px] mt-0.5">{s.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* proof of work log */}
          <div className="rounded-2xl p-3" style={{ background: "var(--sidebar)", border: "1px solid var(--line)" }}>
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide font-bold px-1 pb-2" style={{ color: "#8fa2ff" }}><FileClock size={13} /> Proof-of-work · audit log</div>
            <div className="space-y-1.5 min-h-[160px] font-mono text-[11.5px]" style={{ color: "#cfe0ff" }}>
              {log.length === 0 && <div style={{ color: "#5b6b8a" }}>› waiting for the agent to start…</div>}
              {log.map((l, i) => (
                <div key={i} className="flex gap-2 enter">
                  <span style={{ color: "#4f6" }}>✓</span>
                  <span style={{ color: "#7f8fb0" }}>{l.t}</span>
                  <span className="flex-1">{l.text}</span>
                </div>
              ))}
              {done && <div className="enter" style={{ color: "#4f6" }}>› pipeline complete — every action logged &amp; reversible.</div>}
            </div>
          </div>
        </div>

        {/* trust panel */}
        <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--line)" }}>
          <div className="flex items-center gap-1.5 text-[12px] uppercase tracking-wide font-bold mb-2" style={{ color: "var(--brand-d)" }}><ShieldCheck size={14} /> Why you can trust it</div>
          <div className="grid sm:grid-cols-2 gap-2">
            {trust.map((t, i) => (
              <div key={i} className="flex items-start gap-2 text-[13px]" style={{ animation: done ? `pop .4s ${i * 0.06}s both` : undefined, opacity: done ? undefined : 0.5 }}>
                <Check size={15} className="mt-0.5 shrink-0" style={{ color: "var(--success)" }} />{t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

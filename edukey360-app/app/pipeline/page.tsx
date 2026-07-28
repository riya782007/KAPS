"use client";
import { useState } from "react";
import { Avatar, AiBadge } from "@/components/ui";
import { CANDIDATES, STAGES, type Stage, type Candidate } from "@/lib/mock";

export default function PipelinePage() {
  const [cands, setCands] = useState<Candidate[]>(CANDIDATES);
  const [drag, setDrag] = useState<string | null>(null);

  const move = (id: string, stage: Stage) => {
    setCands((cs) => cs.map((c) => (c.id === id ? { ...c, stage } : c)));
    fetch("/api/pipeline", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, stage }) }).catch(() => {});
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Interview Pipeline</h1>
          <p className="muted text-sm mt-1">Drag a candidate across stages — analytics update instantly. This replaces the shared Excel status tracker.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="chip">Placed: {cands.filter(c => c.stage === "Placed").length}</span>
          <span className="chip">Interviewing: {cands.filter(c => c.stage === "Interview").length}</span>
          <AiBadge>live analytics</AiBadge>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-3">
        {STAGES.map((stage) => {
          const items = cands.filter((c) => c.stage === stage);
          return (
            <div key={stage}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (drag) { move(drag, stage); setDrag(null); } }}
              className="shrink-0 w-[220px] rounded-2xl p-2.5"
              style={{ background: "var(--panel-2)", border: "1px solid var(--line)" }}>
              <div className="flex items-center justify-between px-1.5 pb-2">
                <span className="text-[11px] uppercase tracking-wide font-extrabold muted">{stage}</span>
                <span className="text-[11px] font-bold px-1.5 rounded-md" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>{items.length}</span>
              </div>
              <div className="space-y-2 min-h-[60px]">
                {items.map((c) => (
                  <div key={c.id} draggable onDragStart={() => setDrag(c.id)}
                    className="card !rounded-xl p-2.5 cursor-grab active:cursor-grabbing"
                    style={{ boxShadow: drag === c.id ? "var(--shadow-lg)" : "var(--shadow)" }}>
                    <div className="flex items-center gap-2">
                      <Avatar name={c.name} hue={c.match * 2} size={28} />
                      <div className="min-w-0"><div className="text-[12.5px] font-bold truncate">{c.name}</div><div className="muted text-[10.5px]">{c.subject} · {c.exp}y</div></div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="chip !text-[10px] !py-0.5">{c.match}% match</span>
                      <span className="muted text-[10px]">₹{c.expCTC}k</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

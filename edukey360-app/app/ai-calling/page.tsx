"use client";
import { useState, useRef, useEffect } from "react";
import { Card, SectionTitle, Avatar, Chip, AiBadge, Kpi } from "@/components/ui";
import { CANDIDATES } from "@/lib/mock";
import { PhoneCall, Play, Bot, User, CheckCircle2, Clock, PhoneOff, FileText } from "lucide-react";

const pool = CANDIDATES.filter((c) => ["New", "Contacted", "Interested", "Screened"].includes(c.stage));

function transcript(c: (typeof CANDIDATES)[number]) {
  const f = c.name.split(" ")[0];
  return [
    ["ai", `Hi ${f}, this is Maya calling from Edukey360 about a ${c.subject} teaching opening. Do you have 2 minutes?`],
    ["ca", `Yes, please go ahead.`],
    ["ai", `Great. I can see you're a ${c.qual} with ${c.exp} years' experience. Are you open to a new role right now?`],
    ["ca", `Yes, I'm actively looking.`],
    ["ai", `Perfect. Can you confirm your current monthly CTC?`],
    ["ca", `It's around ₹${c.curCTC},000 per month.`],
    ["ai", `And your expected CTC?`],
    ["ca", `Approximately ₹${c.expCTC},000.`],
    ["ai", `Noted. What's your notice period, and which location works for you?`],
    ["ca", `${c.notice}, and I'm based in ${c.loc}.`],
    ["ai", `Wonderful — I'll share your profile with the school and coordinate an interview. Thank you, ${f}!`],
  ] as [string, string][];
}

export default function AiCallingPage() {
  const [candId, setCandId] = useState(pool[0]?.id || "");
  const [lines, setLines] = useState<[string, string][]>([]);
  const [calling, setCalling] = useState(false);
  const [done, setDone] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const c = CANDIDATES.find((x) => x.id === candId)!;

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [lines]);

  const start = () => {
    if (calling) return;
    setLines([]); setDone(false); setCalling(true);
    const t = transcript(c); let i = 0;
    const step = () => {
      if (i < t.length) { setLines((l) => [...l, t[i]]); i++; setTimeout(step, 750); }
      else { setCalling(false); setDone(true); }
    };
    step();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl grid place-items-center text-white shrink-0" style={{ background: "linear-gradient(135deg,var(--brand),var(--cyan))" }}><PhoneCall size={22} /></div>
        <div><h1 className="text-2xl font-extrabold tracking-tight">AI Calling</h1><p className="muted text-sm mt-1">An AI voice agent screens candidates and writes the answers straight into the record — replacing hours of manual dialing.</p></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger">
        {Kpis()}
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-2">
          <SectionTitle>Place a call</SectionTitle>
          <label className="label">Candidate</label>
          <select className="input" value={candId} onChange={(e) => { setCandId(e.target.value); setLines([]); setDone(false); }}>
            {pool.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.subject}</option>)}
          </select>
          <div className="flex items-center gap-3 mt-4 p-3 rounded-xl" style={{ border: "1px solid var(--line)" }}>
            <Avatar name={c.name} hue={c.match * 2} />
            <div><div className="font-bold text-[14px]">{c.name}</div><div className="muted text-[12px]">{c.qual} · {c.loc}</div></div>
          </div>
          <button className="btn btn-primary w-full justify-center mt-4" onClick={start} disabled={calling}>
            {calling ? <><span className="dot-live" /> Calling…</> : <><Play size={15} /> Start AI Call</>}
          </button>
        </Card>

        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <SectionTitle right={undefined}>{calling ? "Live call" : done ? "Call complete" : "Transcript"}</SectionTitle>
            {calling ? <Chip><span className="dot-live" /> connected</Chip> : done ? <Chip tone="green"><CheckCircle2 size={11} /> auto-tagged</Chip> : <Chip tone="blue"><Bot size={11} /> Maya AI</Chip>}
          </div>
          <div ref={bodyRef} className="space-y-2 min-h-[180px] max-h-[300px] overflow-y-auto">
            {lines.length === 0 && <div className="muted text-sm text-center py-12">Press <b>Start AI Call</b> — Maya runs the full screening automatically.</div>}
            {lines.map(([who, text], i) => (
              <div key={i} className={`flex gap-2 enter ${who === "ca" ? "flex-row-reverse" : ""}`}>
                <div className="w-7 h-7 rounded-full grid place-items-center shrink-0 text-white" style={{ background: who === "ai" ? "var(--brand)" : "var(--muted)" }}>{who === "ai" ? <Bot size={14} /> : <User size={14} />}</div>
                <div className="text-[13px] rounded-xl px-3 py-2 max-w-[80%]" style={{ background: who === "ai" ? "var(--brand-l)" : "var(--panel-2)", border: "1px solid var(--line)" }}>{text}</div>
              </div>
            ))}
          </div>
          {done && (
            <div className="mt-4 pt-4 enter" style={{ borderTop: "1px solid var(--line)" }}>
              <div className="h-sec mb-2 flex items-center gap-1"><FileText size={13} /> Extracted &amp; saved to record</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[["Interest", "Actively looking"], ["Current CTC", `₹${c.curCTC}k`], ["Expected CTC", `₹${c.expCTC}k`], ["Notice", c.notice], ["Location", c.loc], ["Status", "Interview Ready"]].map(([k, v]) => (
                  <div key={k} className="p-2 rounded-lg" style={{ background: "var(--panel-2)", border: "1px solid var(--line)" }}>
                    <div className="muted text-[10px] uppercase font-bold tracking-wide">{k}</div><div className="font-semibold text-[13px] num">{v}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3 text-[12.5px]" style={{ color: "var(--success)" }}><CheckCircle2 size={15} /> Record updated · follow-up task created · no manual entry.</div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function Kpis() {
  const items = [
    { i: <PhoneCall size={18} />, v: "412", l: "Calls automated (wk)" },
    { i: <Clock size={18} />, v: "3m 40s", l: "Avg call time" },
    { i: <PhoneOff size={18} />, v: "68%", l: "Connect rate" },
    { i: <CheckCircle2 size={18} />, v: "54h", l: "Recruiter-hrs saved" },
  ];
  return items.map((x) => <Kpi key={x.l} icon={x.i} value={x.v} label={x.l} />);
}

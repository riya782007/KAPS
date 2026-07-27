"use client";
import { useState } from "react";
import { Card, SectionTitle, AiBadge, PriorityTag, Ring, Avatar } from "@/components/ui";
import { REQUIREMENTS, SCHOOLS, RECRUITERS, schoolName, type Priority } from "@/lib/mock";
import { Plus, Sparkles, Target, CalendarClock, Users, Radar, CheckCircle2, Wand2 } from "lucide-react";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

type Plan = {
  role: string; probability: number; timelineDays: number;
  channels: { name: string; found: number }[];
  phases: { label: string; when: string }[];
  recruiters: { name: string; hue: number; why: string }[];
  note: string;
};

function buildPlan(f: { role: string; subject: string; board: string; exp: number; sMax: number; priority: Priority; vacancies: number }): Plan {
  const speed = f.priority === "High" ? 10 : f.priority === "Medium" ? 16 : 22;
  const salaryEdge = f.sMax >= 55 ? 12 : f.sMax >= 40 ? 6 : 0;
  const probability = Math.min(96, 66 + salaryEdge + (f.exp <= 4 ? 10 : 4) + (f.priority === "High" ? 6 : 0));
  const pool: Record<string, number> = { Physics: 42, Mathematics: 57, English: 38, Primary: 61, Leadership: 12 };
  const base = pool[f.subject] ?? 30;
  const channels = [
    { name: "Internal verified pool", found: Math.round(base * 0.4) },
    { name: "Referral network (WhatsApp)", found: Math.round(base * 0.25) },
    { name: "Job portals (Naukri · Apna)", found: Math.round(base * 0.5) },
    { name: "LinkedIn passive outreach", found: Math.round(base * 0.2) },
  ];
  const d = (n: number) => { const x = new Date("2026-07-27"); x.setDate(x.getDate() + n); return x.toLocaleDateString("en-IN", { day: "numeric", month: "short" }); };
  const phases = [
    { label: "AI sourcing & ranking", when: `${d(0)}–${d(2)}` },
    { label: "AI screening calls", when: `${d(2)}–${d(4)}` },
    { label: "Interviews", when: `${d(4)}–${d(7)}` },
    { label: "Offer & verification", when: `${d(7)}–${d(9)}` },
    { label: "Joining", when: `by ${d(speed)}` },
  ];
  const byLoad = [...RECRUITERS].filter(r => r.role !== "Telerecruiter").sort((a, b) => (a.placed / a.target) - (b.placed / b.target));
  const recruiters = [
    { name: byLoad[0].name, hue: byLoad[0].avatarHue, why: `Lowest current load (${byLoad[0].placed}/${byLoad[0].target}) · strong ${f.board} closes` },
    { name: byLoad[1].name, hue: byLoad[1].avatarHue, why: `High ${f.subject} conversion · available bandwidth` },
  ];
  return { role: f.role, probability, timelineDays: speed, channels, phases, recruiters,
    note: `${f.priority} priority · target fill in ~${speed} days. ${probability >= 85 ? "Strong fill likelihood — pool is deep." : "Moderate — widen salary band or channels to de-risk."}` };
}

export default function RequirementsPage() {
  const [showForm, setShowForm] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [thinking, setThinking] = useState(false);
  const [reqs, setReqs] = useState(REQUIREMENTS);
  const [f, setF] = useState({ schoolId: "sch1", role: "TGT Chemistry", subject: "Physics", board: "CBSE", exp: 2, sMin: 32, sMax: 45, vacancies: 1, joining: "2026-08-20", priority: "High" as Priority });

  const save = () => {
    setThinking(true); setPlan(null);
    const id = "req" + (reqs.length + 1);
    setReqs((r) => [{ id, role: f.role, schoolId: f.schoolId, board: f.board, subject: f.subject, minExp: f.exp, salaryMin: f.sMin, salaryMax: f.sMax, vacancies: f.vacancies, joining: f.joining, priority: f.priority, status: "Open", createdBy: "Aarti Mehta" }, ...r]);
    setTimeout(() => { setThinking(false); setPlan(buildPlan({ role: f.role, subject: f.subject, board: f.board, exp: f.exp, sMax: f.sMax, priority: f.priority, vacancies: f.vacancies })); setShowForm(false); }, 1100);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Requirements</h1>
          <p className="muted text-sm mt-1">Every vacancy — and the moment you save one, AI builds the hiring plan. No Excel, no guesswork.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm((s) => !s); setPlan(null); }}><Plus size={16} /> New Requirement</button>
      </div>

      {showForm && (
        <Card className="enter">
          <SectionTitle right={<AiBadge>auto-plan on save</AiBadge>}>New Requirement</SectionTitle>
          <div className="grid sm:grid-cols-3 gap-3">
            <div><label className="label">School</label><select className="input" value={f.schoolId} onChange={(e) => setF({ ...f, schoolId: e.target.value })}>{SCHOOLS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
            <div><label className="label">Role</label><input className="input" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} /></div>
            <div><label className="label">Subject</label><select className="input" value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })}>{["Physics", "Mathematics", "English", "Primary", "Leadership"].map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label className="label">Board</label><select className="input" value={f.board} onChange={(e) => setF({ ...f, board: e.target.value })}>{["CBSE", "ICSE", "IB"].map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label className="label">Min experience (yrs)</label><input className="input" type="number" value={f.exp} onChange={(e) => setF({ ...f, exp: +e.target.value })} /></div>
            <div><label className="label">Vacancies</label><input className="input" type="number" value={f.vacancies} onChange={(e) => setF({ ...f, vacancies: +e.target.value })} /></div>
            <div><label className="label">Salary min (₹k/mo)</label><input className="input" type="number" value={f.sMin} onChange={(e) => setF({ ...f, sMin: +e.target.value })} /></div>
            <div><label className="label">Salary max (₹k/mo)</label><input className="input" type="number" value={f.sMax} onChange={(e) => setF({ ...f, sMax: +e.target.value })} /></div>
            <div><label className="label">Priority</label><select className="input" value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value as Priority })}>{["High", "Medium", "Low"].map(s => <option key={s}>{s}</option>)}</select></div>
          </div>
          <button className="btn btn-primary mt-4" onClick={save}><Wand2 size={16} /> Save &amp; generate AI plan</button>
        </Card>
      )}

      {thinking && (
        <Card className="ai-glow enter">
          <div className="flex items-center gap-3 text-[14px] font-semibold"><Sparkles size={18} style={{ color: "var(--brand)" }} className="animate-pulse2" /> AI Requirement Analyzer is building your hiring plan…</div>
          <div className="mt-3 space-y-2">
            {["Reading the requirement & board context", "Scanning the verified candidate pool", "Modelling timeline & fill probability", "Recommending the right recruiters"].map((t, i) => (
              <div key={i} className="text-[12.5px] muted flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--brand)" }} />{t}</div>
            ))}
          </div>
        </Card>
      )}

      {plan && (
        <Card className="ai-glow enter">
          <SectionTitle right={<AiBadge>Requirement Analyzer</AiBadge>}>AI Hiring Plan · {plan.role}</SectionTitle>
          <div className="grid lg:grid-cols-4 gap-4">
            <div className="grid place-items-center text-center">
              <Ring pct={plan.probability} size={92} />
              <div className="mt-2 text-[12px] font-bold">Fill probability</div>
              <div className="muted text-[11px] mt-1 max-w-[180px]">{plan.note}</div>
            </div>
            <div className="lg:col-span-1">
              <div className="h-sec mb-2 flex items-center gap-1"><Radar size={13} /> Sourcing strategy</div>
              {plan.channels.map((c) => (
                <div key={c.name} className="flex justify-between text-[12.5px] py-1.5" style={{ borderBottom: "1px solid var(--line)" }}>
                  <span>{c.name}</span><b style={{ color: "var(--brand-d)" }}>{c.found}</b>
                </div>
              ))}
            </div>
            <div>
              <div className="h-sec mb-2 flex items-center gap-1"><CalendarClock size={13} /> Timeline</div>
              <ol className="space-y-2">
                {plan.phases.map((p, i) => (
                  <li key={i} className="flex items-center gap-2 text-[12.5px]">
                    <span className="w-5 h-5 rounded-full grid place-items-center text-[10px] font-bold text-white" style={{ background: "var(--brand)" }}>{i + 1}</span>
                    <span className="flex-1">{p.label}</span><span className="muted">{p.when}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <div className="h-sec mb-2 flex items-center gap-1"><Users size={13} /> Recommended recruiters</div>
              {plan.recruiters.map((r) => (
                <div key={r.name} className="flex items-start gap-2 py-2" style={{ borderBottom: "1px solid var(--line)" }}>
                  <Avatar name={r.name} hue={r.hue} size={30} />
                  <div><div className="text-[12.5px] font-bold">{r.name}</div><div className="muted text-[11px]">{r.why}</div></div>
                </div>
              ))}
              <button className="btn btn-primary btn-sm mt-3 w-full justify-center" style={{ padding: "8px" }}><CheckCircle2 size={15} /> Approve & start AI sourcing</button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4 stagger">
        {reqs.map((r) => {
          const sla = r.priority === "High" ? 10 : r.priority === "Medium" ? 16 : 22;
          return (
            <Card key={r.id}>
              <div className="flex items-start justify-between">
                <div><div className="font-extrabold text-[15px]">{r.role}</div><div className="muted text-[12px] mt-0.5">{schoolName(r.schoolId)} · {r.board} · {r.subject}</div></div>
                <PriorityTag p={r.priority} />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                <span className="chip">{r.minExp}+ yrs</span>
                <span className="chip">{inr(r.salaryMin * 1000)}–{inr(r.salaryMax * 1000)}</span>
                <span className="chip">{r.vacancies} vacancy{r.vacancies > 1 ? "s" : ""}</span>
                <span className="chip">⏱ SLA {sla}d</span>
              </div>
              <div className="flex items-center justify-between mt-3 text-[12px]">
                <span className="chip" style={{ background: r.status === "Filled" ? "rgba(63,157,91,.16)" : "var(--brand-l)", color: r.status === "Filled" ? "#2f8a4f" : "var(--brand-d)" }}>{r.status}</span>
                <span className="muted">Created by {r.createdBy}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

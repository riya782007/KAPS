"use client";
import { useState } from "react";
import { Card, SectionTitle, Avatar, Chip, AiBadge } from "@/components/ui";
import { CANDIDATES, RECRUITERS } from "@/lib/mock";
import {
  Workflow, Play, RotateCcw, Check, Sparkles, User, ArrowDown,
  CalendarClock, MessageCircle, Mail, CalendarPlus, CircleCheck, Clock
} from "lucide-react";

type Actor = "system" | "ai" | "human";
const STEPS: { label: string; actor: Actor }[] = [
  { label: "New Requirement", actor: "system" },
  { label: "AI finds candidates", actor: "ai" },
  { label: "AI screens & calls", actor: "ai" },
  { label: "Recruiter reviews shortlist", actor: "human" },
  { label: "Interview scheduled", actor: "human" },
  { label: "Reminders sent (WhatsApp + Email)", actor: "ai" },
  { label: "Offer & verification", actor: "ai" },
  { label: "Joining tracked", actor: "system" },
  { label: "Invoice auto-raised", actor: "ai" },
];

const SLOTS = ["10:00", "11:30", "14:00", "16:00"];
const dayLabel = (o: number) => { const d = new Date(); d.setDate(d.getDate() + o); return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }); };
const slotDate = (o: number, hhmm: string) => { const d = new Date(); d.setDate(d.getDate() + o); const [h, m] = hhmm.split(":").map(Number); d.setHours(h, m, 0, 0); return d; };
const isBusy = (rid: string, o: number, s: number) => { const seed = (rid.charCodeAt(1) + o * 3 + s * 7) % 5; return seed === 0 || seed === 3; };
const gcal = (title: string, start: Date) => { const end = new Date(start.getTime() + 45 * 60000); const f = (x: Date) => x.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"; return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${f(start)}/${f(end)}&details=${encodeURIComponent("Interview coordinated by Edukey360 OS")}`; };

interface Booking { id: string; cand: string; interviewer: string; when: Date; role: string; }

export default function AutomationPage() {
  const [status, setStatus] = useState<string[]>(STEPS.map((_, i) => (i === 0 ? "done" : "pending")));
  const [running, setRunning] = useState(false);

  const advance = (i: number) => {
    if (i < 0 || i >= STEPS.length) { setRunning(false); return; }
    const step = STEPS[i];
    if (step.actor === "human") { setStatus((s) => s.map((v, idx) => (idx === i ? "waiting" : v))); setRunning(false); return; }
    setStatus((s) => s.map((v, idx) => (idx === i ? "running" : v)));
    setRunning(true);
    setTimeout(() => { setStatus((s) => s.map((v, idx) => (idx === i ? "done" : v))); advance(i + 1); }, 850);
  };
  const run = () => { const next = status.findIndex((s) => s === "pending" || s === "waiting"); advance(next); };
  const approve = (i: number) => { setStatus((s) => s.map((v, idx) => (idx === i ? "done" : v))); advance(i + 1); };
  const reset = () => { setStatus(STEPS.map((_, i) => (i === 0 ? "done" : "pending"))); setRunning(false); };

  // scheduler
  const candPool = CANDIDATES.filter((c) => ["Screened", "Interview", "Offer", "Interested"].includes(c.stage));
  const [candId, setCandId] = useState(candPool[0]?.id || "");
  const [rid, setRid] = useState(RECRUITERS[0].id);
  const [pick, setPick] = useState<{ o: number; s: number } | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const cand = CANDIDATES.find((c) => c.id === candId);
  const recruiter = RECRUITERS.find((r) => r.id === rid);

  const schedule = () => {
    if (!pick || !cand || !recruiter) return;
    const when = slotDate(pick.o, SLOTS[pick.s]);
    setBookings((b) => [{ id: "bk" + Date.now(), cand: cand.name, interviewer: recruiter.name, when, role: cand.subject }, ...b]);
    setPick(null);
    // auto-approve the "Interview scheduled" workflow step if it's waiting
    const idx = STEPS.findIndex((s) => s.label === "Interview scheduled");
    setStatus((s) => (s[idx] === "waiting" ? s.map((v, i) => (i === idx ? "done" : v)) : s));
  };

  const StatusIcon = ({ st }: { st: string }) =>
    st === "done" ? <Check size={13} /> : st === "running" ? <span className="dot-live" /> : st === "waiting" ? <Clock size={13} /> : <span className="w-2 h-2 rounded-full" style={{ background: "var(--disabled)" }} />;

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl grid place-items-center text-white shrink-0" style={{ background: "linear-gradient(135deg,var(--brand),var(--cyan))" }}><Workflow size={22} /></div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Automation</h1>
          <p className="muted text-sm mt-1">Your SOP runs itself — AI executes each step, humans approve only where judgement matters.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Workflow engine */}
        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <SectionTitle right={undefined}>Workflow · "Fill a vacancy"</SectionTitle>
            <div className="flex gap-2">
              <button className="btn btn-line" onClick={reset}><RotateCcw size={14} /> Reset</button>
              <button className="btn btn-primary" onClick={run} disabled={running || status.every((s) => s === "done")}><Play size={14} /> {running ? "Running…" : "Run"}</button>
            </div>
          </div>
          <div className="space-y-1">
            {STEPS.map((step, i) => {
              const st = status[i];
              const color = st === "done" ? "var(--success)" : st === "running" ? "var(--brand)" : st === "waiting" ? "var(--warning)" : "var(--disabled)";
              return (
                <div key={i}>
                  <div className="card !rounded-xl px-4 py-3 flex items-center gap-3" style={{ borderColor: st === "waiting" ? "var(--warning)" : "var(--line)", opacity: st === "pending" ? 0.6 : 1 }}>
                    <span className="w-7 h-7 rounded-full grid place-items-center text-white shrink-0" style={{ background: color }}><StatusIcon st={st} /></span>
                    <span className="text-[13.5px] font-semibold flex-1">{step.label}</span>
                    {step.actor === "ai" && <Chip><Sparkles size={11} /> AI</Chip>}
                    {step.actor === "human" && st !== "done" && (st === "waiting"
                      ? <button className="btn btn-primary !py-1.5 !px-3 !text-[12px]" onClick={() => approve(i)}><CircleCheck size={13} /> Approve</button>
                      : <Chip tone="blue"><User size={11} /> Human</Chip>)}
                    {step.actor === "human" && st === "done" && <Chip tone="green"><Check size={11} /> Approved</Chip>}
                  </div>
                  {i < STEPS.length - 1 && <div className="flex justify-center py-0.5"><ArrowDown size={15} className="muted" /></div>}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Interview scheduler */}
        <Card className="lg:col-span-2">
          <SectionTitle right={<AiBadge>availability</AiBadge>}>Schedule an interview</SectionTitle>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div><label className="label">Candidate</label><select className="input" value={candId} onChange={(e) => { setCandId(e.target.value); setPick(null); }}>{candPool.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div><label className="label">Interviewer</label><select className="input" value={rid} onChange={(e) => { setRid(e.target.value); setPick(null); }}>{RECRUITERS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
          </div>
          <div className="label">Available slots · next 3 days</div>
          <div className="space-y-2 mt-1">
            {[1, 2, 3].map((o) => (
              <div key={o} className="flex items-center gap-2">
                <span className="text-[11px] font-semibold muted w-24 shrink-0">{dayLabel(o)}</span>
                <div className="flex gap-1.5 flex-wrap">
                  {SLOTS.map((slot, s) => {
                    const busy = isBusy(rid, o, s);
                    const sel = pick && pick.o === o && pick.s === s;
                    return (
                      <button key={slot} disabled={busy} onClick={() => setPick({ o, s })}
                        className="text-[12px] font-semibold rounded-lg px-2.5 py-1.5 transition"
                        style={busy
                          ? { background: "var(--panel-2)", color: "var(--disabled)", cursor: "not-allowed", border: "1px solid var(--line)" }
                          : sel
                            ? { background: "var(--brand)", color: "#fff", border: "1px solid var(--brand)" }
                            : { background: "var(--panel)", color: "var(--ink)", border: "1px solid var(--line)" }}>
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 text-[11px] muted">
            <span className="inline-block w-3 h-3 rounded" style={{ background: "var(--panel)", border: "1px solid var(--line)" }} /> free
            <span className="inline-block w-3 h-3 rounded ml-2" style={{ background: "var(--panel-2)", border: "1px solid var(--line)" }} /> busy
            <span className="inline-block w-3 h-3 rounded ml-2" style={{ background: "var(--brand)" }} /> selected
          </div>
          <button className="btn btn-primary w-full justify-center mt-3" disabled={!pick} onClick={schedule}><CalendarClock size={15} /> {pick ? `Schedule ${dayLabel(pick.o)} · ${SLOTS[pick.s]}` : "Pick a slot"}</button>
        </Card>
      </div>

      {/* Upcoming interviews */}
      <Card>
        <SectionTitle right={<Chip tone="green">{bookings.length} scheduled</Chip>}>Upcoming Interviews</SectionTitle>
        {bookings.length === 0 ? (
          <div className="muted text-sm text-center py-8">No interviews scheduled yet. Pick a slot above — the invite goes out on WhatsApp, Email &amp; Calendar automatically.</div>
        ) : (
          <div className="space-y-2">
            {bookings.map((b) => {
              const title = `Interview: ${b.cand} (${b.role}) · Edukey360`;
              const dt = b.when.toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
              const waText = `Hi ${b.cand.split(" ")[0]}, your interview with Edukey360 is confirmed for ${dt}. Please confirm your availability. All the best!`;
              return (
                <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ border: "1px solid var(--line)" }}>
                  <Avatar name={b.cand} hue={b.cand.length * 20} />
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-bold">{b.cand} <span className="muted font-normal">· {b.role}</span></div>
                    <div className="muted text-[12px]">{dt} · with {b.interviewer}</div>
                  </div>
                  <div className="ml-auto flex gap-1.5 flex-wrap justify-end">
                    <a className="btn btn-ghost !py-1.5 !px-2.5 !text-[12px]" target="_blank" rel="noopener" href={`https://wa.me/?text=${encodeURIComponent(waText)}`}><MessageCircle size={13} /> WhatsApp</a>
                    <a className="btn btn-line !py-1.5 !px-2.5 !text-[12px]" href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(waText)}`}><Mail size={13} /> Email</a>
                    <a className="btn btn-line !py-1.5 !px-2.5 !text-[12px]" target="_blank" rel="noopener" href={gcal(title, b.when)}><CalendarPlus size={13} /> Calendar</a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

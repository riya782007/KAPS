import { ReactNode } from "react";
import { Kpi, Card, SectionTitle, Avatar, AiBadge, Bar, Chip } from "@/components/ui";
import { Tilt } from "@/components/tilt";
import { CountUp } from "@/components/count";
import { AreaChart, Donut } from "@/components/charts";
import { getCandidates, getRequirements, getRecruiters, getSchools, dataSource } from "@/lib/db";
import { STAGES } from "@/lib/mock";
import {
  CalendarClock, ClipboardList, UserCog, Users, GraduationCap, BellRing,
  FileSignature, PlaneTakeoff, Bot, TrendingUp, CheckCircle2, Table2, Clock
} from "lucide-react";

const ACTIVITY = [
  { t: "2m", text: "AI Calling Agent screened Ananya Sharma → Interview Ready", kind: "ai" },
  { t: "6m", text: "AI Matcher ranked 9 candidates for PGT Physics (DPS Gurgaon)", kind: "ai" },
  { t: "14m", text: "Interview Coordinator scheduled Deepak Joshi · Fri 11:30", kind: "ai" },
  { t: "20m", text: "Aarti Mehta moved Meera Nair → Screened", kind: "human" },
  { t: "32m", text: "WhatsApp Agent sent interview reminder to Priya Menon", kind: "ai" },
  { t: "1h", text: "Invoice auto-raised ₹47,200 on Kavya Iyer joining (Little Scholars)", kind: "system" },
];
const AI_ACTIONS = [
  "Requirement Analyzer built a 14-day hiring plan for TGT Mathematics",
  "Candidate Matcher auto-shortlisted 5 teachers, 3 above 90% match",
  "Recruiter Copilot drafted 4 WhatsApp outreach messages",
  "Report Generator compiled today's EOD report — no manual entry",
  "Calling Agent completed 8 screening calls, updated all records",
];
const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export default async function Dashboard() {
  const [candidates, requirements, recruiters, schools] = await Promise.all([
    getCandidates(), getRequirements(), getRecruiters(), getSchools(),
  ]);
  const schoolById = Object.fromEntries(schools.map((s) => [s.id, s]));
  const sc = (s: string) => candidates.filter((c) => c.stage === s).length;
  const k = {
    interviews: sc("Interview"), pipeline: candidates.filter((c) => c.stage !== "Placed").length,
    placements: sc("Placed"), offers: sc("Offer"), joining: sc("Joining"),
    activeReqs: requirements.filter((r) => r.status === "Open").length,
    online: recruiters.filter((r) => r.online).length,
    revenue: schools.reduce((a, s) => a + s.revenue, 0),
  };
  const funnel = STAGES.map((s) => ({ s, n: candidates.filter((c) => c.stage === s).length }));
  const maxF = Math.max(1, ...funnel.map((f) => f.n));
  const todaysInterviews = candidates.filter((c) => c.stage === "Interview");
  const trend = [3, 4, 6, 5, 8, k.placements + 6];
  const donut = [
    { label: "Sourcing", value: sc("New") + sc("Contacted"), color: "#3B4EFF" },
    { label: "Engaged", value: sc("Interested") + sc("Screened"), color: "#18C8FF" },
    { label: "Closing", value: sc("Interview") + sc("Offer"), color: "#F7B731" },
    { label: "Won", value: sc("Joining") + sc("Placed"), color: "#16C47F" },
  ];
  const kpis: { icon: ReactNode; to: number; label: string; delta?: string; hint?: string }[] = [
    { icon: <CalendarClock size={18} />, to: k.interviews, label: "Today's Interviews", delta: "2 in next 3 hrs" },
    { icon: <ClipboardList size={18} />, to: k.activeReqs, label: "Active Requirements", delta: "+1 today" },
    { icon: <UserCog size={18} />, to: k.online, label: "Recruiters Online", hint: "of 4 total" },
    { icon: <Users size={18} />, to: k.pipeline, label: "Candidates in Pipeline", delta: "9 added by AI" },
    { icon: <GraduationCap size={18} />, to: k.placements, label: "Placements (MTD)", delta: "+3 vs last week" },
    { icon: <BellRing size={18} />, to: 7, label: "Pending Follow-ups", hint: "all auto-scheduled" },
    { icon: <FileSignature size={18} />, to: k.offers, label: "Offers Sent" },
    { icon: <PlaneTakeoff size={18} />, to: k.joining, label: "Joining This Week" },
  ];

  return (
    <div className="space-y-5">
      <div className="hero-3d enter">
        <span className="hero-grid" />
        <span className="hero-orb" />
        <div className="flex flex-wrap items-end justify-between gap-4 relative">
          <div>
            <span className="hero-pill"><span className="dot-live" /> Live · {dataSource} connected</span>
            <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight mt-3" style={{ fontFamily: '"General Sans", Inter, sans-serif' }}>Good morning, Aarti</h1>
            <p className="text-[13.5px] mt-1.5" style={{ color: "rgba(255,255,255,.85)" }}>Your recruitment OS ran <b>38 automations</b> overnight — zero manual entry.</p>
            <div className="flex gap-2 flex-wrap mt-4">
              <span className="hero-pill"><Table2 size={12} /> Replaces Excel trackers</span>
              <span className="hero-pill"><BellRing size={12} /> Auto follow-ups</span>
              <span className="hero-pill"><CheckCircle2 size={12} /> EOD reports auto-built</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,.7)" }}>Revenue (MTD)</div>
            <div className="text-4xl font-extrabold num mt-1">{inr(k.revenue)}</div>
            <div className="text-[13px] font-semibold flex items-center justify-end gap-1 mt-1" style={{ color: "#c8ffe9" }}><TrendingUp size={15} /> +18% QoQ</div>
          </div>
        </div>
      </div>

      <div className="rail flex md:grid md:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-1 -mx-1 px-1 stagger">
        {kpis.map((m, i) => (
          <div key={i} className="snap-start shrink-0 basis-[62%] sm:basis-[240px] md:basis-auto min-w-0">
            <Tilt>
              <Kpi icon={m.icon} value={<CountUp to={m.to} />} label={m.label} delta={m.delta} hint={m.hint} />
            </Tilt>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Tilt max={4}>
            <Card>
              <SectionTitle right={<AiBadge>forecast</AiBadge>}>Placements &amp; Revenue Trend</SectionTitle>
              <div className="flex items-baseline gap-3 mb-1">
                <div className="text-3xl font-extrabold" style={{ color: "var(--brand-d)" }}>{inr(k.revenue)}</div>
                <span className="text-[13px] font-semibold flex items-center gap-1" style={{ color: "var(--brand)" }}><TrendingUp size={15} /> +18% QoQ</span>
              </div>
              <AreaChart data={trend} labels={["Feb", "Mar", "Apr", "May", "Jun", "Jul"]} />
            </Card>
          </Tilt>
        </div>
        <Tilt max={4}>
          <Card>
            <SectionTitle>Pipeline Distribution</SectionTitle>
            <Donut segments={donut} />
          </Card>
        </Tilt>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <SectionTitle>Hiring Funnel</SectionTitle>
          <div className="space-y-2.5">
            {funnel.map((f) => (
              <div key={f.s} className="flex items-center gap-3 text-[12.5px]">
                <span className="w-24 muted font-semibold">{f.s}</span>
                <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ background: "var(--line)" }}>
                  <div className="h-full rounded-lg flex items-center px-2 text-white text-[11px] font-extrabold"
                    style={{ width: `${Math.max(8, (f.n / maxF) * 100)}%`, background: "linear-gradient(90deg,var(--brand),var(--brand-d))", transition: "width .6s cubic-bezier(.22,.9,.3,1)" }}>{f.n}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="ai-glow">
          <SectionTitle right={<AiBadge>10 agents</AiBadge>}>Recent AI Actions</SectionTitle>
          <div className="space-y-0.5">
            {AI_ACTIONS.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5 py-2 text-[12.5px]" style={{ borderBottom: i < AI_ACTIONS.length - 1 ? "1px solid var(--line)" : "none" }}>
                <Bot size={15} className="mt-0.5 shrink-0" style={{ color: "var(--brand)" }} />{a}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <SectionTitle right={<Chip><span className="dot-live" /> live</Chip>}>Activity Feed</SectionTitle>
          <div className="space-y-0.5">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2 text-[12.5px]" style={{ borderBottom: i < ACTIVITY.length - 1 ? "1px solid var(--line)" : "none" }}>
                <span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ background: a.kind === "ai" ? "var(--brand)" : a.kind === "system" ? "#e8a13a" : "#3d7bd6" }} />
                <span className="flex-1">{a.text}</span><span className="muted text-[10.5px] whitespace-nowrap">{a.t}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionTitle>Recruiter Load</SectionTitle>
          <div className="space-y-2.5">
            {recruiters.map((r) => (
              <div key={r.id} className="flex items-center gap-3">
                <Avatar name={r.name} hue={r.avatarHue} />
                <div className="min-w-0">
                  <div className="text-[13px] font-bold flex items-center gap-2">{r.name}{r.online && <span className="dot-live" />}</div>
                  <div className="muted text-[11px]">{r.role} · {r.calls} calls today</div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Bar pct={Math.round((r.placed / r.target) * 100)} color={r.placed / r.target >= 0.8 ? "var(--brand)" : "#e8a13a"} />
                  <span className="text-[12px] font-bold">{r.placed}/{r.target}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle right={<Chip icon={<Clock size={12} />}>auto-scheduled</Chip>}>Today's Interviews</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-2">
          {todaysInterviews.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ border: "1px solid var(--line)" }}>
              <Avatar name={c.name} hue={c.match * 2} />
              <div className="min-w-0">
                <div className="text-[13px] font-bold">{c.name}</div>
                <div className="muted text-[11px]">{c.subject} · {schoolById[requirements.find((r) => r.id === c.reqId)?.schoolId || ""]?.name || "—"}</div>
              </div>
              <div className="ml-auto text-right"><div className="text-[12px] font-bold" style={{ color: "var(--brand-d)" }}>11:30 AM</div><AiBadge>coordinated</AiBadge></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

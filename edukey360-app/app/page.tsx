import { Kpi, Card, SectionTitle, Avatar, AiBadge, Bar } from "@/components/ui";
import { KPIS, CANDIDATES, STAGES, ACTIVITY, AI_ACTIONS, RECRUITERS, REQUIREMENTS, schoolName } from "@/lib/mock";
import {
  CalendarClock, ClipboardList, UserCog, Users, GraduationCap, BellRing,
  FileSignature, PlaneTakeoff, Wallet, Bot, TrendingUp
} from "lucide-react";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export default function Dashboard() {
  const k = KPIS();
  const funnel = STAGES.map((s) => ({ s, n: CANDIDATES.filter((c) => c.stage === s).length }));
  const maxF = Math.max(1, ...funnel.map((f) => f.n));
  const todaysInterviews = CANDIDATES.filter((c) => c.stage === "Interview");

  return (
    <div className="space-y-5">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Good morning, Aarti 👋</h1>
          <p className="muted text-sm mt-1">Monday, 27 July · Your recruitment OS ran <b style={{ color: "var(--brand-d)" }}>38 automations</b> overnight — no manual entry.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="chip">✅ Replaces Excel trackers</span>
          <span className="chip">✅ Auto follow-ups</span>
          <span className="chip">✅ EOD reports auto-generated</span>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 stagger">
        <Kpi icon={<CalendarClock size={18} />} value={todaysInterviews.length} label="Today's Interviews" delta="2 in next 3 hrs" />
        <Kpi icon={<ClipboardList size={18} />} value={k.activeReqs} label="Active Requirements" delta="+1 today" />
        <Kpi icon={<UserCog size={18} />} value={k.online} label="Recruiters Online" hint="of 4 total" />
        <Kpi icon={<Users size={18} />} value={k.pipeline} label="Candidates in Pipeline" delta="9 added by AI" />
        <Kpi icon={<GraduationCap size={18} />} value={k.placements} label="Placements (MTD)" delta="+3 vs last week" />
        <Kpi icon={<BellRing size={18} />} value={k.followups} label="Pending Follow-ups" hint="all auto-scheduled" />
        <Kpi icon={<FileSignature size={18} />} value={k.offers} label="Offers Sent" />
        <Kpi icon={<PlaneTakeoff size={18} />} value={k.joining} label="Joining This Week" />
      </div>

      {/* revenue + funnel */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1 ai-glow">
          <SectionTitle right={<AiBadge>forecast</AiBadge>}>Revenue</SectionTitle>
          <div className="text-3xl font-extrabold" style={{ color: "var(--brand-d)" }}>{inr(k.revenue)}</div>
          <div className="text-xs muted mt-1">Billed this quarter across 4 schools</div>
          <div className="flex items-center gap-2 mt-4 text-[13px] font-semibold" style={{ color: "var(--brand)" }}>
            <TrendingUp size={16} /> +18% vs last quarter
          </div>
          <div className="mt-4 pt-4 space-y-2" style={{ borderTop: "1px solid var(--line)" }}>
            <div className="flex justify-between text-[12.5px]"><span className="muted">Open invoices</span><b>3</b></div>
            <div className="flex justify-between text-[12.5px]"><span className="muted">Avg. deal size</span><b>{inr(363000)}</b></div>
            <div className="flex justify-between text-[12.5px]"><span className="muted">Cost-per-hire</span><b className="text-green-600">↓ 41%</b></div>
          </div>
        </Card>

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
      </div>

      {/* activity + AI actions */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <SectionTitle right={<span className="chip"><span className="dot-live" /> live</span>}>Activity Feed</SectionTitle>
          <div className="space-y-0.5">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2 text-[12.5px]" style={{ borderBottom: i < ACTIVITY.length - 1 ? "1px solid var(--line)" : "none" }}>
                <span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ background: a.kind === "ai" ? "var(--brand)" : a.kind === "system" ? "#e8a13a" : "#3d7bd6" }} />
                <span className="flex-1">{a.text}</span>
                <span className="muted text-[10.5px] whitespace-nowrap">{a.t}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="ai-glow">
          <SectionTitle right={<AiBadge>10 agents</AiBadge>}>Recent AI Actions</SectionTitle>
          <div className="space-y-0.5">
            {AI_ACTIONS.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2 text-[12.5px]" style={{ borderBottom: i < AI_ACTIONS.length - 1 ? "1px solid var(--line)" : "none" }}>
                <Bot size={15} className="mt-0.5 shrink-0" style={{ color: "var(--brand)" }} />
                <span className="flex-1">{a.text}</span>
                <span className="muted text-[10.5px] whitespace-nowrap">{a.t}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* recruiters + today's interviews */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <SectionTitle>Recruiter Load</SectionTitle>
          <div className="space-y-2">
            {RECRUITERS.map((r) => (
              <div key={r.id} className="flex items-center gap-3">
                <Avatar name={r.name} hue={r.avatarHue} />
                <div className="min-w-0">
                  <div className="text-[13px] font-bold flex items-center gap-2">{r.name}
                    {r.online && <span className="dot-live" />}</div>
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

        <Card>
          <SectionTitle right={<span className="muted text-[11px]">auto-scheduled</span>}>Today's Interviews</SectionTitle>
          <div className="space-y-2">
            {todaysInterviews.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-2 rounded-xl" style={{ border: "1px solid var(--line)" }}>
                <Avatar name={c.name} hue={c.match * 2} />
                <div className="min-w-0">
                  <div className="text-[13px] font-bold">{c.name}</div>
                  <div className="muted text-[11px]">{c.subject} · {schoolName(REQUIREMENTS.find(r => r.id === c.reqId)?.schoolId || "")}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-[12px] font-bold" style={{ color: "var(--brand-d)" }}>11:30 AM</div>
                  <div className="chip mt-1">✨ AI-coordinated</div>
                </div>
              </div>
            ))}
            {todaysInterviews.length === 0 && <div className="muted text-sm text-center py-6">No interviews today.</div>}
          </div>
        </Card>
      </div>
    </div>
  );
}

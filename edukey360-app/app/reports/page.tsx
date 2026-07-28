import { Card, SectionTitle, Kpi, Bar, Avatar, Chip, AiBadge } from "@/components/ui";
import { CountUp } from "@/components/count";
import { AreaChart, Donut } from "@/components/charts";
import { getCandidates, getRequirements, getRecruiters, getSchools } from "@/lib/db";
import { STAGES } from "@/lib/mock";
import { BarChart3, Clock, Target, TrendingUp, GraduationCap } from "lucide-react";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export default async function ReportsPage() {
  const [candidates, requirements, recruiters, schools] = await Promise.all([
    getCandidates(), getRequirements(), getRecruiters(), getSchools(),
  ]);
  const sc = (s: string) => candidates.filter((c) => c.stage === s).length;
  const filled = requirements.filter((r) => r.status === "Filled").length;
  const fillRate = Math.round((filled / requirements.length) * 100) || 40;
  const interviews = sc("Interview") + sc("Offer") + sc("Joining") + sc("Placed");
  const offers = sc("Offer") + sc("Joining") + sc("Placed");
  const joined = sc("Placed");
  const i2o = interviews ? Math.round((offers / interviews) * 100) : 0;
  const o2j = offers ? Math.round((joined / offers) * 100) : 0;
  const revenue = schools.reduce((a, s) => a + s.revenue, 0);
  const trend = [3, 4, 6, 5, 8, joined + 6];
  const donut = [
    { label: "Sourcing", value: sc("New") + sc("Contacted"), color: "#3B4EFF" },
    { label: "Engaged", value: sc("Interested") + sc("Screened"), color: "#18C8FF" },
    { label: "Closing", value: sc("Interview") + sc("Offer"), color: "#F7B731" },
    { label: "Won", value: sc("Joining") + sc("Placed"), color: "#16C47F" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl grid place-items-center text-white shrink-0" style={{ background: "linear-gradient(135deg,var(--brand),var(--cyan))" }}><BarChart3 size={22} /></div>
        <div><h1 className="text-2xl font-extrabold tracking-tight">Reports</h1><p className="muted text-sm mt-1">Live analytics — generated automatically. No more end-of-day report writing.</p></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger">
        <Kpi icon={<Clock size={18} />} value="9.2 days" label="Time-to-Hire" delta="↓ 41% vs manual" />
        <Kpi icon={<Target size={18} />} value={<CountUp to={fillRate} suffix="%" />} label="Fill Rate" />
        <Kpi icon={<TrendingUp size={18} />} value={<CountUp to={i2o} suffix="%" />} label="Interview → Offer" />
        <Kpi icon={<GraduationCap size={18} />} value={<CountUp to={o2j} suffix="%" />} label="Offer → Joining" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <SectionTitle right={<AiBadge>auto</AiBadge>}>Placements &amp; Revenue Trend</SectionTitle>
          <div className="flex items-baseline gap-3 mb-1"><div className="text-2xl font-extrabold num" style={{ color: "var(--brand-d)" }}>{inr(revenue)}</div><span className="text-[12.5px] font-semibold" style={{ color: "var(--brand)" }}>+18% QoQ</span></div>
          <AreaChart data={trend} labels={["Feb", "Mar", "Apr", "May", "Jun", "Jul"]} />
        </Card>
        <Card><SectionTitle>Pipeline Distribution</SectionTitle><Donut segments={donut} /></Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <SectionTitle>Recruiter Performance</SectionTitle>
          <div className="space-y-2.5">
            {recruiters.map((r) => (
              <div key={r.id} className="flex items-center gap-3">
                <Avatar name={r.name} hue={r.avatarHue} size={30} />
                <div className="min-w-0"><div className="text-[13px] font-bold">{r.name}</div><div className="muted text-[11px]">{r.calls} calls · {Math.round((r.placed / r.target) * 100)}% to target</div></div>
                <div className="ml-auto flex items-center gap-2"><Bar pct={Math.round((r.placed / r.target) * 100)} color={r.placed / r.target >= 0.8 ? "var(--success)" : "var(--warning)"} /><span className="text-[12px] font-bold num">{r.placed}/{r.target}</span></div>
              </div>
            ))}
          </div>
        </Card>
        <Card pad={false}>
          <div className="p-4"><SectionTitle>School Performance</SectionTitle></div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead><tr>{["School", "Board", "Vacancies", "Retention", "Revenue"].map((h) => (<th key={h} className="px-4 py-2 text-left text-[10.5px] uppercase tracking-wide font-bold muted" style={{ background: "var(--panel-2)", borderBottom: "1px solid var(--line)" }}>{h}</th>))}</tr></thead>
              <tbody>{schools.map((s) => (
                <tr key={s.id} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td className="px-4 py-2.5 font-semibold">{s.name}</td><td className="px-4 py-2.5"><Chip>{s.board}</Chip></td>
                  <td className="px-4 py-2.5 num">{s.vacancies}</td><td className="px-4 py-2.5 num" style={{ color: "var(--success)" }}>{s.retention}%</td>
                  <td className="px-4 py-2.5 num font-semibold">{inr(s.revenue)}</td>
                </tr>))}</tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

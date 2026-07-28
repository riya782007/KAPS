import { Card, SectionTitle, Kpi, Ring, Chip, AiBadge } from "@/components/ui";
import { getSchools, getRequirements, getCandidates } from "@/lib/db";
import { Building2, MapPin, Receipt, GraduationCap, Briefcase } from "lucide-react";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export default async function SchoolsPage() {
  const [schools, requirements, candidates] = await Promise.all([getSchools(), getRequirements(), getCandidates()]);
  const totalRev = schools.reduce((a, s) => a + s.revenue, 0);
  const totalVac = schools.reduce((a, s) => a + s.vacancies, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl grid place-items-center text-white shrink-0" style={{ background: "linear-gradient(135deg,var(--brand),var(--cyan))" }}><Building2 size={22} /></div>
        <div><h1 className="text-2xl font-extrabold tracking-tight">Schools</h1><p className="muted text-sm mt-1">A CRM for every partner school — vacancies, hiring history, invoices and relationship health in one place.</p></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger">
        <Kpi icon={<Building2 size={18} />} value={schools.length} label="Partner schools" />
        <Kpi icon={<Briefcase size={18} />} value={totalVac} label="Open vacancies" />
        <Kpi icon={<GraduationCap size={18} />} value="89%" label="Avg retention" />
        <Kpi icon={<Receipt size={18} />} value={inr(totalRev)} label="Revenue (Q)" />
      </div>

      <div className="grid md:grid-cols-2 gap-4 stagger">
        {schools.map((s) => {
          const openReqs = requirements.filter((r) => r.schoolId === s.id && r.status === "Open").length;
          const placed = candidates.filter((c) => c.stage === "Placed" && requirements.find((r) => r.id === c.reqId)?.schoolId === s.id).length;
          return (
            <Card key={s.id} className="hover-glow">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-extrabold text-[15px]">{s.name}</div>
                  <div className="muted text-[12px] mt-0.5 flex items-center gap-1"><MapPin size={12} /> {s.loc} · {s.board}</div>
                </div>
                <Ring pct={s.retention} size={54} color="var(--success)" />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <Stat label="Vacancies" value={String(s.vacancies)} />
                <Stat label="Open reqs" value={String(openReqs)} />
                <Stat label="Placed" value={String(placed)} />
              </div>
              <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: "1px solid var(--line)" }}>
                <div className="text-[13px]"><span className="muted">Revenue </span><b className="num">{inr(s.revenue)}</b></div>
                {s.openInvoices > 0
                  ? <Chip tone="amber"><Receipt size={11} /> {s.openInvoices} open invoice{s.openInvoices > 1 ? "s" : ""}</Chip>
                  : <Chip tone="green">Paid up</Chip>}
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="ai-glow">
        <SectionTitle right={<AiBadge>School Relationship Mgr</AiBadge>}>AI insight</SectionTitle>
        <div className="text-[13px] muted">Cambridge Global (93% retention) is due for a renewal conversation in 21 days — and has 2 unfilled premium roles worth ~{inr(130000)}. Recommend a QBR this week.</div>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="text-center p-2 rounded-xl" style={{ background: "var(--panel-2)", border: "1px solid var(--line)" }}><div className="text-[18px] font-extrabold num" style={{ color: "var(--brand-d)" }}>{value}</div><div className="muted text-[10px] font-semibold uppercase tracking-wide mt-0.5">{label}</div></div>;
}

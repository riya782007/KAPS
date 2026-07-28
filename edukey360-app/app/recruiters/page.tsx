import { Card, SectionTitle, Kpi, Avatar, Bar, Chip, AiBadge } from "@/components/ui";
import { getRecruiters } from "@/lib/db";
import { UserCog, Phone, Target, Trophy, TriangleAlert } from "lucide-react";

export default async function RecruitersPage() {
  const recruiters = await getRecruiters();
  const online = recruiters.filter((r) => r.online).length;
  const calls = recruiters.reduce((a, r) => a + r.calls, 0);
  const teamRate = Math.round((recruiters.reduce((a, r) => a + r.placed, 0) / recruiters.reduce((a, r) => a + r.target, 0)) * 100);
  const behind = recruiters.filter((r) => r.placed / r.target < 0.6);

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl grid place-items-center text-white shrink-0" style={{ background: "linear-gradient(135deg,var(--brand),var(--cyan))" }}><UserCog size={22} /></div>
        <div><h1 className="text-2xl font-extrabold tracking-tight">Recruiters</h1><p className="muted text-sm mt-1">Live targets, calls and conversion — with an AI Performance Coach so nothing slips.</p></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger">
        <Kpi icon={<UserCog size={18} />} value={recruiters.length} label="Recruiters" />
        <Kpi icon={<span className="dot-live" />} value={online} label="Online now" />
        <Kpi icon={<Phone size={18} />} value={calls} label="Calls today" />
        <Kpi icon={<Target size={18} />} value={teamRate + "%"} label="Team to target" />
      </div>

      {behind.length > 0 && (
        <Card style={{ borderColor: "var(--warning)" }}>
          <div className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: "#a4701c" }}>
            <TriangleAlert size={16} /> AI Coach: {behind.map((b) => b.name).join(", ")} {behind.length > 1 ? "are" : "is"} below 60% of target. Suggest reallocating requisitions and a mid-week check-in.
          </div>
        </Card>
      )}

      <Card pad={false}>
        <div className="p-4"><SectionTitle right={<AiBadge>Recruiter Coach</AiBadge>}>Performance &amp; accountability</SectionTitle></div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead><tr>{["Recruiter", "Role", "Calls", "Placed / Target", "Progress", "Status"].map((h) => (<th key={h} className="px-4 py-2.5 text-left text-[10.5px] uppercase tracking-wide font-bold muted" style={{ background: "var(--panel-2)", borderBottom: "1px solid var(--line)" }}>{h}</th>))}</tr></thead>
            <tbody>
              {recruiters.map((r) => {
                const pct = Math.round((r.placed / r.target) * 100);
                const top = pct >= 90;
                return (
                  <tr key={r.id} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td className="px-4 py-2.5"><div className="flex items-center gap-2.5"><Avatar name={r.name} hue={r.avatarHue} size={30} /><div className="font-bold flex items-center gap-1.5">{r.name}{top && <Trophy size={13} style={{ color: "var(--warning)" }} />}</div></div></td>
                    <td className="px-4 py-2.5 muted">{r.role}</td>
                    <td className="px-4 py-2.5 num">{r.calls}</td>
                    <td className="px-4 py-2.5 num font-semibold">{r.placed} / {r.target}</td>
                    <td className="px-4 py-2.5"><div className="flex items-center gap-2"><Bar pct={pct} color={pct >= 80 ? "var(--success)" : pct >= 60 ? "var(--warning)" : "var(--error)"} /><span className="num text-[12px] font-bold">{pct}%</span></div></td>
                    <td className="px-4 py-2.5">{r.online ? <Chip tone="green"><span className="dot-live" /> Online</Chip> : <Chip>Offline</Chip>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

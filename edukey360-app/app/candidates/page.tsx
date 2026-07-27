import { Card, Avatar, Bar, SectionTitle, AiBadge } from "@/components/ui";
import { CANDIDATES, REQUIREMENTS, schoolName } from "@/lib/mock";

const TRUST = ["Self-declared", "Doc-verified", "Blockchain"];
const trustColor = ["#7a8783", "#0e8574", "#2f5fbf"];

export default function CandidatesPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Candidates</h1>
        <p className="muted text-sm mt-1">One shared record per teacher — no duplicate data entry, ever. Every module reads &amp; writes here.</p>
      </div>
      <Card pad={false}>
        <div className="p-4"><SectionTitle right={<AiBadge>auto-ranked</AiBadge>}>{CANDIDATES.length} candidates</SectionTitle></div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left" style={{ color: "var(--muted)" }}>
                {["Candidate", "Subject", "Exp", "Location", "Expected", "Match", "Comm", "Trust", "Stage"].map(h => (
                  <th key={h} className="px-4 py-2 text-[11px] uppercase tracking-wide font-bold" style={{ background: "var(--panel-2)", borderBottom: "1px solid var(--line)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CANDIDATES.map((c) => (
                <tr key={c.id} className="hover:bg-black/[.02] dark:hover:bg-white/[.03]" style={{ borderBottom: "1px solid var(--line)" }}>
                  <td className="px-4 py-2.5"><div className="flex items-center gap-2.5"><Avatar name={c.name} hue={c.match * 2} size={30} /><div><div className="font-bold">{c.name}</div><div className="muted text-[11px]">{c.qual}</div></div></div></td>
                  <td className="px-4 py-2.5">{c.subject}</td>
                  <td className="px-4 py-2.5">{c.exp} yrs</td>
                  <td className="px-4 py-2.5">{c.loc}</td>
                  <td className="px-4 py-2.5">₹{c.expCTC}k</td>
                  <td className="px-4 py-2.5"><div className="flex items-center gap-2"><Bar pct={c.match} /><b>{c.match}%</b></div></td>
                  <td className="px-4 py-2.5">{c.commScore}/10</td>
                  <td className="px-4 py-2.5"><span className="text-[11px] font-bold" style={{ color: trustColor[c.trust] }}>{TRUST[c.trust]}</span></td>
                  <td className="px-4 py-2.5"><span className="chip">{c.stage}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

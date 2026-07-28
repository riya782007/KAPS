import { Card, Avatar, Bar, SectionTitle, Chip } from "@/components/ui";
import { WhatsAppButton } from "@/components/reach";
import { getCandidates, dataSource } from "@/lib/db";
import { Database, ShieldCheck, ShieldQuestion, BadgeCheck } from "lucide-react";

const TRUST = ["Self-declared", "Doc-verified", "Blockchain"];
const TrustIcon = [ShieldQuestion, ShieldCheck, BadgeCheck];
const trustColor = ["#94A3B8", "#16C47F", "#3B4EFF"];

export default async function CandidatesPage() {
  const candidates = await getCandidates();
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Candidates</h1>
          <p className="muted text-sm mt-1">One shared record per teacher — no duplicate data entry. Every module reads &amp; writes here.</p>
        </div>
        <Chip icon={<Database size={12} />} tone={dataSource === "Supabase" ? "green" : "blue"}>Source: {dataSource}</Chip>
      </div>
      <Card pad={false}>
        <div className="p-4"><SectionTitle>{candidates.length} candidates · auto-ranked</SectionTitle></div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left">
                {["Candidate", "Subject", "Exp", "Location", "Expected", "Match", "Comm", "Trust", "Stage", "Reach"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[11px] uppercase tracking-wide font-bold muted" style={{ background: "var(--panel-2)", borderBottom: "1px solid var(--line)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => {
                const TI = TrustIcon[c.trust];
                return (
                  <tr key={c.id} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td className="px-4 py-2.5"><div className="flex items-center gap-2.5"><Avatar name={c.name} hue={c.match * 2} size={30} /><div><div className="font-bold">{c.name}</div><div className="muted text-[11px]">{c.qual}</div></div></div></td>
                    <td className="px-4 py-2.5">{c.subject}</td>
                    <td className="px-4 py-2.5">{c.exp} yrs</td>
                    <td className="px-4 py-2.5">{c.loc}</td>
                    <td className="px-4 py-2.5">₹{c.expCTC}k</td>
                    <td className="px-4 py-2.5"><div className="flex items-center gap-2"><Bar pct={c.match} /><b>{c.match}%</b></div></td>
                    <td className="px-4 py-2.5">{c.commScore}/10</td>
                    <td className="px-4 py-2.5"><span className="inline-flex items-center gap-1 text-[11px] font-bold" style={{ color: trustColor[c.trust] }}><TI size={13} />{TRUST[c.trust]}</span></td>
                    <td className="px-4 py-2.5"><Chip>{c.stage}</Chip></td>
                    <td className="px-4 py-2.5"><WhatsAppButton name={c.name} subject={c.subject} /></td>
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

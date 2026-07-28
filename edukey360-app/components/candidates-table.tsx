"use client";
import { useMemo, useState } from "react";
import { Card, Avatar, Bar, SectionTitle, Chip } from "@/components/ui";
import { WhatsAppButton } from "@/components/reach";
import type { Candidate } from "@/lib/mock";
import { Search, ShieldCheck, ShieldQuestion, BadgeCheck, X } from "lucide-react";

const TRUST = ["Self-declared", "Doc-verified", "Blockchain"];
const TrustIcon = [ShieldQuestion, ShieldCheck, BadgeCheck];
const trustColor = ["#94A3B8", "#16C47F", "#3B4EFF"];
const EXP = [{ l: "Any experience", v: 0 }, { l: "1+ yrs", v: 1 }, { l: "3+ yrs", v: 3 }, { l: "5+ yrs", v: 5 }, { l: "8+ yrs", v: 8 }];

export function CandidatesTable({ candidates, initialQuery = "" }: { candidates: Candidate[]; initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery);
  const [subject, setSubject] = useState("All");
  const [loc, setLoc] = useState("All");
  const [minExp, setMinExp] = useState(0);

  const subjects = useMemo(() => Array.from(new Set(candidates.map((c) => c.subject))).sort(), [candidates]);
  const locations = useMemo(() => Array.from(new Set(candidates.map((c) => c.loc))).sort(), [candidates]);

  const rows = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return candidates.filter((c) => {
      if (ql && !(c.name + " " + c.subject + " " + c.loc + " " + c.qual).toLowerCase().includes(ql)) return false;
      if (subject !== "All" && c.subject !== subject) return false;
      if (loc !== "All" && c.loc !== loc) return false;
      if (c.exp < minExp) return false;
      return true;
    });
  }, [candidates, q, subject, loc, minExp]);

  const active = q || subject !== "All" || loc !== "All" || minExp > 0;
  const clear = () => { setQ(""); setSubject("All"); setLoc("All"); setMinExp(0); };

  return (
    <Card pad={false}>
      <div className="p-4 flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-3 opacity-50" />
          <input className="input !pl-9" placeholder="Search by name, subject, location…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="input !w-auto" value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="All">All subjects</option>{subjects.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="input !w-auto" value={String(minExp)} onChange={(e) => setMinExp(+e.target.value)}>
          {EXP.map((x) => <option key={x.v} value={x.v}>{x.l}</option>)}
        </select>
        <select className="input !w-auto" value={loc} onChange={(e) => setLoc(e.target.value)}>
          <option value="All">All locations</option>{locations.map((l) => <option key={l}>{l}</option>)}
        </select>
        {active && <button className="btn btn-line" onClick={clear}><X size={14} /> Clear</button>}
      </div>

      <div className="px-4 pb-2"><SectionTitle>{rows.length} of {candidates.length} candidates{active ? " · filtered" : " · auto-ranked"}</SectionTitle></div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr>{["Candidate", "Subject", "Exp", "Location", "Expected", "Match", "Comm", "Trust", "Stage", "Reach"].map((h) => (
              <th key={h} className="px-4 py-2.5 text-left text-[11px] uppercase tracking-wide font-bold muted" style={{ background: "var(--panel-2)", borderBottom: "1px solid var(--line)" }}>{h}</th>))}</tr>
          </thead>
          <tbody>
            {rows.map((c) => {
              const TI = TrustIcon[c.trust];
              return (
                <tr key={c.id} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td className="px-4 py-2.5"><div className="flex items-center gap-2.5"><Avatar name={c.name} hue={c.match * 2} size={30} /><div><div className="font-bold">{c.name}</div><div className="muted text-[11px]">{c.qual}</div></div></div></td>
                  <td className="px-4 py-2.5">{c.subject}</td>
                  <td className="px-4 py-2.5 num">{c.exp} yrs</td>
                  <td className="px-4 py-2.5">{c.loc}</td>
                  <td className="px-4 py-2.5 num">₹{c.expCTC}k</td>
                  <td className="px-4 py-2.5"><div className="flex items-center gap-2"><Bar pct={c.match} /><b className="num">{c.match}%</b></div></td>
                  <td className="px-4 py-2.5 num">{c.commScore}/10</td>
                  <td className="px-4 py-2.5"><span className="inline-flex items-center gap-1 text-[11px] font-bold" style={{ color: trustColor[c.trust] }}><TI size={13} />{TRUST[c.trust]}</span></td>
                  <td className="px-4 py-2.5"><Chip>{c.stage}</Chip></td>
                  <td className="px-4 py-2.5"><WhatsAppButton name={c.name} subject={c.subject} /></td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr><td colSpan={10} className="px-4 py-10 text-center muted text-sm">No candidates match these filters. <button className="underline" onClick={clear}>Clear filters</button></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

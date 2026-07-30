"use client";
import { useMemo, useState, type ReactNode } from "react";
import { Card, SectionTitle, Bar, Avatar, Chip, AiBadge } from "@/components/ui";
import { AreaChart } from "@/components/charts";
import type { Candidate, Recruiter, School, Requirement } from "@/lib/mock";
import { STAGES } from "@/lib/mock";
import {
  BarChart3, Clock, Target, TrendingUp, IndianRupee, Wallet, Trophy,
  Download, Printer, Sparkles, TriangleAlert, ArrowRight, GraduationCap
} from "lucide-react";

type Period = "This Week" | "This Month" | "This Quarter";
const money = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export function ReportsView({ candidates, recruiters, schools, requirements }: {
  candidates: Candidate[]; recruiters: Recruiter[]; schools: School[]; requirements: Requirement[];
}) {
  const [period, setPeriod] = useState<Period>("This Quarter");

  const totalRevenue = useMemo(() => schools.reduce((a, s) => a + s.revenue, 0), [schools]);
  const openVac = useMemo(() => requirements.filter((r) => r.status === "Open").reduce((a, r) => a + r.vacancies, 0), [requirements]);

  // period datasets (quarter is anchored to real booked revenue; week/month are subsets)
  const P: Record<Period, { rev: number; plc: number; newC: number; tth: string; labels: string[]; trend: number[] }> = {
    "This Week": { rev: Math.round(totalRevenue * 0.09), plc: 2, newC: 9, tth: "8.4", labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], trend: [1, 2, 1, 3, 2, 2] },
    "This Month": { rev: Math.round(totalRevenue * 0.38), plc: 9, newC: 38, tth: "9.0", labels: ["Week 1", "Week 2", "Week 3", "Week 4"], trend: [2, 3, 2, 4] },
    "This Quarter": { rev: totalRevenue, plc: 24, newC: 112, tth: "9.2", labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"], trend: [3, 4, 6, 5, 8, 10] },
  };
  const p = P[period];
  const avgFee = p.plc ? Math.round(p.rev / p.plc) : 0;
  const fillRate = Math.round((p.plc / (p.plc + openVac)) * 100);
  const AVG_INVOICE = 47200;
  const openInvoiceCount = schools.reduce((a, s) => a + s.openInvoices, 0);
  const receivables = openInvoiceCount * AVG_INVOICE;

  // conversion funnel — "reached this stage or beyond"
  const idx = (st: string) => STAGES.indexOf(st as (typeof STAGES)[number]);
  const reached = STAGES.map((_, i) => candidates.filter((c) => idx(c.stage) >= i).length);
  const funnelTop = Math.max(1, reached[0]);

  // recruiter productivity + revenue contribution
  const sumPlaced = recruiters.reduce((a, r) => a + r.placed, 0) || 1;
  const rstats = recruiters
    .map((r) => ({ ...r, pct: Math.round((r.placed / r.target) * 100), rev: Math.round((r.placed / sumPlaced) * totalRevenue) }))
    .sort((a, b) => b.rev - a.rev);
  const topRecruiter = rstats[0];
  const behind = [...rstats].sort((a, b) => a.pct - b.pct)[0];

  // sourcing channel ROI
  const sources = Array.from(new Set(candidates.map((c) => c.source)));
  const sourceStats = sources
    .map((src) => {
      const list = candidates.filter((c) => c.source === src);
      const wins = list.filter((c) => ["Offer", "Joining", "Placed"].includes(c.stage)).length;
      return { src, total: list.length, wins, conv: Math.round((wins / list.length) * 100) };
    })
    .sort((a, b) => b.wins - a.wins || b.total - a.total);
  const maxSrc = Math.max(1, ...sourceStats.map((s) => s.total));
  const topSource = sourceStats[0];

  // client-account health
  const schoolStats = schools
    .map((s) => ({ ...s, openReqs: requirements.filter((r) => r.schoolId === s.id && r.status === "Open").length, atRisk: s.openInvoices > 0 || s.retention < 88 }))
    .sort((a, b) => b.revenue - a.revenue);
  const atRiskCount = schoolStats.filter((s) => s.atRisk).length;
  const maxSchoolRev = Math.max(1, ...schoolStats.map((s) => s.revenue));

  const summary =
    `In ${period.toLowerCase()}, Edukey360 closed ${p.plc} placements generating ${money(p.rev)} in fees (avg ${money(avgFee)} per placement). ` +
    `Time-to-hire held at ${p.tth} days — about 41% faster than the manual process. ` +
    `${topRecruiter.name} led the team with ${topRecruiter.placed} placements (${money(topRecruiter.rev)} contributed)` +
    `${behind && behind.pct < 70 ? `, while ${behind.name} is at ${behind.pct}% of target and needs support` : ""}. ` +
    `${topSource.src} is the strongest sourcing channel with ${topSource.wins} wins. ` +
    `${atRiskCount > 0 ? `${atRiskCount} client account${atRiskCount > 1 ? "s" : ""} need attention this week (open invoices or dipping retention).` : "All client accounts are healthy."}`;

  const kpis: { icon: ReactNode; value: string; label: string; sub?: string; good?: boolean }[] = [
    { icon: <IndianRupee size={18} />, value: money(p.rev), label: "Revenue booked", sub: "+18% vs last period", good: true },
    { icon: <GraduationCap size={18} />, value: String(p.plc), label: "Placements closed", sub: `${p.newC} new candidates added` },
    { icon: <Wallet size={18} />, value: money(avgFee), label: "Avg fee / placement" },
    { icon: <TriangleAlert size={18} />, value: money(receivables), label: "Open receivables", sub: `${openInvoiceCount} invoices pending` },
    { icon: <Clock size={18} />, value: p.tth + " days", label: "Time-to-hire", sub: "↓ 41% vs manual", good: true },
    { icon: <Target size={18} />, value: fillRate + "%", label: "Fill rate", sub: `${openVac} vacancies still open` },
  ];

  const exportCSV = () => {
    const rows: string[][] = [
      ["Edukey360 OS — Recruitment Report", period, new Date().toLocaleDateString("en-IN")],
      [],
      ["Metric", "Value"],
      ["Revenue booked", money(p.rev)],
      ["Placements closed", String(p.plc)],
      ["Avg fee per placement", money(avgFee)],
      ["Time-to-hire (days)", p.tth],
      ["Fill rate", fillRate + "%"],
      ["Open receivables", money(receivables)],
      [],
      ["Recruiter", "Role", "Calls", "Placed", "Target", "% to target", "Revenue contributed"],
      ...rstats.map((r) => [r.name, r.role, String(r.calls), String(r.placed), String(r.target), r.pct + "%", money(r.rev)]),
      [],
      ["Sourcing channel", "Candidates", "Wins", "Conversion"],
      ...sourceStats.map((s) => [s.src, String(s.total), String(s.wins), s.conv + "%"]),
      [],
      ["Client / School", "Board", "Open reqs", "Retention", "Open invoices", "Revenue"],
      ...schoolStats.map((s) => [s.name, s.board, String(s.openReqs), s.retention + "%", String(s.openInvoices), money(s.revenue)]),
    ];
    const csv = rows.map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `edukey360-report-${period.replace(/\s/g, "-").toLowerCase()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* header + controls */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl grid place-items-center text-white shrink-0" style={{ background: "linear-gradient(135deg,var(--brand),var(--cyan))" }}><BarChart3 size={22} /></div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Business Report</h1>
            <p className="muted text-sm mt-1">Auto-generated MIS for the owner — money, people, clients &amp; conversion in one view. Generated {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 no-print">
          <div className="flex rounded-[14px] p-1" style={{ background: "var(--panel-2)", border: "1px solid var(--line)" }}>
            {(["This Week", "This Month", "This Quarter"] as Period[]).map((x) => (
              <button key={x} onClick={() => setPeriod(x)}
                className="text-[12px] font-bold px-3 py-1.5 rounded-[10px] transition"
                style={period === x ? { background: "var(--brand)", color: "#fff" } : { color: "var(--muted)" }}>
                {x.replace("This ", "")}
              </button>
            ))}
          </div>
          <button className="btn btn-line" onClick={exportCSV}><Download size={14} /> Export</button>
          <button className="btn btn-primary" onClick={() => window.print()}><Printer size={14} /> Print / PDF</button>
        </div>
      </div>

      {/* AI executive summary */}
      <Card className="ai-glow">
        <div className="flex items-center gap-2 mb-2"><Sparkles size={15} style={{ color: "var(--brand)" }} /><span className="h-sec">Executive summary · {period}</span><AiBadge>auto-written</AiBadge></div>
        <p className="text-[13.5px] leading-relaxed">{summary}</p>
      </Card>

      {/* owner KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 stagger">
        {kpis.map((m, i) => (
          <div key={i} className="kpi">
            <div className="flex items-start justify-between">
              <div className="text-[19px] leading-none font-extrabold num" style={{ color: "var(--brand-d)" }}>{m.value}</div>
              <div className="opacity-60">{m.icon}</div>
            </div>
            <div className="text-[11px] font-semibold mt-2 muted">{m.label}</div>
            {m.sub && <div className="text-[10.5px] mt-1 font-semibold" style={{ color: m.good ? "var(--success)" : "var(--muted)" }}>{m.sub}</div>}
          </div>
        ))}
      </div>

      {/* revenue trend + revenue by client */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <SectionTitle right={<Chip tone="green"><TrendingUp size={11} /> +18%</Chip>}>Revenue trend · {period}</SectionTitle>
          <div className="text-2xl font-extrabold num mb-1" style={{ color: "var(--brand-d)" }}>{money(p.rev)}</div>
          <AreaChart data={p.trend} labels={p.labels} />
        </Card>
        <Card>
          <SectionTitle>Revenue by client</SectionTitle>
          <div className="space-y-2.5">
            {schoolStats.map((s) => (
              <div key={s.id}>
                <div className="flex items-center justify-between text-[12px] mb-1"><span className="font-semibold truncate pr-2">{s.name}</span><span className="num font-bold whitespace-nowrap">{money(s.revenue)}</span></div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(s.revenue / maxSchoolRev) * 100}%`, background: "linear-gradient(90deg,var(--brand),var(--cyan))" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* conversion funnel */}
      <Card>
        <SectionTitle right={<AiBadge>drop-off tracked</AiBadge>}>Conversion funnel — where candidates fall off</SectionTitle>
        <div className="space-y-2">
          {STAGES.map((s, i) => {
            const n = reached[i];
            const prev = i === 0 ? n : reached[i - 1];
            const conv = prev ? Math.round((n / prev) * 100) : 0;
            return (
              <div key={s} className="flex items-center gap-3 text-[12.5px]">
                <span className="w-24 muted font-semibold shrink-0">{s}</span>
                <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ background: "var(--line)" }}>
                  <div className="h-full rounded-lg flex items-center px-2 text-white text-[11px] font-extrabold"
                    style={{ width: `${Math.max(6, (n / funnelTop) * 100)}%`, background: "linear-gradient(90deg,var(--brand),var(--brand-d))", transition: "width .6s cubic-bezier(.22,.9,.3,1)" }}>{n}</div>
                </div>
                <span className="w-16 text-right num font-bold shrink-0" style={{ color: i > 0 && conv < 60 ? "var(--warning)" : "var(--muted)" }}>{i === 0 ? "—" : conv + "%"}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-[12px] muted flex items-center gap-1.5"><ArrowRight size={13} /> Biggest drop-off is flagged in amber — that's where to focus coaching or automation.</div>
      </Card>

      {/* recruiter productivity */}
      <Card pad={false}>
        <div className="p-4 flex items-center justify-between"><SectionTitle right={undefined}>Recruiter productivity &amp; accountability</SectionTitle><Chip icon={<Trophy size={11} />} tone="amber">Top: {topRecruiter.name.split(" ")[0]}</Chip></div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead><tr>{["Recruiter", "Calls", "Placed / Target", "To target", "Revenue contributed", "Status"].map((h) => (
              <th key={h} className="px-4 py-2.5 text-left text-[10.5px] uppercase tracking-wide font-bold muted" style={{ background: "var(--panel-2)", borderBottom: "1px solid var(--line)" }}>{h}</th>))}</tr></thead>
            <tbody>
              {rstats.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td className="px-4 py-2.5"><div className="flex items-center gap-2.5"><Avatar name={r.name} hue={r.avatarHue} size={30} /><div><div className="font-bold">{r.name}</div><div className="muted text-[11px]">{r.role}</div></div></div></td>
                  <td className="px-4 py-2.5 num">{r.calls}</td>
                  <td className="px-4 py-2.5"><div className="flex items-center gap-2"><Bar pct={r.pct} color={r.pct >= 80 ? "var(--success)" : r.pct >= 60 ? "var(--warning)" : "var(--error)"} /><span className="num font-bold whitespace-nowrap">{r.placed}/{r.target}</span></div></td>
                  <td className="px-4 py-2.5 num font-bold" style={{ color: r.pct >= 80 ? "var(--success)" : r.pct >= 60 ? "var(--warning)" : "var(--error)" }}>{r.pct}%</td>
                  <td className="px-4 py-2.5 num font-semibold">{money(r.rev)}</td>
                  <td className="px-4 py-2.5">{r.pct >= 80 ? <Chip tone="green">On track</Chip> : r.pct >= 60 ? <Chip tone="amber">Watch</Chip> : <Chip tone="amber"><TriangleAlert size={11} /> Behind</Chip>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* sourcing ROI + client health */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <SectionTitle right={<AiBadge>ROI</AiBadge>}>Best sourcing channels</SectionTitle>
          <div className="space-y-3">
            {sourceStats.map((s) => (
              <div key={s.src}>
                <div className="flex items-center justify-between text-[12.5px] mb-1">
                  <span className="font-semibold">{s.src}</span>
                  <span className="muted">{s.total} candidates · <b style={{ color: "var(--success)" }}>{s.wins} wins</b> · {s.conv}%</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(s.total / maxSrc) * 100}%`, background: "linear-gradient(90deg,var(--brand),var(--cyan))" }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-[12px] muted"><b style={{ color: "var(--brand-d)" }}>{topSource.src}</b> converts best — worth doubling down on.</div>
        </Card>

        <Card pad={false}>
          <div className="p-4"><SectionTitle right={atRiskCount > 0 ? <Chip tone="amber"><TriangleAlert size={11} /> {atRiskCount} at risk</Chip> : undefined}>Client account health</SectionTitle></div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead><tr>{["School", "Open reqs", "Retention", "Invoices", "Revenue"].map((h) => (
                <th key={h} className="px-4 py-2 text-left text-[10.5px] uppercase tracking-wide font-bold muted" style={{ background: "var(--panel-2)", borderBottom: "1px solid var(--line)" }}>{h}</th>))}</tr></thead>
              <tbody>
                {schoolStats.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid var(--line)", background: s.atRisk ? "rgba(247,183,49,.06)" : undefined }}>
                    <td className="px-4 py-2.5 font-semibold">{s.name}{s.atRisk && <TriangleAlert size={12} className="inline ml-1.5 -mt-0.5" style={{ color: "var(--warning)" }} />}</td>
                    <td className="px-4 py-2.5 num">{s.openReqs}</td>
                    <td className="px-4 py-2.5 num" style={{ color: s.retention >= 88 ? "var(--success)" : "var(--warning)" }}>{s.retention}%</td>
                    <td className="px-4 py-2.5 num">{s.openInvoices}</td>
                    <td className="px-4 py-2.5 num font-semibold">{money(s.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

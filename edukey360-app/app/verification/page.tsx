"use client";
import { useState } from "react";
import { Card, SectionTitle, Avatar, Chip, AiBadge, Kpi } from "@/components/ui";
import { CANDIDATES } from "@/lib/mock";
import { ShieldCheck, Fingerprint, GraduationCap, Briefcase, Users, ScanSearch, CheckCircle2, Circle, BadgeCheck } from "lucide-react";

const CHECKS = [
  { key: "id", label: "Identity", icon: Fingerprint },
  { key: "edu", label: "Education", icon: GraduationCap },
  { key: "exp", label: "Experience", icon: Briefcase },
  { key: "ref", label: "References", icon: Users },
  { key: "bg", label: "Background", icon: ScanSearch },
];
const TIER = ["Self-declared", "Document-verified", "Blockchain-verified"];

export default function VerificationPage() {
  // progress = number of checks completed (0..5); trust derived
  const [prog, setProg] = useState<Record<string, number>>(() =>
    Object.fromEntries(CANDIDATES.map((c) => [c.id, c.trust === 2 ? 5 : c.trust === 1 ? 3 : 1])));
  const [running, setRunning] = useState<string | null>(null);

  const run = (id: string) => {
    if (running) return;
    setRunning(id);
    let n = prog[id];
    const tick = () => {
      n = Math.min(5, n + 1);
      setProg((p) => ({ ...p, [id]: n }));
      if (n < 5) setTimeout(tick, 450); else setRunning(null);
    };
    tick();
  };
  const tierOf = (n: number) => (n >= 5 ? 2 : n >= 3 ? 1 : 0);
  const verifiedPct = Math.round((CANDIDATES.filter((c) => tierOf(prog[c.id]) >= 1).length / CANDIDATES.length) * 100);
  const chainCount = CANDIDATES.filter((c) => tierOf(prog[c.id]) === 2).length;

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl grid place-items-center text-white shrink-0" style={{ background: "linear-gradient(135deg,var(--brand),var(--cyan))" }}><ShieldCheck size={22} /></div>
        <div><h1 className="text-2xl font-extrabold tracking-tight">Verification</h1><p className="muted text-sm mt-1">The Trust Layer — identity, education, experience, references &amp; background. Verify once, reuse everywhere.</p></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger">
        <Kpi icon={<ShieldCheck size={18} />} value={verifiedPct + "%"} label="Pool verified" />
        <Kpi icon={<BadgeCheck size={18} />} value={chainCount} label="Blockchain-verified" />
        <Kpi icon={<CheckCircle2 size={18} />} value={CANDIDATES.filter((c) => tierOf(prog[c.id]) === 1).length} label="Document-verified" />
        <Kpi icon={<Circle size={18} />} value={CANDIDATES.filter((c) => tierOf(prog[c.id]) === 0).length} label="Awaiting verification" />
      </div>

      <Card className="ai-glow">
        <div className="flex items-center gap-2 text-[13px] font-semibold"><ShieldCheck size={16} style={{ color: "var(--brand)" }} /> Verify a candidate and the badge is reused across Match, Screening &amp; the School Portal — no repeat checks.</div>
      </Card>

      <Card pad={false}>
        <div className="p-4"><SectionTitle right={<AiBadge>DigiLocker / AICTE</AiBadge>}>Candidates</SectionTitle></div>
        <div className="divide-y" style={{ borderColor: "var(--line)" }}>
          {CANDIDATES.map((c) => {
            const n = prog[c.id]; const tier = tierOf(n); const isRun = running === c.id;
            return (
              <div key={c.id} className="flex items-center gap-3 px-4 py-3" style={{ borderTop: "1px solid var(--line)" }}>
                <Avatar name={c.name} hue={c.match * 2} size={34} />
                <div className="min-w-0 w-40 shrink-0">
                  <div className="font-bold text-[13.5px]">{c.name}</div>
                  <div className="muted text-[11px]">{c.subject}</div>
                </div>
                <div className="flex gap-1.5 flex-1 flex-wrap">
                  {CHECKS.map((ch, i) => {
                    const done = i < n; const Icon = ch.icon;
                    return (
                      <span key={ch.key} className="inline-flex items-center gap-1 text-[11px] font-semibold rounded-lg px-2 py-1"
                        style={{ background: done ? "rgba(22,196,127,.12)" : "var(--panel-2)", color: done ? "var(--success)" : "var(--muted)", border: "1px solid var(--line)" }}>
                        <Icon size={12} />{ch.label}{done && <CheckCircle2 size={11} />}
                      </span>
                    );
                  })}
                </div>
                <Chip tone={tier === 2 ? "blue" : tier === 1 ? "green" : "brand"} icon={tier === 2 ? <BadgeCheck size={11} /> : undefined}>{TIER[tier]}</Chip>
                {n < 5 && (
                  <button className="btn btn-primary !py-1.5 !px-3 !text-[12px]" onClick={() => run(c.id)} disabled={!!running}>
                    {isRun ? <><span className="dot-live" /> Verifying…</> : <><ShieldCheck size={13} /> Verify</>}
                  </button>
                )}
                {n >= 5 && <Chip tone="green"><CheckCircle2 size={11} /> Complete</Chip>}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

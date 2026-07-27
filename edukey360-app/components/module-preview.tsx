import { ReactNode } from "react";
import { Card, AiBadge } from "@/components/ui";
import { Sparkles, CheckCircle2 } from "lucide-react";

export function ModulePreview({ title, subtitle, icon, replaces, capabilities, stats }: {
  title: string; subtitle: string; icon: ReactNode;
  replaces: string; capabilities: string[]; stats?: { label: string; value: string }[];
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl grid place-items-center text-white shrink-0" style={{ background: "linear-gradient(135deg,var(--brand),var(--brand-d))" }}>{icon}</div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
          <p className="muted text-sm mt-1">{subtitle}</p>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger">
          {stats.map((s) => (
            <div key={s.label} className="kpi"><div className="text-[22px] font-extrabold" style={{ color: "var(--brand-d)" }}>{s.value}</div><div className="text-xs muted mt-2 font-semibold">{s.label}</div></div>
          ))}
        </div>
      )}

      <Card className="ai-glow">
        <div className="flex items-center gap-2 text-[13px] font-bold"><Sparkles size={16} style={{ color: "var(--brand)" }} /> What this module automates</div>
        <div className="grid sm:grid-cols-2 gap-2 mt-3">
          {capabilities.map((c) => (
            <div key={c} className="flex items-start gap-2 text-[13px]"><CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: "var(--brand)" }} />{c}</div>
          ))}
        </div>
        <div className="mt-4 pt-3 text-[12.5px] muted" style={{ borderTop: "1px solid var(--line)" }}>
          Replaces today's manual work: <b style={{ color: "var(--ink)" }}>{replaces}</b>
        </div>
      </Card>

      <div className="flex items-center gap-2">
        <AiBadge>Phase 2</AiBadge>
        <span className="muted text-[12.5px]">Fully interactive build lands next — foundation, data model &amp; navigation are already live.</span>
      </div>
    </div>
  );
}

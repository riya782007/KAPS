import { Card, AiBadge } from "@/components/ui";
import { Workflow, ArrowDown } from "lucide-react";

const FLOW = [
  "New Requirement", "AI finds candidates", "AI screens & calls", "Recruiter reviews",
  "Interview scheduled", "Reminders sent", "Offer & verification", "Joining tracked", "Invoice auto-raised",
];

export default function Page() {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl grid place-items-center text-white shrink-0" style={{ background: "linear-gradient(135deg,var(--brand),var(--brand-d))" }}><Workflow size={22} /></div>
        <div><h1 className="text-2xl font-extrabold tracking-tight">Automation</h1><p className="muted text-sm mt-1">A visual workflow engine that runs your SOP end-to-end — requirement to invoice — with humans only where they add value.</p></div>
      </div>
      <Card className="ai-glow">
        <div className="flex items-center justify-between mb-4"><div className="h-sec">Default workflow · "Fill a vacancy"</div><AiBadge>running</AiBadge></div>
        <div className="flex flex-col items-center gap-1">
          {FLOW.map((step, i) => (
            <div key={step} className="w-full max-w-md">
              <div className="card !rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: i % 2 ? "var(--panel)" : "var(--panel-2)" }}>
                <span className="w-6 h-6 rounded-full grid place-items-center text-[11px] font-bold text-white shrink-0" style={{ background: "var(--brand)" }}>{i + 1}</span>
                <span className="text-[13px] font-semibold">{step}</span>
                {(i === 1 || i === 2 || i === 5 || i === 8) && <span className="chip ml-auto">✨ AI</span>}
                {(i === 3 || i === 4) && <span className="chip ml-auto" style={{ background: "rgba(61,123,214,.14)", color: "#3560a8" }}>👤 Human</span>}
              </div>
              {i < FLOW.length - 1 && <div className="flex justify-center py-1"><ArrowDown size={16} className="muted" /></div>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

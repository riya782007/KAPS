import { Card, AiBadge } from "@/components/ui";
import { Bot, FileSearch, Users, CalendarCheck, MessageCircle, Mail, ShieldCheck, LineChart, School, Trophy } from "lucide-react";

const AGENTS = [
  { name: "Recruitment Agent", icon: Bot, desc: "Orchestrates the full requirement → joining flow." },
  { name: "Resume Analyzer", icon: FileSearch, desc: "Extracts structured data from any CV in seconds." },
  { name: "Candidate Matcher", icon: Users, desc: "Ranks candidates by fit, communication & retention." },
  { name: "Interview Coordinator", icon: CalendarCheck, desc: "Schedules, invites and reminds — zero manual effort." },
  { name: "WhatsApp Agent", icon: MessageCircle, desc: "Runs outreach & reminders on India's #1 channel." },
  { name: "Email Agent", icon: Mail, desc: "Drafts and sends offers, letters and follow-ups." },
  { name: "Verification Agent", icon: ShieldCheck, desc: "Checks identity, credentials, references, background." },
  { name: "Report Generator", icon: LineChart, desc: "Builds EOD & leadership reports automatically." },
  { name: "Recruiter Coach", icon: Trophy, desc: "Coaches the team; flags who's behind target." },
  { name: "School Relationship Mgr", icon: School, desc: "Tracks retention, renewals and upsell moments." },
];

export default function Page() {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl grid place-items-center text-white shrink-0" style={{ background: "linear-gradient(135deg,var(--brand),var(--brand-d))" }}><Bot size={22} /></div>
        <div><h1 className="text-2xl font-extrabold tracking-tight">AI Recruiter</h1><p className="muted text-sm mt-1">Ten specialised agents that execute your SOPs automatically. Each has its own workspace.</p></div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger">
        {AGENTS.map((a) => {
          const Icon = a.icon;
          return (
            <Card key={a.name} className="cursor-pointer hover:-translate-y-1 transition">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl grid place-items-center" style={{ background: "var(--brand-l)", color: "var(--brand-d)" }}><Icon size={18} /></div>
                <div className="font-bold text-[14px]">{a.name}</div>
              </div>
              <p className="muted text-[12.5px] mt-2.5">{a.desc}</p>
              <div className="mt-3 flex items-center justify-between"><AiBadge>active</AiBadge><span className="dot-live" /></div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

import Link from "next/link";
import { Card, AiBadge } from "@/components/ui";
import { HowItWorks } from "@/components/how-it-works";
import { Bot, FileSearch, Users, CalendarCheck, MessageCircle, Mail, ShieldCheck, LineChart, School, Trophy, ArrowUpRight, ClipboardList, PhoneCall, UserCheck, Receipt } from "lucide-react";

const AGENTS = [
  { name: "Recruitment Agent", icon: Bot, desc: "Orchestrates the full requirement → joining flow.", href: "/automation" },
  { name: "Resume Analyzer", icon: FileSearch, desc: "Extracts structured data from any CV in seconds.", href: "/documents" },
  { name: "Candidate Matcher", icon: Users, desc: "Ranks candidates by fit, communication & retention.", href: "/candidates" },
  { name: "Interview Coordinator", icon: CalendarCheck, desc: "Schedules, invites and reminds — zero manual effort.", href: "/automation" },
  { name: "WhatsApp Agent", icon: MessageCircle, desc: "Runs outreach & reminders on India's #1 channel.", href: "/candidates" },
  { name: "Email Agent", icon: Mail, desc: "Drafts and sends offers, letters and follow-ups.", href: "/automation" },
  { name: "Verification Agent", icon: ShieldCheck, desc: "Checks identity, credentials, references, background.", href: "/verification" },
  { name: "Report Generator", icon: LineChart, desc: "Builds EOD & leadership reports automatically.", href: "/reports" },
  { name: "Recruiter Coach", icon: Trophy, desc: "Coaches the team; flags who's behind target.", href: "/recruiters" },
  { name: "School Relationship Mgr", icon: School, desc: "Tracks retention, renewals and upsell moments.", href: "/schools" },
];

export default function Page() {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl grid place-items-center text-white shrink-0" style={{ background: "linear-gradient(135deg,var(--brand),var(--cyan))" }}><Bot size={22} /></div>
        <div><h1 className="text-2xl font-extrabold tracking-tight">AI Recruiter</h1><p className="muted text-sm mt-1">Ten specialised agents that execute your SOPs automatically. Open any agent's workspace.</p></div>
      </div>

      <HowItWorks
        title="How the AI Recruitment engine works — start to finish"
        subtitle="From a new requirement to joining & invoice. Watch each step run, with its proof logged."
        accuracy="94%"
        steps={[
          { icon: <ClipboardList size={15} />, label: "Requirement understood", detail: "AI reads the JD and builds a hiring plan, timeline & fill probability.", proof: "Requirement parsed · 14-day hiring plan generated" },
          { icon: <Users size={15} />, label: "Candidates sourced & ranked", detail: "Ranks the verified pool by fit + predicted retention — each with a reason.", proof: "9 candidates ranked · top 3 above 90% match" },
          { icon: <PhoneCall size={15} />, label: "AI screens & calls", detail: "Voice/WhatsApp screen collects the 7 data points and auto-tags.", proof: "8 screening calls completed · records updated" },
          { icon: <UserCheck size={15} />, label: "Recruiter reviews", detail: "A human approves the shortlist — AI recommends, people decide.", proof: "Shortlist approved by Aarti Mehta" },
          { icon: <ShieldCheck size={15} />, label: "Verified & interviewed", detail: "Identity & credentials verified; interview auto-scheduled.", proof: "Identity + degree verified · interview booked Fri 11:30" },
          { icon: <Receipt size={15} />, label: "Joined & invoiced", detail: "Joining tracked; invoice auto-raised on deployment.", proof: "Invoice ₹47,200 auto-raised on joining" },
        ]}
        trust={[
          "Every AI decision is a recommendation with a visible reason — never a black box.",
          "Humans approve the key steps (shortlist, offer) — full human-in-the-loop.",
          "Every action is logged with a timestamp and is fully reversible.",
          "Candidate data is consent-first and DPDP-aligned.",
          "You can override or edit anything the AI does, anytime.",
          "Verification is tamper-proof and reusable across the system.",
        ]}
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger">
        {AGENTS.map((a) => {
          const Icon = a.icon;
          return (
            <Link key={a.name} href={a.href} className="card p-4 sm:p-5 hover-glow hover:-translate-y-1 transition block group">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl grid place-items-center" style={{ background: "var(--brand-l)", color: "var(--brand-d)" }}><Icon size={18} /></div>
                <div className="font-bold text-[14px]">{a.name}</div>
                <ArrowUpRight size={16} className="ml-auto muted group-hover:text-[var(--brand)] transition" />
              </div>
              <p className="muted text-[12.5px] mt-2.5">{a.desc}</p>
              <div className="mt-3 flex items-center justify-between"><AiBadge>active</AiBadge><span className="dot-live" /></div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

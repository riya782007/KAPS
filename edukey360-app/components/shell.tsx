"use client";
import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, ClipboardList, Users, School, UserCog, KanbanSquare,
  Bot, PhoneCall, ShieldCheck, FileText, BarChart3, Workflow, Settings,
  Search, Moon, Sun, Sparkles, Menu, X, Send, GraduationCap, FileSpreadsheet, KeyRound
} from "lucide-react";
import { useTheme } from "./theme";

const NAV = [
  { group: "Operate", items: [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/requirements", label: "Requirements", icon: ClipboardList },
    { href: "/candidates", label: "Candidates", icon: Users },
    { href: "/schools", label: "Schools", icon: School },
    { href: "/recruiters", label: "Recruiters", icon: UserCog },
    { href: "/pipeline", label: "Interview Pipeline", icon: KanbanSquare },
    { href: "/import", label: "Import Data", icon: FileSpreadsheet },
  ]},
  { group: "AI Engine", items: [
    { href: "/ai-recruiter", label: "AI Recruiter", icon: Bot },
    { href: "/ai-calling", label: "AI Calling", icon: PhoneCall },
    { href: "/verification", label: "Verification", icon: ShieldCheck },
    { href: "/documents", label: "Documents", icon: FileText },
  ]},
  { group: "Grow", items: [
    { href: "/reports", label: "Reports", icon: BarChart3 },
    { href: "/automation", label: "Automation", icon: Workflow },
  ]},
  { group: "Admin", items: [
    { href: "/team", label: "Team & Roles", icon: KeyRound },
    { href: "/settings", label: "Settings", icon: Settings },
  ]},
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const path = usePathname();
  return (
    <aside
      className="fixed lg:sticky top-0 z-40 h-screen w-[236px] shrink-0 flex flex-col transition-transform"
      style={{ background: "linear-gradient(180deg,var(--sidebar),var(--sidebar-2))", transform: open ? "none" : undefined }}
      data-open={open}
    >
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className="w-9 h-9 rounded-xl grid place-items-center text-white" style={{ background: "linear-gradient(135deg,var(--brand),var(--brand-d))" }}><GraduationCap size={19} /></div>
        <div>
          <div className="text-white font-extrabold text-[15px] leading-tight">Edukey360 OS</div>
          <div className="text-[10px] tracking-wide" style={{ color: "#8fa2ff" }}>AI Recruitment OS</div>
        </div>
        <button className="ml-auto lg:hidden text-white/70" onClick={onClose}><X size={18} /></button>
      </div>
      <nav className="px-3 py-2 flex-1 overflow-y-auto">
        {NAV.map((g) => (
          <div key={g.group}>
            <div className="text-[10px] uppercase tracking-wider font-bold px-2.5 pt-3 pb-1.5" style={{ color: "rgba(255,255,255,.4)" }}>{g.group}</div>
            {g.items.map((it) => {
              const active = path === it.href;
              const Icon = it.icon;
              return (
                <Link key={it.href} href={it.href} onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-[10px] text-[13.5px] font-semibold transition"
                  style={active
                    ? { background: "var(--brand)", color: "#fff" }
                    : { color: "#cfe3dd" }}>
                  <Icon size={17} />{it.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="px-4 py-3 text-[10.5px]" style={{ color: "rgba(255,255,255,.55)", borderTop: "1px solid rgba(255,255,255,.08)" }}>
        One operating system.<br />Built by <b style={{ color: "#8fa2ff" }}>NEWVORA</b>.
      </div>
    </aside>
  );
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  const { theme, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-30 glass flex items-center gap-3 px-4 sm:px-6 py-3" style={{ borderBottom: "1px solid var(--line)" }}>
      <button className="lg:hidden btn btn-line !p-2" onClick={onMenu}><Menu size={18} /></button>
      <div className="relative hidden sm:block">
        <Search size={15} className="absolute left-3 top-2.5 opacity-50" />
        <input className="input !pl-9 !w-[260px]" placeholder="Search candidates, schools, requirements…" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span className="chip hidden sm:inline-flex"><span className="dot-live" /> 3 recruiters online</span>
        <button className="btn btn-line !p-2" onClick={toggle} aria-label="Toggle theme">
          {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
        </button>
        <div className="flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded-full grid place-items-center text-white text-xs font-bold" style={{ background: "hsl(210 55% 45%)" }}>AM</div>
          <div className="hidden md:block leading-tight">
            <div className="text-[12.5px] font-bold">Aarti Mehta</div>
            <div className="text-[10.5px] muted">Senior Recruiter</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function AiAssistant() {
  const [open, setOpen] = useState(false);
  const prompts = [
    "Show teachers for Maths",
    "Who is joining this week?",
    "Which recruiter is behind target?",
    "Create a JD for TGT Chemistry",
    "Summarize Ananya Sharma",
  ];
  const [msgs, setMsgs] = useState<{ role: "ai" | "me"; text: string }[]>([
    { role: "ai", text: "Hi Aarti — I'm your Recruitment Copilot. Ask me anything, or tap a suggestion below." },
  ]);
  const answer = (q: string): string => {
    const s = q.toLowerCase();
    if (s.includes("math")) return "3 strong Maths teachers: Sunita Rao (91%), Sneha Kulkarni (89%), Imran Khan (79%). Sunita can join immediately.";
    if (s.includes("join")) return "Joining this week: Sneha Kulkarni (TGT Maths, Heritage). Kavya Iyer joined Little Scholars yesterday.";
    if (s.includes("behind")) return "Rohan Das is behind target (4/8). Suggest reallocating 2 PRT requisitions from Sana (9/10).";
    if (s.includes("jd") || s.includes("chemistry")) return "Drafted a JD for TGT Chemistry (CBSE, 2+ yrs, ₹32–42k). Want me to publish it and start AI sourcing?";
    if (s.includes("summar") || s.includes("ananya")) return "Ananya Sharma — M.Sc Physics + B.Ed, 5 yrs CBSE. 96% match for PGT Physics. Strengths: board prep, labs. Low flight-risk. Interview-ready.";
    return "On it — I've queued that across the pipeline and updated the trackers automatically. No manual entry needed.";
  };
  const send = (q: string) => {
    setMsgs((m) => [...m, { role: "me", text: q }, { role: "ai", text: answer(q) }]);
  };
  return (
    <>
      <button onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 btn btn-primary !rounded-full !px-4 !py-3 shadow-lg2 animate-pulse2">
        <Sparkles size={18} /> AI Assistant
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[92vw] card enter overflow-hidden" style={{ boxShadow: "var(--shadow-lg)" }}>
          <div className="px-4 py-3 text-white flex items-center gap-2" style={{ background: "linear-gradient(120deg,#3B4EFF,#18C8FF)" }}>
            <Sparkles size={16} /><b className="text-sm">Recruitment Copilot</b>
            <button className="ml-auto opacity-80" onClick={() => setOpen(false)}><X size={16} /></button>
          </div>
          <div className="p-3 max-h-[46vh] overflow-y-auto space-y-2">
            {msgs.map((m, i) => (
              <div key={i} className={`text-[13px] rounded-xl px-3 py-2 ${m.role === "ai" ? "" : "ml-8"}`}
                style={{ background: m.role === "ai" ? "var(--brand-l)" : "var(--panel-2)", border: "1px solid var(--line)" }}>{m.text}</div>
            ))}
          </div>
          <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
            {prompts.map((p) => (
              <button key={p} className="chip cursor-pointer" onClick={() => send(p)}>{p}</button>
            ))}
          </div>
          <div className="p-3 flex gap-2" style={{ borderTop: "1px solid var(--line)" }}>
            <input id="ek-ai-input" className="input" placeholder="Ask your Copilot…"
              onKeyDown={(e) => { if (e.key === "Enter") { const v = (e.target as HTMLInputElement).value.trim(); if (v) { send(v); (e.target as HTMLInputElement).value = ""; } } }} />
            <button className="btn btn-primary !px-3" onClick={() => { const el = document.getElementById("ek-ai-input") as HTMLInputElement; if (el?.value.trim()) { send(el.value.trim()); el.value = ""; } }}><Send size={16} /></button>
          </div>
        </div>
      )}
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen lg:grid" style={{ gridTemplateColumns: "236px 1fr" }}>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}
      <div className={open ? "" : "hidden lg:block"}><Sidebar open={open} onClose={() => setOpen(false)} /></div>
      <div className="min-w-0 flex flex-col">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="p-4 sm:p-6 max-w-[1240px] w-full mx-auto">{children}</main>
      </div>
      <AiAssistant />
    </div>
  );
}

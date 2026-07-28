"use client";
import { useState } from "react";
import { Card, SectionTitle, Avatar, Chip, AiBadge } from "@/components/ui";
import { EMPLOYEES, ROLES, type Employee } from "@/lib/mock";
import { UserPlus, KeyRound, Eye, EyeOff, ShieldCheck, Shuffle, CheckCircle2, Circle } from "lucide-react";

const gen = (name: string) => {
  const ini = name.trim().split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "EK";
  return `${ini}-${Math.floor(1000 + Math.random() * 9000)}`;
};

export default function TeamPage() {
  const [team, setTeam] = useState<Employee[]>(EMPLOYEES);
  const [show, setShow] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", role: "Recruiter", email: "", target: 10, responsibilities: "", passcode: "" });

  const add = () => {
    if (!f.name) return;
    const emp: Employee = {
      id: "e" + (team.length + 1) + "_" + Math.random().toString(36).slice(2, 5),
      name: f.name, role: f.role, email: f.email || undefined, target: Number(f.target) || 0, active: true,
      passcode: f.passcode || gen(f.name),
      responsibilities: f.responsibilities.split(",").map((s) => s.trim()).filter(Boolean),
    };
    setTeam((t) => [emp, ...t]);
    fetch("/api/employees", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(emp) }).catch(() => {});
    setOpen(false); setF({ name: "", role: "Recruiter", email: "", target: 10, responsibilities: "", passcode: "" });
  };
  const toggle = (id: string) => setTeam((t) => t.map((e) => (e.id === id ? { ...e, active: !e.active } : e)));

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Team &amp; Roles</h1>
          <p className="muted text-sm mt-1">Admin control — create members, assign roles &amp; passcodes, define responsibilities, and hold every task accountable to a person.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setOpen((o) => !o)}><UserPlus size={16} /> Add member</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger">
        {[
          { l: "Team members", v: team.length },
          { l: "Active now", v: team.filter((e) => e.active).length },
          { l: "Roles in use", v: new Set(team.map((e) => e.role)).size },
          { l: "Combined target", v: team.reduce((a, e) => a + e.target, 0) },
        ].map((s) => (
          <div key={s.l} className="kpi"><div className="text-[22px] font-extrabold" style={{ color: "var(--brand-d)" }}>{s.v}</div><div className="text-xs muted mt-2 font-semibold">{s.l}</div></div>
        ))}
      </div>

      {open && (
        <Card className="enter">
          <SectionTitle right={<Chip icon={<KeyRound size={12} />}>passcode auto-generated</Chip>}>Add a team member</SectionTitle>
          <div className="grid sm:grid-cols-3 gap-3">
            <div><label className="label">Full name</label><input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="e.g. Kunal Verma" /></div>
            <div><label className="label">Role</label><select className="input" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select></div>
            <div><label className="label">Email</label><input className="input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="name@edukey360.com" /></div>
            <div><label className="label">Monthly target</label><input className="input" type="number" value={f.target} onChange={(e) => setF({ ...f, target: +e.target.value })} /></div>
            <div className="sm:col-span-2"><label className="label">Responsibilities (comma separated)</label><input className="input" value={f.responsibilities} onChange={(e) => setF({ ...f, responsibilities: e.target.value })} placeholder="Sourcing, Screening, Follow-ups" /></div>
            <div><label className="label">Passcode</label><div className="flex gap-2"><input className="input" value={f.passcode} onChange={(e) => setF({ ...f, passcode: e.target.value })} placeholder="auto" /><button className="btn btn-line" onClick={() => setF({ ...f, passcode: gen(f.name || "EK") })}><Shuffle size={15} /></button></div></div>
          </div>
          <button className="btn btn-primary mt-4" onClick={add}><CheckCircle2 size={16} /> Create member</button>
        </Card>
      )}

      <Card pad={false}>
        <div className="p-4"><SectionTitle right={<AiBadge>accountability</AiBadge>}>Members</SectionTitle></div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead><tr>{["Member", "Role", "Responsibilities", "Target", "Passcode", "Status"].map((h) => (
              <th key={h} className="px-4 py-2.5 text-left text-[11px] uppercase tracking-wide font-bold muted" style={{ background: "var(--panel-2)", borderBottom: "1px solid var(--line)" }}>{h}</th>))}</tr></thead>
            <tbody>
              {team.map((e) => (
                <tr key={e.id} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td className="px-4 py-2.5"><div className="flex items-center gap-2.5"><Avatar name={e.name} hue={e.name.length * 20} size={30} /><div><div className="font-bold">{e.name}</div><div className="muted text-[11px]">{e.email || "—"}</div></div></div></td>
                  <td className="px-4 py-2.5"><Chip icon={e.role === "Admin" || e.role === "Business Head" ? <ShieldCheck size={11} /> : undefined} tone={e.role === "Business Head" ? "amber" : "brand"}>{e.role}</Chip></td>
                  <td className="px-4 py-2.5"><div className="flex flex-wrap gap-1">{e.responsibilities.map((r) => <span key={r} className="chip !text-[10px] !py-0.5">{r}</span>)}</div></td>
                  <td className="px-4 py-2.5 font-semibold">{e.target || "—"}</td>
                  <td className="px-4 py-2.5"><button className="inline-flex items-center gap-1.5 font-mono text-[12px]" onClick={() => setShow((s) => ({ ...s, [e.id]: !s[e.id] }))}><KeyRound size={12} />{show[e.id] ? e.passcode : "••••••"}{show[e.id] ? <EyeOff size={12} className="muted" /> : <Eye size={12} className="muted" />}</button></td>
                  <td className="px-4 py-2.5"><button className="inline-flex items-center gap-1.5 text-[12px] font-semibold" onClick={() => toggle(e.id)} style={{ color: e.active ? "var(--brand-d)" : "var(--muted)" }}>{e.active ? <CheckCircle2 size={13} /> : <Circle size={13} />}{e.active ? "Active" : "Inactive"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

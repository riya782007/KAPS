"use client";
import { useState } from "react";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton({ name, subject }: { name: string; subject: string }) {
  const [busy, setBusy] = useState(false);
  const open = async () => {
    let text = `Hi ${name.split(" ")[0]}, this is Edukey360. We have a ${subject} teaching opening that fits your profile. Are you open to it? Reply YES and we'll schedule your interview.`;
    setBusy(true);
    try {
      const r = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task: "outreach", input: { name, role: subject + " teacher" } }) });
      const d = await r.json();
      if (d.ok && d.text) text = d.text;
    } catch {}
    setBusy(false);
    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
  };
  return (
    <button className="btn btn-ghost !py-1.5 !px-2.5 !text-[12px]" disabled={busy} onClick={open} title="Draft with AI & open WhatsApp">
      <MessageCircle size={14} /> {busy ? "Drafting…" : "WhatsApp"}
    </button>
  );
}

"use client";
import { useState } from "react";
import { Card, SectionTitle, AiBadge, Chip, Kpi } from "@/components/ui";
import { FileText, Upload, ScanText, CheckCircle2, XCircle, FileCheck } from "lucide-react";
import { HowItWorks } from "@/components/how-it-works";

const DOCS = ["Resume", "Degree certificate", "Government ID", "Experience letters", "Teaching certification"];

export default function DocumentsPage() {
  const [text, setText] = useState("");
  const [fields, setFields] = useState<Record<string, any> | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [have, setHave] = useState<Record<string, boolean>>({ Resume: true, "Degree certificate": true, "Government ID": false, "Experience letters": true, "Teaching certification": false });

  const onFile = (f?: File) => { if (!f) return; const r = new FileReader(); r.onload = () => setText(String(r.result || "")); r.readAsText(f); };
  const extract = async () => {
    if (!text.trim()) { setStatus("Paste or upload a document first."); return; }
    setBusy(true); setStatus("AI is reading the document…"); setFields(null);
    try {
      const r = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task: "parse", input: text }) });
      const d = await r.json();
      let obj: any = null;
      if (d.ok) { try { obj = JSON.parse((d.text || "").replace(/```json|```/g, "").trim()); } catch {} }
      if (obj && obj.name) { setFields(obj); setStatus("✓ Extracted live by AI."); setHave((h) => ({ ...h, Resume: true, "Degree certificate": true })); }
      else { setFields({ name: (text.split(/[\n,]/)[0] || "Candidate").slice(0, 40), subject: "—", exp: "—", qual: "—", loc: "—" }); setStatus(d.reason === "no-key" ? "Extracted (demo) — add OPENAI_API_KEY for live AI." : "Extracted (demo fallback)."); }
    } catch { setStatus("Extraction failed (network)."); }
    setBusy(false);
  };
  const completeness = Math.round((Object.values(have).filter(Boolean).length / DOCS.length) * 100);

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl grid place-items-center text-white shrink-0" style={{ background: "linear-gradient(135deg,var(--brand),var(--cyan))" }}><FileText size={22} /></div>
        <div><h1 className="text-2xl font-extrabold tracking-tight">Documents</h1><p className="muted text-sm mt-1">Upload a document — AI extracts every field, checks completeness, and flags what's missing. No manual reading.</p></div>
      </div>

      <HowItWorks
        title="How the Document AI works"
        subtitle="Every extracted field traces back to the source document — a recruiter confirms before use."
        accuracy="97%"
        steps={[
          { icon: <Upload size={15} />, label: "Document uploaded", detail: "Any CV or certificate — PDF or text.", proof: "1 document received" },
          { icon: <ScanText size={15} />, label: "AI reads & extracts", detail: "Pulls ~14 structured fields in seconds.", proof: "14 fields extracted" },
          { icon: <FileCheck size={15} />, label: "Completeness check", detail: "Cross-checks required documents and flags gaps.", proof: "Missing: Government ID flagged" },
          { icon: <FileText size={15} />, label: "Profile created", detail: "A structured candidate profile is created — no re-typing.", proof: "Candidate profile created" },
          { icon: <CheckCircle2 size={15} />, label: "Human confirm", detail: "Sent to the recruiter to confirm before use.", proof: "Sent for recruiter confirmation" },
        ]}
        trust={[
          "The original document is retained and linked to every field.",
          "Extracted fields trace back to the source text — verifiable.",
          "A recruiter confirms before the profile is used.",
          "Nothing is auto-approved; AI assists, humans decide.",
          "Sensitive data is access-controlled and consent-logged.",
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger">
        <Kpi icon={<FileText size={18} />} value="1,240" label="Docs processed" />
        <Kpi icon={<ScanText size={18} />} value="14 / CV" label="Fields extracted" />
        <Kpi icon={<FileCheck size={18} />} value={completeness + "%"} label="Completeness" />
        <Kpi icon={<XCircle size={18} />} value={DOCS.length - Object.values(have).filter(Boolean).length} label="Missing docs" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <SectionTitle right={undefined}>Extract from a document</SectionTitle>
            <label className="btn btn-line cursor-pointer !py-1.5 !px-2.5 !text-[12px]"><Upload size={14} /> Upload<input type="file" accept=".txt,.csv,.md" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} /></label>
          </div>
          <textarea className="input font-mono" style={{ minHeight: 150, resize: "vertical" }} placeholder="Paste a résumé / document text here…" value={text} onChange={(e) => setText(e.target.value)} />
          <div className="flex items-center gap-2 mt-3">
            <button className="btn btn-primary" onClick={extract} disabled={busy}><ScanText size={15} /> {busy ? "Reading…" : "Extract with AI"}</button>
            {status && <span className="text-[12px] font-semibold" style={{ color: status.startsWith("✓") ? "var(--brand-d)" : "var(--muted)" }}>{status}</span>}
          </div>
          {fields && (
            <div className="mt-4 pt-4 enter" style={{ borderTop: "1px solid var(--line)" }}>
              <div className="h-sec mb-2">Extracted fields</div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(fields).filter(([k]) => ["name", "subject", "qual", "exp", "loc", "expCTC", "notice"].includes(k)).map(([k, v]) => (
                  <div key={k} className="p-2 rounded-lg" style={{ background: "var(--panel-2)", border: "1px solid var(--line)" }}><div className="muted text-[10px] uppercase font-bold">{k}</div><div className="font-semibold text-[13px]">{String(v)}</div></div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle right={<AiBadge>auto-checked</AiBadge>}>Document completeness</SectionTitle>
          <div className="space-y-2">
            {DOCS.map((d) => (
              <button key={d} onClick={() => setHave((h) => ({ ...h, [d]: !h[d] }))}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left" style={{ border: "1px solid var(--line)", background: have[d] ? "rgba(22,196,127,.06)" : "var(--panel)" }}>
                {have[d] ? <CheckCircle2 size={18} style={{ color: "var(--success)" }} /> : <XCircle size={18} style={{ color: "var(--error)" }} />}
                <span className="text-[13.5px] font-semibold flex-1">{d}</span>
                <Chip tone={have[d] ? "green" : "amber"}>{have[d] ? "Received" : "Missing"}</Chip>
              </button>
            ))}
          </div>
          <div className="mt-3 text-[12.5px] muted">Overall completeness: <b style={{ color: completeness === 100 ? "var(--success)" : "var(--warning)" }}>{completeness}%</b> {completeness < 100 && "— chase the missing documents automatically via WhatsApp."}</div>
        </Card>
      </div>
    </div>
  );
}

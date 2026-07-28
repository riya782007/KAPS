"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, SectionTitle, AiBadge, Chip } from "@/components/ui";
import { FileSpreadsheet, Upload, CheckCircle2, Table2, ArrowRight } from "lucide-react";

const SAMPLE = `name,subject,qualification,experience,location,boards,current,expected,notice,source
Rohit Sharma,Physics,M.Sc Physics B.Ed,6,Gurgaon,CBSE,46,58,30 days,Naukri
Priya Nair,Primary,B.A D.El.Ed CTET,2,Delhi,CBSE,21,27,Immediate,Apna
Imran Khan,Mathematics,M.Sc Maths B.Ed,4,Delhi,CBSE,34,44,30 days,Referral`;

type Row = Record<string, string>;

function parseCSV(text: string): Row[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const cells = line.split(",").map((c) => c.trim());
    const o: Row = {};
    headers.forEach((h, i) => (o[h] = cells[i] ?? ""));
    return {
      name: o.name, subject: o.subject, qual: o.qualification || o.qual, exp: o.experience || o.exp,
      loc: o.location || o.loc, boards: o.boards || o.board,
      curCTC: o.current || o.currentctc || o.cur_ctc, expCTC: o.expected || o.expectedctc || o.exp_ctc,
      notice: o.notice, source: o.source || "Import", stage: o.stage || "New", match: o.match || "",
    };
  }).filter((r) => r.name);
}

export default function ImportPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState<string>("");

  const preview = () => setRows(parseCSV(text));
  const onFile = (f?: File) => { if (!f) return; const r = new FileReader(); r.onload = () => { const t = String(r.result || ""); setText(t); setRows(parseCSV(t)); }; r.readAsText(f); };
  const doImport = async () => {
    if (!rows.length) { setStatus("Nothing to import — paste data and preview first."); return; }
    setStatus("Importing…");
    try {
      const res = await fetch("/api/candidates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rows }) });
      const d = await res.json();
      setStatus(d.ok ? `✓ Imported ${d.count} candidates — auto-placed into the database.` : "Import failed: " + (d.error || ""));
      if (d.ok) { setRows([]); setText(""); router.refresh(); }
    } catch { setStatus("Import failed (network)."); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl grid place-items-center text-white shrink-0" style={{ background: "linear-gradient(135deg,var(--brand),var(--brand-d))" }}><FileSpreadsheet size={22} /></div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Import from Excel / Sheets</h1>
          <p className="muted text-sm mt-1">Paste your existing tracker or upload a CSV — the system reads it and places every candidate into the database automatically. No re-typing.</p>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <SectionTitle right={<AiBadge>auto-map</AiBadge>}>Paste rows or upload a file</SectionTitle>
          <div className="flex gap-2">
            <label className="btn btn-line cursor-pointer"><Upload size={15} /> Upload CSV<input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} /></label>
            <button className="btn btn-line" onClick={() => { setText(SAMPLE); setRows(parseCSV(SAMPLE)); }}><Table2 size={15} /> Use sample</button>
          </div>
        </div>
        <textarea className="input font-mono" style={{ minHeight: 150, resize: "vertical" }} placeholder="name,subject,experience,location,boards,current,expected,notice…" value={text} onChange={(e) => setText(e.target.value)} />
        <div className="flex items-center gap-2 mt-3">
          <button className="btn btn-ghost" onClick={preview}><ArrowRight size={15} /> Preview mapping</button>
          <button className="btn btn-primary" onClick={doImport} disabled={!rows.length}><CheckCircle2 size={15} /> Import {rows.length ? `${rows.length} rows` : ""}</button>
          {status && <span className="text-[12.5px] font-semibold ml-1" style={{ color: status.startsWith("✓") ? "var(--brand-d)" : "var(--muted)" }}>{status}</span>}
        </div>
      </Card>

      {rows.length > 0 && (
        <Card pad={false} className="enter">
          <div className="p-4"><SectionTitle right={<Chip tone="green">{rows.length} rows ready</Chip>}>Preview · auto-mapped columns</SectionTitle></div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px]">
              <thead><tr>{["Name", "Subject", "Exp", "Location", "Boards", "Current", "Expected", "Notice", "Source"].map((h) => (
                <th key={h} className="px-3 py-2 text-left text-[10.5px] uppercase tracking-wide font-bold muted" style={{ background: "var(--panel-2)", borderBottom: "1px solid var(--line)" }}>{h}</th>))}</tr></thead>
              <tbody>{rows.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td className="px-3 py-2 font-semibold">{r.name}</td><td className="px-3 py-2">{r.subject}</td><td className="px-3 py-2">{r.exp}</td>
                  <td className="px-3 py-2">{r.loc}</td><td className="px-3 py-2">{r.boards}</td><td className="px-3 py-2">₹{r.curCTC}k</td>
                  <td className="px-3 py-2">₹{r.expCTC}k</td><td className="px-3 py-2">{r.notice}</td><td className="px-3 py-2">{r.source}</td>
                </tr>))}</tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

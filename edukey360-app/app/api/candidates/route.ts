import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Bulk import candidates (from Excel/CSV) → auto-place into the database.
export async function POST(req: Request) {
  const { rows } = await req.json();
  if (!Array.isArray(rows) || !rows.length) return NextResponse.json({ ok: false, error: "no rows" }, { status: 400 });
  const mapped = rows.map((r: any, i: number) => ({
    id: r.id || "imp_" + Date.now() + "_" + i,
    name: r.name, subject: r.subject || "Physics", qual: r.qual || "",
    exp: Number(r.exp) || 0, loc: r.loc || "", boards: r.boards ? String(r.boards).split(/[,/]/).map((x: string) => x.trim()) : [],
    cur_ctc: Number(r.curCTC ?? r.cur_ctc) || 0, exp_ctc: Number(r.expCTC ?? r.exp_ctc) || 0,
    notice: r.notice || "", source: r.source || "Import", stage: r.stage || "New",
    match: Number(r.match) || 70, comm_score: Number(r.commScore ?? r.comm_score) || 7, trust: Number(r.trust) || 0,
    req_id: r.reqId || null, recruiter: r.recruiter || null,
  }));
  if (!supabase) return NextResponse.json({ ok: true, demo: true, count: mapped.length });
  const { error } = await supabase.from("candidates").upsert(mapped, { onConflict: "id" });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, count: mapped.length });
}

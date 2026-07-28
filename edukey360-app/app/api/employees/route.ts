import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const b = await req.json();
  const row = {
    id: b.id || "emp_" + Date.now(),
    name: b.name, role: b.role, passcode: b.passcode, email: b.email || null,
    responsibilities: b.responsibilities || [], target: Number(b.target) || 0, active: b.active ?? true,
  };
  if (!supabase) return NextResponse.json({ ok: true, demo: true });
  const { error } = await supabase.from("employees").upsert(row, { onConflict: "id" });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

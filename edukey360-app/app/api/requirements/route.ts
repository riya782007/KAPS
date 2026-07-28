import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const b = await req.json();
  const row = {
    id: b.id, role: b.role, school_id: b.schoolId, board: b.board, subject: b.subject,
    min_exp: b.minExp, salary_min: b.salaryMin, salary_max: b.salaryMax, vacancies: b.vacancies,
    joining: b.joining, priority: b.priority, status: b.status ?? "Open", created_by: b.createdBy ?? "Aarti Mehta",
  };
  if (!supabase) return NextResponse.json({ ok: true, demo: true });
  const { error } = await supabase.from("requirements").insert(row);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

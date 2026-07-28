import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { id, stage } = await req.json();
  if (!id || !stage) return NextResponse.json({ ok: false, error: "id and stage required" }, { status: 400 });
  if (!supabase) return NextResponse.json({ ok: true, demo: true });
  const { error } = await supabase.from("candidates").update({ stage }).eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

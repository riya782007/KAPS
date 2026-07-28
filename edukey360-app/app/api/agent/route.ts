import { NextResponse } from "next/server";
import { llm, whatsapp, email, verifyKyc, calendarEvent, voiceCall } from "@/lib/providers";
import { supabase } from "@/lib/supabase";

// Unified agent endpoint. POST { agent, payload } → runs the agent.
// AI agents go live with just OPENAI_API_KEY; channel agents (WhatsApp,
// Email, Voice, KYC, Calendar) go live when their provider key is set.
export async function POST(req: Request) {
  let body: any = {};
  try { body = await req.json(); } catch { body = {}; }
  const { agent, payload = {} } = body;

  try {
    switch (agent) {
      // ---------- LLM agents (live with OPENAI_API_KEY) ----------
      case "resume": {
        const r = await llm(
          `Extract ONLY minified JSON with keys name, subject, qual, exp (int), loc, cur (int, ₹k/mo), exp_ctc (int), notice, boards (array), skills (array) from:\n"""${String(payload.text || "").slice(0, 4000)}"""`,
          "You are a resume parser for Indian K-12 teacher recruitment. Return only JSON, no prose."
        );
        return NextResponse.json({ ok: r.ok, live: r.live, result: r.text, reason: r.reason });
      }
      case "match": {
        const r = await llm(`Requirement: ${JSON.stringify(payload.req)}. Candidates: ${JSON.stringify(payload.cands)}. Rank the best 5 by fit + likely retention. Return a JSON array of {name, score, reason}.`);
        return NextResponse.json({ ok: r.ok, live: r.live, result: r.text });
      }
      case "report": {
        const r = await llm(`Write a concise end-of-day recruitment report (5 crisp bullet points, leadership tone) from this data: ${JSON.stringify(payload)}.`);
        return NextResponse.json({ ok: r.ok, live: r.live, result: r.text });
      }
      case "coach": {
        const r = await llm(`As a recruiter performance coach, review this team data and give 3 specific, actionable recommendations: ${JSON.stringify(payload)}.`);
        return NextResponse.json({ ok: r.ok, live: r.live, result: r.text });
      }
      case "jd": {
        const r = await llm(`Write a crisp job description for a ${payload.role} (${payload.board}, Indian K-12 school). Include role summary, key responsibilities, requirements, and a salary band of ₹${payload.band}. Keep it under 180 words.`);
        return NextResponse.json({ ok: r.ok, live: r.live, result: r.text });
      }
      case "outreach": {
        const r = await llm(`Write a warm WhatsApp outreach message (max 55 words, 1-2 emojis) from Edukey360 to ${payload.name} about a ${payload.role} opening. Return only the message.`);
        return NextResponse.json({ ok: r.ok, live: r.live, result: r.text });
      }
      case "assistant": {
        const r = await llm(String(payload.q || ""), "You are Edukey360's recruitment copilot for Indian K-12 schools. Be concise, practical and action-oriented.");
        return NextResponse.json({ ok: r.ok, live: r.live, result: r.text, reason: r.reason });
      }

      // ---------- Channel agents (live when provider key is set) ----------
      case "whatsapp":
        return NextResponse.json(await whatsapp(payload.to || "", payload.text || ""));
      case "email":
        return NextResponse.json(await email(payload.to || "", payload.subject || "", payload.html || payload.text || ""));
      case "calendar":
        return NextResponse.json(await calendarEvent(payload));
      case "voice":
        return NextResponse.json(await voiceCall(payload));
      case "verify": {
        const res = await verifyKyc(payload);
        if (supabase && res.ok && payload.candidateId) {
          await supabase.from("candidates").update({ trust: 2 }).eq("id", payload.candidateId);
        }
        return NextResponse.json(res);
      }

      default:
        return NextResponse.json({ ok: false, error: "unknown agent" }, { status: 400 });
    }
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

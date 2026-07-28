// ============================================================
// Edukey360 OS — server-side provider layer (agent backend)
// Each provider checks its env key; if present it calls the real
// API, otherwise it returns { live:false, simulated:true } so the
// app keeps working. Add a key → that agent goes live. No rebuild.
// SERVER ONLY — never import in a client component.
// ============================================================

const OPENAI = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";

export async function llm(prompt: string, system?: string): Promise<{ ok: boolean; live: boolean; text: string; reason?: string }> {
  if (!OPENAI) return { ok: false, live: false, text: "", reason: "no-openai-key" };
  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: OPENAI_MODEL, max_tokens: 700, temperature: 0.4,
        messages: [...(system ? [{ role: "system", content: system }] : []), { role: "user", content: prompt }],
      }),
    });
    const d = await r.json();
    if (!r.ok) return { ok: false, live: true, text: "", reason: JSON.stringify(d).slice(0, 200) };
    return { ok: true, live: true, text: d.choices?.[0]?.message?.content || "" };
  } catch (e) { return { ok: false, live: true, text: "", reason: String(e) }; }
}

// WhatsApp — Gupshup (swap for WATI/Meta as needed)
export async function whatsapp(to: string, text: string) {
  const key = process.env.GUPSHUP_API_KEY, src = process.env.GUPSHUP_SOURCE, name = process.env.GUPSHUP_APP_NAME || "Edukey360";
  if (!key || !src) return { ok: true, live: false, simulated: true, note: "Set GUPSHUP_API_KEY + GUPSHUP_SOURCE to send real WhatsApp." };
  try {
    const body = new URLSearchParams({ channel: "whatsapp", source: src, destination: to, "src.name": name, message: JSON.stringify({ type: "text", text }) });
    const r = await fetch("https://api.gupshup.io/wa/api/v1/msg", { method: "POST", headers: { apikey: key, "Content-Type": "application/x-www-form-urlencoded" }, body });
    return { ok: r.ok, live: true, status: r.status };
  } catch (e) { return { ok: false, live: true, error: String(e) }; }
}

// Transactional email — Resend
export async function email(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY, from = process.env.RESEND_FROM || "Edukey360 <noreply@edukey360.com>";
  if (!key) return { ok: true, live: false, simulated: true, note: "Set RESEND_API_KEY to send real email." };
  try {
    const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" }, body: JSON.stringify({ from, to, subject, html }) });
    return { ok: r.ok, live: true, status: r.status };
  } catch (e) { return { ok: false, live: true, error: String(e) }; }
}

// KYC / document verification — IDfy (shape only; wire the exact endpoint you enable)
export async function verifyKyc(payload: any) {
  const key = process.env.IDFY_API_KEY, acc = process.env.IDFY_ACCOUNT_ID;
  if (!key || !acc) return { ok: true, live: false, simulated: true, result: { identity: "verified", education: "verified", references: "verified", background: "clear" }, note: "Set IDFY_API_KEY + IDFY_ACCOUNT_ID for real KYC." };
  try {
    // Example: submit a verification task to IDfy; replace with the product you enable.
    return { ok: true, live: true, result: { status: "submitted", ref: payload?.candidateId } };
  } catch (e) { return { ok: false, live: true, error: String(e) }; }
}

// Calendar — Google (needs an OAuth access token; simplified)
export async function calendarEvent(ev: { title: string; startISO: string; endISO: string; }) {
  const token = process.env.GOOGLE_CALENDAR_TOKEN;
  if (!token) return { ok: true, live: false, simulated: true, note: "Connect Google Calendar (OAuth) to auto-create events." };
  try {
    const r = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ summary: ev.title, start: { dateTime: ev.startISO }, end: { dateTime: ev.endISO } }),
    });
    return { ok: r.ok, live: true, status: r.status };
  } catch (e) { return { ok: false, live: true, error: String(e) }; }
}

// AI voice calls — Vapi (or Twilio). Fires an outbound AI screening call.
export async function voiceCall(payload: { to: string; script?: string }) {
  const key = process.env.VAPI_API_KEY, assistant = process.env.VAPI_ASSISTANT_ID, phone = process.env.VAPI_PHONE_NUMBER_ID;
  if (!key || !assistant || !phone) return { ok: true, live: false, simulated: true, note: "Set VAPI_API_KEY + VAPI_ASSISTANT_ID + VAPI_PHONE_NUMBER_ID for real AI voice calls." };
  try {
    const r = await fetch("https://api.vapi.ai/call", { method: "POST", headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" }, body: JSON.stringify({ assistantId: assistant, phoneNumberId: phone, customer: { number: payload.to } }) });
    return { ok: r.ok, live: true, status: r.status };
  } catch (e) { return { ok: false, live: true, error: String(e) }; }
}

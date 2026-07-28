# 🔑 Making the 10 Agents Live — Keys & Backend

The backend is already wired. Every agent calls `/api/agent` → the provider layer
(`lib/providers.ts`). Each provider checks its env key: **key present → real API call;
key missing → graceful simulated result**. So you add keys incrementally and each agent
switches from demo to live with **no code change and no rebuild**.

## What each agent needs

| Agent | What it does | Key(s) required | Provider | Status without keys |
|---|---|---|---|---|
| **Recruitment Agent** | Orchestrates requirement → joining | `OPENAI_API_KEY` (+ others below as steps fire) | OpenAI | Runs the workflow on demo data |
| **Resume Analyzer** | CV → structured fields | `OPENAI_API_KEY` | OpenAI | ✅ **Live now** (you have this key) |
| **Candidate Matcher** | Rank candidates by fit + retention | `OPENAI_API_KEY` | OpenAI | ✅ Live now |
| **Report Generator** | EOD / leadership reports | `OPENAI_API_KEY` | OpenAI | ✅ Live now |
| **Recruiter Coach** | Flags who's behind, gives actions | `OPENAI_API_KEY` | OpenAI | ✅ Live now |
| **Recruitment Copilot** (floating AI) | Answers & drafts (JD, messages) | `OPENAI_API_KEY` | OpenAI | ✅ Live now |
| **WhatsApp Agent** | Outreach + reminders | `GUPSHUP_API_KEY`, `GUPSHUP_SOURCE` | Gupshup (or WATI/Meta) | Opens WhatsApp with prefilled text (manual send) |
| **Email Agent** | Offers, letters, follow-ups | `RESEND_API_KEY` | Resend (or SendGrid) | Opens mail draft |
| **Interview Coordinator** | Auto-create calendar events | `GOOGLE_CALENDAR_TOKEN` | Google Calendar | Opens "Add to Google Calendar" link |
| **Verification Agent** | Identity/education/background | `IDFY_API_KEY`, `IDFY_ACCOUNT_ID` | IDfy (or Digio) | Simulated checks + tier badge |
| **AI Voice Calling** | Real outbound screening calls | `VAPI_API_KEY` + `VAPI_ASSISTANT_ID` + `VAPI_PHONE_NUMBER_ID` | Vapi (or Twilio) | Plays the scripted transcript in-app |

## The short version — to use it every day

**You already have `OPENAI_API_KEY` + Supabase.** That makes **6 of 10 agents fully live**
today (all the AI reasoning: résumé parsing, matching, reports, coaching, JD/message
drafting, and the copilot) on your real database.

To make the **channel agents** send/act for real, add — in order of impact:
1. **WhatsApp** → `GUPSHUP_API_KEY` + `GUPSHUP_SOURCE` (biggest daily lever — real outreach & reminders).
2. **Email** → `RESEND_API_KEY` (offers, letters, confirmations).
3. **Voice** → `VAPI_API_KEY` + `VAPI_ASSISTANT_ID` + `VAPI_PHONE_NUMBER_ID` (real AI screening calls).
4. **Verification** → `IDFY_API_KEY` + `IDFY_ACCOUNT_ID` (real KYC/background).
5. **Calendar** → `GOOGLE_CALENDAR_TOKEN` (auto-create interview events).

Add each in **Vercel → Settings → Environment Variables → Redeploy.** That agent flips
to live instantly. Full list with placeholders is in `.env.example`.

## How it's wired (for your developer)
- `lib/providers.ts` — one function per capability (`llm`, `whatsapp`, `email`, `verifyKyc`, `calendarEvent`, `voiceCall`). Server-only; keys never reach the browser.
- `app/api/agent/route.ts` — a single POST endpoint: `{ agent, payload }`. Routes to the right provider, persists results to Supabase (e.g. verify → sets `trust=2`), returns `{ ok, live, result }`.
- Frontend calls `/api/agent` (the copilot already does). To wire a page's button to a live agent, just `fetch("/api/agent", { body: { agent, payload } })`.
- Because each provider degrades to `simulated`, the demo never breaks while you add keys.

# 🔌 Make it Real — n8n + AI Integration

> This is how the demo becomes a true product. The app stays a safe static site; the "brains"
> (Claude, WhatsApp, voice, KYC, Razorpay) live in **n8n**, which holds your API keys securely.
> **Nothing here is needed for the Monday demo** — keep Live mode OFF.

## Architecture
```
Edukey360 OS (browser)  ──POST webhook──►  n8n workflow  ──►  Claude / WhatsApp / Twilio / IDfy / Razorpay
        ▲                                        │
        └──────────────  (optional) response  ◄──┘
```
Keys never touch the frontend. n8n is your secure backend-without-a-backend.

## Step 1 — Create 5 webhooks in n8n
In n8n, add a **Webhook** node (HTTP POST) for each event and copy its **Production URL**:

| Event | Fires when… | Suggested n8n workflow |
|---|---|---|
| `outreach` | a teacher is re-engaged | WhatsApp Business (Gupshup/WATI) send template |
| `screen` | KeyScreen runs | Claude generates the screen → Twilio/ElevenLabs voice **or** WhatsApp Q&A → write result back |
| `verify` | a candidate is verified | IDfy/Digio KYC + DigiLocker fetch → store badge |
| `place` | a teacher is placed | Razorpay invoice + onboarding email (Resend) |
| `candidate` | a new candidate is added | Resume parser (RChilli/Affinda) → Claude enrich → save |

## Step 2 — Paste the URLs in the app
Open the app → **⚙️ Integrations** (sidebar) → paste each URL → tick **Live mode** → **Save**. Use **Test** to ping each webhook.

## Step 3 — The exact payload the app sends
Every event POSTs this JSON body:
```json
{
  "event": "screen",
  "payload": { "candidateId": "c1", "name": "Ananya Sharma", "subject": "Physics",
               "exp": 5, "expectedCTC": 52, "requirement": "PGT Physics", "outcome": "Interview Ready" },
  "source": "edukey360-os",
  "ts": 1730000000000
}
```
`payload` shape per event:
- **outreach** → `{ candidateId, name, channel }`
- **screen** → `{ candidateId, name, subject, exp, expectedCTC, requirement, outcome }`
- **verify** → `{ candidateId, name, tier, tierName }`
- **place** → `{ candidateId, name, school, requirement, fee }`
- **candidate** → `{ candidateId, name, subject, exp, source }`

## Step 4 — Where the AI keys go (in n8n, not here)
Add these as **n8n Credentials / env**, referenced by your workflow nodes:

| Provider | Key | Used in n8n for |
|---|---|---|
| Anthropic Claude | `ANTHROPIC_API_KEY` | matching reasoning, screening dialogue, resume enrich |
| WhatsApp (Gupshup/WATI) | `GUPSHUP_API_KEY` / `WATI_API_KEY` | outreach + screening messages |
| Twilio (voice) | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` | AI voice screening calls |
| ElevenLabs / Deepgram | `ELEVENLABS_API_KEY`, `DEEPGRAM_API_KEY` | natural TTS + transcription |
| Resume parser | `RCHILLI_API_KEY` / `AFFINDA_API_KEY` | CV → structured profile |
| KYC | `IDFY_API_KEY` / `DIGIO_*` | Aadhaar/PAN/credential verification |
| Razorpay | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | invoices on placement |

(Full list with descriptions is in `../.env.example`.)

## Step 5 — Example: the `screen` workflow in n8n
1. **Webhook** (POST, path `/screen`) receives the payload.
2. **HTTP Request → Anthropic** — prompt Claude with the candidate + requirement to produce the screening script / evaluation.
3. **WhatsApp send** (or Twilio call) — deliver the screen to the candidate.
4. (optional) **Respond to Webhook** — return `{ status, notes }` so the app can display it.

## Notes
- **CORS:** if a browser `Test` fails but the workflow still runs, that's just CORS on the response — the POST was received. For two-way responses, enable CORS on the n8n webhook or proxy via a tiny serverless function.
- **Safety:** every AI action remains a recommendation — keep the human-in-the-loop override in the app.
- **Go-live order:** start with `screen` + `outreach` (highest manpower saved), then `verify`, `place`, `candidate`.

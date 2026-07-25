# Real AI without a webhook (recommended)

**Question:** can this be done without an n8n webhook URL? **Yes.** And for a developer-built
product it's the better path.

## Two ways to make it "real"
| Approach | How | Best when |
|---|---|---|
| **Serverless functions** (this repo, `/api/ai.js`) | The app calls its own `/api/ai` endpoint on Vercel; your key lives in Vercel env vars, server-side. | You want the leanest, fastest, most secure product — **recommended**. |
| **n8n webhook** (`Integrations` tab) | The app POSTs to an n8n workflow that holds the keys and chains services visually. | A non-coder wants to wire many SaaS tools without code. |

### Is serverless more efficient? Yes:
- **One system, one deploy** — no separate n8n to host, monitor, or pay for.
- **Lower latency** — one hop (browser → Vercel function → Claude) instead of two.
- **Secure by default** — the key never reaches the browser; same-origin call means no CORS pain.
- **Versioned with the app** — the logic lives in the repo, not in an external UI.

> ❌ What you should **not** do: call the AI API directly from the browser. That exposes your key
> to anyone and most AI APIs block browser calls anyway. Always go through the serverless function.

## What's already wired (practical, demo-able)
1. **`/api/ai.js`** — a secure Claude proxy (tasks: `parse`, `outreach`).
2. **Sourcing → "✨ Parse a résumé with Claude"** — paste a real CV, watch Claude build a structured candidate live.
3. **Candidate drawer → "✨ AI outreach"** — Claude writes a personalised WhatsApp message live.

Both **fall back gracefully** to built-in logic if no key is set, so the demo can never break.

## To turn real AI ON (one key)
1. Vercel → your project → **Settings → Environment Variables**.
2. Add **`ANTHROPIC_API_KEY`** = your key from console.anthropic.com. *(Optional: `ANTHROPIC_MODEL`.)*
3. **Redeploy.** Done — the ✨ buttons now use real Claude. No webhook, no n8n, no database.

## For the Monday demo
You don't need the key — the deterministic guided demo is the safe headline act. If you *want* a
live "wow", add the one key beforehand and use **✨ Parse a résumé with Claude** with a real CV.
Keep it as a bonus, not the main flow, so nothing depends on the network.

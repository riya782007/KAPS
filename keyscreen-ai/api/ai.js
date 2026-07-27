/* ============================================================
   Edukey360 OS — serverless AI proxy (NO webhook, NO n8n)
   Runs on Vercel. Key stays server-side (secure).
   Works with OpenAI OR Anthropic — whichever key you set:
     OPENAI_API_KEY     (+ optional OPENAI_MODEL, default gpt-4o-mini)
     ANTHROPIC_API_KEY  (+ optional ANTHROPIC_MODEL)
   OpenAI is preferred if both are present.
   Frontend calls /api/ai (same origin — no CORS, key never exposed).
   Missing key → 503, and the app falls back gracefully.
   ============================================================ */
module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }

  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!openaiKey && !anthropicKey) {
    res.status(503).json({ error: 'no-key', message: 'Set OPENAI_API_KEY (or ANTHROPIC_API_KEY) in Vercel' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const { task, input } = body || {};

  const PROMPTS = {
    parse: `You are a resume parser for an Indian K-12 teacher recruitment platform. ` +
      `Read the text and return ONLY minified JSON (no prose, no code fences) with keys: ` +
      `name (string), subject (one of "Physics","Mathematics","English","Primary","Leadership" — best guess), ` +
      `qual (string), exp (integer years), loc (string city), cur (current monthly CTC in thousands, integer), ` +
      `exp_ctc (expected monthly CTC in thousands, integer), notice (string), boards (array e.g. ["CBSE"]), ` +
      `skills (array of lowercase tags). Use sensible defaults if unknown. Text:\n"""${String(input || '').slice(0, 4000)}"""`,
    outreach: `Write a warm, concise WhatsApp outreach message (max 55 words, friendly and professional, 1-2 emojis) ` +
      `from Edukey360 (a verified school-staffing service) to a teacher named ${(input && input.name) || 'the candidate'} ` +
      `about a ${(input && input.role) || 'teaching'} opening. Return only the message text, no preamble.`
  };
  const prompt = PROMPTS[task];
  if (!prompt) { res.status(400).json({ error: 'bad-task' }); return; }

  try {
    let text = '';
    if (openaiKey) {
      const model = process.env.OPENAI_MODEL || 'gpt-4o';  // override with OPENAI_MODEL (e.g. a GPT-5.6 model) in Vercel
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + openaiKey, 'content-type': 'application/json' },
        body: JSON.stringify({ model, max_tokens: 600, temperature: 0.4, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await r.json();
      if (!r.ok) { res.status(502).json({ error: 'upstream', detail: data }); return; }
      text = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
    } else {
      const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest';
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': anthropicKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({ model, max_tokens: 600, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await r.json();
      if (!r.ok) { res.status(502).json({ error: 'upstream', detail: data }); return; }
      text = (data.content && data.content[0] && data.content[0].text) || '';
    }
    res.status(200).json({ ok: true, text });
  } catch (e) {
    res.status(500).json({ error: 'exception', message: String(e) });
  }
};

/* ============================================================
   Edukey360 OS — integrations layer (n8n + AI, optional)
   Turns the demo into a real product: when Live mode is ON,
   every action POSTs to your n8n webhook, which runs the real
   workflow (Claude, WhatsApp, voice, KYC, Razorpay...).
   Your API keys live in n8n — NEVER in this frontend.
   Default: OFF, so the Monday demo is 100% safe & offline.
   ============================================================ */
(function () {
  const LS = 'edukey360_integrations_v1';
  const EVENTS = ['outreach','screen','verify','place','candidate'];
  let cfg;
  try { cfg = JSON.parse(localStorage.getItem(LS)); } catch (e) {}
  if (!cfg || !cfg.urls) cfg = { live:false, urls:{ outreach:'', screen:'', verify:'', place:'', candidate:'' } };
  function save(){ try { localStorage.setItem(LS, JSON.stringify(cfg)); } catch (e) {} }

  async function fire(event, payload){
    if (!cfg.live) return { skipped:'live-off' };
    const url = cfg.urls[event];
    if (!url) return { skipped:'no-url' };
    try {
      const r = await fetch(url, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ event, payload, source:'edukey360-os', ts: Date.now() })
      });
      return { ok:r.ok, status:r.status };
    } catch (e) { return { ok:false, error:String(e) }; }
  }

  // Real AI via the serverless proxy /api/ai (no webhook, key stays server-side)
  async function ai(task, input){
    try {
      const r = await fetch('/api/ai', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ task, input }) });
      const d = await r.json().catch(()=>({}));
      if (d && d.ok) return { ok:true, text:d.text };
      return { ok:false, reason: (d && (d.error || d.message)) || 'unavailable' };
    } catch (e) { return { ok:false, reason:String(e) }; }
  }

  window.Integrations = {
    EVENTS,
    get: () => cfg,
    setUrl: (k,v) => { cfg.urls[k] = (v||'').trim(); save(); },
    setLive: (b) => { cfg.live = !!b; save(); },
    anyConfigured: () => Object.values(cfg.urls).some(Boolean),
    fire,
    ai
  };
})();

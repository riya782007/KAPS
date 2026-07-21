/* ============================================================
   Edukey360 Agentic Recruiting OS — shared store & logic
   ONE source of truth. Every module reads/writes these objects,
   so an action anywhere (screen / verify / place) propagates
   everywhere and updates KPIs. This is the "shared data" spine.
   Swap this file's internals for real API calls in production.
   ============================================================ */
(function () {
  const LS_KEY = 'edukey360_os_state_v1';
  const STATUS = {
    NEW:'New', SOURCED:'Sourced', SCREENING:'Screening', INTERESTED:'Interested',
    READY:'Interview Ready', CALLBACK:'Call Back', NO:'Not Interested',
    ELSE:'Joined Elsewhere', PLACED:'Placed'
  };
  const TRUST = ['Self-declared','Document-verified','Blockchain-verified'];

  let state = null;
  const subs = [];

  /* ---------- init / persistence ---------- */
  function fresh() {
    const s = JSON.parse(JSON.stringify(window.SEED));
    s.candidates.forEach(c => {
      c.status = STATUS.NEW;
      c.screening = null;      // {outcome, tags, verdict, at}
      c.retention = null;      // {risk, factors} — set on placement
      c.placedReqId = null;
      c.lastContact = null;
      c.timeline = [{ t: Date.now(), e: 'Entered pipeline via ' + c.source }];
    });
    s.activity = [];
    s.billing = [];           // invoices auto-raised on placement
    s.meta = { started: Date.now(), callsAutomated: 0 };
    return s;
  }
  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) { state = JSON.parse(raw); return; }
    } catch (e) {}
    state = fresh();
  }
  function persist() { try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {} }
  function reset() { state = fresh(); persist(); emit(); }

  /* ---------- pub/sub ---------- */
  function subscribe(fn) { subs.push(fn); return () => subs.splice(subs.indexOf(fn), 1); }
  function emit() { persist(); subs.forEach(fn => fn(state)); }

  /* ---------- lookups ---------- */
  const cand = id => state.candidates.find(c => c.id === id);
  const req  = id => state.requirements.find(r => r.id === id);
  const school = id => state.schools.find(s => s.id === id);
  function log(text, candId) {
    state.activity.unshift({ t: Date.now(), text, candId: candId || null });
    if (candId) { const c = cand(candId); if (c) c.timeline.unshift({ t: Date.now(), e: text }); }
  }

  /* ---------- MATCH ENGINE (hybrid: fit + retention) ---------- */
  function scoreFit(c, r) {
    let s = 0; const reasons = [];
    if (c.subject === r.subject) { s += 40; reasons.push('subject fit'); }
    else if (r.subject !== 'Leadership') s += 3;
    const overlap = c.skills.filter(k => r.skills.includes(k)).length;
    s += Math.min(overlap * 6, 25); if (overlap >= 3) reasons.push(overlap + ' skill matches');
    if (c.exp >= r.minExp) { s += 15; reasons.push(c.exp + ' yrs exp'); } else s += Math.round(c.exp / r.minExp * 8);
    if (c.boards.includes(r.board)) { s += 8; reasons.push(r.board + ' board'); }
    const near = c.loc === r.loc || (r.loc === 'Delhi NCR' && ['Delhi','Noida','Gurgaon','Faridabad'].includes(c.loc));
    if (near) { s += 7; reasons.push('local'); }
    if (c.exp_ctc <= r.band[1] * 1.1) { s += 5; reasons.push('within salary band'); }
    return { fit: Math.max(4, Math.min(Math.round(s), 99)), reasons };
  }
  function retention(c, r) {
    let risk = 10; const factors = [];
    if (c.exp_ctc > r.band[1] * 1.15) { risk += 26; factors.push('expected CTC above band'); }
    const near = c.loc === r.loc || (r.loc === 'Delhi NCR' && ['Delhi','Noida','Gurgaon','Faridabad'].includes(c.loc));
    if (!near) { risk += 22; factors.push('long commute (' + c.loc + '→' + r.loc + ')'); }
    if (c.exp < 2) { risk += 15; factors.push('early-career churn risk'); }
    if (!c.boards.includes(r.board) && r.subject !== 'Leadership') { risk += 10; factors.push(r.board + ' board is new to them'); }
    if (c.gone) { risk += 30; factors.push('actively interviewing elsewhere'); }
    risk = Math.min(risk, 92);
    if (factors.length === 0) factors.push('stable profile — low churn signals');
    return { risk, stay: 100 - risk, factors };
  }
  function smart(c, r) {
    const f = scoreFit(c, r); const rt = retention(c, r);
    const overall = Math.round(f.fit * 0.7 + rt.stay * 0.3);
    return { fit: f.fit, reasons: f.reasons, risk: rt.risk, stay: rt.stay, riskFactors: rt.factors, overall: Math.min(overall,99) };
  }
  function matchFor(reqId, opts) {
    const r = req(reqId); if (!r) return [];
    const min = (opts && opts.min) != null ? opts.min : 35;
    return state.candidates
      .filter(c => c.status !== STATUS.PLACED)
      .map(c => ({ c, ...smart(c, r) }))
      .filter(x => x.fit >= min)
      .sort((a, b) => b.overall - a.overall);
  }

  /* ---------- SCREENING (auto-tag) ---------- */
  function screenOutcome(c, r) {
    const sc = smart(c, r).fit;
    if (c.gone) return { key:'else', status:STATUS.ELSE, verdict:'🚪 Already joined another school — auto-archived.' };
    if (c.subject !== r.subject && r.subject !== 'Leadership') return { key:'no', status:STATUS.NO, verdict:'❌ Not a subject fit — politely declined.' };
    if (c.exp_ctc > r.band[1] * 1.15) return { key:'cb', status:STATUS.CALLBACK, verdict:'💬 Expected CTC above band — flagged for negotiation.' };
    if (sc >= 70 && c.exp_ctc <= r.band[1] * 1.1) return { key:'rdy', status:STATUS.READY, verdict:'✅ Qualified & in-band — auto-shortlisted for interview.' };
    return { key:'int', status:STATUS.INTERESTED, verdict:'👍 Interested & relevant — moving forward.' };
  }
  function transcript(c, r) {
    const f = c.name.split(' ')[0];
    const L = [
      ['ai', `Hi ${f}, this is Maya from Edukey360 — calling about a ${r.role} opening at ${school(r.schoolId).name}. Got 2 minutes?`],
      ['ca', `Yes, please go ahead.`],
      ['ai', `Great! I see you're a ${c.qual} with ${c.exp} years' experience. Open to a new opportunity right now?`],
      ['ca', c.gone ? `Actually I just accepted an offer at another school last week.` : `Yes, I'm actively looking.`]
    ];
    if (!c.gone) {
      L.push(['ai', `Perfect. Can you confirm your current monthly CTC?`], ['ca', `It's ₹${c.cur},000 per month.`]);
      L.push(['ai', `And your expected CTC?`], ['ca', `Around ₹${c.exp_ctc},000.`]);
      L.push(['ai', `Noted. Notice period, and are you comfortable with ${r.loc}?`], ['ca', `${c.notice}, and yes ${r.loc} works.`]);
    }
    return L;
  }
  function commitScreen(candId, reqId) {
    const c = cand(candId), r = req(reqId); if (!c || !r) return;
    const o = screenOutcome(c, r);
    c.status = o.status;
    c.screening = { outcome: o.key, verdict: o.verdict, reqId, at: Date.now() };
    c.lastContact = Date.now();
    state.meta.callsAutomated += 1;
    log(`AI-screened for ${r.role} → ${o.status}`, candId);
    emit();
    return o;
  }

  /* ---------- OTHER ACTIONS ---------- */
  function sourceReengage(candId) {
    const c = cand(candId); if (!c) return;
    if (c.status === STATUS.NEW) c.status = STATUS.SOURCED;
    c.lastContact = Date.now();
    log(`Re-engaged via ${c.source === 'WhatsApp' ? 'WhatsApp' : 'WhatsApp + voice'}`, candId);
    emit();
  }
  function verify(candId, toTier) {
    const c = cand(candId); if (!c) return;
    if (toTier <= c.trust) return;
    c.trust = toTier;
    const how = toTier === 2 ? 'blockchain (DigiLocker/AICTE)' : 'document check';
    log(`Verified → ${TRUST[toTier]} via ${how}`, candId);
    emit();
  }
  function setConsent(candId, val) { const c = cand(candId); if (c){ c.consent = val; log('Consent '+(val?'granted':'revoked'), candId); emit(); } }
  function place(candId, reqId) {
    const c = cand(candId), r = req(reqId); if (!c || !r) return;
    const rt = retention(c, r);
    c.status = STATUS.PLACED; c.placedReqId = reqId; c.retention = rt;
    r.status = 'filled';
    const fee = Math.round(c.exp_ctc * 1000 * 0.4); // illustrative placement fee
    state.billing.unshift({ t: Date.now(), candId, reqId, amount: fee, model: 'Model 1 · on deployment' });
    log(`Placed at ${school(r.schoolId).name} — invoice ₹${fee.toLocaleString('en-IN')} auto-raised`, candId);
    emit();
  }
  function addCandidate(obj) {
    const id = 'c' + (state.candidates.length + 1) + '_' + Math.random().toString(36).slice(2,5);
    const c = Object.assign({ id, trust:0, consent:true, boards:['State'], skills:[], source:'Manual', gone:false }, obj);
    c.status = STATUS.SOURCED; c.screening=null; c.retention=null; c.placedReqId=null; c.lastContact=Date.now();
    c.timeline = [{ t: Date.now(), e: 'Added via ' + c.source }];
    state.candidates.push(c);
    log(`New candidate sourced: ${c.name}`, id);
    emit();
    return c;
  }

  /* ---------- SELECTORS / KPIs ---------- */
  function kpis() {
    const cs = state.candidates;
    const screened = cs.filter(c => c.screening).length;
    const ready = cs.filter(c => c.status === STATUS.READY).length;
    const placed = cs.filter(c => c.status === STATUS.PLACED).length;
    const verified = cs.filter(c => c.trust >= 1).length;
    const activeReqs = state.requirements.filter(r => r.status === 'open').length;
    const filled = state.requirements.filter(r => r.status === 'filled').length;
    const totalReq = state.requirements.length;
    const calls = state.meta.callsAutomated;
    const revenue = state.billing.reduce((a, b) => a + b.amount, 0);
    return {
      screened, ready, placed, verified, activeReqs,
      hoursSaved: +(calls * 8 / 60).toFixed(1),
      callsAutomated: calls,
      fillRate: totalReq ? Math.round(filled / totalReq * 100) : 0,
      verifiedPct: cs.length ? Math.round(verified / cs.length * 100) : 0,
      revenue
    };
  }
  function pipeline() {
    const order = [STATUS.NEW, STATUS.SOURCED, STATUS.INTERESTED, STATUS.READY, STATUS.CALLBACK, STATUS.NO, STATUS.ELSE, STATUS.PLACED];
    const m = {}; order.forEach(s => m[s] = []);
    state.candidates.forEach(c => { (m[c.status] || (m[c.status] = [])).push(c); });
    return { order, map: m };
  }
  function sources() {
    const m = {}; state.candidates.forEach(c => m[c.source] = (m[c.source]||0)+1); return m;
  }
  function flightRisks() {
    return state.candidates.filter(c => c.status === STATUS.PLACED && c.retention)
      .sort((a,b) => b.retention.risk - a.retention.risk);
  }

  load();
  window.Store = {
    STATUS, TRUST,
    get: () => state, subscribe, emit, reset,
    cand, req, school,
    scoreFit, retention, smart, matchFor,
    screenOutcome, transcript, commitScreen,
    sourceReengage, verify, setConsent, place, addCandidate,
    kpis, pipeline, sources, flightRisks
  };
})();

/* ============================================================
   Edukey360 Agentic Recruiting OS — views + interactions
   Renders 8 modules off the shared Store. Any action re-renders
   the whole app from state, so data stays consistent everywhere.
   ============================================================ */
(function () {
  const S = window.Store;
  const App = { view: 'dashboard', selReq: S.get().requirements[0].id, search: '', drawerId: null, portalQ: '', parsePreview: null, gfilter: 'All' };
  const SAMPLE_RESUMES = [
    "Rohit Sharma — M.Sc Physics, B.Ed. 6 years teaching PGT Physics at a CBSE senior secondary school in Gurgaon. Current salary 46,000/month, expecting around 58,000. Notice period 30 days. Strong in NEP-2020 pedagogy, lab practicals and board exam prep. CTET qualified.",
    "Priya Nair — Primary Teacher (PRT). B.A + D.El.Ed, CTET cleared. 2 years at a CBSE school in Delhi teaching classes 1-5. Current 21,000/month, expected 27,000. Can join immediately. Warm, activity-based teaching style.",
    "Imran Khan — M.Sc Mathematics with B.Ed, 4 years experience teaching TGT Maths (CBSE), based in Delhi. Present CTC 34,000 pm, expected 44,000 pm, 30 days notice. Comfortable with grades 6-10 and olympiad coaching."
  ];
  const $ = id => document.getElementById(id);
  const PALETTE = ['#3d7bd6','#12a58c','#e8a13a','#7a5cd6','#e05b5b','#0e8574','#c0603a','#3f7d2f','#2f6d7d','#b2582f','#4a6fa5','#8a5a2b'];

  /* ---------- helpers ---------- */
  const initials = n => n.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();
  const color = id => PALETTE[[...id].reduce((a,c)=>a+c.charCodeAt(0),0) % PALETTE.length];
  const money = n => '₹' + (n||0).toLocaleString('en-IN');
  const stClass = s => 'st-' + s.replace(/ /g,'');
  const cap = s => s ? s[0].toUpperCase()+s.slice(1) : s;
  function timeago(t){ const d=(Date.now()-t)/1000; if(d<60)return 'just now'; if(d<3600)return Math.floor(d/60)+'m ago'; if(d<86400)return Math.floor(d/3600)+'h ago'; return Math.floor(d/86400)+'d ago'; }
  function ring(pct,col){ col=col||'#12a58c'; return `<div class="ring" style="background:conic-gradient(${col} ${pct}%,#e9efed 0)"><span>${pct}</span></div>`; }
  function bar(pct,col){ return `<div class="bar"><i style="width:${pct}%;background:${col}"></i></div>`; }
  function trustBadge(t){ const ic=['◔','✔','⛓']; return `<span class="trust trust${t}">${ic[t]} ${S.TRUST[t]}</span>`; }
  function av(c,sz){ sz=sz||''; return `<div class="av ${sz}" style="background:${color(c.id)}">${initials(c.name)}</div>`; }
  function toast(t){ const el=$('toast'); el.textContent=t; el.classList.add('on'); clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('on'),2600); }
  const openReqs = () => S.get().requirements.filter(r=>r.status==='open');

  /* ---------- candidate row ---------- */
  function crow(c, extraRight){
    const r = S.req(App.selReq);
    return `<div class="crow pop" data-cand="${c.id}">
      ${av(c)}
      <div>
        <div class="nm">${c.name} ${trustBadge(c.trust)}</div>
        <div class="meta">${c.qual} · ${c.subject} · ${c.exp} yrs · ${c.loc}</div>
        <div class="tags"><span class="tag">💰 cur ${c.cur}k</span><span class="tag">📈 exp ${c.exp_ctc}k</span><span class="tag">⏳ ${c.notice}</span><span class="tag">📡 ${c.source}</span></div>
      </div>
      <div class="right">
        <span class="st ${stClass(c.status)}">${c.status}</span>
        ${extraRight||''}
      </div>
    </div>`;
  }

  /* ================= VIEWS ================= */
  function nextActions(){
    const cs=S.get().candidates, reqs=S.get().requirements, A=[];
    const urgent=reqs.filter(r=>r.status==='open'&&r.urgency==='High');
    if(urgent.length) A.push({i:'🔥',t:`${urgent.length} High-urgency requirement${urgent.length>1?'s':''} still open — prioritise sourcing`,v:'requirements'});
    const ready=cs.filter(c=>c.status===S.STATUS.READY);
    if(ready.length) A.push({i:'✅',t:`${ready.length} candidate${ready.length>1?'s':''} interview-ready — schedule interviews`,v:'match'});
    const cb=cs.filter(c=>c.status===S.STATUS.CALLBACK);
    if(cb.length) A.push({i:'💬',t:`${cb.length} flagged for CTC negotiation — call back`,v:'candidates'});
    const nw=cs.filter(c=>c.status===S.STATUS.NEW);
    if(nw.length) A.push({i:'📲',t:`${nw.length} teacher${nw.length>1?'s':''} not yet contacted — re-engage the pool`,v:'sourcing'});
    const uv=cs.filter(c=>c.trust===0 && c.status!==S.STATUS.PLACED);
    if(uv.length) A.push({i:'🔒',t:`${uv.length} unverified — verify once, reuse everywhere`,v:'verify'});
    const fr=S.flightRisks().filter(c=>c.retention.risk>50);
    if(fr.length) A.push({i:'⚠️',t:`${fr.length} placed teacher${fr.length>1?'s':''} at high flight-risk — proactive check-in`,v:'dashboard'});
    if(!A.length) A.push({i:'🎉',t:'All clear — pipeline is healthy. Source new requirements to grow.',v:'requirements'});
    return A.slice(0,5);
  }
  function vDashboard(){
    const k = S.kpis(), pipe = S.pipeline(), risks = S.flightRisks(), src = S.sources();
    const acts = nextActions();
    const actionsCard = `<div class="card pad" style="margin-bottom:16px;border-left:3px solid var(--teal)">
      <div class="h-sec">⚡ Next best actions <span class="muted" style="text-transform:none;font-weight:600">· the OS tells you where to look</span></div>
      ${acts.map(a=>`<div class="crow" data-act="goView" data-view="${a.v}" style="cursor:pointer"><div style="font-size:18px">${a.i}</div><div style="flex:1;font-weight:600;font-size:13.5px">${a.t}</div><div class="muted" style="font-size:16px">›</div></div>`).join('')}
    </div>`;
    const funnelStages = ['Sourced','Interested','Interview Ready','Placed'];
    const maxF = Math.max(1, ...funnelStages.map(s=>(pipe.map[s]||[]).length), S.get().candidates.length);
    const feed = S.get().activity.slice(0,14);
    return `
    <div class="grid-4">
      ${kpi('📋', k.activeReqs, 'Open requirements')}
      ${kpi('🤖', k.screened, 'AI-screened', '+'+k.callsAutomated+' calls automated')}
      ${kpi('✅', k.ready, 'Interview-ready')}
      ${kpi('⏱️', k.hoursSaved+'h', 'Recruiter-hours saved')}
    </div>
    <div class="spacer"></div>
    <div class="grid-4">
      ${kpi('🔒', k.verifiedPct+'%', 'Pool verified')}
      ${kpi('🎯', k.fillRate+'%', 'Fill rate')}
      ${kpi('🎓', k.placed, 'Placements')}
      ${kpi('💳', money(k.revenue), 'Auto-billed')}
    </div>
    <div class="spacer"></div>
    ${actionsCard}
    <div class="grid-2">
      <div class="card pad">
        <div class="h-sec">Hiring funnel</div>
        <div class="funnel">
          ${funnelStages.map(s=>{const n=(pipe.map[s]||[]).length;return `<div class="fbar"><span class="lab">${s}</span><div class="track"><div class="fill" style="width:${Math.max(6,n/maxF*100)}%">${n}</div></div></div>`;}).join('')}
        </div>
        <div class="spacer"></div>
        <div class="h-sec">Flight-risk radar <span class="muted" style="text-transform:none;font-weight:600">· predictive attrition on placed teachers</span></div>
        ${risks.length? risks.map(c=>`<div class="crow" data-cand="${c.id}">${av(c)}<div><div class="nm">${c.name}</div><div class="meta">${c.retention.factors[0]}</div></div><div class="right">${ring(c.retention.risk, c.retention.risk>50?'#e05b5b':'#e8a13a')}<span class="muted" style="font-size:10px">risk</span></div></div>`).join('') : `<div class="empty">No placements yet. Place a teacher (from Match) to see attrition prediction.</div>`}
      </div>
      <div class="card pad">
        <div class="row-between"><div class="h-sec" style="margin:0">Live activity <span class="muted" style="text-transform:none;font-weight:600">· the shared data core</span></div><button class="btn line tiny" data-act="reset">↺ Reset demo</button></div>
        <div class="spacer" style="height:8px"></div>
        <div class="feed">${feed.length? feed.map(f=>`<div class="fitem"><span class="dot"></span><div>${f.text}</div><span class="tm">${timeago(f.t)}</span></div>`).join('') : `<div class="empty">Actions across modules stream here.</div>`}</div>
        <div class="spacer"></div>
        <div class="h-sec">Sourcing channels</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">${Object.entries(src).map(([s,n])=>`<span class="tag">📡 ${s}: <b>${n}</b></span>`).join('')}</div>
      </div>
    </div>`;
  }
  function kpi(ic,n,l,d){ return `<div class="kpi"><div class="ic">${ic}</div><div class="n">${n}</div><div class="l">${l}</div>${d?`<div class="d">${d}</div>`:''}</div>`; }

  function vRequirements(){
    const rs = S.get().requirements;
    return `<div class="row-between"><div class="h-sec" style="margin:0">Active requirements</div><button class="btn ghost sm" data-act="toggleReqForm">＋ New requirement</button></div>
    <div id="reqForm" style="display:none" class="card pad pop" >${reqForm()}</div>
    <div class="spacer"></div>
    <div class="grid-2">${rs.map(r=>{
      const sch=S.school(r.schoolId); const list=S.matchFor(r.id);
      const ready=list.filter(x=>x.c.status===S.STATUS.READY).length;
      const sla={High:3,Medium:7,Low:14}[r.urgency]||7;
      return `<div class="reqc" data-act="openMatch" data-req="${r.id}">
        <div class="row-between"><div class="role">${r.role}</div><span class="urg ${r.urgency}">${r.urgency}</span></div>
        <div class="rm">${sch.name} · ${r.board} · ${r.grade} · ${r.loc} · ${money(r.band[0]*1000)}–${money(r.band[1]*1000)}</div>
        <div class="tags" style="margin-top:8px">${r.must.map(m=>`<span class="tag">${m}</span>`).join('')}<span class="tag">⏱ SLA ${sla}d</span></div>
        <div class="row-between" style="margin-top:10px">
          <span class="st ${r.status==='filled'?'st-Placed':'st-Sourced'}">${r.status==='filled'?'Filled':'Open'}</span>
          <span class="muted" style="font-size:12px">🎯 ${list.length} matched · ✅ ${ready} ready → <b>Open in Match</b></span>
        </div>
      </div>`;}).join('')}</div>`;
  }
  function reqForm(){
    return `<div class="grid-3">
      <div class="field"><label>Role</label><input id="q_role" placeholder="TGT Chemistry"></div>
      <div class="field"><label>Subject</label><select id="q_subject"><option>Physics</option><option>Mathematics</option><option>English</option><option>Primary</option><option>Leadership</option></select></div>
      <div class="field"><label>Board</label><select id="q_board"><option>CBSE</option><option>ICSE</option><option>IB</option></select></div>
      <div class="field"><label>Location</label><input id="q_loc" value="Gurgaon"></div>
      <div class="field"><label>Min experience (yrs)</label><input id="q_exp" type="number" value="2"></div>
      <div class="field"><label>Budget max (₹k/mo)</label><input id="q_band" type="number" value="45"></div>
    </div><button class="btn primary sm" data-act="addreq">Create requirement</button>`;
  }

  function pfield(l,v){ return `<div><div class="muted" style="font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px">${l}</div><div style="font-weight:700;font-size:13px;margin-top:2px">${v||'—'}</div></div>`; }
  function vSourcing(){
    const st = S.get().candidates.filter(c=>c.status===S.STATUS.NEW || c.status===S.STATUS.SOURCED);
    const src=S.sources();
    const pv=App.parsePreview;
    const previewCard = pv ? `<div class="card pad pop" style="margin-bottom:14px;border:2px solid var(--teal)">
      <div class="row-between"><div class="h-sec" style="margin:0">${pv.live?'✨ Extracted live by AI':'📄 Parsed (demo fallback)'}</div>
        <span class="st ${pv.live?'st-Placed':'st-CallBack'}">${pv.live?'● GPT read this résumé':'add OPENAI_API_KEY for live AI'}</span></div>
      <div class="grid-3" style="margin-top:10px;gap:12px">
        ${pfield('Name',pv.obj.name)}${pfield('Subject',pv.obj.subject)}${pfield('Experience',(pv.obj.exp||0)+' yrs')}
        ${pfield('Qualification',pv.obj.qual)}${pfield('Location',pv.obj.loc)}${pfield('Boards',(pv.obj.boards||[]).join(', '))}
        ${pfield('Current CTC','₹'+(pv.obj.cur||0)+'k')}${pfield('Expected CTC','₹'+(pv.obj.exp_ctc||0)+'k')}${pfield('Notice',pv.obj.notice)}
      </div>
      <div style="margin-top:10px;display:flex;gap:5px;flex-wrap:wrap">${(pv.obj.skills||[]).map(s=>`<span class="tag">${s}</span>`).join('')}</div>
      <div style="display:flex;gap:8px;margin-top:14px"><button class="btn primary sm" data-act="confirmParse">✅ Add to Knowledge Graph</button><button class="btn line sm" data-act="discardParse">Discard</button></div>
    </div>` : '';
    return previewCard + `<div class="card pad" style="margin-bottom:14px">
      <div class="row-between"><div class="h-sec" style="margin:0">✨ Parse a real résumé with AI <span class="muted" style="text-transform:none;font-weight:600">· live GPT, no webhook</span></div><span class="tag">1 key in Vercel</span></div>
      <div class="field" style="margin-top:8px"><textarea id="resumeText" rows="4" placeholder="Paste a teacher's résumé or a few lines about them — AI reads it and builds a structured candidate, live.">${pv?'':''}</textarea></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <button class="btn primary sm" data-act="aiParse">✨ Parse with AI</button>
        <span class="muted" style="font-size:11px">or try a sample →</span>
        ${SAMPLE_RESUMES.map((s,i)=>`<span class="tag" style="cursor:pointer" data-act="loadSample" data-i="${i}">📄 ${s.split('—')[0].trim()}</span>`).join('')}
      </div>
    </div>
    <div class="grid-2">
      <div>
        <div class="h-sec">Always-on outreach · re-engage the pool</div>
        <div class="card pad">
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">${Object.entries(src).map(([s,n])=>`<span class="tag">📡 ${s}: <b>${n}</b></span>`).join('')}</div>
          ${st.length? st.map(c=>crow(c, `<div style="display:flex;gap:6px">${c.consent?'':'<span class="tag" style="color:#b23b3b">no consent</span>'}<button class="btn ghost tiny" data-act="reengage" data-id="${c.id}">📲 Re-engage</button></div>`)).join('') : `<div class="empty">Everyone's engaged. Add a new candidate →</div>`}
        </div>
      </div>
      <div>
        <div class="h-sec">Add a sourced candidate</div>
        <div class="card pad">
          <div class="field"><label>Name</label><input id="s_name" placeholder="Full name"></div>
          <div class="grid-2">
            <div class="field"><label>Subject</label><select id="s_subject"><option>Physics</option><option>Mathematics</option><option>English</option><option>Primary</option><option>Leadership</option></select></div>
            <div class="field"><label>Experience (yrs)</label><input id="s_exp" type="number" value="3"></div>
          </div>
          <div class="grid-2">
            <div class="field"><label>Location</label><input id="s_loc" value="Gurgaon"></div>
            <div class="field"><label>Notice</label><input id="s_notice" value="30 days"></div>
          </div>
          <div class="grid-2">
            <div class="field"><label>Current CTC (₹k)</label><input id="s_cur" type="number" value="30"></div>
            <div class="field"><label>Expected CTC (₹k)</label><input id="s_exp_ctc" type="number" value="40"></div>
          </div>
          <button class="btn primary sm" data-act="addcand">＋ Add to Knowledge Graph</button>
          <p class="muted" style="font-size:11px;margin-top:8px">New candidates flow straight into Match, Screening & Verification — one shared record.</p>
        </div>
      </div>
    </div>`;
  }

  function reqPicker(){
    return `<div class="card pad" style="margin-bottom:14px"><div class="h-sec">Requirement</div>
      <div class="grid-2">${S.get().requirements.map(r=>`<div class="reqc ${App.selReq===r.id?'sel':''}" data-act="selreq" data-req="${r.id}">
        <div class="row-between"><div class="role">${r.role}</div><span class="urg ${r.urgency}">${r.urgency}</span></div>
        <div class="rm">${S.school(r.schoolId).name} · ${r.loc} · ${money(r.band[0]*1000)}–${money(r.band[1]*1000)}</div></div>`).join('')}</div></div>`;
  }

  function vMatch(){
    const r = S.req(App.selReq); const list = S.matchFor(App.selReq);
    return reqPicker() + `<div class="row-between"><div class="h-sec" style="margin:0">Ranked matches for <b style="color:var(--ink)">${r.role}</b> · hybrid fit + predicted retention</div><button class="btn ghost sm" data-act="screenall" data-req="${r.id}">🤖 Auto-screen all</button></div><div class="spacer" style="height:8px"></div>
    ${list.length? list.map(x=>{
      const c=x.c;
      return `<div class="crow" data-cand="${c.id}">
        ${av(c)}
        <div style="flex:1">
          <div class="nm">${c.name} ${trustBadge(c.trust)} ${c.screening?`<span class="st ${stClass(c.status)}">${c.status}</span>`:''}</div>
          <div class="meta">${c.qual} · ${c.exp} yrs · ${c.loc} · exp ₹${c.exp_ctc}k</div>
          <div style="display:flex;gap:14px;margin-top:7px;flex-wrap:wrap">
            <div><div class="muted" style="font-size:10px;font-weight:700">FIT</div><div class="dual">${bar(x.fit,'#12a58c')}<b style="font-size:12px">${x.fit}</b></div></div>
            <div><div class="muted" style="font-size:10px;font-weight:700">STAY</div><div class="dual">${bar(x.stay, x.stay>65?'#3f9d5b':'#e8a13a')}<b style="font-size:12px">${x.stay}</b></div></div>
            <div style="font-size:11px;color:var(--slate);max-width:280px"><b class="muted">Why:</b> ${x.reasons.join(' · ')||'partial'} ${x.risk>45?`<br><b style="color:#c0603a">Risk:</b> ${x.riskFactors[0]}`:''}</div>
          </div>
        </div>
        <div class="right">
          ${ring(x.overall, x.overall>=70?'#12a58c':x.overall>=50?'#3d7bd6':'#e8a13a')}
          <div class="muted" style="font-size:9px;font-weight:800">SMART SCORE</div>
          <div style="display:flex;gap:5px;margin-top:3px">
            <button class="btn primary tiny" data-act="screen" data-id="${c.id}" data-req="${r.id}" ${c.screening?'disabled':''}>🤖 Screen</button>
            <button class="btn ghost tiny" data-act="place" data-id="${c.id}" data-req="${r.id}">🎓 Place</button>
          </div>
        </div>
      </div>`;}).join('') : `<div class="empty">No matches ≥35% for this requirement in the current pool.</div>`}`;
  }

  function vScreen(){
    const r=S.req(App.selReq); const list=S.matchFor(App.selReq); const k=S.kpis();
    return reqPicker() + `<div class="grid-4"><div class="grid-2" style="grid-column:1/3;display:contents">
      ${kpi('🤖',k.callsAutomated,'Calls automated')}${kpi('⏱️',k.hoursSaved+'h','Hours saved')}${kpi('✅',k.ready,'Interview-ready')}${kpi('👍',S.get().candidates.filter(c=>c.status===S.STATUS.INTERESTED).length,'Interested')}
    </div></div><div class="spacer"></div>
    <div class="row-between"><div class="h-sec" style="margin:0">KeyScreen queue · ${r.role}</div><button class="btn ghost sm" data-act="screenall" data-req="${r.id}">🤖 Auto-screen entire pool</button></div><div class="spacer" style="height:8px"></div>
    ${list.map(x=>{const c=x.c;return `<div class="crow" data-cand="${c.id}">${av(c)}<div style="flex:1"><div class="nm">${c.name} ${c.screening?`<span class="st ${stClass(c.status)}">${c.status}</span>`:''}</div><div class="meta">${c.subject} · ${c.exp} yrs · fit ${x.fit} · exp ₹${c.exp_ctc}k</div>${c.screening?`<div style="font-size:11px;color:var(--teal-d);margin-top:4px">${c.screening.verdict}</div>`:''}</div><div class="right"><button class="btn primary tiny" data-act="screen" data-id="${c.id}" data-req="${r.id}" ${c.screening?'disabled':''}>${c.screening?'✓ Screened':'🤖 AI Screen'}</button></div></div>`;}).join('')}`;
  }

  function vVerify(){
    const cs=S.get().candidates; const k=S.kpis();
    const tiers=[{t:0,name:'Self-declared — needs verification'},{t:1,name:'Document-verified'},{t:2,name:'Blockchain-verified (DigiLocker/AICTE)'}];
    return `<div class="grid-4">${kpi('🔒',k.verifiedPct+'%','Pool verified')}${kpi('⛓',cs.filter(c=>c.trust===2).length,'Blockchain-verified')}${kpi('✔',cs.filter(c=>c.trust===1).length,'Document-verified')}${kpi('◔',cs.filter(c=>c.trust===0).length,'Awaiting verification')}</div><div class="spacer"></div>
    <div class="card pad" style="margin-bottom:12px"><div class="row-between"><div><b>Trust Layer</b> — verify once, reuse across Match, Screening &amp; the School Portal. Tiered badges solve the Model-3 verification question.</div><button class="btn ghost sm" data-act="verifyAllDoc" style="flex-shrink:0">✔ Verify all pending</button></div></div>
    ${tiers.map(g=>{const grp=cs.filter(c=>c.trust===g.t); if(!grp.length)return ''; return `<div class="h-sec">${trustBadge(g.t)} &nbsp; ${g.name} <span class="muted" style="text-transform:none;font-weight:600">(${grp.length})</span></div>
      ${grp.map(c=>crow(c, `<div style="display:flex;gap:5px">${c.trust<1?`<button class="btn line tiny" data-act="verify" data-id="${c.id}" data-tier="1">✔ Doc verify</button>`:''}${c.trust<2?`<button class="btn ghost tiny" data-act="verify" data-id="${c.id}" data-tier="2">⛓ Blockchain</button>`:'<span class="tag">fully verified</span>'}</div>`)).join('')}<div class="spacer"></div>`;}).join('')}`;
  }

  function vPortal(){
    const q=App.portalQ; const parsed=parseQuery(q);
    const pool=S.get().candidates.filter(c=>c.trust>=1 && c.consent && c.status!==S.STATUS.PLACED);
    let results=pool.map(c=>({c,score:portalScore(c,parsed)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
    if(!q) results=pool.map(c=>({c,score:60})); // show verified pool by default
    return `<div class="card pad" style="background:linear-gradient(120deg,#0f2620,#12a58c);color:#fff;border:0;margin-bottom:14px">
      <div style="font-weight:800;font-size:16px">🏫 School Self-Service Portal <span style="opacity:.7;font-weight:500;font-size:12px">· Model 3 · subscription</span></div>
      <div style="opacity:.9;font-size:13px;margin-top:4px">Search the verified, consented teacher pool in plain English. Powered by the same Match + Verification engine.</div>
    </div>
    <div class="card pad" style="margin-bottom:14px">
      <div style="display:flex;gap:8px;flex-wrap:wrap"><input id="portalInput" value="${q.replace(/"/g,'&quot;')}" placeholder='e.g. "CBSE PGT Physics in Gurgaon under 60k"' style="flex:1;min-width:220px;border:1px solid var(--line);border-radius:10px;padding:10px 12px;font-size:13px;outline:none"><button class="btn primary sm" data-act="portalSearch">Search</button></div>
      <div style="margin-top:9px;display:flex;gap:6px;flex-wrap:wrap">${['CBSE PGT Physics Gurgaon under 60k','ICSE Mathematics teacher','Primary CTET Delhi','English IB Noida'].map(s=>`<span class="tag" style="cursor:pointer" data-act="portalChip" data-q="${s}">🔎 ${s}</span>`).join('')}</div>
      ${q?`<div class="muted" style="font-size:11.5px;margin-top:8px">Parsed → ${[parsed.subject&&'subject: '+parsed.subject,parsed.board&&'board: '+parsed.board,parsed.loc&&'location: '+parsed.loc,parsed.budget&&'budget ≤ ₹'+parsed.budget+'k'].filter(Boolean).join(' · ')||'free search'}</div>`:''}
    </div>
    <div class="h-sec">${results.length} verified teacher${results.length!==1?'s':''} available</div>
    ${results.length? results.map(x=>{const c=x.c;return `<div class="crow" data-cand="${c.id}">${av(c)}<div style="flex:1"><div class="nm">${c.name} ${trustBadge(c.trust)}</div><div class="meta">${c.qual} · ${c.subject} · ${c.exp} yrs · ${c.loc} · expects ₹${c.exp_ctc}k</div></div><div class="right">${ring(x.score,'#12a58c')}<div style="display:flex;gap:5px;margin-top:3px"><button class="btn primary tiny" data-act="screen" data-id="${c.id}" data-req="${bestReqFor(c)}">🤖 Screen</button></div></div></div>`;}).join('') : `<div class="empty">No verified teachers match. Try a broader search.</div>`}`;
  }

  function vCandidates(){
    const all=S.get().candidates;
    let cs=all;
    if(App.search){ const q=App.search.toLowerCase(); cs=cs.filter(c=>(c.name+c.subject+c.loc+c.qual).toLowerCase().includes(q)); }
    if(App.gfilter && App.gfilter!=='All') cs=cs.filter(c=>c.status===App.gfilter);
    const chips=['All',S.STATUS.NEW,S.STATUS.SOURCED,S.STATUS.INTERESTED,S.STATUS.READY,S.STATUS.PLACED];
    return `<div class="card pad" style="margin-bottom:12px"><b>🧠 Candidate Knowledge Graph</b> — the single shared record every module reads &amp; writes. Click any teacher for their 360° node.</div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">${chips.map(s=>{const n=s==='All'?all.length:all.filter(c=>c.status===s).length;return `<span class="tag" style="cursor:pointer;${App.gfilter===s?'background:var(--teal);color:#fff;border-color:var(--teal)':''}" data-act="gfilter" data-status="${s}">${s} · ${n}</span>`;}).join('')}</div>
    <div class="h-sec">${cs.length} candidate node${cs.length!==1?'s':''}${App.gfilter!=='All'?' · '+App.gfilter:''}</div>
    ${cs.map(c=>crow(c, `<span class="muted" style="font-size:11px">${c.timeline.length} events</span>`)).join('') || `<div class="empty">No candidates match this filter.</div>`}`;
  }

  function vSettings(){
    const cfg = window.Integrations ? window.Integrations.get() : {live:false,urls:{}};
    const fields = [
      ['outreach','📲 Outreach — WhatsApp / voice re-engage'],
      ['screen','🤖 AI Screening — OpenAI + voice/WhatsApp call'],
      ['verify','🔒 Verification — KYC / DigiLocker / blockchain'],
      ['place','🎓 Placement — invoice (Razorpay) + onboarding'],
      ['candidate','📄 New candidate — resume parse + enrich']
    ];
    const steps = [
      ['1','Structured profile ready','The candidate already has a parsed record — subject, experience, board, current &amp; expected CTC, notice, location.'],
      ['2','AI runs the conversation','“Maya” asks the same 7 questions every time (interest, CTC, notice, location, board, availability) over voice or WhatsApp.'],
      ['3','Speech → structured fields','Answers are converted to fields and written straight to the candidate record — no Excel, no re-typing.'],
      ['4','Auto-tag &amp; route','The outcome is auto-tagged — Interview-Ready, Interested, Call-Back, Not-Interested — and the pipeline + KPIs update instantly.']
    ];
    return `<div class="card pad ai-glow" style="margin-bottom:14px;background:linear-gradient(120deg,rgba(18,165,140,.10),rgba(61,123,214,.06))">
      <div class="row-between"><div><b>🧠 AI Engine — OpenAI</b><div class="muted" style="font-size:12.5px;margin-top:4px">Screening, matching &amp; résumé parsing run through a secure serverless endpoint (<code style="background:#eef3f1;padding:1px 5px;border-radius:5px">/api/ai</code>). Your key lives in Vercel, never in this app.</div></div>
        <span class="st st-Placed" style="flex-shrink:0">● Connected</span></div>
    </div>
    <div class="card pad" style="margin-bottom:14px">
      <div class="h-sec" style="margin-bottom:10px">How AI screening works</div>
      <div style="display:grid;gap:10px">
        ${steps.map(([n,t,d])=>`<div style="display:flex;gap:12px;align-items:flex-start"><span style="width:24px;height:24px;border-radius:50%;background:var(--teal);color:#fff;display:grid;place-items:center;font-weight:800;font-size:12px;flex-shrink:0">${n}</span><div><div style="font-weight:700;font-size:13px">${t}</div><div class="muted" style="font-size:12px;margin-top:2px">${d}</div></div></div>`).join('')}
      </div>
      <div class="callout" style="margin-top:12px;background:#fff8ec;border:1px solid #f0dcae;border-radius:12px;padding:10px 12px;font-size:12px;color:#7a5a1c">In this demo, screening plays a deterministic script so it never fails. In production the <b>same flow</b> calls OpenAI live and, optionally, a voice/WhatsApp provider via the webhooks below.</div>
    </div>
    <div class="card pad">
      <div style="margin-bottom:10px"><b>⚙️ Optional automation webhooks (n8n)</b><div class="muted" style="font-size:12px;margin-top:4px">For the deeper actions — WhatsApp/voice outreach, KYC verification, invoicing — paste n8n webhook URLs and flip <b>Live mode</b> on. Keys stay in n8n. Leave OFF for the demo. <span class="st ${cfg.live?'st-Placed':'st-New'}">${cfg.live?'● LIVE MODE ON':'○ Demo mode'}</span></div></div>
      <div class="row-between" style="margin-bottom:12px">
        <div class="h-sec" style="margin:0">Webhook endpoints</div>
        <label style="display:flex;gap:8px;align-items:center;font-size:12.5px;font-weight:700;cursor:pointer"><input type="checkbox" id="liveToggle" ${cfg.live?'checked':''}> Live mode</label>
      </div>
      ${fields.map(([k,label])=>`<div class="field"><label>${label}</label><div style="display:flex;gap:6px"><input id="wh_${k}" value="${(cfg.urls[k]||'').replace(/"/g,'&quot;')}" placeholder="https://your-n8n.app/webhook/${k}"><button class="btn line sm" data-act="testWebhook" data-ev="${k}">Test</button></div></div>`).join('')}
      <button class="btn primary sm" data-act="saveIntegrations">💾 Save integrations</button>
      <p class="muted" style="font-size:11.5px;margin-top:10px">Full setup, payloads &amp; where to paste AI keys → <b>docs/N8N_INTEGRATION.md</b> in the repo.</p>
    </div>`;
  }

  /* ---------- Portal search helpers ---------- */
  function parseQuery(q){
    q=(q||'').toLowerCase();
    const subjMap={maths:'Mathematics',math:'Mathematics',mathematics:'Mathematics',physics:'Physics',english:'English',primary:'Primary',leadership:'Leadership'};
    const subject=Object.keys(subjMap).find(k=>q.includes(k));
    const board=['cbse','icse','ib'].find(k=>q.includes(k));
    const loc=['gurgaon','delhi','noida','faridabad'].find(k=>q.includes(k));
    const bm=q.match(/(\d{2,3})\s*k/)||q.match(/under\s*(\d{2,3})/)||q.match(/(\d{2,3})/);
    return {subject:subject?subjMap[subject]:null, board:board?board.toUpperCase():null, loc:loc?cap(loc):null, budget:bm?+bm[1]:null};
  }
  function portalScore(c,p){
    let s=0;
    if(p.subject){ if(c.subject===p.subject)s+=50; else return 0; } else s+=25;
    if(p.board){ if(c.boards.includes(p.board))s+=18; }
    if(p.loc){ if(c.loc===p.loc)s+=18; }
    if(p.budget){ if(c.exp_ctc<=p.budget)s+=14; else s-=10; }
    s+= c.trust*4;
    return Math.max(0,Math.min(99,s+20));
  }
  function bestReqFor(c){
    let best=openReqs()[0]; let bs=-1;
    openReqs().forEach(r=>{const sc=S.smart(c,r).overall; if(sc>bs){bs=sc;best=r;}});
    return best? best.id : S.get().requirements[0].id;
  }

  /* ================= DRAWER (Candidate 360) ================= */
  function openCand(id){ App.drawerId=id; renderDrawer(); $('drawerBg').classList.add('on'); $('drawer').classList.add('on'); }
  function closeDrawer(){ App.drawerId=null; $('drawerBg').classList.remove('on'); $('drawer').classList.remove('on'); }
  function renderDrawer(){
    const c=S.cand(App.drawerId); if(!c) return;
    const matches=openReqs().map(r=>({r,...S.smart(c,r)})).sort((a,b)=>b.overall-a.overall).slice(0,3);
    const best=matches[0];
    $('drawerHead').innerHTML=`<span class="x" data-act="closeDrawer">✕</span>
      <div style="display:flex;gap:12px;align-items:center">${av(c)}<div><div style="font-weight:800;font-size:17px">${c.name}</div><div style="font-size:12px;opacity:.9">${c.qual}</div></div></div>
      <div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap"><span class="st ${stClass(c.status)}">${c.status}</span>${trustBadge(c.trust)}${c.consent?'':'<span class="trust trust0" style="background:#5a2b2b;color:#ffd">no consent</span>'}</div>`;
    $('drawerBody').innerHTML=`
      <div class="sect"><h5>Snapshot</h5>
        <div class="kv"><span class="muted">Subject</span><b>${c.subject}</b></div>
        <div class="kv"><span class="muted">Experience</span><b>${c.exp} yrs</b></div>
        <div class="kv"><span class="muted">Boards</span><b>${c.boards.join(', ')}</b></div>
        <div class="kv"><span class="muted">Location</span><b>${c.loc}</b></div>
        <div class="kv"><span class="muted">Current / Expected</span><b>₹${c.cur}k → ₹${c.exp_ctc}k</b></div>
        <div class="kv"><span class="muted">Notice</span><b>${c.notice}</b></div>
        <div class="kv"><span class="muted">Source</span><b>${c.source}</b></div>
      </div>
      <div class="sect"><h5>Best-fit open requirements</h5>
        ${matches.map(m=>`<div class="kv"><span>${m.r.role} <span class="muted">· ${S.school(m.r.schoolId).name}</span></span><b style="color:var(--teal-d)">${m.overall}</b></div>`).join('')||'<div class="muted">No open requirements.</div>'}
      </div>
      ${c.screening?`<div class="sect"><h5>Screening result</h5><div style="font-size:12.5px">${c.screening.verdict}</div></div>`:''}
      ${c.retention?`<div class="sect"><h5>Retention prediction</h5><div class="dual" style="margin-bottom:6px">${bar(c.retention.risk,c.retention.risk>50?'#e05b5b':'#e8a13a')}<b>${c.retention.risk}% risk</b></div><div class="muted" style="font-size:11.5px">${c.retention.factors.join(' · ')}</div></div>`:''}
      <div class="sect"><h5>Actions</h5>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn ghost tiny" data-act="reengage" data-id="${c.id}">📲 Re-engage</button>
          <button class="btn line tiny" data-act="aiMsg" data-id="${c.id}" data-role="${best?best.r.role:'teaching'}">✨ AI outreach</button>
          ${best?`<button class="btn primary tiny" data-act="screen" data-id="${c.id}" data-req="${best.r.id}" ${c.screening?'disabled':''}>🤖 Screen for ${best.r.role}</button>`:''}
          ${c.trust<2?`<button class="btn line tiny" data-act="verify" data-id="${c.id}" data-tier="${c.trust+1}">${c.trust<1?'✔ Doc verify':'⛓ Blockchain verify'}</button>`:''}
          ${best && c.status!==S.STATUS.PLACED?`<button class="btn line tiny" data-act="place" data-id="${c.id}" data-req="${best.r.id}">🎓 Place at ${S.school(best.r.schoolId).name.split(',')[0]}</button>`:''}
          <button class="btn ${c.consent?'danger':'ghost'} tiny" data-act="consent" data-id="${c.id}" data-val="${c.consent?0:1}">${c.consent?'Revoke consent':'Grant consent'}</button>
        </div>
      </div>
      <div class="sect"><h5>Timeline · ${c.timeline.length} events</h5><ul class="tl">${c.timeline.map(e=>`<li>${e.e}<div class="tm">${timeago(e.t)}</div></li>`).join('')}</ul></div>`;
  }

  /* ================= SCREENING MODAL ================= */
  function screenModal(id,reqId){
    const c=S.cand(id), r=S.req(reqId); if(!c||!r)return;
    const lines=S.transcript(c,r);
    $('mName').textContent=c.name; $('mRole').textContent='KeyScreen AI · '+r.role;
    $('mBody').innerHTML=''; $('mVerdict').textContent=''; $('overlay').classList.add('on');
    let k=0;
    (function step(){
      if(k<lines.length){
        const [who,txt]=lines[k]; const d=document.createElement('div'); d.className='msg '+who;
        d.innerHTML=`<div class="w">${who==='ai'?'🤖 Maya':'👤 '+c.name.split(' ')[0]}</div><div class="bub">${txt}</div>`;
        $('mBody').appendChild(d); $('mBody').scrollTop=$('mBody').scrollHeight; k++; setTimeout(step,560);
      } else {
        const o=S.commitScreen(id,reqId);
        $('mVerdict').innerHTML=`<span style="color:var(--teal-d)">Auto-tagged:</span> ${o.verdict}`;
      }
    })();
  }

  /* ================= ROUTER + RENDER ================= */
  const TITLES={dashboard:['Dashboard','Founder cockpit · live from the shared data core'],
    requirements:['Requirements','Open school vacancies'],
    sourcing:['Sourcing','Always-on outreach & pool building'],
    match:['Match','Hybrid AI matching · fit + predicted retention'],
    screen:['KeyScreen','Autonomous AI voice/WhatsApp screening'],
    verify:['Verification','The Trust Layer · verify once, reuse everywhere'],
    portal:['School Portal','Self-service verified pool · Model 3'],
    candidates:['Knowledge Graph','Every candidate node, shared across modules'],
    settings:['Integrations','Connect n8n webhooks + AI to make it real']};
  function setView(v){ App.view=v; document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('active',a.dataset.view===v)); $('side').classList.remove('on'); render(); }
  function animateNum(el, from, to, pre, suf, dec){
    const start=performance.now(), dur=650;
    (function f(now){ const p=Math.min(1,(now-start)/dur); const v=from+(to-from)*(1-Math.pow(1-p,3));
      el.textContent=pre+(dec?v.toFixed(1):Math.round(v).toLocaleString('en-IN'))+suf;
      if(p<1) requestAnimationFrame(f);
    })(performance.now());
  }
  const _kpiPrev={};
  function animateKpis(){
    document.querySelectorAll('#view .kpi').forEach(box=>{
      const nEl=box.querySelector('.n'), lEl=box.querySelector('.l'); if(!nEl||!lEl) return;
      const label=lEl.textContent.trim();
      const m=nEl.textContent.match(/^([^\d-]*)([\d.,]+)(.*)$/); if(!m) return;
      const pre=m[1], numStr=m[2], suf=m[3], dec=numStr.indexOf('.')>=0;
      const to=parseFloat(numStr.replace(/,/g,'')); if(isNaN(to)) return;
      const from=(label in _kpiPrev)?_kpiPrev[label]:0; _kpiPrev[label]=to;
      if(from!==to) animateNum(nEl, from, to, pre, suf, dec);
    });
  }
  function render(){
    const [t,c]=TITLES[App.view]||TITLES.dashboard; $('viewTitle').textContent=t; $('viewCrumb').textContent=c;
    $('pip-open').textContent=S.kpis().activeReqs;
    const map={dashboard:vDashboard,requirements:vRequirements,sourcing:vSourcing,match:vMatch,screen:vScreen,verify:vVerify,portal:vPortal,candidates:vCandidates,settings:vSettings};
    const host=$('view');
    const changed = render._rv !== App.view; render._rv = App.view;
    host.innerHTML=(map[App.view]||vDashboard)();
    if(changed){ host.classList.remove('enter'); void host.offsetWidth; host.classList.add('enter'); }
    if(App.view==='dashboard') requestAnimationFrame(animateKpis);
    if(App.drawerId && $('drawer').classList.contains('on')) renderDrawer();
  }

  /* ================= EVENTS ================= */
  document.addEventListener('click', e=>{
    const nav=e.target.closest('.nav a'); if(nav){ setView(nav.dataset.view); return; }
    const a=e.target.closest('[data-act]');
    if(a){ handleAct(a); return; }
    const c=e.target.closest('[data-cand]'); if(c){ openCand(c.dataset.cand); }
  });
  function val(id){ const el=$(id); return el?el.value.trim():''; }
  function handleAct(el){
    const act=el.dataset.act, id=el.dataset.id, reqId=el.dataset.req;
    switch(act){
      case 'closeDrawer': closeDrawer(); break;
      case 'reset': S.reset(); toast('Demo reset to seed data'); render(); break;
      case 'selreq': App.selReq=reqId; render(); break;
      case 'openMatch': App.selReq=reqId; setView('match'); break;
      case 'toggleReqForm': { const f=$('reqForm'); f.style.display=f.style.display==='none'?'block':'none'; break; }
      case 'screen': screenModal(id,reqId); break;
      case 'screenall': { const list=S.matchFor(reqId); let n=0; list.forEach(x=>{ if(!x.c.screening){ S.commitScreen(x.c.id,reqId); n++; } }); toast(`🤖 Auto-screened ${n} candidates`); break; }
      case 'place': S.place(id,reqId); confetti(); toast('🎓 Placed — invoice auto-raised & retention scored'); break;
      case 'verify': S.verify(id,+el.dataset.tier); toast('🔒 Verification updated across all modules'); break;
      case 'reengage': S.sourceReengage(id); toast('📲 Re-engaged via WhatsApp'); break;
      case 'consent': S.setConsent(id, el.dataset.val==='1'); toast('Consent updated'); break;
      case 'addcand': {
        const name=val('s_name'); if(!name){ toast('Enter a name'); return; }
        S.addCandidate({name, subject:val('s_subject'), exp:+val('s_exp')||0, loc:val('s_loc')||'Gurgaon', notice:val('s_notice')||'30 days',
          cur:+val('s_cur')||0, exp_ctc:+val('s_exp_ctc')||0, qual:val('s_subject')+' teacher', boards:['CBSE'],
          skills:[val('s_subject').toLowerCase(),'b.ed'], source:'Manual'});
        toast('✅ Added to the Knowledge Graph'); setView('candidates'); break;
      }
      case 'addreq': {
        const role=val('q_role'); if(!role){ toast('Enter a role'); return; }
        const band=+val('q_band')||45; const st=S.get();
        st.requirements.push({id:'r'+(st.requirements.length+1)+Math.random().toString(36).slice(2,4), role, schoolId:st.schools[0].id,
          board:val('q_board'), grade:'—', loc:val('q_loc')||'Gurgaon', band:[Math.round(band*0.7),band], minExp:+val('q_exp')||2,
          subject:val('q_subject'), urgency:'Medium', status:'open', must:[val('q_subject'),val('q_board')], skills:[val('q_subject').toLowerCase(),'b.ed']});
        S.emit(); toast('📋 Requirement created'); break;
      }
      case 'portalSearch': App.portalQ=val('portalInput'); render(); break;
      case 'portalChip': App.portalQ=el.dataset.q; render(); break;
      case 'startDemo': startDemo(); break;
      case 'stopDemo': stopDemo(); break;
      case 'beginWalk': beginWalk(); break;
      case 'skipToResults': skipToResults(); break;
      case 'closeStory': hideStory(); break;
      case 'loadSample': { const ta=$('resumeText'); if(ta) ta.value=SAMPLE_RESUMES[+el.dataset.i]||''; break; }
      case 'aiParse': {
        const txt=val('resumeText'); if(!txt){ toast('Paste a résumé (or pick a sample) first'); break; }
        el.disabled=true; el.textContent='✨ AI is reading…'; toast('✨ AI is reading the résumé…');
        window.Integrations.ai('parse', txt).then(res=>{
          let obj=null;
          if(res.ok){ try{ obj=JSON.parse((res.text||'').replace(/```json|```/g,'').trim()); }catch(e){} }
          if(obj && obj.name){
            obj.source='AI Parsed'; obj.boards=obj.boards||['CBSE']; obj.skills=obj.skills||[]; obj.qual=obj.qual||((obj.subject||'')+' teacher');
            App.parsePreview={obj, live:true};
          } else {
            const nm=(txt.split(/[\n,—-]/)[0]||'New Candidate').trim().slice(0,40);
            App.parsePreview={obj:{name:nm, subject:'Physics', exp:2, loc:'Gurgaon', cur:25, exp_ctc:32, notice:'30 days', qual:'Teacher', boards:['CBSE'], skills:['b.ed'], source:'Manual'}, live:false, reason:res.reason};
          }
          render();
        });
        break;
      }
      case 'confirmParse': {
        if(App.parsePreview){ const nm=App.parsePreview.obj.name; S.addCandidate(App.parsePreview.obj); App.parsePreview=null; toast('✅ '+nm+' added to the Knowledge Graph'); setView('candidates'); }
        break;
      }
      case 'discardParse': { App.parsePreview=null; render(); break; }
      case 'goView': setView(el.dataset.view); break;
      case 'verifyAllDoc': {
        let n=0; S.get().candidates.forEach(c=>{ if(c.trust===0 && c.status!==S.STATUS.PLACED){ S.verify(c.id,1); n++; } });
        toast(n?`✔ Document-verified ${n} candidates`:'None pending'); break;
      }
      case 'gfilter': { App.gfilter=el.dataset.status||'All'; render(); break; }
      case 'aiMsg': {
        const c=S.cand(id); if(!c) break;
        $('mName').textContent='AI outreach — '+c.name; $('mRole').textContent='Personalised live by Claude';
        $('mBody').innerHTML='<div class="msg ai"><div class="w">🤖 Maya</div><div class="bub">✨ Writing a message…</div></div>';
        $('mVerdict').textContent=''; $('overlay').classList.add('on');
        window.Integrations.ai('outreach', {name:c.name, role:el.dataset.role||'teaching'}).then(res=>{
          const msg = res.ok ? res.text : `Hi ${c.name.split(' ')[0]}! 👋 This is Edukey360. We have a ${el.dataset.role||'teaching'} opening that fits your profile (${c.qual}). Are you open to it? Reply YES and we'll schedule your interview. 🎓`;
          $('mBody').innerHTML=`<div class="wa" style="white-space:pre-wrap;background:#f7faf9;border:1px dashed var(--teal);border-radius:12px;padding:12px;font-size:13px">${msg}</div>`;
          $('mVerdict').innerHTML = res.ok ? '<span style="color:var(--teal-d)">✍️ Written live by Claude</span>' : (res.reason==='no-key'?'Template shown — add ANTHROPIC_API_KEY in Vercel for live AI':'Template shown — AI unavailable');
        });
        break;
      }
      case 'saveIntegrations': {
        if(window.Integrations){ ['outreach','screen','verify','place','candidate'].forEach(k=>window.Integrations.setUrl(k, val('wh_'+k))); const lt=$('liveToggle'); window.Integrations.setLive(lt && lt.checked); }
        toast('✅ Integrations saved'); render(); break;
      }
      case 'testWebhook': {
        const ev=el.dataset.ev, u=val('wh_'+ev);
        if(!u){ toast('Enter a webhook URL first'); break; }
        fetch(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:ev,test:true,source:'edukey360-os',ts:Date.now()})})
          .then(()=>toast('📡 Test payload sent to the '+ev+' webhook'))
          .catch(()=>toast('⚠ Could not reach webhook — check the URL / n8n CORS'));
        break;
      }
    }
  }

  /* ================= GUIDED DEMO ("Play") — 3-act story ================= */
  const DEMO = [
    { say:"Meet the Edukey360 OS — one system on a single shared Knowledge Graph. Watch it fill a real vacancy end-to-end, hands-free.", run:()=>{ S.reset(); setView('dashboard'); }, wait:3200 },
    { say:"Step 1 · Sourcing. Instead of manual dialing, the AI re-engages a teacher from the pool over WhatsApp.", run:()=>{ setView('sourcing'); }, wait:2400 },
    { run:()=>{ S.sourceReengage('c1'); }, wait:1900 },
    { say:"Step 2 · Match. It ranks by Fit + predicted Stay, with plain-English reasons — Ananya tops PGT Physics.", run:()=>{ App.selReq='r1'; setView('match'); }, wait:3500 },
    { say:"Step 3 · KeyScreen. An adaptive AI voice call collects every detail and auto-tags the outcome — no telecaller, no script fatigue.", run:()=>{ screenModal('c1','r1'); }, wait:7000 },
    { run:()=>{ $('overlay').classList.remove('on'); }, wait:800 },
    { say:"Step 4 · Verification. Instant, reusable trust — one blockchain-verified badge, trusted across every module.", run:()=>{ setView('verify'); S.verify('c1',2); }, wait:3300 },
    { say:"Step 5 · Place. The vacancy fills, an invoice auto-raises, and the system predicts this teacher's retention risk.", run:()=>{ S.place('c1','r1'); confetti(); }, wait:3300 },
    { say:"And it never stops at one — KeyScreen clears the entire shortlist in seconds.", run:()=>{ App.selReq='r1'; setView('screen'); S.matchFor('r1').forEach(x=>{ if(!x.c.screening) S.commitScreen(x.c.id,'r1'); }); }, wait:3400 },
    { say:"That was a full week of manual calling — done in a minute. Here's what your team just got back.", run:()=>{ setView('dashboard'); }, wait:3200 },
    { run:()=>{ hideCoach(); showFinale(); }, last:true, wait:0 }
  ];
  let demoOn=false, demoIdx=0, demoTimer=null, lastSay='';
  const STEPS = DEMO.filter(s=>s.say).length;
  function setCoach(){
    const shown = DEMO.slice(0,demoIdx+1).filter(s=>s.say).length;
    const pct = Math.round(Math.min(shown,STEPS)/STEPS*100);
    $('coach').innerHTML = `<div class="txt"><div class="step">GUIDED DEMO · STEP ${Math.min(shown,STEPS)} / ${STEPS}</div><div class="say">${lastSay}</div><div class="prog"><i style="width:${pct}%"></i></div></div>
      <div class="btns"><button class="stop" data-act="stopDemo">Stop</button></div>`;
  }
  function hideCoach(){ $('coach').classList.remove('on'); }
  function stepDemo(){
    if(!demoOn) return;
    if(demoIdx>=DEMO.length){ demoOn=false; return; }
    const s=DEMO[demoIdx];
    if(s.say) lastSay=s.say;
    if(!s.last){ $('coach').classList.add('on'); setCoach(); }
    try{ s.run && s.run(); }catch(e){}
    const w=s.wait||2200; demoIdx++;
    if(!s.last) demoTimer=setTimeout(stepDemo, w);
  }
  function startDemo(){ stopDemo(); showIntro(); }
  function beginWalk(){ hideStory(); demoOn=true; demoIdx=0; lastSay=''; stepDemo(); }
  function skipToResults(){
    hideStory(); demoOn=false; clearTimeout(demoTimer);
    S.reset(); S.sourceReengage('c1'); S.commitScreen('c1','r1'); S.verify('c1',2); S.place('c1','r1');
    S.matchFor('r1').forEach(x=>{ if(!x.c.screening) S.commitScreen(x.c.id,'r1'); });
    setView('dashboard'); showFinale();
  }
  function stopDemo(){ demoOn=false; clearTimeout(demoTimer); hideCoach(); $('overlay').classList.remove('on'); hideStory(); }
  function hideStory(){ $('storyIntro').classList.remove('on'); $('storyFinale').classList.remove('on'); }

  function showIntro(){
    $('storyIntro').innerHTML = `<div class="inner">
      <div class="eyebrow">Edukey360 · powered by NEWVORA</div>
      <h2>A week in your recruitment team — today</h2>
      <p class="sub">This is the work quietly draining your people, every single day:</p>
      <ul class="pains">
        <li><span class="x">📞</span> 40–50 screening calls per recruiter, every single day</li>
        <li><span class="x">🔁</span> The same 7 questions, asked hundreds of times over</li>
        <li><span class="x">📋</span> Manual trackers, human errors, missed follow-ups</li>
        <li><span class="x">👻</span> Great teachers who ghost — discovered far too late</li>
      </ul>
      <div class="cta">
        <button class="go" data-act="beginWalk">▶ Show me the other way</button>
        <button class="skip" data-act="skipToResults">Skip to the results</button>
      </div>
    </div>`;
    $('storyIntro').classList.add('on');
  }

  function showFinale(){
    const k=S.kpis(); const calls=k.callsAutomated||0, hours=k.hoursSaved||0, rev=k.revenue||0;
    const monthly=Math.max(1, Math.round(hours*25));
    $('storyFinale').innerHTML = `<div class="inner">
      <div class="eyebrow">The result</div>
      <h2>Your team just got its time back</h2>
      <p class="sub">One vacancy — sourced, screened, verified, placed and billed — with almost no human effort.</p>
      <div class="tiles">
        <div class="tile"><div class="n" data-to="${calls}" data-dur="1100">0</div><div class="l">screening calls automated</div></div>
        <div class="tile"><div class="n" data-to="${hours}" data-dur="1200" data-dec="1" data-suf="h">0</div><div class="l">recruiter-hours saved</div></div>
        <div class="tile"><div class="n" data-to="${rev}" data-dur="1300" data-pre="₹">0</div><div class="l">auto-billed, zero manual invoicing</div></div>
      </div>
      <div class="proj">📈 At ~25 hires a month, that's ≈ <b>${monthly} recruiter-hours</b> back every month — roughly a full desk freed from dialing, so your team screens smarter and closes more.</div>
      <div class="close-line">No monotony. No repetitive scripts. No manual trackers. No missed follow-ups.<br>Just your team — doing the work only humans can.</div>
      <div class="cta">
        <button class="go" data-act="startDemo">▶ Replay the story</button>
        <button class="skip" data-act="closeStory">Explore the OS</button>
      </div>
    </div>`;
    $('storyFinale').classList.add('on');
    confetti();
    document.querySelectorAll('#storyFinale [data-to]').forEach(countUp);
  }

  function countUp(el){
    const to=+el.dataset.to, dur=+(el.dataset.dur||1100), dec=el.dataset.dec==='1', pre=el.dataset.pre||'', suf=el.dataset.suf||'';
    const start=performance.now();
    (function frame(now){ const p=Math.min(1,(now-start)/dur); const v=to*(1-Math.pow(1-p,3));
      el.textContent=pre+(dec?v.toFixed(1):Math.round(v).toLocaleString('en-IN'))+suf;
      if(p<1) requestAnimationFrame(frame);
    })(performance.now());
  }
  function confetti(){
    const c=$('confetti'); if(!c) return; const cols=['#12a58c','#7fe9d3','#e8a13a','#3d7bd6','#ffffff']; let h='';
    for(let i=0;i<46;i++){ h+=`<i style="left:${(Math.random()*100).toFixed(1)}vw;background:${cols[i%cols.length]};animation-duration:${(2+Math.random()*1.7).toFixed(2)}s;animation-delay:${(Math.random()*0.5).toFixed(2)}s"></i>`; }
    c.innerHTML=h; clearTimeout(c._t); c._t=setTimeout(()=>{ c.innerHTML=''; },3900);
  }
  $('mClose').onclick=()=>$('overlay').classList.remove('on');
  $('overlay').onclick=e=>{ if(e.target===$('overlay'))$('overlay').classList.remove('on'); };
  $('drawerBg').onclick=closeDrawer;
  $('menuBtn').onclick=()=>$('side').classList.toggle('on');
  $('globalSearch').addEventListener('input', e=>{ App.search=e.target.value; if(App.view!=='candidates') setView('candidates'); else render(); });
  { const pb=$('playBtn'); if(pb) pb.onclick=startDemo; }

  S.subscribe(()=>render());
  render();
})();

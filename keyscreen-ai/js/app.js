/* ============================================================
   KeyScreen AI — application logic
   Depends on: data.js (COLORS, REQS, POOL)
   All matching + screening runs client-side on sample data.
   ============================================================ */

let selReq = null, matched = [], stats = {screened:0, calls:0, ready:0};
const $ = id => document.getElementById(id);

function initials(n){ return n.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase(); }
function flash(t){ const f=$('flash'); f.textContent=t; f.classList.add('on'); clearTimeout(f._t); f._t=setTimeout(()=>f.classList.remove('on'),2600); }

/* ---------- MATCH ENGINE (runs live) ---------- */
function scoreCandidate(c, r){
  let s=0, reasons=[];
  if(c.subj===r.subject){ s+=42; reasons.push('subject fit'); }
  else if(r.subject!=='Leadership'){ s+=3; }
  const overlap = c.skills.filter(k=>r.skills.includes(k)).length;
  s += Math.min(overlap*7,28); if(overlap>=3) reasons.push(overlap+' skill matches');
  if(c.exp>=r.minExp){ s+=14; reasons.push(c.exp+' yrs exp'); } else { s+=Math.round(c.exp/r.minExp*8); }
  if(c.boards.includes(r.board)){ s+=9; reasons.push(r.board+' board'); }
  const near = c.loc===r.loc || (r.loc==='Delhi NCR' && ['Delhi','Noida','Gurgaon','Faridabad'].includes(c.loc));
  if(near){ s+=7; reasons.push('local'); }
  if(c.exp_ctc <= r.band[1]*1.1){ s+=6; reasons.push('within salary band'); }
  return {score: Math.max(4, Math.min(Math.round(s),99)), reasons};
}
function scoreColor(s){ return s>=75?'#12a58c':s>=55?'#3d7bd6':s>=40?'#e8a13a':'#e05b5b'; }

/* ---------- SCREENING OUTCOME (auto-tag) ---------- */
function outcome(c, r, score){
  if(c.gone) return {key:'else', label:'Joined Elsewhere', cls:'st-else', col:'no', verdict:'🚪 Already joined another school — auto-archived.'};
  if(c.subj!==r.subject && r.subject!=='Leadership') return {key:'no', label:'Not Interested', cls:'st-no', col:'no', verdict:'❌ Not a subject fit — politely declined.'};
  if(c.exp_ctc > r.band[1]*1.15) return {key:'cb', label:'Call Back', cls:'st-cb', col:'cb', verdict:'💬 Expected CTC above band — flagged for negotiation.'};
  if(score>=70 && c.exp_ctc<=r.band[1]*1.1) return {key:'rdy', label:'Interview Ready', cls:'st-rdy', col:'rdy', verdict:'✅ Qualified & in-band — auto-shortlisted for interview.'};
  return {key:'int', label:'Interested', cls:'st-int', col:'int', verdict:'👍 Interested & relevant — moving forward.'};
}

/* ---------- RENDER REQUIREMENTS ---------- */
function renderReqs(){
  $('reqList').innerHTML = REQS.map(r=>`
    <div class="req ${selReq&&selReq.id===r.id?'active':''}" data-id="${r.id}">
      <div class="r-role">${r.role}</div>
      <div class="r-meta">${r.board} · ${r.grade} · ${r.loc} · ₹${r.band[0]}–${r.band[1]}k/mo</div>
      <div class="r-tags">${r.must.map(m=>`<span class="tag must">${m}</span>`).join('')}</div>
    </div>`).join('');
  document.querySelectorAll('.req').forEach(el=>el.onclick=()=>{
    selReq = REQS.find(x=>x.id===el.dataset.id); renderReqs();
    $('poolHint').textContent = 'Ready — hit “Source & AI-match pool.”';
  });
}

/* ---------- RUN MATCH ---------- */
function runMatch(){
  if(!selReq){ flash('Pick a requirement first ☝️'); return; }
  matched = POOL.map(c=>{ const m=scoreCandidate(c,selReq); return {...c, score:m.score, reasons:m.reasons, screened:false, st:null}; })
    .filter(c=>c.score>=35).sort((a,b)=>b.score-a.score);
  $('poolTitle').textContent = `Candidate Pool — ${selReq.role} (${matched.length} matched)`;
  $('poolHint').textContent = 'AI parsed resumes & ranked by fit ✓';
  $('screenAllBtn').disabled = false;
  renderCands();
  renderBoardNew();
  flash(`⚡ ${matched.length} resumes parsed & ranked for ${selReq.role}`);
}

function renderCands(){
  if(!matched.length){ $('candWrap').innerHTML='<div class="empty">No strong matches ≥35% for this JD in the sample pool.</div>'; return; }
  $('candWrap').innerHTML = matched.map((c,i)=>`
    <div class="cand" style="animation-delay:${i*60}ms">
      <div class="avatar" style="background:${COLORS[i%COLORS.length]}">${initials(c.n)}</div>
      <div>
        <div class="nm">${c.n} ${c.st?`<span class="status ${c.st.cls}">${c.st.label}</span>`:''}</div>
        <div class="ql">${c.ql}</div>
        <div class="fields">
          <span class="field">📚 <b>${c.subj}</b></span>
          <span class="field">🎯 <b>${c.exp} yrs</b></span>
          <span class="field">🏫 ${c.boards.join('/')}</span>
          <span class="field">📍 ${c.loc}</span>
          <span class="field">💰 cur <b>₹${c.cur}k</b></span>
          <span class="field">📈 exp <b>₹${c.exp_ctc}k</b></span>
          <span class="field">⏳ ${c.notice}</span>
        </div>
        <div class="why">🔎 <b>Why matched:</b> ${c.reasons.join(' · ')||'partial fit'}</div>
      </div>
      <div class="scorebox">
        <div class="ring" style="background:conic-gradient(${scoreColor(c.score)} ${c.score}%, #e9efed 0)"><span>${c.score}%</span></div>
        <div class="lab">MATCH</div>
      </div>
      <div class="cactions">
        <button class="btn primary sm" data-scr="${i}" ${c.screened?'disabled':''}>🤖 AI Screen</button>
        <button class="btn ghost sm" data-wa="${i}">📲 WhatsApp msg</button>
      </div>
    </div>`).join('');
  document.querySelectorAll('[data-scr]').forEach(b=>b.onclick=()=>screenOne(+b.dataset.scr));
  document.querySelectorAll('[data-wa]').forEach(b=>b.onclick=()=>showWA(+b.dataset.wa));
}

/* ---------- WHATSAPP OUTREACH ---------- */
function waText(c){
  const f=c.n.split(' ')[0];
  return `Hi ${f}! 👋 This is Edukey360 (verified school staffing).\n\nWe have a *${selReq.role}* opening — ${selReq.board}, ${selReq.loc}, ₹${selReq.band[0]}–${selReq.band[1]}k/mo.\n\nYour profile (${c.ql}, ${c.exp} yrs) looks like a strong fit. Are you open to it?\nReply YES and we'll schedule your interview. 🎓`;
}
function showWA(i){
  const c=matched[i];
  $('m-name').textContent = 'WhatsApp outreach — '+c.n;
  $('m-role').textContent = 'Auto-personalised by KeyScreen AI';
  $('m-body').innerHTML = `<div class="wa">${waText(c)}</div><div class="wa-note">In production this fires automatically via the WhatsApp Business API — no recruiter typing required.</div>`;
  $('m-verdict').textContent = '';
  $('overlay').classList.add('on');
}

/* ---------- SCREENING CALL (animated) ---------- */
function buildTranscript(c, r){
  const f=c.n.split(' ')[0];
  const lines=[
    ['ai',`Hi ${f}, this is Maya from Edukey360 — calling about a ${r.role} opening at a ${r.board} school in ${r.loc}. Got 2 minutes?`],
    ['ca',`Yes, please go ahead.`],
    ['ai',`Great! I see you're a ${c.ql} with ${c.exp} years' experience. Are you open to a new opportunity right now?`],
    ['ca', c.gone ? `Actually I just accepted an offer at another school last week.` : `Yes, I'm actively looking.`],
  ];
  if(!c.gone){
    lines.push(['ai',`Perfect. Can you confirm your current monthly CTC?`]);
    lines.push(['ca',`It's ₹${c.cur},000 per month.`]);
    lines.push(['ai',`And your expected CTC?`]);
    lines.push(['ca',`Around ₹${c.exp_ctc},000.`]);
    lines.push(['ai',`Noted. What's your notice period, and are you comfortable with ${r.loc}?`]);
    lines.push(['ca',`${c.notice}, and yes ${r.loc} works for me.`]);
  }
  return lines;
}
function screenOne(i){
  const c=matched[i], r=selReq;
  const res=outcome(c,r,c.score);
  const lines=buildTranscript(c,r);
  $('m-name').textContent = c.n;
  $('m-role').textContent = `KeyScreen AI · screening for ${r.role}`;
  $('m-body').innerHTML=''; $('m-verdict').textContent='';
  $('overlay').classList.add('on');
  let k=0;
  (function step(){
    if(k<lines.length){
      const [who,txt]=lines[k];
      const d=document.createElement('div');
      d.className='msg '+who;
      d.innerHTML=`<div class="who">${who==='ai'?'🤖 Maya':'👤 '+c.n.split(' ')[0]}</div><div class="bubble">${txt}</div>`;
      $('m-body').appendChild(d); $('m-body').scrollTop=$('m-body').scrollHeight;
      k++; setTimeout(step,620);
    } else {
      $('m-verdict').innerHTML = `<span style="color:var(--teal-d)">Auto-tagged:</span> ${res.verdict}`;
      applyResult(i,res);
    }
  })();
}
function applyResult(i,res){
  const c=matched[i];
  if(c.screened) return;
  c.screened=true; c.st=res;
  stats.screened++; stats.calls++; if(res.key==='rdy') stats.ready++;
  updateKPIs(); renderCands(); addToBoard(c,res);
}

/* ---------- SCREEN ALL ---------- */
function screenAll(){
  if(!matched.length){ flash('Source a pool first'); return; }
  let did=0;
  matched.forEach((c,i)=>{ if(!c.screened){ const res=outcome(c,selReq,c.score); applyResult(i,res); did++; } });
  flash(did ? `🤖 Auto-screened ${did} candidates in ~2 seconds` : 'All already screened');
}

/* ---------- KPIs ---------- */
function updateKPIs(){
  $('k-screened').textContent = stats.screened;
  $('k-calls').textContent = stats.calls;
  $('k-hours').textContent = (stats.calls*8/60).toFixed(1)+'h';
  $('k-ready').textContent = stats.ready;
}

/* ---------- PIPELINE BOARD ---------- */
function renderBoardNew(){
  $('col-new').innerHTML = matched.filter(c=>!c.screened).map(c=>pcard(c, c.score+'% match')).join('');
  countBoard();
}
function pcard(c,meta){ return `<div class="pcard">${c.n}<div class="m">${meta}</div></div>`; }
function addToBoard(c,res){
  renderBoardNew();
  const map={int:'col-int', rdy:'col-rdy', cb:'col-cb', no:'col-no', else:'col-no'};
  const el=$(map[res.col]||map[res.key]);
  if(el) el.insertAdjacentHTML('afterbegin', pcard(c,res.label));
  countBoard();
}
function countBoard(){
  $('c-new').textContent=$('col-new').children.length;
  $('c-int').textContent=$('col-int').children.length;
  $('c-rdy').textContent=$('col-rdy').children.length;
  $('c-cb').textContent=$('col-cb').children.length;
  $('c-no').textContent=$('col-no').children.length;
}

/* ---------- WIRE UP ---------- */
$('runBtn').onclick = runMatch;
$('screenAllBtn').onclick = screenAll;
$('m-close').onclick = ()=>$('overlay').classList.remove('on');
$('overlay').onclick = e=>{ if(e.target===$('overlay')) $('overlay').classList.remove('on'); };
renderReqs();

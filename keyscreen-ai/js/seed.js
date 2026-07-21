/* ============================================================
   Edukey360 Agentic Recruiting OS — seed data
   This is the initial Candidate Knowledge Graph. In production it
   comes from resume ingestion + verified sources. All modules
   read/write these same objects (shared state).
   ============================================================ */
window.SEED = {
  schools: [
    {id:'sch1', name:'Delhi Public School, Gurgaon', board:'CBSE', loc:'Gurgaon', culture:['discipline','results','tech-forward']},
    {id:'sch2', name:'Heritage International, Gurgaon', board:'ICSE', loc:'Gurgaon', culture:['holistic','arts','inclusive']},
    {id:'sch3', name:'Little Scholars, Delhi', board:'CBSE', loc:'Delhi', culture:['nurturing','primary-focus']},
    {id:'sch4', name:'Cambridge Global, Noida', board:'IB', loc:'Noida', culture:['inquiry','global','premium']},
  ],

  requirements: [
    {id:'r1', role:'PGT Physics', schoolId:'sch1', board:'CBSE', grade:'Sr. Secondary', loc:'Gurgaon', band:[45,60], minExp:3, subject:'Physics', urgency:'High', status:'open', must:['M.Sc/B.Sc Physics','B.Ed','CBSE exp'], skills:['physics','b.ed','cbse','senior secondary','pgt']},
    {id:'r2', role:'TGT Mathematics', schoolId:'sch2', board:'ICSE', grade:'Class 6–10', loc:'Gurgaon', band:[30,42], minExp:2, subject:'Mathematics', urgency:'Medium', status:'open', must:['B.Sc Maths','B.Ed','2+ yrs'], skills:['mathematics','maths','b.ed','tgt','icse']},
    {id:'r3', role:'PRT (Primary)', schoolId:'sch3', board:'CBSE', grade:'Class 1–5', loc:'Delhi', band:[22,30], minExp:1, subject:'Primary', urgency:'High', status:'open', must:['Graduate','D.El.Ed/B.Ed','CTET'], skills:['primary','prt','ctet','b.ed','d.el.ed']},
    {id:'r4', role:'Vice Principal', schoolId:'sch1', board:'CBSE', grade:'Leadership', loc:'Gurgaon', band:[90,120], minExp:10, subject:'Leadership', urgency:'Low', status:'open', must:['M.Ed preferred','10+ yrs','Admin exp'], skills:['leadership','administration','m.ed','vice principal','academic']},
    {id:'r5', role:'PGT English', schoolId:'sch4', board:'IB', grade:'Sr. Secondary', loc:'Noida', band:[50,68], minExp:4, subject:'English', urgency:'Medium', status:'open', must:['M.A English','B.Ed','IB/CBSE exp'], skills:['english','literature','b.ed','pgt','ib']},
  ],

  // trust: 0 = self-declared, 1 = document-verified, 2 = blockchain-verified
  candidates: [
    {id:'c1', name:'Ananya Sharma', subject:'Physics', qual:'M.Sc Physics, B.Ed', exp:5, boards:['CBSE'], loc:'Gurgaon', cur:42, exp_ctc:52, notice:'30 days', source:'Internal DB', trust:1, consent:true, skills:['physics','b.ed','cbse','pgt','senior secondary']},
    {id:'c2', name:'Rahul Verma', subject:'Physics', qual:'B.Sc Physics, B.Ed', exp:2, boards:['State'], loc:'Faridabad', cur:30, exp_ctc:46, notice:'60 days', source:'Naukri', trust:0, consent:true, skills:['physics','b.ed','tgt']},
    {id:'c3', name:'Meera Nair', subject:'Physics', qual:'M.Sc Physics, B.Ed', exp:8, boards:['CBSE','ICSE'], loc:'Gurgaon', cur:58, exp_ctc:80, notice:'90 days', source:'Referral', trust:2, consent:true, skills:['physics','b.ed','cbse','pgt','senior secondary']},
    {id:'c4', name:'Sunita Rao', subject:'Mathematics', qual:'B.Sc Maths, B.Ed', exp:3, boards:['ICSE'], loc:'Gurgaon', cur:28, exp_ctc:38, notice:'Immediate', source:'WhatsApp', trust:1, consent:true, skills:['mathematics','maths','b.ed','tgt','icse']},
    {id:'c5', name:'Imran Khan', subject:'Mathematics', qual:'M.Sc Maths, B.Ed', exp:4, boards:['CBSE'], loc:'Delhi', cur:34, exp_ctc:44, notice:'30 days', source:'Internal DB', trust:0, consent:true, skills:['mathematics','maths','b.ed','tgt']},
    {id:'c6', name:'Priya Menon', subject:'Primary', qual:'B.A, D.El.Ed, CTET', exp:2, boards:['CBSE'], loc:'Delhi', cur:20, exp_ctc:27, notice:'Immediate', source:'Apna', trust:1, consent:true, skills:['primary','prt','ctet','d.el.ed']},
    {id:'c7', name:'Kavya Iyer', subject:'Primary', qual:'B.Com, B.Ed, CTET', exp:1, boards:['CBSE'], loc:'Noida', cur:18, exp_ctc:24, notice:'15 days', source:'WhatsApp', trust:0, consent:true, skills:['primary','prt','ctet','b.ed']},
    {id:'c8', name:'Deepak Joshi', subject:'Leadership', qual:'M.Ed, 12 yrs admin', exp:12, boards:['CBSE'], loc:'Gurgaon', cur:95, exp_ctc:118, notice:'90 days', source:'Referral', trust:2, consent:true, skills:['leadership','administration','m.ed','vice principal','academic']},
    {id:'c9', name:'Neha Gupta', subject:'Mathematics', qual:'M.A, B.Ed', exp:2, boards:['State'], loc:'Gurgaon', cur:26, exp_ctc:33, notice:'30 days', source:'Naukri', trust:0, consent:true, gone:true, skills:['mathematics','b.ed','tgt']},
    {id:'c10', name:'Arjun Reddy', subject:'Physics', qual:'B.Sc Physics, B.Ed', exp:6, boards:['CBSE'], loc:'Gurgaon', cur:44, exp_ctc:55, notice:'45 days', source:'Internal DB', trust:1, consent:true, skills:['physics','b.ed','cbse','pgt']},
    {id:'c11', name:'Fatima Sheikh', subject:'English', qual:'M.A English, B.Ed', exp:5, boards:['CBSE','IB'], loc:'Noida', cur:48, exp_ctc:62, notice:'30 days', source:'Referral', trust:1, consent:true, skills:['english','literature','b.ed','pgt','ib']},
    {id:'c12', name:'Rohit Malhotra', subject:'English', qual:'M.A English, B.Ed', exp:3, boards:['CBSE'], loc:'Delhi', cur:36, exp_ctc:47, notice:'60 days', source:'Naukri', trust:0, consent:true, skills:['english','literature','b.ed','tgt']},
    {id:'c13', name:'Sneha Kulkarni', subject:'Mathematics', qual:'B.Sc Maths, B.Ed, CTET', exp:3, boards:['CBSE','ICSE'], loc:'Gurgaon', cur:31, exp_ctc:40, notice:'30 days', source:'WhatsApp', trust:1, consent:true, skills:['mathematics','maths','b.ed','tgt','icse','ctet']},
    {id:'c14', name:'Vikram Singh', subject:'Physics', qual:'M.Sc Physics', exp:4, boards:['State'], loc:'Gurgaon', cur:38, exp_ctc:50, notice:'Immediate', source:'Apna', trust:0, consent:false, skills:['physics','pgt']},
  ]
};

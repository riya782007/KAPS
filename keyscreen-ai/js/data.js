/* ============================================================
   KeyScreen AI — sample data
   In production, REQS come from live school requirements and
   POOL comes from parsed resumes (job portals + internal DB).
   ============================================================ */

const COLORS = ['#3d7bd6','#12a58c','#e8a13a','#7a5cd6','#e05b5b','#0e8574','#c0603a','#3f7d2f','#2f6d7d','#b2582f'];

/* Live requirements (Job Descriptions) */
const REQS = [
  {id:'pgt-phy', role:'PGT Physics', board:'CBSE', grade:'Sr. Secondary', loc:'Gurgaon', band:[45,60], minExp:3, subject:'Physics',
   must:['M.Sc/B.Sc Physics','B.Ed','CBSE exp'], skills:['physics','b.ed','cbse','senior secondary','pgt']},
  {id:'tgt-math', role:'TGT Mathematics', board:'ICSE', grade:'Class 6–10', loc:'Gurgaon', band:[30,42], minExp:2, subject:'Mathematics',
   must:['B.Sc Maths','B.Ed','2+ yrs'], skills:['mathematics','maths','b.ed','tgt','icse']},
  {id:'prt', role:'PRT (Primary)', board:'CBSE', grade:'Class 1–5', loc:'Delhi NCR', band:[22,30], minExp:1, subject:'Primary',
   must:['Graduate','D.El.Ed/B.Ed','CTET'], skills:['primary','prt','ctet','b.ed','d.el.ed']},
  {id:'vp', role:'Vice Principal', board:'CBSE', grade:'Leadership', loc:'Gurgaon', band:[90,120], minExp:10, subject:'Leadership',
   must:['M.Ed preferred','10+ yrs','Admin exp'], skills:['leadership','administration','m.ed','vice principal','academic']},
];

/* Candidate pool (as if parsed from resumes) */
const POOL = [
  {n:'Ananya Sharma', ql:'M.Sc Physics, B.Ed', subj:'Physics', exp:5, boards:['CBSE'], loc:'Gurgaon', cur:42, exp_ctc:52, notice:'30 days', skills:['physics','b.ed','cbse','pgt','senior secondary']},
  {n:'Rahul Verma', ql:'B.Sc Physics, B.Ed', subj:'Physics', exp:2, boards:['State'], loc:'Faridabad', cur:30, exp_ctc:46, notice:'60 days', skills:['physics','b.ed','tgt']},
  {n:'Meera Nair', ql:'M.Sc Physics, B.Ed', subj:'Physics', exp:8, boards:['CBSE','ICSE'], loc:'Gurgaon', cur:58, exp_ctc:80, notice:'90 days', skills:['physics','b.ed','cbse','pgt','senior secondary']},
  {n:'Sunita Rao', ql:'B.Sc Maths, B.Ed', subj:'Mathematics', exp:3, boards:['ICSE'], loc:'Gurgaon', cur:28, exp_ctc:38, notice:'Immediate', skills:['mathematics','maths','b.ed','tgt','icse']},
  {n:'Imran Khan', ql:'M.Sc Maths, B.Ed', subj:'Mathematics', exp:4, boards:['CBSE'], loc:'Delhi', cur:34, exp_ctc:44, notice:'30 days', skills:['mathematics','maths','b.ed','tgt']},
  {n:'Priya Menon', ql:'B.A, D.El.Ed, CTET', subj:'Primary', exp:2, boards:['CBSE'], loc:'Delhi', cur:20, exp_ctc:27, notice:'Immediate', skills:['primary','prt','ctet','d.el.ed']},
  {n:'Kavya Iyer', ql:'B.Com, B.Ed, CTET', subj:'Primary', exp:1, boards:['CBSE'], loc:'Noida', cur:18, exp_ctc:24, notice:'15 days', skills:['primary','prt','ctet','b.ed']},
  {n:'Deepak Joshi', ql:'M.Ed, 12 yrs admin', subj:'Leadership', exp:12, boards:['CBSE'], loc:'Gurgaon', cur:95, exp_ctc:118, notice:'90 days', skills:['leadership','administration','m.ed','vice principal','academic']},
  {n:'Neha Gupta', ql:'M.A, B.Ed', subj:'Mathematics', exp:2, boards:['State'], loc:'Gurgaon', cur:26, exp_ctc:33, notice:'30 days', gone:true, skills:['mathematics','b.ed','tgt']},
  {n:'Arjun Reddy', ql:'B.Sc Physics, B.Ed', subj:'Physics', exp:6, boards:['CBSE'], loc:'Gurgaon', cur:44, exp_ctc:55, notice:'45 days', skills:['physics','b.ed','cbse','pgt']},
];

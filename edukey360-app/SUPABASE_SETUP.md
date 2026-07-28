# Attach Supabase to Edukey360 OS

The app works out-of-the-box on demo data. To make it read from a **real Supabase database**,
do two things: (1) add env vars in Vercel, (2) run the migration below in Supabase.
If env is missing, the app safely uses demo data — nothing breaks.

## 1) Vercel → Settings → Environment Variables
| Key | From Supabase → Project Settings → API |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (server-side reads) |

(Keep your `OPENAI_API_KEY` too — that powers the AI screening/parse.)
Redeploy after adding. The Dashboard & Candidates header will then show **Source: Supabase**.

## 2) Supabase → SQL Editor → run this migration + seed
```sql
create table if not exists schools (
  id text primary key, name text, board text, loc text,
  vacancies int, retention int, revenue bigint, open_invoices int default 0
);
create table if not exists recruiters (
  id text primary key, name text, role text, online boolean,
  target int, placed int, calls int, avatar_hue int default 200
);
create table if not exists requirements (
  id text primary key, role text, school_id text references schools(id),
  board text, subject text, min_exp int, salary_min int, salary_max int,
  vacancies int, joining date, priority text, status text default 'Open', created_by text
);
create table if not exists candidates (
  id text primary key, name text, subject text, qual text, exp int, loc text,
  boards text[] default '{}', cur_ctc int, exp_ctc int, notice text, source text,
  stage text, match int, comm_score int, trust int default 0, req_id text, recruiter text
);

-- seed
insert into schools (id,name,board,loc,vacancies,retention,revenue,open_invoices) values
 ('sch1','Delhi Public School, Gurgaon','CBSE','Gurgaon',6,91,480000,1),
 ('sch2','Heritage International','ICSE','Gurgaon',3,88,265000,0),
 ('sch3','Little Scholars','CBSE','Delhi',4,84,190000,2),
 ('sch4','Cambridge Global','IB','Noida',2,93,520000,0)
on conflict (id) do nothing;

insert into recruiters (id,name,role,online,target,placed,calls,avatar_hue) values
 ('r1','Aarti Mehta','Senior Recruiter',true,12,10,61,210),
 ('r2','Vikas Nair','Recruiter',true,10,6,48,150),
 ('r3','Sana Kapoor','Recruiter',false,10,9,52,30),
 ('r4','Rohan Das','Telerecruiter',true,8,4,74,280)
on conflict (id) do nothing;

insert into requirements (id,role,school_id,board,subject,min_exp,salary_min,salary_max,vacancies,joining,priority,status,created_by) values
 ('req1','PGT Physics','sch1','CBSE','Physics',3,45,60,2,'2026-08-15','High','Open','Aarti Mehta'),
 ('req2','TGT Mathematics','sch2','ICSE','Mathematics',2,30,42,1,'2026-08-20','Medium','Open','Vikas Nair'),
 ('req3','PRT (Primary)','sch3','CBSE','Primary',1,22,30,3,'2026-08-05','High','Open','Sana Kapoor'),
 ('req4','PGT English','sch4','IB','English',4,50,68,1,'2026-09-01','Medium','Open','Aarti Mehta'),
 ('req5','Vice Principal','sch1','CBSE','Leadership',10,90,120,1,'2026-09-10','Low','Open','Aarti Mehta')
on conflict (id) do nothing;

insert into candidates (id,name,subject,qual,exp,loc,boards,cur_ctc,exp_ctc,notice,source,stage,match,comm_score,trust,req_id,recruiter) values
 ('c1','Ananya Sharma','Physics','M.Sc Physics, B.Ed',5,'Gurgaon','{CBSE}',42,52,'30 days','Internal DB','Interview',96,9,1,'req1','Aarti Mehta'),
 ('c2','Meera Nair','Physics','M.Sc Physics, B.Ed',8,'Gurgaon','{CBSE,ICSE}',58,80,'90 days','Referral','Screened',88,8,2,'req1','Aarti Mehta'),
 ('c3','Arjun Reddy','Physics','B.Sc Physics, B.Ed',6,'Gurgaon','{CBSE}',44,55,'45 days','Naukri','Contacted',84,7,1,'req1',null),
 ('c4','Sunita Rao','Mathematics','B.Sc Maths, B.Ed',3,'Gurgaon','{ICSE}',28,38,'Immediate','WhatsApp','Interested',91,8,1,'req2',null),
 ('c5','Imran Khan','Mathematics','M.Sc Maths, B.Ed',4,'Delhi','{CBSE}',34,44,'30 days','Internal DB','New',79,7,0,'req2',null),
 ('c6','Priya Menon','Primary','B.A, D.El.Ed, CTET',2,'Delhi','{CBSE}',20,27,'Immediate','Apna','Offer',90,8,1,'req3','Sana Kapoor'),
 ('c7','Kavya Iyer','Primary','B.Com, B.Ed, CTET',1,'Noida','{CBSE}',18,24,'15 days','WhatsApp','Placed',86,7,2,'req3','Sana Kapoor'),
 ('c8','Fatima Sheikh','English','M.A English, B.Ed',5,'Noida','{CBSE,IB}',48,62,'30 days','Referral','Screened',93,9,1,'req4',null),
 ('c9','Rohit Malhotra','English','M.A English, B.Ed',3,'Delhi','{CBSE}',36,47,'60 days','Naukri','New',74,6,0,'req4',null),
 ('c10','Deepak Joshi','Leadership','M.Ed, 12 yrs admin',12,'Gurgaon','{CBSE}',95,118,'90 days','Referral','Interview',94,9,2,'req5','Aarti Mehta'),
 ('c11','Sneha Kulkarni','Mathematics','B.Sc Maths, B.Ed, CTET',3,'Gurgaon','{CBSE,ICSE}',31,40,'30 days','WhatsApp','Joining',89,8,1,'req2','Vikas Nair'),
 ('c12','Neha Gupta','Mathematics','M.A, B.Ed',2,'Gurgaon','{State}',26,33,'30 days','Naukri','New',68,6,0,null,null)
on conflict (id) do nothing;

alter table schools enable row level security;
alter table recruiters enable row level security;
alter table requirements enable row level security;
alter table candidates enable row level security;
create policy "read all" on schools for select using (true);
create policy "read all" on recruiters for select using (true);
create policy "read all" on requirements for select using (true);
create policy "read all" on candidates for select using (true);
```

That's it — reload the app and it's running on your live Supabase data.

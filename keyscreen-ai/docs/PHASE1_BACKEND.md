# Phase 1 — Real Backend (Supabase + Claude)

> ⚠️ **Not needed for the Monday demo.** The app runs 100% in the browser on seed data —
> nothing here has to be set up for Varun's walkthrough. This is the groundwork for going
> live on real data *after* the demo, so a live API can never break the pitch.

There are two things you asked for: **(A) the migration to paste** and **(B) the env keys to enter in Vercel.**

---

## A) Supabase migration — paste into Supabase → SQL Editor → Run

```sql
-- Edukey360 Agentic Recruiting OS — Phase 1 schema
create extension if not exists "pgcrypto";

create table if not exists schools (
  id         text primary key,
  name       text not null,
  board      text,
  loc        text,
  culture    text[] default '{}'
);

create table if not exists requirements (
  id         text primary key,
  role       text not null,
  school_id  text references schools(id) on delete set null,
  board      text,
  grade      text,
  loc        text,
  band_min   int,
  band_max   int,
  min_exp    int default 0,
  subject    text,
  urgency    text default 'Medium',
  status     text default 'open',        -- open | filled
  must       text[] default '{}',
  skills     text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists candidates (
  id            text primary key,
  name          text not null,
  subject       text,
  qual          text,
  exp           int default 0,
  boards        text[] default '{}',
  loc           text,
  cur           int,                      -- current CTC (₹k/mo)
  exp_ctc       int,                      -- expected CTC (₹k/mo)
  notice        text,
  source        text,
  trust         int default 0,            -- 0 self / 1 doc / 2 blockchain
  consent       boolean default true,
  gone          boolean default false,
  skills        text[] default '{}',
  status        text default 'New',
  screening     jsonb,                    -- {outcome, verdict, reqId, at}
  retention     jsonb,                    -- {risk, stay, factors}
  placed_req_id text,
  last_contact  timestamptz,
  created_at    timestamptz default now()
);

create table if not exists activity (
  id           bigserial primary key,
  candidate_id text references candidates(id) on delete cascade,
  text         text not null,
  created_at   timestamptz default now()
);

create table if not exists billing (
  id           bigserial primary key,
  candidate_id text references candidates(id) on delete set null,
  req_id       text references requirements(id) on delete set null,
  amount       int not null,
  model        text,
  created_at   timestamptz default now()
);

create index if not exists idx_candidates_status  on candidates(status);
create index if not exists idx_candidates_subject on candidates(subject);
create index if not exists idx_activity_created   on activity(created_at desc);

-- Row Level Security (turn on; add auth-scoped policies for production)
alter table schools      enable row level security;
alter table requirements enable row level security;
alter table candidates   enable row level security;
alter table activity     enable row level security;
alter table billing      enable row level security;

-- Starter policy: allow authenticated users full access (tighten per role later)
create policy "auth read/write schools"      on schools      for all to authenticated using (true) with check (true);
create policy "auth read/write requirements" on requirements for all to authenticated using (true) with check (true);
create policy "auth read/write candidates"   on candidates   for all to authenticated using (true) with check (true);
create policy "auth read/write activity"     on activity     for all to authenticated using (true) with check (true);
create policy "auth read/write billing"      on billing      for all to authenticated using (true) with check (true);
```

This schema mirrors the app's data model exactly, so wiring is a straight swap of `js/store.js`'s
internals from the in-memory arrays to Supabase queries (`seed.js` becomes a one-time seed insert).

---

## B) Vercel environment variables — Project → Settings → Environment Variables

**Minimum to go live on real data (Phase 1):**

| Key | Where to get it | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | DB endpoint |
| `SUPABASE_URL` | same | server-side DB endpoint |
| `SUPABASE_ANON_KEY` | Supabase → API → anon public | client reads |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → API → service_role (keep secret) | server writes |
| `ANTHROPIC_API_KEY` | console.anthropic.com | AI matching / screening / parsing |

**Add later, per module (all listed in `.env.example`):**
Resume parsing (`RCHILLI_API_KEY`), WhatsApp (`GUPSHUP_API_KEY`/`WATI_API_KEY`), voice
(`TWILIO_*`, `ELEVENLABS_API_KEY`, `DEEPGRAM_API_KEY`), KYC (`IDFY_API_KEY`/`DIGIO_*`),
billing (`RAZORPAY_*`).

After adding variables, **redeploy** for them to take effect.

---

## Reminder for Monday
Deploy the repo as a **static site** (Root Directory `keyscreen-ai`, no build command). The demo,
the guided story, and all 8 modules work with **zero** of the above configured. Set up Supabase +
Claude only when you're ready to run on real candidate data.

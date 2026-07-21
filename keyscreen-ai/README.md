# 🎓 Edukey360 · Agentic Recruiting OS

> One connected system that automates the recruiter grunt-work end-to-end — **sourcing → matching → AI screening → verification → the school portal → ops intelligence** — all running on a single shared **Candidate Knowledge Graph**.
> A working proof-of-concept by **NEWVORA** for **Edukey360** (Varun Bahl & Amit ji).

Instead of 7 separate tools, this is **one app with one source of truth**: an action in any module (screen, verify, place) instantly updates every other module and the founder KPIs. That shared-data flywheel is the product's moat.

---

## 🧭 What's inside (8 views)
| View | Module | What it does |
|---|---|---|
| **Dashboard** | Ops Intelligence | Founder cockpit: KPIs, hiring funnel, live activity feed, **predictive flight-risk radar**, auto-billing. |
| **Requirements** | — | Open school vacancies; create new ones. |
| **Sourcing** | AI Outreach | Re-engage the pool (WhatsApp/voice), consent flags, add candidates. |
| **Match** | AI Match Engine | Hybrid ranking with **Fit + Stay (predicted retention)** and a blended Smart Score, with explanations. |
| **KeyScreen** | Screening Copilot | Animated AI voice/WhatsApp screening that auto-tags status; one-click auto-screen the whole pool. |
| **Verification** | Trust Layer | Tiered badges (self-declared → document → blockchain/DigiLocker); verify once, reuse everywhere. |
| **School Portal** | Model 3 | Natural-language search over the **verified, consented** pool ("CBSE PGT Physics Gurgaon under 60k"). |
| **Knowledge Graph** | Shared core | Every candidate node; click any teacher for a **360° drawer** (snapshot, best-fit matches, screening, retention, timeline). |

The **feedback loop**: placing a teacher computes a retention risk that feeds the Match Engine's Stay score — the system learns to match for teachers who *stay*.

---

## 🗂 Project structure
```
keyscreen-ai/
├─ index.html          # the OS app shell (entry point)
├─ css/app.css         # design system
├─ js/
│  ├─ seed.js          # initial Knowledge Graph (candidates, requirements, schools)
│  ├─ store.js         # shared reactive store + all logic (scoring, screening, verify, place, KPIs, pub/sub)
│  └─ views.js         # 8 views, Candidate 360 drawer, routing, interactions
├─ poc.html            # the original single-module KeyScreen demo (kept for reference)
├─ plan.html           # Master Plan (/plan)
├─ modules.html        # research-backed deep dive (/modules)
├─ .env.example        # every third-party API key, grouped by function
├─ docs/               # PLAN.md, CONCEPT_NOTE.md
├─ vercel.json  package.json  .gitignore
```
No build step, no dependencies, no backend — pure static site. State persists in the browser (localStorage) with a **Reset demo** button on the Dashboard.

---

## ▶️ Run locally
Open `index.html` in a browser, or:
```bash
npx serve .
```

## ▲ Deploy on Vercel
Import the repo, set **Root Directory → `keyscreen-ai`**, Framework Preset **Other**, no build command. Deploy.
Live routes: `/` (the OS), `/plan`, `/modules`, `/poc`.

---

## 🔭 Production path (not in this POC)
Swap `seed.js`/`store.js` internals for a real API + database; wire the AI (Claude/GPT), resume parser, WhatsApp + voice, and KYC/verification providers listed in `.env.example`. The UI and logic layer stay the same. See `docs/PLAN.md` and `modules.html`.

*Built by NEWVORA · sample data only · human-in-the-loop by design.*

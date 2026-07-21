# KeyScreen AI — Product Plan & Build Roadmap
### NEWVORA × Edukey360

## 1. Problem → Product
| Manual today (per SOP) | KeyScreen AI |
|---|---|
| Recruiter reads each resume | Auto-parse into structured fields |
| 40–50 screening calls/day/recruiter | AI voice/WhatsApp screening at scale |
| Same 7 questions asked every call | Standardised AI script, zero variance |
| Manual status tagging in tracker | Auto-tag using SOP labels |
| Shortlist takes days | Interview-ready shortlist in minutes |

## 2. Core modules
1. **Resume Intake & Parser** — ingest from job portals + internal DB; extract subject, qualification, experience, board, CTC, notice, location.
2. **AI Match Engine** — score candidate ↔ requirement with explainable reasons (subject fit, skills, experience, board, location, salary band).
3. **AI Screening Agent** — WhatsApp Business API + AI voice caller running the 7-point screening; captures answers, transcribes, tags outcome.
4. **Auto-Tag Pipeline** — Kanban mirroring SOP status labels (Interested / Interview Ready / Call Back / Not Interested / Not Reachable / Joined Elsewhere).
5. **ROI & Ops Dashboard** — calls automated, recruiter-hours saved, time-to-shortlist, fill rate — feeding the KPIs already defined in the Operations SOP.

## 3. Safety / human-in-the-loop
- Every AI tag is **recommended, not final** — recruiter can override in one click.
- No candidate is contacted without a consent flag (aligns with SOP data-privacy section).
- Verification badges stay owned by the Verification Team; KeyScreen surfaces them, never fakes them.

## 4. Build roadmap
| Phase | Deliverable | Status |
|---|---|---|
| **0 — POC (this repo)** | Clickable working model: match engine + simulated screening + auto-tag + ROI counter, on sample data. | ✅ Done |
| **1 — Real data** | Connect internal candidate DB + resume parser; live requirements from BD. | Next |
| **2 — AI outreach** | WhatsApp Business API integration; AI voice caller; consent + opt-out handling. | |
| **3 — Dashboard integration** | Embed into `edukey360.vercel.app` dashboard; recruiter override UI; KPI feed. | |
| **4 — Scale** | Bulk screening, multi-requirement queues, analytics, and Model 3 (self-service portal) tie-in. | |

## 5. Tech (kept deliberately simple for the POC)
- **POC:** static HTML/CSS/JS — zero build, deploys on Vercel in one click.
- **Production path:** same front-end shell → add a lightweight backend (Node/Serverless on Vercel) for parsing, WhatsApp/voice webhooks, and a database (e.g., Postgres/Supabase). Front-end code is already modular (`data.js` swaps to an API call, `app.js` logic stays).

## 6. Success metrics (tie to Operations SOP KPIs)
- ↓ Time-to-Hire · ↑ Fill Rate · ↓ Cost-per-Hire · recruiter-hours redeployed from dialing to closing.

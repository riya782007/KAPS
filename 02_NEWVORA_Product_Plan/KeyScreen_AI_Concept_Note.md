# KeyScreen AI — One-Page Concept Note
### by NEWVORA, for Edukey360 (Varun Bahl & Amit ji)

## The one pain point we attacked
Across both SOPs, the single biggest, dullest, most repeatable cost is the **sourcing-and-screening call loop**:
- Junior Recruiter target: **40–50 sourcing calls/day**, 15–20 profiles, 8–10 screenings.
- Telerecruiter: read each resume, call the candidate, collect the **same 7 data points every time** (interest, current CTC, expected CTC, notice period, subject, location, availability), then hand-tag status (Interested / Not Interested / Call Back / Not Reachable / Interview Ready / Joined Elsewhere) and update the tracker.

It is pure manpower. It doesn't scale, it burns out telecallers, and it's the slowest step between a school's requirement and a shortlist.

## What KeyScreen AI does (the working model)
One AI copilot that runs the whole loop, hands-free:
1. **Auto-parses resumes** into structured profiles (subject, qualification, experience, board, CTC, notice, location).
2. **AI-matches & ranks** every candidate against the live requirement (JD) with a transparent match score + "why matched" reasoning.
3. **Runs the screening conversation** (AI voice/WhatsApp) collecting the exact 7 SOP data points.
4. **Auto-tags** each candidate into the pipeline using the SOP's own status labels — no recruiter typing.
5. **Live KPI counter** shows calls automated and recruiter-hours saved in real time.

The HTML file `KeyScreen_AI_Working_Model.html` is a real, clickable proof-of-concept — the matching and screening logic actually runs in the browser on sample Edukey360 requirements (PGT Physics, TGT Maths, PRT, Vice Principal).

## Why it's delightful / viral
- Founders literally watch resumes turn into an interview-ready shortlist in seconds.
- "Hire in days, not weeks" stops being a slogan and becomes visible on screen.
- The auto-tagged Kanban mirrors their SOP exactly, so the team adopts it with zero retraining.

## The relief (illustrative math)
If a recruiter makes ~45 screening calls/day at ~8 min each = **~6 hours/day of pure screening**. KeyScreen removes the bulk of that.
- ~1 telecaller's day of calling → automated.
- Screening that took a day compresses to minutes.
- Recruiters shift from dialing to closing (interviews, offers, joining) — the high-value work.

## How to read the demo
1. Open `KeyScreen_AI_Working_Model.html` in any browser.
2. Click a requirement on the left → **Source & AI-match pool**.
3. Click **🤖 AI Screen** on a candidate to watch the AI call, or **Auto-screen entire pool** to do them all at once.
4. Watch the pipeline board and the "recruiter-hours saved" counter fill up.

## What production would add (next phase, not in this demo)
Real resume ingestion from portals/database · WhatsApp Business API + AI voice caller · integration into the Edukey360 dashboard · verification badges wired to the verification protocol · recruiter override on every AI tag (human-in-the-loop, always safe).

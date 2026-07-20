# KAPS — Edukey360 × NEWVORA

This repository holds the NEWVORA engagement for **Edukey360** (founders Varun Bahl & Amit ji):
source SOPs, product planning, and a **working AI proof-of-concept**.

## 📁 Structure
```
KAPS/
├─ keyscreen-ai/          ← the deployable working model (deploy this on Vercel)
│  ├─ index.html
│  ├─ css/  js/  docs/
│  └─ README.md           ← full app + deploy docs
├─ 01_Source_Documents/   ← Edukey360 SOPs (recruiter + operations) and index
└─ 02_NEWVORA_Product_Plan/ ← concept note + standalone single-file demo
```

## 🚀 The working model — KeyScreen AI
An AI Recruiter Copilot that auto-sources, AI-matches, AI-screens, and auto-tags candidates —
removing the recruiter's manual sourcing-and-screening call loop.

**Live demo:** deploy `keyscreen-ai/` on Vercel (see below).
**Docs:** [`keyscreen-ai/README.md`](keyscreen-ai/README.md) · [`keyscreen-ai/docs/PLAN.md`](keyscreen-ai/docs/PLAN.md)

## ▲ Deploy on Vercel (important: set the root directory)
Because the app is in a subfolder, when importing this repo on [vercel.com/new](https://vercel.com/new):
1. Import `riya782007/KAPS`.
2. **Root Directory → `keyscreen-ai`** (click *Edit* and select it).
3. Framework Preset: **Other** · Build Command: *(empty)* · Output Directory: *(empty / default)*.
4. **Deploy.**

---
*Built by NEWVORA · sample data only · internal proof-of-concept.*

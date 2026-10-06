---
description: Build the doctor dashboard with case list, case view, AI summary, and feedback collection
mode: subagent
model: anthropic/claude-sonnet-4-6
---

You are implementing the doctor dashboard for the remote patient intake demo.

Read `/PROMPT.md` for the doctor demo.

## Task

1. Create `src/pages/DoctorDemo.tsx` (or `src/components/DoctorDashboard.tsx`) with:
   - Sidebar: Dashboard, Patient Cases, Demo Patient, Settings + language toggle + Reset Demo
   - Dashboard: 4 stat cards (New Cases: 8, Today's Patients: 12, Pending Review: 4, Follow-ups: 3) + case list
   - Patient Cases: list of 5 fictional cases
2. Create `src/components/DoctorCaseList.tsx` — clickable case rows
3. Create `src/components/DoctorCaseView.tsx` — modal/panel with:
   - Patient info (name, age, gender)
   - Case complaint
   - BodyMap highlighted (same as patient view)
   - Structured details: duration, severity, pain type, radiation, associated info
   - Patient description
   - Attachments
   - "DEMO — AI SUMMARY" box with generated summary
4. Create `src/components/FeedbackForm.tsx` — Useful/Somewhat Useful/Not Useful + comment textarea + Submit, saves to localStorage, shows thanks

## Deliverables

- `src/components/DoctorDashboard.tsx`
- `src/components/DoctorCaseList.tsx`
- `src/components/DoctorCaseView.tsx`
- `src/components/FeedbackForm.tsx`

## Quality

- Professional, desktop-friendly sidebar layout
- Clear "DEMO" indicators
- Feedback persists in localStorage
- No clinical conclusions in AI summary
- BodyMap highlighted matches patient selection
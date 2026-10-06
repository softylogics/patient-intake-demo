---
description: Implement the patient intake workflow: welcome, body selection, questions, attachments, review, submit
mode: subagent
model: anthropic/claude-sonnet-4-6
---

You are implementing the patient intake workflow for the remote patient intake demo.

Read `/PROMPT.md` for patient demo screens 1-6.

## Task

1. Create `src/pages/PatientDemo.tsx` with 6 steps:
   - Step 1: Welcome — title, subtitle, Start button, demo notice
   - Step 2: Body area selection — BodyMap component
   - Step 3: Questions — dynamic based on body area (duration, severity 1-10, pain type, radiation), name input, description textarea with Roman Urdu placeholder
   - Step 4: Add info — AttachmentUploader, simulated voice recording
   - Step 5: Review — PatientSummary with Edit/Submit
   - Step 6: Submission — success, "View Doctor Dashboard" button
2. Create `src/components/QuestionCard.tsx` — renders select/radio/scale/text inputs
3. Create `src/components/AttachmentUploader.tsx` — drag-and-drop, image preview, file list
4. Create `src/components/PatientSummary.tsx` — structured medical summary, BodyMap highlight
5. Create `src/components/ProgressIndicator.tsx` — step indicator

## Deliverables

- `src/pages/PatientDemo.tsx`
- `src/components/QuestionCard.tsx`
- `src/components/AttachmentUploader.tsx`
- `src/components/PatientSummary.tsx`
- `src/components/ProgressIndicator.tsx`

## Quality

- Multi-step form with validation (block前进 if required unanswered)
- Simulated recording (toggle only, no actual audio processing)
- Demo notice visible
- Language toggle works throughout
- Complete flow in ~2 minutes
---
description: Provide Urdu/English translations, Roman Urdu support, and fictional demo data structures
mode: subagent
model: anthropic/claude-sonnet-4-6
---

You are creating localization data and demo data structures for the remote patient intake demo.

Read `/PROMPT.md` for language support and demo data requirements.

## Task

1. Create `src/utils/translations.ts` with `en`/`ur` translations for ALL UI strings used in the app (landing, body map, questions, review, doctor dashboard, feedback, disclaimers).
2. Create `src/utils/demoData.ts` with:
   - `bodyRegions`: array of `{ id, name, svgPath }` for 13 regions
   - `patientCases`: 5 fictional cases (Lower back pain, Knee pain, Skin rash, Headache, Abdominal pain)
   - `questionsByRegion`: map region id → question array
3. Create `src/types.ts` with `BodyRegion`, `PatientCase`, `Question`, `Answer` types.

## Deliverables

- `src/utils/translations.ts`
- `src/utils/demoData.ts`
- `src/types.ts`

## Quality

- Proper Urdu Unicode
- Roman Urdu placeholders ("Apni problem apne alfaaz mein likhein...")
- Easily extensible — add new region/question without changing core logic
- TypeScript typed throughout
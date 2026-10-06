---
description: Scaffold the React + TypeScript + Tailwind project with routing, layout, and localStorage hooks
mode: subagent
model: anthropic/claude-sonnet-4-6
---

You are setting up the project scaffold for a remote patient intake demo.

Read `/PROMPT.md` in the project root for full requirements.

## Task

1. Verify `package.json` has React 18, TypeScript 5, Tailwind CSS, Vite with scripts `dev`, `build`, `preview`.
2. Ensure `src/main.tsx` mounts the React app with `<LanguageProvider><DemoDataProvider><App /></DemoDataProvider></LanguageProvider>`.
3. Create `src/components/Layout.tsx` with header (app name + DEMO MODE badge), language toggle, nav links (Patient Demo | Doctor Demo | Reset Demo), footer disclaimer.
4. Create `src/hooks/useLanguage.ts` and `src/hooks/useLocalStorage.ts`.
5. Create `src/utils/translations.ts` with `en`/`ur` keys and `src/utils/demoData.ts` with `bodyRegions`, `patientCases`, `questionsByRegion`.
6. Create `src/types.ts` with `BodyRegion`, `PatientCase`, `Question`, `Answer`.
7. Set up routing so landing shows Patient Demo / Doctor Demo buttons.

## Deliverables

- `package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.ts`
- `src/main.tsx`, `src/App.tsx`
- `src/components/Layout.tsx`
- `src/hooks/useLanguage.ts`, `src/hooks/useLocalStorage.ts`
- `src/utils/translations.ts`, `src/utils/demoData.ts`
- `src/types.ts`

## Quality

- TypeScript strict, accessible, responsive (mobile-first)
- No external API calls
- Demo mode badge visible everywhere
- Language toggle persists in localStorage
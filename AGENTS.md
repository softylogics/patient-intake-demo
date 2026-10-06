# Agents — Remote Patient Intake Demo

This project uses opencode subagents to parallelize development.

## Agent Files

All agents live in `.opencode/agent/`:

| Agent | Responsibility |
|-------|---------------|
| `scaffold.md` | Project setup: Vite + React + TS + Tailwind, layout, routing, hooks, data utilities |
| `body-map.md` | Interactive BodyMap/BodyRegion SVG components |
| `patient-workflow.md` | Patient intake: 6-step form, questions, attachments, summary |
| `doctor-dashboard.md` | Doctor dashboard, case list, case view, feedback |
| `localization-data.md` | Urdu/English translations, demo data, TypeScript types |
| `verify.md` | End-to-end verification, VERIFICATION.md |

## How to Run

From the TUI, type `@` to list agents and select one. Or run directly:

```bash
opencode @ scaffold
opencode @ body-map
opencode @ patient-workflow
opencode @ doctor-dashboard
opencode @ localization-data
opencode @ verify
```

## Plan

Full requirements are in `PROMPT.md` at the project root. Every agent reads that file first.

## Priority Order (if doing sequentially)

1. `scaffold` — project setup
2. `localization-data` — types, translations, demo data
3. `body-map` — interactive body selection
4. `patient-workflow` — patient intake flow
5. `doctor-dashboard` — doctor view + feedback
6. `verify` — end-to-end test

## Medical Safety

This is a DEMO prototype only. No diagnosis, treatment, prescriptions. Persistent disclaimer required.
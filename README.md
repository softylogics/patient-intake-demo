# Remote Patient Intake Demo

A production-style **remote patient intake & triage** web application for Pakistani doctors. Built with React 18 + TypeScript + Tailwind CSS + Vite. No backend — all state lives in `localStorage` with a demo-mode safety banner.

## Features

### Patient Intake Flow
- **Landing page** with privacy notice, emergency contact (1122), and telemedicine CTA
- **Multi-step wizard** (progress indicator, RTL support for Urdu)
- **Anatomical body map** — tap body parts to report pain/symptoms
- **Demographics** — age, gender, doctor gender preference
- **Symptom checklist** — 20+ common associated symptoms
- **Red-flag screening** — automatic emergency warning for chest pain, SOB, confusion, severe bleeding, etc.
- **Telemedicine option** — "Connect to Doctor" button at review step

### Doctor Dashboard
- **Case list** with triage badge (URGENT / ROUTINE), patient age, gender, chief complaint
- **Case detail view** — AI-generated summary (demo), selected body regions, symptoms, red flags, attachments
- **Feedback form** — quick doctor notes + severity rating

### Anatomical Body Map (core)
- **Real human silhouette** — 7.5-head proportions, organic bezier curves, not a mannequin
- **Layered rendering**: skin gradient → hair → volume shading (highlights/shadows) → detail lines (clavicles, abs, ribs, etc.) → transparent region overlays
- **Clipped regions** — 70+ anatomical parts; only highlight on hover/selection so the base figure always reads as human
- **Semantic zoom** — scroll/pinch zooms *and* progressively separates crowded structures (e.g., fingers, ear, knee) so they become individually selectable; fully reversible on zoom-out
- **Hit-target enlargement** — small structures grow their clickable area at higher zoom
- **Three views**: Front, Back, Left Side
- **Body-system color coding** (Musculoskeletal, Neurological, Cardiovascular, Respiratory, Integumentary, General)
- **Keyboard accessible** (Tab + Enter/Space), ARIA labels, RTL Urdu labels

### Localization
- English / Urdu (Roman Urdu) toggle
- All UI strings, body-part labels, body-system names translated
- RTL-aware layout for Urdu

### Demo / Safety
- **No PHI stored** — everything in `localStorage`
- **Demo banner** on every screen
- **Medical disclaimer** — "Not for clinical use"
- **Emergency notice** — 1122 prominently shown

## Tech Stack
| Layer | Choice |
|-------|--------|
| Build | Vite 5 |
| Framework | React 18 (hooks, context) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| State | React Context + `localStorage` (no backend) |
| Icons | Inline SVG (no icon lib) |
| Fonts | System UI stack (Noto Nastaliq for Urdu if available) |

## Quick Start
```bash
npm install
npm run dev     # dev server at http://localhost:3000
npm run build   # production build to dist/
npm run preview # preview production build
```

## Project Structure
```
src/
├── components/
│   ├── BodyMap.tsx          # Anatomical body map (core)
│   ├── PatientDemo.tsx      # Multi-step intake wizard
│   ├── DoctorDashboard.tsx  # Case list + detail view
│   ├── LandingPage.tsx      # Public entry point
│   └── ... (supporting UI)
├── context/
│   ├── DemoDataContext.tsx  # Patient intake state + demo cases
│   └── LanguageContext.tsx  # EN/Urdu translations + RTL
└── main.tsx
```

## Key Files
- `src/components/BodyMap.tsx` — the anatomical body map (≈800 LOC)
- `src/context/DemoDataContext.tsx` — demo cases (dengue, typhoid, hypertension, etc.)
- `src/context/LanguageContext.tsx` — 150+ translation keys

## License
MIT — demo/educational use only. **Not for clinical deployment.**
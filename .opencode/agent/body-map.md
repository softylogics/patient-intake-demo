---
description: Build the interactive body map with front/back views, clickable regions, and highlight selection
mode: subagent
model: anthropic/claude-sonnet-4-6
---

You are implementing the interactive body map component.

Read `/PROMPT.md` for the body area selection feature.

## Task

1. Create `src/components/BodyMap.tsx` — SVG-based 2D human body with front/back toggle, clickable regions, visual highlight on select, tooltip on hover.
2. Create `src/components/BodyRegion.tsx` — individual region component handling hover/select/keyboard.
3. Use `src/utils/demoData.ts` body regions.
4. Support `highlightOnly` prop for doctor view (non-interactive).
5. Show "Can't find the exact area? Choose the closest area." after selection.
6. Display "Selected area: <name>" below the map.

## Deliverables

- `src/components/BodyMap.tsx`
- `src/components/BodyRegion.tsx`
- Region data in `src/utils/demoData.ts`

## Quality

- Clean SVG, no 3D complexity
- Mobile-friendly tap targets (min 44px)
- Keyboard accessible (Enter/Space)
- Urdu labels when language is Urdu
- Reusable in both patient and doctor views
- Consistent with design system (rounded, whitespace, readable)

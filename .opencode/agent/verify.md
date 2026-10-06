---
description: Verify end-to-end demo flow and document run instructions
mode: subagent
model: anthropic/claude-sonnet-4-6
---

You are verifying the complete remote patient intake demo application.

Read `/PROMPT.md` for the verification requirements.

## Task

1. Verify the complete flow end-to-end:
   - Patient Demo: Welcome → Select body area → Answer questions → Add optional info → Review → Submit
   - Doctor Dashboard: Open submitted case → See body location → See AI summary → Submit feedback
2. Check: language toggle (EN/UR), demo badges, disclaimers, localStorage persistence, reset demo.
3. Create `VERIFICATION.md` at project root with:
   - Prerequisites to run (`npm install`, `npm run dev`)
   - Verification steps for each screen
   - Known limitations
   - Troubleshooting tips

## Deliverables

- `VERIFICATION.md` at project root

## Quality

- Test without external resources
- Document all known issues
- Include clear steps a non-technical reviewer can follow
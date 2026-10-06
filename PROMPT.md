# Remote Patient Intake Demo — Project Prompt (Improved)

Build a polished, functional demo web application that showcases the concept of a remote patient information/intake system for Pakistani doctors.

The purpose of this demo is NOT to provide medical diagnosis, treatment, prescriptions, or real healthcare services. It will be shown to doctors so they can understand the concept and provide feedback.

## Core Concept (Improved for Pakistani Public)

Patient describes where they have a health problem → selects the affected body area → answers a few simple questions → optionally provides a voice/text description and photo → submits the case → doctor sees a structured summary of the patient's complaint.

**Pakistan-specific additions:**
- Gender preference for doctor (male/female) — important for Pakistani patients
- Pakistan-specific common conditions (dengue, malaria, typhoid, hepatitis, TB, hypertension, diabetes, respiratory infections)
- Emergency contacts (1122, 1021) for urgent cases
- Privacy notice for female patients
- Telemedicine option (call/video consultation)
- Mobile-first design (most Pakistanis use mobile)
- Roman Urdu support (many Pakistanis read Urdu in English script)

The most important feature is the visual body-area selection.

## Technology

React + TypeScript + Tailwind CSS + Vite. Local/mock data only. No backend. No auth. Store demo state in localStorage.

## Application Structure

Two demo experiences: **Patient Intake** and **Doctor Dashboard**.

Landing screen with [ Patient Demo ] / [ Doctor Demo ] buttons. Clear "DEMO MODE" indicator. Emergency notice for urgent symptoms.

## Patient Demo (7 screens)

1. **Welcome** — "Tell Your Doctor What You're Experiencing", Start button, EN/UR toggle, demo notice, emergency notice, privacy notice
2. **Select Problem Area** — Interactive body map (front/back), clickable regions, highlight on select, "Can't find the exact area?" message
3. **Demographics + Questions** — Age, gender, gender preference for doctor, symptoms selection, red flag screening, duration, severity, pain type, radiation
4. **Add More Info** — Photo upload (preview), document, simulated voice recording, Skip/Continue
5. **Review** — Structured medical summary, Edit/Submit
6. **Submission** — Success, "View Doctor Dashboard" button, telemedicine option
7. **Doctor Dashboard** — Stats, case list, case view, feedback

## Doctor Demo

Sidebar: Dashboard, Patient Cases, Demo Patient, Settings. Stats cards (New Cases, Today's Patients, Pending Review, Follow-ups). Case list with 5 fictional patients. Case view shows body map highlighted, structured info, AI summary ("DEMO — AI SUMMARY"), triage indicator (URGENT/ROUTINE), red flags, feedback form (Useful/Somewhat Useful/Not Useful + comment, saved to localStorage).

## Pakistani Localization

English / اردو toggle. Roman Urdu in text inputs ("Apni problem apne alfaaz mein likhein..."). Pakistan-specific terminology.

## Demo Data (8 cases)

Lower back pain, Knee pain, Skin rash, Headache, Abdominal pain, Dengue fever, Typhoid, Hypertension — each with name, age, gender, complaint, body area, duration, severity, description, symptoms, red flags.

## Medical Safety

No diagnosis, no treatment, no prescriptions. Persistent disclaimer: "Demo only. This prototype does not provide medical diagnosis or treatment." Emergency notice for red flags.

## Technical

Reusable components: BodyMap, BodyRegion, ProgressIndicator, QuestionCard, PatientSummary, AttachmentUploader, DoctorCaseCard, DoctorCaseView, FeedbackForm, LanguageToggle. Mock JSON data structures for regions, questions, patients, cases, translations. Questionnaire architecture extensible.

## Final Verification

Patient Demo → Select body area → Answer questions → Add info → Review → Submit → Doctor Dashboard → Open case → See body location → See AI summary → Submit feedback.

Complete in ~2 min patient flow, ~30 sec doctor onboarding.
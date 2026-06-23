# DayFlow

**Your day, orchestrated in glass.**

DayFlow is a premium React + Supabase day planner and productivity dashboard with Apple-style glassmorphism, a holographic 3D calendar cube, magnetic dock navigation, tasks, timeline blocks, habits, focus mode, settings, and Gemini-powered AI day planning.

## Tech Stack

- React + Vite
- Tailwind CSS
- Framer Motion
- React Three Fiber + Drei
- Lucide React icons
- Supabase Auth + Supabase Postgres
- Supabase Edge Function for Gemini API

## 1. Install

```bash
npm install
```

## 2. Create `.env`

Copy `.env.example` into `.env` and fill your Supabase project values:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
copy .env.example .env
```

Required frontend values:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## 3. Set up Supabase database

Open your Supabase dashboard, go to **SQL Editor**, then run:

```sql
-- Paste everything from supabase/migrations/0001_dayflow_schema.sql
```

This creates all tables, Row Level Security, policies, and default user settings.

## 4. Deploy the Gemini Edge Function

Install and login to Supabase CLI if needed:

```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

Set your Gemini key securely:

```bash
supabase secrets set GEMINI_API_KEY=your_gemini_api_key
```

Optional model override:

```bash
supabase secrets set GEMINI_MODEL=gemini-1.5-flash
```

Deploy:

```bash
supabase functions deploy generate-day-plan
```

## 5. Run locally

```bash
npm run dev
```

Open the URL Vite shows, usually:

```text
http://localhost:5173
```

## 6. Build for production

```bash
npm run build
npm run preview
```

## Notes

- The frontend never stores your Gemini API key.
- If the Edge Function has no Gemini key, it returns a clean fallback plan so the app still works in demo mode.
- Supabase email confirmation can be toggled in Supabase Auth settings. For easier local testing, you may disable email confirmation temporarily.
- For Vercel, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Project Settings → Environment Variables.

## Suggested upgrades later

- Weekly calendar view
- Push reminders
- Google Calendar sync
- AI task breakdown
- Team/shared planning
- Offline-first sync
- More 3D object themes


## Visual refresh notes

This version includes a React Bits-inspired Dock and Ferrofluid background. Install dependencies again after pulling this zip because the UI now uses extra animation/render packages:

```bash
npm install
```

New packages in `package.json`:

- `motion` for the magnetic dock animation
- `ogl` for the Ferrofluid WebGL background
- `lenis` because the React Bits ScrollStack component is included under `src/components/reactbits` for future landing-page/card-stack sections

The active dock wrapper is `src/components/Dock.jsx`; the reusable React Bits source lives in `src/components/reactbits/Dock.jsx` and `Dock.css`. The background is wired through `src/components/BackgroundOrbs.jsx` using `src/components/reactbits/Ferrofluid.jsx`.

# ECHO EARTH stage 2: add-on files for your Next.js project (untested)

Copy these folders into your `echo-earth` Next.js (App Router, TypeScript, `@/` alias) project.

1. `npm i @supabase/supabase-js @supabase/ssr zod maplibre-gl`
2. Create a Supabase project, then run `supabase/migrations/0001_init.sql` in the SQL editor.
3. Copy `.env.example` to `.env.local` and fill it in. Never expose the service-role key.
4. In Supabase > Authentication > URL Configuration, add `http://localhost:3000/auth/callback` and your Vercel URL.
5. Google sign-in: enable the provider in Supabase and add your Google OAuth credentials.
6. `npm run dev`, then open `/login`.

Endpoints: `GET/POST /api/scenarios`, `DELETE /api/scenarios/[id]`, `POST /api/insights`.
Scenario results are recomputed on the server. Insights use Gemini when `GEMINI_API_KEY` is set, otherwise rule-based text.

Not included: route protection middleware, rate limiting, forgot-password, account deletion,
locations/observations/simulation_runs/reports tables, and map overlays.

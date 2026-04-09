# Bridge

A mobile-first, full-screen 4-step exercise that helps you shift your state and get moving. No accounts, no login — just open and go.

**Tech stack:** Next.js 14 (App Router) · Tailwind CSS · Supabase · Rive · Vercel

---

## Setup

### 1. Clone and install

```bash
git clone <your-repo>
cd bridge
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run the contents of [`supabase/schema.sql`](./supabase/schema.sql)
3. Go to **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> The service role key is only used server-side (API routes) and is never exposed to the browser.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Rive animation

Place your `.riv` file at `public/animations/bridge.riv`. The `<RiveAnimation />` component in [`components/RiveAnimation.tsx`](./components/RiveAnimation.tsx) will load it automatically. Until a file is present, a pulsing placeholder circle is shown.

To change the state machine name, update the `stateMachine` prop on the `<RiveAnimation />` call in [`app/page.tsx`](./app/page.tsx).

---

## Deploy to Vercel

1. Push the project to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add the three environment variables in **Project Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Click **Deploy**

No other configuration needed — Next.js and Tailwind are detected automatically.

---

## Event schema

All events are stored in a single `events` table:

| Column | Type | Notes |
|---|---|---|
| `id` | bigserial | Auto-increment PK |
| `session_id` | text | UUID generated per browser, stored in localStorage |
| `event_type` | text | `exercise_started`, `step_completed`, `exercise_completed` |
| `step_number` | integer | Null except for `step_completed` events |
| `timestamp` | timestamptz | ISO 8601, set by the client |

---

## Admin

Visit `/admin` (unlisted, no auth) for:
- Total sessions / started / completed
- Completion rate
- Full event log

-- Bridge — Supabase schema
-- Run this in the Supabase SQL editor to create the events table.

create table if not exists events (
  id          bigserial primary key,
  session_id  text        not null,
  event_type  text        not null check (event_type in ('exercise_started', 'step_completed', 'exercise_completed')),
  step_number integer,
  timestamp   timestamptz not null default now()
);

-- Index for fast admin queries
create index if not exists events_session_id_idx on events (session_id);
create index if not exists events_event_type_idx  on events (event_type);
create index if not exists events_timestamp_idx   on events (timestamp desc);

-- Row-level security (public insert, no reads without service key)
alter table events enable row level security;

-- Allow anyone to insert (anonymous tracking)
create policy "Allow anonymous inserts" on events
  for insert with check (true);

-- Only service role can read (used by the API route via service key)
create policy "Service role reads" on events
  for select using (auth.role() = 'service_role');

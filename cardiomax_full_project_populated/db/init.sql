-- Run this in Supabase SQL editor
create table bookings (
  id uuid default gen_random_uuid() primary key,
  name text,
  email text,
  phone text,
  type text,
  date date,
  time text,
  status text default 'pending',
  stripe_payment_intent text,
  cancelled_reason text,
  google_event_id text,
  created_at timestamptz default now()
);

-- Missed Call Leads MVP schema
-- Run in Supabase SQL Editor

create type lead_source as enum ('missed_call', 'sms', 'form');
create type lead_status as enum ('new', 'contacted', 'booked', 'completed');
create type call_status as enum ('missed', 'answered', 'no_answer');

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_name text not null,
  email text not null,
  phone_number text,
  twilio_number text,
  sms_template text not null default 'Sorry we missed your call from {business_name}. What do you need help with? Reply here or tell us more: {form_link}',
  booking_link text,
  notification_email text not null,
  is_active boolean not null default true,
  subscription_status text not null default 'trial',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  caller_phone text not null,
  caller_name text,
  message text not null,
  job_type text,
  urgency text,
  source lead_source not null default 'missed_call',
  status lead_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.calls (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  caller_phone text not null,
  call_status call_status not null default 'missed',
  twilio_call_sid text,
  created_at timestamptz not null default now()
);

create index leads_business_id_idx on public.leads(business_id);
create index leads_status_idx on public.leads(status);
create index calls_business_id_idx on public.calls(business_id);

alter table public.businesses enable row level security;
alter table public.leads enable row level security;
alter table public.calls enable row level security;

-- Businesses: owners only
create policy "Users read own business"
  on public.businesses for select
  using (auth.uid() = user_id);

create policy "Users insert own business"
  on public.businesses for insert
  with check (auth.uid() = user_id);

create policy "Users update own business"
  on public.businesses for update
  using (auth.uid() = user_id);

-- Leads: business owners
create policy "Users read own leads"
  on public.leads for select
  using (
    business_id in (select id from public.businesses where user_id = auth.uid())
  );

create policy "Users update own leads"
  on public.leads for update
  using (
    business_id in (select id from public.businesses where user_id = auth.uid())
  );

-- Calls: business owners
create policy "Users read own calls"
  on public.calls for select
  using (
    business_id in (select id from public.businesses where user_id = auth.uid())
  );

-- Early access waitlist (public insert, no auth required)
create table public.early_access (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

alter table public.early_access enable row level security;

create policy "Anyone can join waitlist"
  on public.early_access for insert
  with check (true);

-- Service role bypasses RLS for webhooks (use service client server-side only)

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger businesses_updated_at
  before update on public.businesses
  for each row execute function public.handle_updated_at();

create trigger leads_updated_at
  before update on public.leads
  for each row execute function public.handle_updated_at();

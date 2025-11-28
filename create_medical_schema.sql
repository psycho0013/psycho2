-- Create symptoms table
create table if not exists public.symptoms (
  id text primary key,
  name text not null,
  category text not null,
  severities jsonb not null default '[]'::jsonb
);

-- Create treatments table
create table if not exists public.treatments (
  id text primary key,
  name text not null,
  description text,
  type text not null,
  dosage text,
  instructions text,
  duration text,
  side_effects jsonb default '[]'::jsonb,
  precautions jsonb default '[]'::jsonb
);

-- Create diseases table
create table if not exists public.diseases (
  id text primary key,
  name text not null,
  description text,
  symptoms jsonb default '[]'::jsonb, -- Array of symptom IDs
  treatments jsonb default '[]'::jsonb, -- Array of treatment IDs
  prevention jsonb default '[]'::jsonb,
  causes jsonb default '[]'::jsonb,
  complications jsonb default '[]'::jsonb,
  diagnosis_method text
);

-- Enable RLS
alter table public.symptoms enable row level security;
alter table public.treatments enable row level security;
alter table public.diseases enable row level security;

-- Create policies (Public Read, Authenticated/Anon Write for demo)
-- Note: In production, write access should be restricted to admins only.

-- Symptoms Policies
create policy "Enable read access for all users" on public.symptoms for select using (true);
create policy "Enable insert for all users" on public.symptoms for insert with check (true);
create policy "Enable update for all users" on public.symptoms for update using (true);
create policy "Enable delete for all users" on public.symptoms for delete using (true);

-- Treatments Policies
create policy "Enable read access for all users" on public.treatments for select using (true);
create policy "Enable insert for all users" on public.treatments for insert with check (true);
create policy "Enable update for all users" on public.treatments for update using (true);
create policy "Enable delete for all users" on public.treatments for delete using (true);

-- Diseases Policies
create policy "Enable read access for all users" on public.diseases for select using (true);
create policy "Enable insert for all users" on public.diseases for insert with check (true);
create policy "Enable update for all users" on public.diseases for update using (true);
create policy "Enable delete for all users" on public.diseases for delete using (true);

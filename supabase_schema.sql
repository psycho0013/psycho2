-- Create diagnoses table
create table public.diagnoses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  governorate text,
  age integer,
  gender text,
  disease_id text,
  disease_name text,
  is_emergency boolean default false,
  symptoms jsonb
);

-- Create site_content table for CMS
create table public.site_content (
  id text primary key,
  content jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.diagnoses enable row level security;
alter table public.site_content enable row level security;

-- Create policies (Allow public read/write for demo purposes)
-- In a real production app, you would restrict write access
create policy "Enable read access for all users" on public.diagnoses for select using (true);
create policy "Enable insert access for all users" on public.diagnoses for insert with check (true);

create policy "Enable read access for all users" on public.site_content for select using (true);
create policy "Enable insert/update access for all users" on public.site_content for all using (true);

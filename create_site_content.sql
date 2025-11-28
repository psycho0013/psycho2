-- Create site_content table if it doesn't exist
create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.site_content enable row level security;

-- Create policies (dropping existing ones first to avoid errors if re-running)
drop policy if exists "Enable read access for all users" on public.site_content;
drop policy if exists "Enable insert/update for all users" on public.site_content;
drop policy if exists "Enable update for all users" on public.site_content;

create policy "Enable read access for all users"
on public.site_content for select
using (true);

create policy "Enable insert/update for all users"
on public.site_content for insert
with check (true);

create policy "Enable update for all users"
on public.site_content for update
using (true);

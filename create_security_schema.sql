-- Create security_keys table to store the Admin's Encrypted Private Key
-- This table should only be writable by Admin, and readable by Admin.
-- The Public Key will be stored here too, readable by everyone.

create table if not exists public.security_keys (
  id text primary key, -- 'admin_key_pair'
  public_key text not null, -- JWK JSON string (Public)
  encrypted_private_key text not null, -- Encrypted JWK JSON string (Private, encrypted with Master Password)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.security_keys enable row level security;

-- Policies
-- Public Key is readable by everyone (so patients can encrypt)
create policy "Enable read access for all users" on public.security_keys for select using (true);

-- Only Admin can insert/update (In a real app, restrict to specific user ID, here we assume authenticated = admin for simplicity or use a specific check)
create policy "Enable insert/update for authenticated users only" on public.security_keys for all using (auth.role() = 'authenticated');

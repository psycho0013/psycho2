-- Create Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  gender text check (gender in ('Male', 'Female')),
  date_of_birth date,
  blood_type text check (blood_type in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown')),
  height numeric, -- in cm
  weight numeric, -- in kg
  chronic_conditions jsonb default '[]'::jsonb, -- Array of strings e.g. ['Diabetes', 'Hypertension']
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Users can view their own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can update their own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Users can insert their own profile" 
  on public.profiles for insert 
  with check (auth.uid() = id);

-- Create Medical History Table
create table if not exists public.medical_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  symptoms jsonb not null default '[]'::jsonb,
  diagnosis_result jsonb,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Medical History
alter table public.medical_history enable row level security;

-- Medical History Policies
create policy "Users can view their own history" 
  on public.medical_history for select 
  using (auth.uid() = user_id);

create policy "Users can insert their own history" 
  on public.medical_history for insert 
  with check (auth.uid() = user_id);

-- Function to handle new user signup (Auto-create profile)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

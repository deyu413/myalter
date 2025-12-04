-- ==============================================================================
-- GHOST PROTOCOL - INITIALIZATION SCRIPT
-- ==============================================================================
-- This script sets up the entire backend infrastructure for Ghost Protocol.
-- It is idempotent (safe to run multiple times).

-- 1. EXTENSIONS
-- Enable the pgvector extension to work with OpenAI embeddings
create extension if not exists vector;

-- 2. TABLES

-- PROFILES: Public user data
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  age int,
  gender text,
  location_code text, -- ISO code e.g., 'ES', 'US'
  avatar_url text,
  is_onboarded boolean default false,
  updated_at timestamp with time zone,
  
  constraint username_length check (char_length(username) >= 3)
);

-- GHOSTS: The AI Brain (Strictly Private)
create table if not exists public.ghosts (
  user_id uuid references public.profiles(id) on delete cascade not null primary key,
  persona_vector jsonb not null, -- Stores traits, style, red_flags
  embedding vector(1536), -- OpenAI text-embedding-3-small
  is_active boolean default true,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- SIMULATIONS: The Match Results
create table if not exists public.simulations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null, -- The user who ran it
  target_ghost_id uuid references public.ghosts(user_id) on delete cascade not null,
  scenario_id text not null,
  score int check (score >= 0 and score <= 100),
  summary text,
  result jsonb, -- Full structured result from LLM
  is_unlocked boolean default false, -- Monetization flag
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- USER CREDITS: The Wallet
create table if not exists public.user_credits (
  user_id uuid references public.profiles(id) on delete cascade not null primary key,
  balance int default 0 check (balance >= 0),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. ROW LEVEL SECURITY (RLS)
-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.ghosts enable row level security;
alter table public.simulations enable row level security;
alter table public.user_credits enable row level security;

-- PROFILES POLICIES
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- GHOSTS POLICIES (Strict Privacy)
-- Only the owner can see their own ghost configuration.
-- The "embedding" column is hidden from public view to prevent vector scraping.
create policy "Users can view own ghost"
  on public.ghosts for select
  using ( auth.uid() = user_id );

create policy "Users can update own ghost"
  on public.ghosts for insert
  with check ( auth.uid() = user_id );

create policy "Users can modify own ghost"
  on public.ghosts for update
  using ( auth.uid() = user_id );

-- SIMULATIONS POLICIES
-- Users can only see simulations they created.
create policy "Users can view own simulations"
  on public.simulations for select
  using ( auth.uid() = user_id );

create policy "Users can insert simulations"
  on public.simulations for insert
  with check ( auth.uid() = user_id );

-- CREDITS POLICIES
-- Users can read their balance, but ONLY the system (Postgres) can update it.
create policy "Users can view own credits"
  on public.user_credits for select
  using ( auth.uid() = user_id );

-- 4. AUTOMATION (TRIGGERS)

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- 1. Create Profile
  insert into public.profiles (id, username, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');

  -- 2. Create Wallet with 3 FREE CREDITS
  insert into public.user_credits (user_id, balance)
  values (new.id, 3);

  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function on auth.users insert
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. AI MATCHING FUNCTION (RPC)
-- This function runs with SECURITY DEFINER to access the private 'ghosts' table
-- but only returns safe public data.

create or replace function match_ghosts(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  user_id uuid,
  similarity float,
  username text,
  age int,
  gender text,
  location_code text,
  avatar_url text
)
language plpgsql
security definer
as $$
begin
  return query
  select
    g.user_id,
    1 - (g.embedding <=> query_embedding) as similarity,
    p.username,
    p.age,
    p.gender,
    p.location_code,
    p.avatar_url
  from
    public.ghosts g
  join
    public.profiles p on g.user_id = p.id
  where
    1 - (g.embedding <=> query_embedding) > match_threshold
    and g.user_id != auth.uid() -- Exclude self
    and g.is_active = true
  order by
    g.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- 6. CREDIT DEDUCTION HELPER
create or replace function deduct_credit(
  user_id uuid,
  amount int
)
returns void
language plpgsql
security definer
as $$
begin
  update public.user_credits
  set balance = balance - amount,
      updated_at = now()
  where user_id = deduct_credit.user_id
  and balance >= amount;
  
  if not found then
    raise exception 'Insufficient credits';
  end if;
end;
$$;

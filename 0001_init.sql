-- ECHO EARTH stage 2: profiles + scenarios with Row Level Security
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  preferred_theme text not null default 'dark' check (preferred_theme in ('dark','light')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.scenarios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  model_version text not null,
  input_parameters jsonb not null,
  results jsonb not null,
  created_at timestamptz not null default now()
);
create index scenarios_user_idx on public.scenarios(user_id, created_at desc);
alter table public.profiles enable row level security;
alter table public.scenarios enable row level security;
create policy "own profile read" on public.profiles for select using ((select auth.uid()) = id);
create policy "own profile update" on public.profiles for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "own scenarios read" on public.scenarios for select using ((select auth.uid()) = user_id);
create policy "own scenarios insert" on public.scenarios for insert with check ((select auth.uid()) = user_id);
create policy "own scenarios update" on public.scenarios for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own scenarios delete" on public.scenarios for delete using ((select auth.uid()) = user_id);
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin insert into public.profiles(id, display_name) values (new.id, split_part(new.email,'@',1)); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

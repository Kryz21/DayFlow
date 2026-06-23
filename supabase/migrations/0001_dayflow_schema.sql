-- DayFlow database schema
-- Paste this whole file into Supabase SQL Editor and click Run.
-- Safe to run more than once.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  theme text not null default 'dark' check (theme in ('dark', 'light')),
  accent text not null default 'silver',
  display_name text not null default 'DayFlow User',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  notes text default '',
  category text not null default 'Other' check (category in ('Study', 'Fitness', 'Personal', 'Work', 'Creative', 'Other')),
  priority text not null default 'Medium' check (priority in ('Low', 'Medium', 'High')),
  due_date date not null default current_date,
  completed boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.timeline_blocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  title text not null,
  block_date date not null default current_date,
  start_time text not null default '09:00',
  end_time text not null default '10:00',
  category text not null default 'Other' check (category in ('Study', 'Fitness', 'Personal', 'Work', 'Creative', 'Other')),
  priority text not null default 'Medium' check (priority in ('Low', 'Medium', 'High')),
  completed boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  icon text not null default 'Sparkles',
  target_per_week integer not null default 7 check (target_per_week between 1 and 7),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  log_date date not null default current_date,
  completed boolean not null default true,
  created_at timestamptz not null default now(),
  unique (habit_id, log_date)
);

create table if not exists public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  duration_minutes integer not null check (duration_minutes > 0),
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists tasks_user_due_idx on public.tasks(user_id, due_date);
create index if not exists timeline_user_date_idx on public.timeline_blocks(user_id, block_date);
create index if not exists habits_user_active_idx on public.habits(user_id, active);
create index if not exists habit_logs_user_date_idx on public.habit_logs(user_id, log_date);
create index if not exists focus_sessions_user_completed_idx on public.focus_sessions(user_id, completed_at);

drop trigger if exists profiles_updated_at on public.profiles;
drop trigger if exists user_settings_updated_at on public.user_settings;
drop trigger if exists tasks_updated_at on public.tasks;
drop trigger if exists timeline_blocks_updated_at on public.timeline_blocks;
drop trigger if exists habits_updated_at on public.habits;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger user_settings_updated_at before update on public.user_settings for each row execute function public.set_updated_at();
create trigger tasks_updated_at before update on public.tasks for each row execute function public.set_updated_at();
create trigger timeline_blocks_updated_at before update on public.timeline_blocks for each row execute function public.set_updated_at();
create trigger habits_updated_at before update on public.habits for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.tasks enable row level security;
alter table public.timeline_blocks enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.focus_sessions enable row level security;

drop policy if exists "Profiles are owned by users" on public.profiles;
drop policy if exists "Settings are owned by users" on public.user_settings;
drop policy if exists "Tasks are owned by users" on public.tasks;
drop policy if exists "Timeline blocks are owned by users" on public.timeline_blocks;
drop policy if exists "Habits are owned by users" on public.habits;
drop policy if exists "Habit logs are owned by users" on public.habit_logs;
drop policy if exists "Focus sessions are owned by users" on public.focus_sessions;

create policy "Profiles are owned by users" on public.profiles
  for all using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Settings are owned by users" on public.user_settings
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Tasks are owned by users" on public.tasks
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Timeline blocks are owned by users" on public.timeline_blocks
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Habits are owned by users" on public.habits
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Habit logs are owned by users" on public.habit_logs
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Focus sessions are owned by users" on public.focus_sessions
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant usage on schema public to anon, authenticated;
grant all on public.profiles to authenticated;
grant all on public.user_settings to authenticated;
grant all on public.tasks to authenticated;
grant all on public.timeline_blocks to authenticated;
grant all on public.habits to authenticated;
grant all on public.habit_logs to authenticated;
grant all on public.focus_sessions to authenticated;

create or replace function public.handle_new_dayflow_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_name text;
begin
  clean_name := coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1), 'DayFlow User');

  insert into public.profiles (id, display_name)
  values (new.id, clean_name)
  on conflict (id) do nothing;

  insert into public.user_settings (user_id, display_name, theme, accent)
  values (new.id, clean_name, 'dark', 'silver')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_dayflow on auth.users;
create trigger on_auth_user_created_dayflow
  after insert on auth.users
  for each row execute function public.handle_new_dayflow_user();

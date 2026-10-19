-- =====================================================================
-- UstazLab — Supabase схемасы
-- Қолдану: Supabase → SQL Editor → New query → осы файлды толық қойып → Run
-- Қайта іске қосуға қауіпсіз (if not exists / or replace).
-- =====================================================================

-- ---------- 1. Профильдер ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null default '',
  role        text not null default 'student'
              check (role in ('student', 'teacher', 'researcher')),
  group_code  text,               -- эксперимент / бақылау тобының коды
  created_at  timestamptz not null default now()
);

-- Зерттеуші ме? (RLS ішінде рекурсиясыз тексеру үшін security definer)
create or replace function public.is_researcher()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'researcher'
  );
$$;

-- Тіркелгенде профиль автоматты түрде жасалады.
-- 'researcher' рөлін өзі таңдай алмайды — тек student/teacher.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text := coalesce(new.raw_user_meta_data->>'role', 'student');
begin
  if requested_role not in ('student', 'teacher') then
    requested_role := 'student';
  end if;

  insert into public.profiles (id, full_name, role, group_code)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    requested_role,
    nullif(upper(trim(new.raw_user_meta_data->>'group_code')), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Пайдаланушы өз рөлін өзгерте алмайды (тек зерттеуші немесе SQL Editor)
create or replace function public.prevent_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_researcher() then
    raise exception 'Рөлді өзгертуге рұқсат жоқ';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_change on public.profiles;
create trigger profiles_prevent_role_change
  before update on public.profiles
  for each row execute function public.prevent_role_change();

-- ---------- 2. Кіріс / шығыс бағалау (pre / post) ----------
create table if not exists public.assessment_attempts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  kind          text not null check (kind in ('pre', 'post')),
  answers       jsonb not null,     -- { itemId: optionId }
  self_ratings  jsonb not null,     -- { competencyKey: 1..5 }
  scores        jsonb not null,     -- { competencyKey: 0..100 }
  duration_sec  integer,
  completed_at  timestamptz not null default now(),
  unique (user_id, kind)            -- әр адам pre мен post-ты бір рет қана тапсырады
);

-- ---------- 3. Курс модульдеріндегі жауаптар ----------
create table if not exists public.module_responses (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  module_id       integer not null,
  question_index  integer not null,
  option_index    integer not null,
  created_at      timestamptz not null default now(),
  unique (user_id, module_id, question_index)
);

-- ---------- 4. Рефлексиялар ----------
create table if not exists public.reflections (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  module_id   integer not null,
  text        text not null check (char_length(text) >= 20),
  created_at  timestamptz not null default now(),
  unique (user_id, module_id)
);

-- ---------- 5. Row Level Security ----------
alter table public.profiles            enable row level security;
alter table public.assessment_attempts enable row level security;
alter table public.module_responses    enable row level security;
alter table public.reflections         enable row level security;

-- profiles
drop policy if exists "profiles: өзін немесе зерттеуші көреді" on public.profiles;
create policy "profiles: өзін немесе зерттеуші көреді" on public.profiles
  for select using (id = auth.uid() or public.is_researcher());

drop policy if exists "profiles: өзін өзгертеді" on public.profiles;
create policy "profiles: өзін өзгертеді" on public.profiles
  for update using (id = auth.uid() or public.is_researcher());

-- assessment_attempts
drop policy if exists "attempts: оқу" on public.assessment_attempts;
create policy "attempts: оқу" on public.assessment_attempts
  for select using (user_id = auth.uid() or public.is_researcher());

drop policy if exists "attempts: өзі қосады" on public.assessment_attempts;
create policy "attempts: өзі қосады" on public.assessment_attempts
  for insert with check (user_id = auth.uid());
-- update/delete саясаты әдейі жоқ: тапсырылған нәтижені өзгертуге болмайды.

-- module_responses
drop policy if exists "responses: оқу" on public.module_responses;
create policy "responses: оқу" on public.module_responses
  for select using (user_id = auth.uid() or public.is_researcher());

drop policy if exists "responses: өзі қосады" on public.module_responses;
create policy "responses: өзі қосады" on public.module_responses
  for insert with check (user_id = auth.uid());

-- reflections
drop policy if exists "reflections: оқу" on public.reflections;
create policy "reflections: оқу" on public.reflections
  for select using (user_id = auth.uid() or public.is_researcher());

drop policy if exists "reflections: өзі қосады" on public.reflections;
create policy "reflections: өзі қосады" on public.reflections
  for insert with check (user_id = auth.uid());

-- ---------- 5b. Топ баптаулары (бақылау тобына шығыс диагностиканы ашу) ----------
create table if not exists public.group_settings (
  group_code text primary key,
  post_open  boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.group_settings enable row level security;
drop policy if exists "group_settings_select" on public.group_settings;
create policy "group_settings_select" on public.group_settings for select to authenticated using (true);
drop policy if exists "group_settings_insert" on public.group_settings;
create policy "group_settings_insert" on public.group_settings for insert to authenticated with check (public.is_researcher());
drop policy if exists "group_settings_update" on public.group_settings;
create policy "group_settings_update" on public.group_settings for update to authenticated using (public.is_researcher());

-- ---------- 6. Функцияларды сырттан шақыруды жабу ----------
-- Триггер функцияларын API арқылы шақыруға болмайды; is_researcher тек RLS үшін.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.prevent_role_change() from public, anon, authenticated;
revoke execute on function public.is_researcher() from public, anon;
grant execute on function public.is_researcher() to authenticated;

-- =====================================================================
-- ӨЗІҢІЗДІ ЗЕРТТЕУШІ ЕТУ (бір рет, сайтта тіркелгеннен кейін):
--   update public.profiles set role = 'researcher'
--   where id = (select id from auth.users where email = 'сіздің@поштаңыз');
-- =====================================================================

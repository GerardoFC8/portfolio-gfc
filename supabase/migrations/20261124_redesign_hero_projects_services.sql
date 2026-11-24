-- Redesign: value headline in the hero, client vs open-source projects,
-- and a services table. Additive only: the site in production keeps working,
-- because it selects explicit columns and never reads the new ones.
--
-- Run once in Supabase > SQL Editor. Safe to re-run.

begin;

-- 1. Hero: a results-oriented headline above the subtitle --------------------
alter table public.hero
  add column if not exists headline_es text not null default '',
  add column if not exists headline_en text not null default '';

-- 2. Projects: client work vs open-source tools for developers ---------------
alter table public.projects
  add column if not exists category text not null default 'client';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'projects_category_check'
  ) then
    alter table public.projects
      add constraint projects_category_check
      check (category in ('client', 'open_source'));
  end if;
end $$;

-- 3. Services -------------------------------------------------------------------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  "order" integer not null default 0,
  icon text not null default 'wrench',        -- lucide icon key, see services.tsx
  featured boolean not null default false,     -- highlighted card
  title_es text not null,
  title_en text not null,
  description_es text not null default '',
  description_en text not null default '',
  items_es text[] not null default '{}',       -- "what it includes" list
  items_en text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;

drop policy if exists "services are public" on public.services;
create policy "services are public"
  on public.services for select
  using (true);

-- Same rule as the admin panel: only the 'admin' role can write.
drop policy if exists "admins manage services" on public.services;
create policy "admins manage services"
  on public.services for all
  to authenticated
  using ((select public.get_user_role()) = 'admin')
  with check ((select public.get_user_role()) = 'admin');

commit;

-- Rollback (only if needed):
--   drop table if exists public.services;
--   alter table public.projects drop constraint if exists projects_category_check;
--   alter table public.projects drop column if exists category;
--   alter table public.hero drop column if exists headline_es, drop column if exists headline_en;

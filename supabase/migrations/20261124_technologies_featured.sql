-- Featured technologies: the short list a client sees first. The rest stay
-- available under "Other technologies". Additive: production ignores it.
--
-- Run once in Supabase > SQL Editor. Safe to re-run.

alter table public.technologies
  add column if not exists featured boolean not null default false;

-- Rollback (only if needed):
--   alter table public.technologies drop column if exists featured;

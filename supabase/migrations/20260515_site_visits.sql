-- Anonymous and signed-in page visits (admin reads via service role).
create table if not exists public.site_visits (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null,
  user_id uuid references public.users (id) on delete set null,
  path text not null,
  referrer text,
  user_agent text,
  country text,
  created_at timestamptz not null default now()
);

create index if not exists idx_site_visits_created on public.site_visits (created_at desc);
create index if not exists idx_site_visits_visitor on public.site_visits (visitor_id, created_at desc);
create index if not exists idx_site_visits_user on public.site_visits (user_id, created_at desc)
  where user_id is not null;

alter table public.site_visits enable row level security;

-- No policies: inserts from server (service role); reads from admin API only.

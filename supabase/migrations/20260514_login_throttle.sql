-- Track failed password attempts per app user (row exists in public.users).
create table if not exists public.login_throttle (
  user_id uuid primary key references public.users (id) on delete cascade,
  failed_count int not null default 0 check (failed_count >= 0 and failed_count <= 20),
  updated_at timestamptz not null default now()
);

alter table public.login_throttle enable row level security;

-- No policies: only service_role (server) should access this table.

create index if not exists idx_login_throttle_updated on public.login_throttle (updated_at desc);

-- Shareable read-only report links (default 7-day expiry set in app).
create table if not exists public.search_shares (
  id uuid primary key default gen_random_uuid(),
  search_id uuid not null references public.searches (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_search_shares_token on public.search_shares (token);
create index if not exists idx_search_shares_search on public.search_shares (search_id);

alter table public.search_shares enable row level security;

-- Stripe Customer Portal
alter table public.users
  add column if not exists stripe_customer_id text;

create index if not exists idx_users_stripe_customer on public.users (stripe_customer_id)
  where stripe_customer_id is not null;

-- Limit warning emails (avoid spam)
alter table public.users
  add column if not exists limit_warned_at timestamptz,
  add column if not exists limit_reached_emailed_at timestamptz;

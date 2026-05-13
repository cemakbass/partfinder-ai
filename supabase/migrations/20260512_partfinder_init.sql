create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  plan text not null default 'free' check (plan in ('free', 'starter', 'pro', 'ultra')),
  searches_used int not null default 0 check (searches_used >= 0),
  searches_limit int not null default 2 check (searches_limit >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  image_url text not null,
  result_json jsonb not null,
  vehicle_make text,
  vehicle_model text,
  vehicle_year text,
  created_at timestamptz not null default now()
);

create index if not exists idx_searches_user_created on public.searches (user_id, created_at desc);

alter table public.users enable row level security;
alter table public.searches enable row level security;

drop policy if exists "users_select_own" on public.users;
create policy "users_select_own" on public.users
for select using (auth.uid() = id);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
for update using (auth.uid() = id);

drop policy if exists "searches_select_own" on public.searches;
create policy "searches_select_own" on public.searches
for select using (auth.uid() = user_id);

drop policy if exists "searches_insert_own" on public.searches;
create policy "searches_insert_own" on public.searches
for insert with check (auth.uid() = user_id);

create or replace function public.consume_search_credit(p_user_id uuid)
returns table(searches_used int, searches_limit int)
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.users as u
  set searches_used = u.searches_used + 1
  where u.id = p_user_id
    and u.searches_used < u.searches_limit;

  if not found then
    raise exception 'Search limit reached';
  end if;

  return query
  select u.searches_used, u.searches_limit
  from public.users u
  where u.id = p_user_id;
end;
$$;

revoke all on function public.consume_search_credit(uuid) from public;
grant execute on function public.consume_search_credit(uuid) to service_role;

insert into storage.buckets (id, name, public)
values ('part-images', 'part-images', true)
on conflict (id) do nothing;

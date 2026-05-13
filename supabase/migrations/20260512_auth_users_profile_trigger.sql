-- Auto-create public.users when a new auth user signs up (no client INSERT needed; avoids RLS insert gaps).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, plan, searches_used, searches_limit)
  values (new.id, coalesce(new.email, ''), 'free', 0, 2)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

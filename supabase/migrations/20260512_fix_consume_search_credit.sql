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
  from public.users as u
  where u.id = p_user_id;
end;
$$;

revoke all on function public.consume_search_credit(uuid) from public;
grant execute on function public.consume_search_credit(uuid) to service_role;

-- Grants the existing MyPantry demo account access to the protected user
-- maintenance Edge Function. The account is pinned by immutable Auth UUID so a
-- later account created with the same email cannot inherit administrator access.
-- Run this migration only after mypantrydemo@gmail.com is confirmed in Auth.
begin;

-- User deletion should also remove that user's pantry rows, matching the
-- existing on-delete-cascade behavior of the other account-owned tables.
alter table public.pantry_item
  drop constraint if exists pantry_item_auth_user_id_fkey;
alter table public.pantry_item
  add constraint pantry_item_auth_user_id_fkey
  foreign key (auth_user_id) references auth.users(id) on delete cascade;

create schema if not exists app_private;
revoke all on schema app_private from public, anon, authenticated;

create table if not exists app_private.maintenance_admin_account (
  singleton boolean primary key default true check (singleton),
  user_id uuid not null references auth.users(id) on delete restrict
);
alter table app_private.maintenance_admin_account enable row level security;
revoke all on app_private.maintenance_admin_account from public, anon, authenticated;

do $$
declare
  demo_count integer;
  demo_id uuid;
begin
  select count(*) into demo_count
    from auth.users u
    where pg_catalog.lower(u.email) = 'mypantrydemo@gmail.com'
      and u.email_confirmed_at is not null
      and not coalesce(u.is_anonymous, false);

  if demo_count <> 1 then
    raise exception 'User maintenance requires exactly one confirmed mypantrydemo@gmail.com Auth account; found %.', demo_count;
  end if;

  select u.id into demo_id
    from auth.users u
    where pg_catalog.lower(u.email) = 'mypantrydemo@gmail.com'
      and u.email_confirmed_at is not null
      and not coalesce(u.is_anonymous, false);

  insert into app_private.maintenance_admin_account (singleton, user_id)
    values (true, demo_id)
    on conflict (singleton) do nothing;

  if not exists (
    select 1 from app_private.maintenance_admin_account a
    where a.singleton and a.user_id = demo_id
  ) then
    raise exception 'The maintenance administrator is already pinned to another Auth user.';
  end if;
end;
$$;

create or replace function public.is_maintenance_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
      from app_private.maintenance_admin_account a
      join auth.users u on u.id = a.user_id
      where a.singleton
        and a.user_id = (select auth.uid())
        and u.email_confirmed_at is not null
        and not coalesce(u.is_anonymous, false)
  );
$$;
revoke all on function public.is_maintenance_admin() from public, anon, authenticated;
grant execute on function public.is_maintenance_admin() to authenticated;

commit;

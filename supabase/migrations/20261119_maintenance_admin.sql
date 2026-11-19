-- Maintenance access is tied to confirmed Auth identities, never to an email
-- typed in the browser. Apply after 20261116_admin_okr_dashboard.sql.
begin;

create schema if not exists app_private;
revoke all on schema app_private from public, anon, authenticated;

create table if not exists app_private.maintenance_admin_account (
  user_id uuid primary key references auth.users(id) on delete cascade,
  granted_at timestamptz not null default now()
);
alter table app_private.maintenance_admin_account enable row level security;
revoke all on app_private.maintenance_admin_account from public, anon, authenticated;

-- Bootstrap the known site owner from the already pinned OKR administrator.
-- A separate grader account can be added only after its actual Auth UUID and
-- confirmed email are known; do not give access based on an email string alone.
do $$
declare
  bootstrap_id uuid;
begin
  select a.user_id into bootstrap_id
    from app_private.okr_admin_account a
    join auth.users u on u.id = a.user_id
    where a.singleton
      and pg_catalog.lower(u.email) = 'rgardanier@gmail.com'
      and u.email_confirmed_at is not null
      and not coalesce(u.is_anonymous, false);

  if bootstrap_id is null then
    raise exception 'Maintenance setup requires the existing confirmed OKR administrator.';
  end if;

  insert into app_private.maintenance_admin_account (user_id)
    values (bootstrap_id)
    on conflict (user_id) do nothing;
end;
$$;

-- The client can ask whether its own verified JWT belongs to the allowlist.
-- No private table rows or other administrators' identities are returned.
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
      where a.user_id = (select auth.uid())
        and u.email_confirmed_at is not null
        and not coalesce(u.is_anonymous, false)
  );
$$;
revoke all on function public.is_maintenance_admin() from public, anon, authenticated;
grant execute on function public.is_maintenance_admin() to authenticated;

-- The Edge Function uses this service-only check before deleting an Auth user.
-- An allowlisted account cannot be deleted from the maintenance UI.
create or replace function public.is_maintenance_admin_user(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from app_private.maintenance_admin_account a
      where a.user_id = p_user_id
  );
$$;
revoke all on function public.is_maintenance_admin_user(uuid) from public, anon, authenticated;
grant execute on function public.is_maintenance_admin_user(uuid) to service_role;

-- The server can mark protected accounts in the user list without exposing
-- the allowlist to normal browser sessions.
create or replace function public.maintenance_admin_user_ids()
returns uuid[]
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(pg_catalog.array_agg(a.user_id), '{}'::uuid[])
    from app_private.maintenance_admin_account a;
$$;
revoke all on function public.maintenance_admin_user_ids() from public, anon, authenticated;
grant execute on function public.maintenance_admin_user_ids() to service_role;

-- Only the pinned site owner can grant a confirmed Auth account maintenance
-- access. The Edge Function passes its independently verified caller UUID.
-- Matching the target UUID and email prevents granting a stale list entry.
create or replace function public.grant_maintenance_admin_user(
  p_actor_id uuid,
  p_user_id uuid,
  p_expected_email text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1
      from app_private.okr_admin_account a
      join auth.users actor on actor.id = a.user_id
      where a.singleton
        and a.user_id = p_actor_id
        and pg_catalog.lower(actor.email) = 'rgardanier@gmail.com'
        and actor.email_confirmed_at is not null
        and not coalesce(actor.is_anonymous, false)
  ) then
    raise exception 'Only the site owner can grant maintenance access.' using errcode = '42501';
  end if;

  if not exists (
    select 1 from auth.users target
      where target.id = p_user_id
        and pg_catalog.lower(target.email) = pg_catalog.lower(p_expected_email)
        and target.email_confirmed_at is not null
        and not coalesce(target.is_anonymous, false)
  ) then
    return false;
  end if;

  insert into app_private.maintenance_admin_account (user_id)
    values (p_user_id)
    on conflict (user_id) do nothing;
  return true;
end;
$$;
revoke all on function public.grant_maintenance_admin_user(uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.grant_maintenance_admin_user(uuid, uuid, text) to service_role;

-- The OKR dashboard pins one Auth UUID and requires its original email.
-- Keep that email stable while allowing the maintainer to edit its name.
create or replace function public.is_okr_admin_user(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from app_private.okr_admin_account a
      where a.singleton and a.user_id = p_user_id
  );
$$;
revoke all on function public.is_okr_admin_user(uuid) from public, anon, authenticated;
grant execute on function public.is_okr_admin_user(uuid) to service_role;

commit;

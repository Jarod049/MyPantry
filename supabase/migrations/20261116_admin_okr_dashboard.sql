-- Admin-only, aggregate OKR dashboard. Apply after the food-added, food-waste,
-- app-session, and recipe-use migrations. The admin account must already be a
-- confirmed Supabase Auth user; otherwise this migration fails closed.
begin;

create index if not exists food_added_events_added_at_idx
  on public.food_added_events (added_at);
create index if not exists food_waste_events_occurred_at_idx
  on public.food_waste_events (occurred_at);

create schema if not exists app_private;
revoke all on schema app_private from public, anon, authenticated;

-- Pin the authorization to one Auth user ID. The RPC also verifies that this
-- same account still owns the confirmed email at request time. A later account
-- created with the email cannot inherit access, nor can an email change retain it.
create table if not exists app_private.okr_admin_account (
  singleton boolean primary key default true check (singleton),
  user_id uuid not null references auth.users(id) on delete cascade
);
alter table app_private.okr_admin_account enable row level security;
revoke all on app_private.okr_admin_account from public, anon, authenticated;

do $$
declare
  admin_count integer;
  admin_id uuid;
begin
  select count(*) into admin_count
    from auth.users u
    where pg_catalog.lower(u.email) = 'rgardanier@gmail.com'
      and u.email_confirmed_at is not null
      and not coalesce(u.is_anonymous, false);
  if admin_count <> 1 then
    raise exception 'Admin OKR setup requires exactly one confirmed rgardanier@gmail.com Auth account; found %.', admin_count;
  end if;

  select u.id into admin_id
    from auth.users u
    where pg_catalog.lower(u.email) = 'rgardanier@gmail.com'
      and u.email_confirmed_at is not null
      and not coalesce(u.is_anonymous, false);

  insert into app_private.okr_admin_account (singleton, user_id)
    values (true, admin_id)
    on conflict (singleton) do nothing;
  if not exists (
    select 1 from app_private.okr_admin_account a
    where a.singleton and a.user_id = admin_id
  ) then
    raise exception 'Admin OKR account is already pinned to another Auth user.';
  end if;
end;
$$;

create or replace function public.is_okr_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
      from app_private.okr_admin_account a
      join auth.users u on u.id = a.user_id
      where a.singleton
        and a.user_id = (select auth.uid())
        and pg_catalog.lower(u.email) = 'rgardanier@gmail.com'
        and u.email_confirmed_at is not null
        and not coalesce(u.is_anonymous, false)
  );
$$;
revoke all on function public.is_okr_admin() from public, anon, authenticated;
grant execute on function public.is_okr_admin() to authenticated;

-- Returns only aggregate counts. No cross-account rows or email addresses are
-- exposed. Month and week boundaries use Mountain Time, including DST changes.
create or replace function public.get_admin_okr_metrics()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  monthly_metrics jsonb;
  weekly_metrics jsonb;
begin
  if not public.is_okr_admin() then
    raise exception 'Admin OKR access is required.' using errcode = '42501';
  end if;

  -- Current month plus the preceding eleven months. An addition is one
  -- confirmed new pantry item; a waste event is one user-reported waste action.
  -- Quantities are grouped by measurement to avoid combining unlike units.
  with month_anchor as (
    select pg_catalog.date_trunc('month', pg_catalog.now() at time zone 'America/Denver') as this_month
  ), month_local as (
    select a.this_month - (g.n * interval '1 month') as local_start
      from month_anchor a cross join pg_catalog.generate_series(11, 0, -1) as g(n)
  ), months as (
    select local_start::date as month,
           local_start at time zone 'America/Denver' as start_at,
           (local_start + interval '1 month') at time zone 'America/Denver' as end_at
      from month_local
  )
  select coalesce(pg_catalog.jsonb_agg(
    pg_catalog.jsonb_build_object(
      'month', m.month,
      'food_added_items', (
        select count(*) from public.food_added_events fa
        where fa.added_at >= m.start_at and fa.added_at < m.end_at
      ),
      'food_waste_events', (
        select count(*) from public.food_waste_events fw
        where fw.occurred_at >= m.start_at and fw.occurred_at < m.end_at
      ),
      'waste_quantities', (
        select coalesce(pg_catalog.jsonb_agg(
          pg_catalog.jsonb_build_object('measurement', units.measurement, 'quantity', units.quantity)
          order by units.measurement
        ), '[]'::jsonb)
        from (
          select fw.measurement, sum(fw.quantity) as quantity
            from public.food_waste_events fw
            where fw.occurred_at >= m.start_at and fw.occurred_at < m.end_at
            group by fw.measurement
        ) units
      )
    ) order by m.month
  ), '[]'::jsonb) into monthly_metrics
  from months m;

  -- Last eight completed calendar weeks. Eligibility and active-session rules
  -- match supabase/reports/weekly-active-users.sql: confirmed, nonanonymous
  -- users created before the week, with >=1 session start during that week.
  -- Recipe averages include eligible users with zero recorded recipes.
  with week_anchor as (
    select pg_catalog.date_trunc('week', pg_catalog.now() at time zone 'America/Denver') as this_week
  ), week_local as (
    select a.this_week - (g.n * interval '1 week') as local_start
      from week_anchor a cross join pg_catalog.generate_series(8, 1, -1) as g(n)
  ), weeks as (
    select local_start::date as week_start,
           (local_start + interval '1 week')::date as week_end_exclusive,
           local_start at time zone 'America/Denver' as start_at,
           (local_start + interval '1 week') at time zone 'America/Denver' as end_at
      from week_local
  ), totals as (
    select w.week_start, w.week_end_exclusive,
           count(u.id) as eligible_users,
           count(u.id) filter (where exists (
             select 1 from public.app_sessions s
             where s.user_id = u.id
               and s.started_at >= w.start_at and s.started_at < w.end_at
           )) as active_users,
           coalesce(sum(rec.recipe_count), 0)::bigint as recipe_uses,
           count(u.id) filter (where rec.recipe_count > 0) as recipe_users
      from weeks w
      left join auth.users u
        on u.created_at < w.start_at
       and u.email_confirmed_at < w.start_at
       and not coalesce(u.is_anonymous, false)
      left join lateral (
        select count(*) as recipe_count
          from public.recipe_use_events r
          where r.user_id = u.id
            and r.used_at >= w.start_at and r.used_at < w.end_at
      ) rec on true
      group by w.week_start, w.week_end_exclusive
  )
  select coalesce(pg_catalog.jsonb_agg(
    pg_catalog.jsonb_build_object(
      'week_start', t.week_start,
      'week_end_exclusive', t.week_end_exclusive,
      'eligible_users', t.eligible_users,
      'active_users', t.active_users,
      'active_percent', case when t.eligible_users > 0
        then pg_catalog.trunc(100.0 * t.active_users / t.eligible_users, 1) end,
      'meets_80_percent', case when t.eligible_users > 0
        then t.active_users * 5 >= t.eligible_users * 4 end,
      'recipe_uses', t.recipe_uses,
      'recipes_per_user', case when t.eligible_users > 0
        then pg_catalog.round(t.recipe_uses::numeric / t.eligible_users, 2) end,
      'recipe_users', t.recipe_users,
      'recipe_user_percent', case when t.eligible_users > 0
        then pg_catalog.trunc(100.0 * t.recipe_users / t.eligible_users, 1) end,
      'meets_20_percent', case when t.eligible_users > 0
        then t.recipe_users * 5 >= t.eligible_users end
    ) order by t.week_start
  ), '[]'::jsonb) into weekly_metrics
  from totals t;

  return pg_catalog.jsonb_build_object(
    'timezone', 'America/Denver',
    'monthly', monthly_metrics,
    'weekly', weekly_metrics
  );
end;
$$;
revoke all on function public.get_admin_okr_metrics() from public, anon, authenticated;
grant execute on function public.get_admin_okr_metrics() to authenticated;

commit;

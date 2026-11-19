-- Server-only hourly item allowance for AI-assisted FoodKeeper matching.
begin;

create table if not exists public.food_date_estimate_usage (
  user_id uuid primary key references auth.users(id) on delete cascade,
  hour_start timestamptz not null,
  items integer not null
);

alter table public.food_date_estimate_usage enable row level security;
revoke all on public.food_date_estimate_usage from public, anon, authenticated;
grant all on public.food_date_estimate_usage to service_role;

create or replace function public.consume_food_date_estimate(owner uuid, requested_items integer)
returns boolean
language sql security invoker set search_path = '' as $$
  with consumed as (
    insert into public.food_date_estimate_usage as usage (user_id, hour_start, items)
    select owner, date_trunc('hour', now()), requested_items
    where requested_items between 1 and 30
    on conflict (user_id) do update set
      hour_start = date_trunc('hour', now()),
      items = case
        when usage.hour_start = date_trunc('hour', now()) then usage.items + excluded.items
        else excluded.items
      end
    where usage.hour_start <> date_trunc('hour', now())
       or usage.items + excluded.items <= 120
    returning 1
  )
  select exists(select 1 from consumed);
$$;

revoke all on function public.consume_food_date_estimate(uuid, integer) from public, anon, authenticated;
grant execute on function public.consume_food_date_estimate(uuid, integer) to service_role;

commit;

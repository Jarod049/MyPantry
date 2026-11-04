-- Keep a user's reported food waste after the matching pantry row is removed.
-- Apply as the database owner before deploying the waste-tracking frontend.
begin;

create table if not exists public.food_waste_events (
  event_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_ingredient_id bigint,
  ingredient_name text not null,
  food_type text,
  quantity numeric not null check (quantity > 0),
  measurement text not null,
  reason text not null check (reason in ('spoiled', 'past_date', 'unused', 'other')),
  occurred_at timestamptz not null default now()
);

create index if not exists food_waste_events_user_occurred_idx
  on public.food_waste_events (user_id, occurred_at desc);

alter table public.food_waste_events enable row level security;
drop policy if exists food_waste_events_owner_read on public.food_waste_events;
create policy food_waste_events_owner_read on public.food_waste_events
  for select to authenticated
  using ((select auth.uid()) = user_id);

-- Clients can read their history; only the function below can write an event.
revoke all on public.food_waste_events from public, anon, authenticated;
grant select on public.food_waste_events to authenticated;

create or replace function public.record_food_waste(
  p_ingredient_id bigint,
  p_quantity numeric,
  p_reason text
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  owner_id uuid := (select auth.uid());
  pantry_row public.pantry_item%rowtype;
  waste_row public.food_waste_events%rowtype;
  remaining_numeric numeric;
begin
  if owner_id is null then
    raise exception 'Sign in before recording food waste.' using errcode = '28000';
  end if;
  if p_ingredient_id is null or p_quantity is null or p_quantity <= 0 then
    raise exception 'Choose a pantry item and a waste quantity greater than zero.' using errcode = '22023';
  end if;
  if p_reason is null or p_reason not in ('spoiled', 'past_date', 'unused', 'other') then
    raise exception 'Choose a valid reason for the food waste.' using errcode = '22023';
  end if;

  -- Lock the owned row so concurrent reports cannot waste more than remains.
  select * into pantry_row
    from public.pantry_item
    where ingredient_id = p_ingredient_id and auth_user_id = owner_id
    for update;
  if not found then
    raise exception 'Pantry item was not found in your account.' using errcode = 'P0002';
  end if;
  if pantry_row.quantity is null or pantry_row.quantity <= 0 then
    raise exception 'Pantry item has no remaining quantity to waste.' using errcode = '22023';
  end if;
  if p_quantity > pantry_row.quantity then
    raise exception 'Waste quantity exceeds the amount left in your pantry.' using errcode = '22023';
  end if;

  remaining_numeric := pantry_row.quantity - p_quantity;
  if remaining_numeric = 0 then
    delete from public.pantry_item
      where ingredient_id = pantry_row.ingredient_id and auth_user_id = owner_id;
  else
    update public.pantry_item
      set quantity = remaining_numeric
      where ingredient_id = pantry_row.ingredient_id and auth_user_id = owner_id;
  end if;

  insert into public.food_waste_events (
    user_id, source_ingredient_id, ingredient_name, food_type,
    quantity, measurement, reason
  ) values (
    owner_id, pantry_row.ingredient_id, pantry_row.ingredient_name, pantry_row.food_type,
    p_quantity, pantry_row.measurement, p_reason
  ) returning * into waste_row;

  return jsonb_build_object(
    'event', to_jsonb(waste_row),
    'remaining_quantity', remaining_numeric
  );
end;
$$;

revoke all on function public.record_food_waste(bigint, numeric, text) from public, anon;
grant execute on function public.record_food_waste(bigint, numeric, text) to authenticated;

commit;

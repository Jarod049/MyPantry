-- Preserve an account-owned record of each confirmed food addition.
-- Apply before deploying the Ingredients food-added tracker.
-- Existing pantry rows have no reliable date of entry and are not backfilled.
begin;

-- A marker is supplied only for a new item the user confirms adding. Pantry
-- rows restored by Undo and Demo seed rows omit it, so they do not inflate totals.
alter table public.pantry_item
  add column if not exists addition_event_id uuid;

create unique index if not exists pantry_item_addition_event_id_unique
  on public.pantry_item (addition_event_id)
  where addition_event_id is not null;

create table if not exists public.food_added_events (
  event_id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  -- Deliberately not a foreign key: history survives pantry deletion/reset.
  source_ingredient_id bigint not null,
  ingredient_name text not null,
  brand text,
  product_name text,
  quantity numeric not null check (quantity > 0),
  measurement text not null,
  way_added text not null check (way_added in ('manual', 'barcode', 'receipt', 'pantry_photo')),
  added_at timestamptz not null default now()
);

create index if not exists food_added_events_user_added_idx
  on public.food_added_events (user_id, added_at desc, event_id desc);

alter table public.food_added_events enable row level security;
drop policy if exists food_added_events_owner_read on public.food_added_events;
create policy food_added_events_owner_read on public.food_added_events
  for select to authenticated
  using ((select auth.uid()) = user_id);

-- Browser clients may read only their own history. The trigger is the sole
-- writer, so an event cannot be edited or removed when pantry stock changes.
revoke all on public.food_added_events from public, anon, authenticated;
grant select on public.food_added_events to authenticated;

create or replace function public.capture_food_added_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.addition_event_id is null then
    return new;
  end if;

  if new.auth_user_id is null then
    raise exception 'A tracked food addition requires an account owner.' using errcode = '23502';
  end if;

  insert into public.food_added_events (
    event_id, user_id, source_ingredient_id, ingredient_name,
    brand, product_name, quantity, measurement, way_added
  ) values (
    new.addition_event_id, new.auth_user_id, new.ingredient_id, new.ingredient_name,
    new.brand, new.product_name, new.quantity, new.measurement,
    coalesce(new.way_added, 'manual')
  );

  return new;
end;
$$;

revoke all on function public.capture_food_added_event() from public, anon, authenticated;

drop trigger if exists pantry_item_capture_food_added on public.pantry_item;
create trigger pantry_item_capture_food_added
  after insert on public.pantry_item
  for each row execute function public.capture_food_added_event();

commit;

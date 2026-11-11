-- Keep a separate, account-owned record for every recipe a user says they made.
-- Apply before deploying the Ingredients tracker and Pantry Pal logging action.
begin;

create table if not exists public.recipe_use_events (
  event_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null check (source in ('reels', 'ai')),
  recipe_id text check (recipe_id is null or recipe_id ~ '^[a-z0-9-]+$'),
  recipe_name text not null check (length(btrim(recipe_name)) between 1 and 120),
  used_at timestamptz not null default now()
);

create index if not exists recipe_use_events_user_used_idx
  on public.recipe_use_events (user_id, used_at desc);

alter table public.recipe_use_events enable row level security;
drop policy if exists recipe_use_events_owner_read on public.recipe_use_events;
create policy recipe_use_events_owner_read on public.recipe_use_events
  for select to authenticated
  using ((select auth.uid()) = user_id);
drop policy if exists recipe_use_events_owner_insert on public.recipe_use_events;
create policy recipe_use_events_owner_insert on public.recipe_use_events
  for insert to authenticated
  with check ((select auth.uid()) = user_id and source = 'ai');
drop policy if exists recipe_use_events_owner_delete on public.recipe_use_events;
create policy recipe_use_events_owner_delete on public.recipe_use_events
  for delete to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.recipe_use_events from public, anon, authenticated;
grant select, insert, delete on public.recipe_use_events to authenticated;

-- Catalog recipe use changes pantry quantities and records the use in one
-- transaction. A client-generated event ID makes an uncertain response safe
-- to retry without consuming the same ingredients twice.
create or replace function public.record_recipe_use(
  p_event_id uuid,
  p_source text,
  p_recipe_id text,
  p_recipe_name text,
  p_consumption jsonb
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  owner_id uuid := (select auth.uid());
  use_row public.recipe_use_events%rowtype;
  pantry_row public.pantry_item%rowtype;
  consumption_row jsonb;
  v_ingredient_id bigint;
  from_quantity numeric;
  to_quantity numeric;
  seen_ids bigint[] := '{}'::bigint[];
begin
  if owner_id is null then
    raise exception 'Sign in before recording a recipe.' using errcode = '28000';
  end if;
  if p_event_id is null then
    raise exception 'Recipe use ID is required.' using errcode = '22023';
  end if;
  if p_source is null or p_source not in ('reels', 'ai') then
    raise exception 'Choose a valid recipe source.' using errcode = '22023';
  end if;
  if p_recipe_id is not null and p_recipe_id !~ '^[a-z0-9-]+$' then
    raise exception 'Recipe ID is invalid.' using errcode = '22023';
  end if;
  if p_source = 'reels' and p_recipe_id is null then
    raise exception 'Reels recipes require a recipe ID.' using errcode = '22023';
  end if;
  if p_recipe_name is null or length(pg_catalog.btrim(p_recipe_name)) not between 1 and 120 then
    raise exception 'Recipe name must contain 1 to 120 characters.' using errcode = '22023';
  end if;
  if p_consumption is null or pg_catalog.jsonb_typeof(p_consumption) <> 'array' then
    raise exception 'Recipe ingredients must be an array.' using errcode = '22023';
  end if;
  if pg_catalog.jsonb_array_length(p_consumption) not between 1 and 100 then
    raise exception 'Choose 1 to 100 pantry items for this recipe.' using errcode = '22023';
  end if;

  -- Reject malformed and duplicate rows before changing any pantry quantity.
  for consumption_row in
    select value from pg_catalog.jsonb_array_elements(p_consumption)
  loop
    if pg_catalog.jsonb_typeof(consumption_row) <> 'object'
      or pg_catalog.jsonb_typeof(consumption_row->'ingredient_id') <> 'number'
      or pg_catalog.jsonb_typeof(consumption_row->'from_quantity') <> 'number'
      or pg_catalog.jsonb_typeof(consumption_row->'to_quantity') <> 'number' then
      raise exception 'Each recipe ingredient needs numeric ID, before, and after quantities.' using errcode = '22023';
    end if;
    if (consumption_row->>'ingredient_id')::numeric <= 0
      or pg_catalog.trunc((consumption_row->>'ingredient_id')::numeric) <> (consumption_row->>'ingredient_id')::numeric then
      raise exception 'Recipe ingredient ID is invalid.' using errcode = '22023';
    end if;
    v_ingredient_id := (consumption_row->>'ingredient_id')::bigint;
    from_quantity := (consumption_row->>'from_quantity')::numeric;
    to_quantity := (consumption_row->>'to_quantity')::numeric;
    if from_quantity <= 0 or to_quantity < 0 or to_quantity >= from_quantity then
      raise exception 'Recipe ingredient quantities must decrease from a positive amount.' using errcode = '22023';
    end if;
    if v_ingredient_id = any(seen_ids) then
      raise exception 'A pantry item can appear only once in a recipe use.' using errcode = '22023';
    end if;
    seen_ids := pg_catalog.array_append(seen_ids, v_ingredient_id);
  end loop;

  -- Return the original event on a retry without changing pantry quantities.
  select * into use_row
    from public.recipe_use_events
    where event_id = p_event_id and user_id = owner_id;
  if found then
    if use_row.source <> p_source
      or use_row.recipe_id is distinct from p_recipe_id
      or use_row.recipe_name <> pg_catalog.btrim(p_recipe_name) then
      raise exception 'Recipe use ID already belongs to another recipe.' using errcode = '23505';
    end if;
    return pg_catalog.jsonb_build_object('event', pg_catalog.to_jsonb(use_row));
  end if;

  -- Take owned row locks in a stable order to avoid conflicting recipe uses.
  for consumption_row in
    select value from pg_catalog.jsonb_array_elements(p_consumption)
    order by (value->>'ingredient_id')::bigint
  loop
    v_ingredient_id := (consumption_row->>'ingredient_id')::bigint;
    from_quantity := (consumption_row->>'from_quantity')::numeric;
    to_quantity := (consumption_row->>'to_quantity')::numeric;

    select * into pantry_row
      from public.pantry_item
      where ingredient_id = v_ingredient_id and auth_user_id = owner_id
      for update;
    if not found then
      raise exception 'Pantry item was not found in your account.' using errcode = 'P0002';
    end if;
    if pantry_row.quantity is null or pantry_row.quantity <> from_quantity then
      raise exception 'Pantry quantity changed. Refresh your pantry and try again.' using errcode = '40001';
    end if;

    if to_quantity = 0 then
      delete from public.pantry_item
        where ingredient_id = pantry_row.ingredient_id and auth_user_id = owner_id;
    else
      update public.pantry_item
        set quantity = to_quantity
        where ingredient_id = pantry_row.ingredient_id and auth_user_id = owner_id;
    end if;
  end loop;

  insert into public.recipe_use_events (
    event_id, user_id, source, recipe_id, recipe_name
  ) values (
    p_event_id, owner_id, p_source, p_recipe_id, pg_catalog.btrim(p_recipe_name)
  ) returning * into use_row;

  return pg_catalog.jsonb_build_object('event', pg_catalog.to_jsonb(use_row));
end;
$$;

revoke all on function public.record_recipe_use(uuid, text, text, text, jsonb) from public, anon;
grant execute on function public.record_recipe_use(uuid, text, text, text, jsonb) to authenticated;

commit;

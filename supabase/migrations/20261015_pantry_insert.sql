-- Authenticated rows use auth_user_id; legacy numeric associations are preserved.
-- Do not assign a shared legacy demo account to a new authenticated person.
begin;
alter table public.pantry_item alter column user_id drop not null;
alter table public.pantry_item add constraint pantry_owner_required
  check (user_id is not null or auth_user_id is not null);
alter table public.pantry_item add column storage_location text
  check (storage_location in ('Fridge', 'Pantry', 'Freezer'));
alter table public.pantry_item add column expiration_source text
  check (expiration_source in ('label', 'ai'));
create policy pantry_account_insert on public.pantry_item
  for insert to authenticated
  with check ((select auth.uid()) = auth_user_id and user_id is null);
grant insert on public.pantry_item to authenticated;
grant usage on sequence public.pantry_item_ingredient_id_seq to authenticated;
commit;

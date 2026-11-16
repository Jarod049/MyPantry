-- Keep the dates used for estimates and distinguish user-entered dates from labels.
begin;

alter table public.pantry_item
  add column if not exists acquired_on date,
  add column if not exists opened_on date,
  add column if not exists estimate_basis text;

alter table public.pantry_item
  drop constraint if exists pantry_item_expiration_source_check;

alter table public.pantry_item
  add constraint pantry_item_expiration_source_check
  check (expiration_source in ('label', 'ai', 'user'));

commit;

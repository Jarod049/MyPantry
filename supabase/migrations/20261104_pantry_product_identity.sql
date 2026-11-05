-- Preserve optional package identity alongside the pantry item's display name.
-- Existing rows remain unchanged; no product or brand is inferred from old names.
-- Separate pantry rows remain available for different boxes and expiration dates.
begin;

alter table public.pantry_item
  add column if not exists brand text,
  add column if not exists product_name text;

commit;

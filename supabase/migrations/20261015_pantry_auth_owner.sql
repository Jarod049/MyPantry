-- Review in the project's SQL editor before applying. Run as the database owner.
-- Existing numeric user_id values and pantry rows are preserved.
-- Existing rows remain unclaimed (and inaccessible to browser clients) until
-- an administrator assigns their auth_user_id to the verified owning account.
begin;

alter table public.pantry_item
  add column if not exists auth_user_id uuid references auth.users(id)
  default auth.uid();

create index if not exists pantry_item_auth_user_id_idx
  on public.pantry_item(auth_user_id);

alter table public.pantry_item enable row level security;

-- Restrictive policies are ANDed with existing permissive demo policies.
-- This prevents an old "allow everyone" policy from bypassing ownership.
create policy pantry_account_boundary on public.pantry_item
  as restrictive for all to anon, authenticated
  using ((select auth.uid()) = auth_user_id)
  with check ((select auth.uid()) = auth_user_id);

create policy pantry_account_read on public.pantry_item
  for select to authenticated
  using ((select auth.uid()) = auth_user_id);

create policy pantry_account_update on public.pantry_item
  for update to authenticated
  using ((select auth.uid()) = auth_user_id)
  with check ((select auth.uid()) = auth_user_id);

grant select, update on public.pantry_item to authenticated;
commit;

-- After verifying the account and its ownership, an administrator can assign
-- specific existing rows. Do not automatically assign shared demo data to
-- every new account. Example only (replace both placeholders):
-- update public.pantry_item set auth_user_id = 'VERIFIED-AUTH-USER-UUID'
-- where user_id = VERIFIED-LEGACY-USER-ID and auth_user_id is null;

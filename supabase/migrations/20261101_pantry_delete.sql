-- Allow authenticated accounts to delete only pantry rows they own.
-- The existing restrictive pantry_account_boundary policy still applies.
-- Review in the Supabase SQL Editor and run as the database owner.
begin;

drop policy if exists pantry_account_delete on public.pantry_item;
create policy pantry_account_delete on public.pantry_item
  for delete to authenticated
  using ((select auth.uid()) = auth_user_id);

grant delete on public.pantry_item to authenticated;

commit;

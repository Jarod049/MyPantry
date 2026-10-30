-- Allow authenticated users to delete only their own pantry rows.
-- Required by remove-item, recipe consumption, and reset-inventory actions.
begin;

drop policy if exists pantry_account_delete on public.pantry_item;
create policy pantry_account_delete on public.pantry_item
  for delete to authenticated
  using ((select auth.uid()) = auth_user_id);

grant delete on public.pantry_item to authenticated;

commit;

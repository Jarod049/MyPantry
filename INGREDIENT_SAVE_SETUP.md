# Ingredient persistence fix

Adding an ingredient previously changed only browser memory. A successful pantry
read left the status at “Saved in database,” even though no INSERT was sent.

This change sends manual additions and reviewed scan batches to Supabase and
waits for the returned rows before showing the completion screen. Failed saves
keep the form/review available. Storage location and expiration source round-trip
through the database. New rows use the signed-in Auth UUID, never shared user 1.

## Release order

1. Confirm the existing project has both `20261015` pantry migrations applied.
   The insert migration preserves rows and numeric foreign keys, permits
   Auth-owned rows without a legacy numeric user, and keeps ownership checks in
   place under RLS.
2. Review and apply `supabase/migrations/20261026_sync_account_state.sql` before
   deploying the matching frontend. It adds account-state and assistant-history
   tables without altering existing pantry rows.
3. Merge this change to deploy the frontend through the existing Pages workflow.
   Config values continue to come from Actions secrets, not a committed config.
4. Sign in, manually add an ingredient with quantity, storage and expiry, reload,
   and verify it remains. Repeat using a reviewed receipt scan. Verify a second
   account cannot see it.

The user approved the production migration on 15 October 2026, and it was applied
as pantry_authenticated_insert. Existing pantry rows were preserved.

Validation: 28 local tests pass, including manual insert/reload, scanned batch
insert/reload, failed inserts, duplicate clicks, and logout during an insert.
The UI tests use a simulated database. Live Supabase role checks also passed:
authenticated insert/read/update, cross-account read/update denial, forged-owner
insert denial, and anonymous read/insert denial. Test rows were rolled back.

Scope: authenticated pantry additions, edits, deletion, recipe consumption and
reset now write through to Supabase. Saved, liked and watched recipes, recipe
preferences, units, spoil reminders, preferred store, ZIP code, and assistant
conversations also sync per account after the follow-up migration. Previously lost in-memory pantry
additions cannot be recovered from Supabase.

# Ingredient persistence fix

Adding an ingredient previously changed only browser memory. A successful pantry
read left the status at “Saved in database,” even though no INSERT was sent.

This change sends manual additions and reviewed scan batches to Supabase and
waits for the returned rows before showing the completion screen. Failed saves
keep the form/review available. Storage location and expiration source round-trip
through the database. New rows use the signed-in Auth UUID, never shared user 1.

## Release order

1. Approve and apply `supabase/migrations/20261015_pantry_insert.sql` to the
   existing project. It preserves existing rows and numeric foreign keys, permits
   Auth-owned rows without a legacy numeric user, adds an owner-required check,
   and adds an authenticated INSERT policy requiring the caller's own UUID and
   a null legacy user ID. RLS stays enabled. Anonymous access stays blocked by
   the existing restrictive account boundary.
2. Merge this change to deploy the frontend through the existing Pages workflow.
   Config values continue to come from Actions secrets, not a committed config.
3. Sign in, manually add an ingredient with quantity, storage and expiry, reload,
   and verify it remains. Repeat using a reviewed receipt scan. Verify a second
   account cannot see it.

The migration has not been applied: automatic approval review rejected the
production constraint/permission change pending explicit user approval.

Validation: 28 local tests pass, including manual insert/reload, scanned batch
insert/reload, failed inserts, duplicate clicks, and logout during an insert.
These use a simulated database; live Supabase validation is still pending.

Scope: this fixes ingredient creation and storage/expiry edits. The prototype's
delete, recipe-consumption, and reset flows still need separate database writes.
Previously lost in-memory additions cannot be recovered from Supabase.

# Supabase account data sync

MyPantry already uses Supabase Auth and `public.pantry_item` for signed-in pantry
reads, additions, and edits. This follow-up completes persistence for the rest of
the account data currently used by the app.

## What syncs

- Pantry additions, edits, deletions, recipe consumption, and reset operations.
- Saved, liked, and watched recipe IDs, recipe preferences, unit preference,
  preferred store, and the ZIP code used for local deals.
- Spoil-reminder and unit preferences.
- Assistant messages in the current conversation. Starting a new chat creates a
  separate conversation; the app resumes the latest conversation on sign-in.
- App sessions in `app_sessions`: session start, a last-active time updated
  about once a minute while the app is visible, explicit sign-out, and an
  inferred end after 15 minutes without a check-in. The timeout is recorded
  when the app next reconnects. A force-closed app or powered-off phone cannot
  report its exact shutdown time to the server.
- Existing account-specific browser settings are copied to Supabase once, only
  when that account has no `user_app_state` row yet.

Navigation, unfinished scans, and demo-mode data remain browser-local. The
legacy `ai_message` table and existing pantry rows are not modified by the new
migration.

## Migration and release order

1. Confirm that `20261015_pantry_auth_owner.sql` and
   `20261015_pantry_insert.sql` have been applied to the target project.
2. Review and apply `supabase/migrations/20261026_sync_account_state.sql` in the
   Supabase SQL Editor. It creates `user_app_state`, `chat_conversations`, and
   `chat_messages`, and enables owner-scoped row-level security on each table.
3. Review and apply `supabase/migrations/20261026_app_session_tracking.sql` in
   the Supabase SQL Editor. It creates the owner-scoped `app_sessions` table.
4. Deploy the matching frontend through the existing Pages workflow. It uses
   the repository's `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` Actions
   secrets; never add a service-role or secret key to browser code.
5. In a preview build, sign in and check that pantry edits, deletion, recipe
   consumption, recipe activity, settings, and chat messages remain after a
   reload. Check two accounts to confirm they cannot see each other's records.

The migration is additive and does not copy or reassign legacy numeric user
records. Do not deploy the new frontend before the migration, because its new
account-state and chat tables will not exist yet.

# Supabase account data sync

MyPantry already uses Supabase Auth and `public.pantry_item` for signed-in pantry
reads, additions, and edits. This follow-up completes persistence for the rest of
the account data currently used by the app.

## What syncs

- Pantry additions, edits, deletions, recipe consumption, and reset operations.
  A pantry item can also save its optional brand and specific product name,
  alongside the food name used for display and recipe matching.
- Confirmed food waste in `food_waste_events`: the ingredient, amount, unit,
  reason, and time reported by the user. Waste history stays available after
  the ingredient is removed or the inventory is reset.
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

Navigation and unfinished scans remain browser-local. The
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
4. Review and apply `supabase/migrations/20261101_pantry_delete.sql` in the
   Supabase SQL Editor. It grants authenticated accounts permission to delete
   only their own pantry rows. Reset, empty, recipe consumption, and Demo pantry
   tools require this policy.
5. Review and apply `supabase/migrations/20261104_food_waste_tracking.sql` in
   the Supabase SQL Editor before deploying food waste tracking. It creates an
   owner-scoped waste history and a function that records waste while reducing
   or removing the corresponding pantry amount in one database transaction.
   Authenticated app clients add waste records through the function and can
   read only their own records.
6. Review and apply `supabase/migrations/20261104_pantry_product_identity.sql`
   before deploying branded product recognition. It adds optional `brand` and
   `product_name` fields to `pantry_item`. Existing rows retain their names and
   have empty identity fields until a user edits them; the migration does not
   combine pantry rows or change their quantities.
7. Deploy the revised `receipt-scan` and `barcode-lookup` Edge Functions to the
   target Supabase project after the migration and before deploying the
   frontend. This is a separate Supabase deployment; the GitHub Pages workflow
   does not deploy Edge Functions.
8. Deploy the matching frontend through the existing Pages workflow. It uses
   the repository's `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` Actions
   secrets; never add a service-role or secret key to browser code.
9. In a preview build, sign in and check that pantry edits, deletion, recipe
   consumption, food waste, recipe activity, settings, and chat messages remain
   after a reload. Confirm that a branded item keeps its brand and product name,
   and that multiple boxes remain represented after a reload. Check two
   accounts to confirm they cannot see each other's records.

Food waste is recorded only when a user explicitly logs it. An expired date or
an ordinary ingredient deletion does not count as waste. Waste reports retain
the ingredient's unit; totals with incompatible units such as pounds, gallons,
and counts must not be summed into one amount. Reset inventory removes pantry
rows but preserves food waste history.

Package counts use the pantry item's quantity and measurement (for example,
quantity `2` and measurement `box` appears as “2 boxes”). Branded products and batches with different expiration dates may
remain separate pantry rows; there is no uniqueness rule on their names or
brands.

These migrations are additive and do not copy or reassign legacy numeric user
records. Apply the matching migration before deploying each frontend feature;
the account-state and chat tables and the food-waste function must exist before
the app can use them.

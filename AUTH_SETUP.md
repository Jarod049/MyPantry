# Supabase Auth rollout

## Verified existing setup (15 October 2026)

The MyPantry dashboard currently has zero Supabase Auth accounts. `pantry_item.user_id` is a required bigint referencing `app_user.user_id`. The `app_user` table contains a required legacy `password` text column; the new frontend never reads, writes, copies, or authenticates against it. Do not migrate those passwords into browser storage or Supabase Auth.

The existing pantry policies grant anonymous read/write access to demo user 1. The `pantry_item_with_days` view already uses `security_invoker=true` and therefore follows underlying table policies.

## Apply in a coordinated release

1. Review `supabase/migrations/20261015_pantry_auth_owner.sql`. It adds an independent nullable UUID owner without deleting rows or changing the existing numeric relationship. It adds an ownership boundary and authenticated SELECT/UPDATE policies. Apply it in the Supabase SQL editor as the database owner when the new frontend is ready. It disables the anonymous demo's database access, so do not apply it early to a live demo deployment that still depends on that access. It is a one-time transactional migration; rerunning after success fails on duplicate policy names.
2. Under Authentication → Sign In / Providers, verify Email is enabled. Keep email confirmation enabled unless the project owner explicitly chooses another policy.
3. Under URL Configuration, set Site URL to the **verified current** production URL. Add exact production and preview redirect URLs used for signup/reset, plus `http://127.0.0.1:4173/` for local testing. Do not use broad wildcard redirects for unrelated sites. The user-confirmed production URL is `https://jarod049.github.io/MyPantry/`.
4. GitHub Pages uses the checked-in `config.js`, which contains only the public project URL and publishable key from the dashboard. These values are intended for browser use; RLS enforces access. Never commit `.env` or replace the publishable key with a secret/service-role key. Optional build variables can override these defaults.
5. Create a real account using the new signup form and confirm the email. The demo email/password displayed in the prototype is not a Supabase account.
6. Verify which existing numeric account belongs to that person, then assign only those pantry rows to the account's Auth UUID using the commented example at the end of the migration. Do not automatically claim an old account based only on an email string. Unassigned rows are preserved but invisible to browser clients.
7. Test with two accounts: each can select/update only its own assigned rows; anonymous requests must return no pantry rows. Test both `pantry_item` and the existing `pantry_item_with_days` view. Test sign-in, reload, logout, email confirmation, and recovery in the preview deployment.
8. Merge/deploy after the checks pass. Keep the previous deployment available for rollback; note that rolling back only the frontend does not restore the old anonymous database access.

## Limits of this change

- Pantry loading/editing now uses `auth_user_id`; the existing numeric user_id is retained. New accounts initially have an empty pantry until existing rows are assigned. The older prototype's in-memory add/delete/recipe-consumption flows are not rewritten here. Implementing full pantry CRUD requires provisioned app_user records or a separate schema migration because the legacy user_id is NOT NULL.
- Saved recipes/preferences are isolated by account in local browser storage, not synced to Supabase. Legacy demo state is not automatically attached to a real user.
- “Stay signed in” is the default. There is no misleading Remember me checkbox. The SDK owns tokens and their refresh; application state never stores passwords.
- Mocked regression tests validate app behavior, not the actual Supabase email service or deployed policies. Live validation is required before release.

References: [Supabase Auth](https://supabase.com/docs/reference/javascript/auth), [auth events](https://supabase.com/docs/reference/javascript/auth-onauthstatechange), [row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security).

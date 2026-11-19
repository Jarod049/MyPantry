# MyPantry maintenance page

The IS401 maintenance landing page is `https://jarod049.github.io/MyPantry/maintenance.html`. It has an image, email/password sign-in, and a private workspace. After the server verifies a maintenance account, the page shows **Maintain Users** and **Maintain Records**, with separate recipe and pantry-item buttons. Each area can display, create, edit, and delete records. Logging out removes this page's Supabase session and hides every maintenance control.

## Accounts and access

- Supabase Auth is the user table. Do **not** use the legacy `app_user.password` column.
- The role table is `app_private.maintenance_admin_account`. Its row-level security and grants prevent the browser from reading or editing it. The Edge Function checks the signed-in token and this table on every request.
- The migration initially grants access to the already verified `rgardanier@gmail.com` OKR administrator. This **site owner account** is separate from a Supabase Dashboard project administrator. The dedicated teacher account is an ordinary MyPantry Auth login until the site owner grants it maintenance access.
- Create the dedicated account with an address controlled by the project team. For example, use a mailbox or alias that delivers to the owner; do not assume an arbitrary address such as `admin@admin.org` belongs to the team. Enter an initial password in the maintenance form and share it with the TAs through the course's approved private channel. No browser code contains a service key or a fixed email/password, and the form clears the password after saving.
- The teacher account can maintain users and records, but only the pinned site owner can grant another account maintenance access. A separate Supabase Dashboard project administrator is needed to deploy the migration and Edge Function; the teacher does not need Dashboard access.

## Production release order

1. Apply `supabase/migrations/20261119_maintenance_admin.sql` to the MyPantry production Supabase project `llazlrlxjoywqrbconbs`. It requires `20261116_admin_okr_dashboard.sql`.
2. Keep Supabase Auth email/password sign-in enabled. Direct account creation through this page does not require invitation email delivery. If the team later sends Auth invitations or recovery emails, add the exact `https://jarod049.github.io/MyPantry/maintenance.html` redirect URL in **Authentication → URL Configuration**.
3. Deploy `supabase/functions/maintenance-api` to the same project. Its endpoint will be `https://llazlrlxjoywqrbconbs.supabase.co/functions/v1/maintenance-api`. The function reads `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` only in the server environment. Supabase provides these built-in values for Edge Functions. Never add the service key to the repository, GitHub Pages, or a public build.
4. Merge the website change to `main`; the Pages workflow publishes `dist/maintenance.html` and its assets.
5. Sign in as `rgardanier@gmail.com` on the maintenance page, open **Maintain Users**, and select **Create account**. Enter the dedicated, team-controlled email and an initial password. The Auth admin endpoint creates and confirms that account without relying on email delivery. The password is never returned by the service or shown in the user list.
6. In that new user's row, select **Give maintenance access** and confirm. The server checks the signed-in owner's verified identity; the database checks both the owner's pinned UUID and the new user's UUID, current email, and confirmation before granting access. A teacher account cannot use this action.
7. Sign out and sign in as the dedicated account. Confirm the three maintenance areas open and that creating, editing, and deleting a sample recipe or pantry item changes the main app. Confirm an ordinary account cannot open them. Share the working URL and credentials with TAs privately.

## What each area changes

| Button | Data | Available actions |
| --- | --- | --- |
| Maintain Users | Supabase Auth users | List, create with an initial password, edit email/display name, delete non-admin accounts; owner can grant maintenance access |
| Maintain Recipes | `public.recipe` | List, create, edit, publish/unpublish, delete |
| Maintain Pantry Items | `public.pantry_item` | List, create for a chosen Auth owner, edit, delete |

Activity histories and OKR event tables are audit records, so this page does not alter them. A pantry item entered here is an administrative correction and does not increment the food-added tracker. Recipe Reels use the database catalog when it loads successfully, so a deleted or unpublished recipe no longer reappears from the website's offline fallback.

## Grading handoff

- **URL:** `https://jarod049.github.io/MyPantry/maintenance.html`
- **Email:** the dedicated account created and granted access above
- **Password:** the initial password entered by the site owner; deliver privately to TAs

If sign-in succeeds but the maintenance controls stay hidden, check that the site owner granted the new account access and that the Edge Function is deployed to the same Supabase project.

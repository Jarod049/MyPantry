# MyPantry maintenance page

The IS401 maintenance landing page is `https://jarod049.github.io/MyPantry/maintenance.html`. It has an image, email/password sign-in, and a private workspace. After the server verifies a maintenance account, the page shows **Maintain Users** and **Maintain Records**, with separate recipe and pantry-item buttons. Each area can display, create, edit, and delete records. Logging out removes this page's Supabase session and hides every maintenance control.

## Accounts and access

- Supabase Auth is the user table. Do **not** use the legacy `app_user.password` column.
- The role table is `app_private.maintenance_admin_account`. Its row-level security and grants prevent the browser from reading or editing it. The Edge Function checks the signed-in token and this table on every request.
- The migration initially grants access to the already verified `rgardanier@gmail.com` OKR administrator. A separate maintenance or TA account is invited by email and granted access by its **confirmed Auth UUID**. No browser code contains a service key or a fixed email/password.
- Invitations let the recipient choose a password. The site owner can share the dedicated account's email and password with TAs through the course's approved private channel; do not commit credentials to GitHub or put them in the webpage.

## Production release order

1. Apply `supabase/migrations/20261119_maintenance_admin.sql` to the MyPantry Supabase project. It requires `20261116_admin_okr_dashboard.sql`.
2. In Supabase **Authentication → URL Configuration**, add the exact redirect URL `https://jarod049.github.io/MyPantry/maintenance.html`. Keep email sign-in and invitation mail delivery enabled.
3. Deploy `supabase/functions/maintenance-api` to the same project. The function reads `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` only in the server environment. Supabase provides these built-in values for Edge Functions. Never add the service key to the repository, GitHub Pages, or a public build. If the deployed address differs, set `MAINTENANCE_INVITE_REDIRECT_URL` to its exact allowlisted URL.
4. Merge the website change to `main`; the Pages workflow publishes `dist/maintenance.html` and its assets.
5. Sign in as the existing `rgardanier@gmail.com` administrator on the maintenance page, open **Maintain Users**, and invite the dedicated account at an inbox the site owner controls. The invitee opens the emailed link, sets a password, and confirms the email if Supabase requests confirmation.
6. In the Supabase Auth Users screen, copy that specific account's UUID. As a project administrator, grant maintenance access with the following SQL after checking the email and confirmation status. Replace the placeholders before running it:

   ```sql
   insert into app_private.maintenance_admin_account (user_id)
   select id from auth.users
   where id = 'VERIFIED-AUTH-UUID'
     and lower(email) = lower('DEDICATED-ACCOUNT-EMAIL')
     and email_confirmed_at is not null
     and not coalesce(is_anonymous, false)
   on conflict (user_id) do nothing;
   ```

7. Sign out and sign in as the dedicated account. Confirm the three maintenance areas open and that creating, editing, and deleting a sample recipe or pantry item changes the main app. Confirm an ordinary account cannot open them. Use a real invite and password before providing the URL and credentials to TAs.

## What each area changes

| Button | Data | Available actions |
| --- | --- | --- |
| Maintain Users | Supabase Auth users | List, invite, edit email/display name, delete non-admin accounts |
| Maintain Recipes | `public.recipe` | List, create, edit, publish/unpublish, delete |
| Maintain Pantry Items | `public.pantry_item` | List, create for a chosen Auth owner, edit, delete |

Activity histories and OKR event tables are audit records, so this page does not alter them. A pantry item entered here is an administrative correction and does not increment the food-added tracker. Recipe Reels use the database catalog when it loads successfully, so a deleted or unpublished recipe no longer reappears from the website's offline fallback.

## Grading handoff

- **URL:** `https://jarod049.github.io/MyPantry/maintenance.html`
- **Email:** the dedicated account invited and granted access above
- **Password:** the one set by that account's owner; deliver privately to TAs

If the invitation redirects to the main app instead, check the exact Auth redirect allowlist entry. If sign-in succeeds but the maintenance controls stay hidden, check the account's confirmed UUID in the private role table and that the Edge Function is deployed to the same Supabase project.

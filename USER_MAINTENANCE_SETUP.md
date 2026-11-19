# User maintenance setup

The Demo tools panel exposes **Maintain Users** only to the Auth UUID configured as `DEMO_ACCOUNT_ID`. User administration runs in the `admin-users` Supabase Edge Function; the browser never receives a service-role key.

## Supabase rollout

1. In **Authentication → Users**, confirm that exactly one confirmed, non-anonymous account uses `mypantrydemo@gmail.com`.
2. Run [`supabase/migrations/20261119_demo_user_maintenance.sql`](supabase/migrations/20261119_demo_user_maintenance.sql) in the Supabase SQL Editor, or include it in the next migration push. It pins administrator access to that account's immutable Auth UUID and makes user-owned pantry rows cascade when an account is deleted.
3. Deploy the function from the linked project:

   ```powershell
   supabase functions deploy admin-users
   ```

   Supabase supplies `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to hosted Edge Functions. Do not add the service-role key to GitHub Pages, Netlify, `.env`, or browser configuration.
4. If the production hostname is not `https://jarod049.github.io`, add its exact origin to the existing `ALLOWED_ORIGINS` Supabase function secret.
5. Keep the website's `DEMO_ACCOUNT_ID` deployment variable set to the same demo Auth UUID, then deploy the frontend.

## Grading verification

1. Open the deployed URL in a private browser window and confirm the pantry illustration and login form appear.
2. Sign in with `mypantrydemo@gmail.com` and the demo password.
3. Confirm **Maintain Users**, **Maintain Records**, and the existing demo controls appear only after login.
4. Open **Maintain Records** and create, view, edit, and delete a disposable pantry item.
5. Open **Maintain Users** and create, view, edit, and delete a disposable test login. The signed-in grading administrator must show a disabled Delete button.
6. Log out and confirm the maintenance controls disappear and a refresh remains signed out.

Give the TAs the deployed URL, `mypantrydemo@gmail.com`, and the demo password through the course's approved private submission channel. Never commit the password.

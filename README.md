# MyPantry

## 1. App Summary

Our app helps reduce household food waste by making it easier for users to keep track of the food they already have and decide what to eat before it expires.

Users can track food in their fridge and pantry, including expiration dates, so they know what they have and what needs to be used soon. The app also suggests recipes based on ingredients the user already has, helping them use food before buying more or letting it go to waste.

The app also includes an AI chat assistant that can answer food-related questions, recommend recipes, and help users decide what to make. Users can also browse food reels for meal inspiration and discover new ways to use the ingredients they already have.

Here is our demo: https://jarod049.github.io/MyPantry/

### Behavioral requirements

| Requirement | Status | Where to find it |
| --- | --- | --- |
| Add and manage food in the pantry, fridge, and freezer | Complete | Ingredients and Scan: manual entry, receipt photos, pantry photos, and UPC/EAN barcodes |
| Search food and see what needs attention soon | Complete | Ingredients → Going bad soon groups items by food category and sorts by date within each group |
| Review dates and icons before saving scanned food | Complete | Scan review shows food icons and label dates when available; estimated dates are planning reminders |
| Ask cooking questions and get pantry-aware recipe ideas | Complete | Pantry Pal on Home |
| Remove food through chat only when requested | Complete | Ask “Remove Apples from my pantry” and confirm the exact match |
| Find, save, and like recipes | Complete | Reels shows makeable recipes first and lets users opt in to recipes needing more ingredients |
| Track recipes made and food thrown away | Complete | Ingredients shows recipe-use and food-waste history |
| Plan grocery shopping without entering a ZIP code | Complete | Settings → Shopping → Shop ideas links to the preferred retailer’s offers |
| Manage account details and preferences | Complete | Settings supports username, email, password, profile photo, allergies, and other preferences |
| Measure the 80% weekly usage OKR | Complete | Run the [weekly session report](supabase/reports/weekly-active-users.sql) in the Supabase SQL Editor |
| Use the app on phones, tablets, and desktop | Complete | The layout adapts to screen size |
| Verify a Lighthouse accessibility score of at least 90 | Not complete | The score has not been verified |

## 2. ERD
<img width="1427" height="779" alt="Screenshot 2026-10-07 at 11 55 41 AM" src="https://github.com/user-attachments/assets/039444b7-bdcb-46a0-8949-6543cb8199ea" />



## 3. Tech Stack
- **Frontend:** HTML, CSS, and JavaScript
- **Database & Backend:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **AI:** AI API for food questions, recipe recommendations, and cooking assistance
- **Development:** AI-assisted development
- **Version Control:** GitHub

## 4. Run locally

Requires Node.js 22 or later.

1. Run `npm ci`.
2. Copy `.env.example` to `.env` and supply the MyPantry project URL and publishable key. Never use a secret or service-role key.
3. Complete the database and Auth setup in [AUTH_SETUP.md](AUTH_SETUP.md) before connecting real accounts.
4. Run `npm start` and open `http://127.0.0.1:4173`.
5. Run `npm test` for the session and app regression tests.

The demo uses a real Supabase Auth account. Set `DEMO_ACCOUNT_ID` to that account's Auth UUID to reveal Demo tools after it signs in. Never put the Demo password in `.env` or frontend code.

Use an HTTP server locally, rather than opening `index.html` as a file. `npm run build` generates `dist/config.js` and copies the website files into `dist/`.

## 5. Authentication

Connected mode uses Supabase Auth for sign-in, signup, email confirmation, password recovery, session restoration, and logout. Sessions persist on the same browser until sign-out or server-side expiry/revocation. Browser storage restrictions may prevent persistence. There is no sign-in bypass. The configured Demo account receives pantry reset/seed tools and simulated scan outcomes after normal authentication.

Navigation and unfinished scans remain browser-local. Demo data stays separate from real accounts.

Authenticated accounts now sync pantry changes, saved/liked/watched recipes, recipe preferences, units, spoil reminders, preferred store, and assistant conversations to Supabase. Apply the account-state migrations and `supabase/migrations/20261101_pantry_delete.sql` before deploying this frontend. The delete migration is required for pantry item removal, inventory reset, and Demo pantry tools. See [SUPABASE_SYNC.md](SUPABASE_SYNC.md) for the rollout details.

Profile photos use the private Supabase Storage bucket and owner-only policies created by `supabase/migrations/20261105_profile_avatars.sql`. Apply that migration before deploying the profile-photo UI. Users can open their profile row in Settings, take a front-camera photo or choose an image, replace it, and remove it.

Food allergy preferences are stored in the existing per-account `recipe_preferences` JSON. Settings provides the nine common allergen presets plus custom ingredient entries for less common allergies. Matching recipes are removed from generated suggestions, shopping ideas, Reels, and Pantry Pal prompts; saved recipes remain visible with a warning. This is a suggestion filter rather than a food-safety guarantee because recipe data cannot detect incomplete labels or cross-contact. Redeploy the `pantry-chat` Edge Function with the frontend so AI suggestions receive the saved allergy list. No additional database migration is required.

## 6. Deploy

The current site uses GitHub Pages at https://jarod049.github.io/MyPantry/. The deployment workflow generates browser configuration from repository Actions secrets `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`, plus the non-secret repository variable `DEMO_ACCOUNT_ID`. The workflow runs the same build as local development, publishes the generated `dist/` folder, and versions asset URLs so browsers can load changed files. Merging to `main` triggers deployment. For optional Netlify hosting, set the same build environment values. Complete [AUTH_SETUP.md](AUTH_SETUP.md) before deployment. Use a preview deployment and verify account isolation before updating production.

## 7. Verify

- Sign up with a real email and complete confirmation if required.
- Sign in, reload, and reopen the same site: the account remains signed in.
- Sign out and reload: the login form remains visible.
- Sign in as a second account: neither the first account's pantry, recipe activity, settings, nor chat history appear.
- Test the password-reset email and save a new password.
- Test again with browser storage unavailable and with a network failure; errors should be visible.

Recipe Reels come from a catalog of 120+ recipes. The built-in copy lives in `recipes.js`; `supabase/migrations/20261103_recipe_reels.sql` creates the public-read `recipe` table and seeds the same reels. After editing `recipes.js`, run `npm run recipes:sql` and apply the regenerated migration. To add reels without a redeploy, insert rows into `public.recipe` with `is_published = true` (an optional `video_url` plays a real clip). The feed shows recipes you can make now. Select **Show recipes that need more ingredients** to see additional recipes with their missing ingredients.

The Ingredients tab shows how many recipes the account made this month, split between Reels and Pantry Pal, plus a dated history. Confirming “I used this recipe” in Reels updates the pantry and records a use together; viewing, saving, or liking a reel does not count. For a recipe suggested in free-form Pantry Pal chat, users explicitly log its name with “Log a recipe I made.” That log does not automatically deduct ingredients from the pantry. Each use is a separate owner-scoped record in `recipe_use_events`, so making the same recipe twice counts twice. Apply `supabase/migrations/20261110_recipe_use_tracking.sql` before deploying this frontend; see [SUPABASE_SYNC.md](SUPABASE_SYNC.md).

Settings → Shopping → Shop ideas uses the signed-in account's preferred store, pantry, and saved recipes. It shows ingredient ideas for recipes, checks whether a matching pantry item is already listed, and flags items whose listed dates need review. It does not calculate exact purchase quantities or determine food safety. The store button opens that retailer's official offers page; the user chooses a local store and checks current prices and availability there. MyPantry does not currently ingest live retailer prices, promotions, or stock, and no new database migration is needed for these suggestions.

Receipt and pantry photos are processed by the `receipt-scan` Edge Function; see [RECEIPT_SCAN_SETUP.md](RECEIPT_SCAN_SETUP.md).

Camera scan screens use a live rear-camera preview when `getUserMedia` is available over HTTPS or localhost. The shutter captures one still frame for analysis; gallery upload and file capture remain available when live preview is unsupported or permission is denied.

UPC/EAN food bar codes are decoded in the browser and looked up through the authenticated `barcode-lookup` Edge Function using USDA FoodData Central first and Open Food Facts as a fallback. Results open in the existing editable item form, and spoil dates use the current category and storage estimates. See [BARCODE_SETUP.md](BARCODE_SETUP.md).

Pantry data and account-specific state sync through Supabase after the follow-up migration is applied. See [SUPABASE_SYNC.md](SUPABASE_SYNC.md) for the migration and preview rollout steps, and [AUTH_SETUP.md](AUTH_SETUP.md) for the existing-data ownership step.

### Sprint 3 pantry behavior and reporting

| Requirement | Implementation |
| --- | --- |
| Track progress toward 80% weekly use | [Weekly session report](supabase/reports/weekly-active-users.sql), run in the Supabase SQL editor by a project admin. The report counts distinct users with a recorded session start in the last completed Mountain Time week, among confirmed accounts that already existed when the week began. It does not count a session that started before the week. |
| Classify meat snacks separately from raw meat | Recognized meat sticks and jerky receive a planning reminder when no package date is available. Follow the package label and storage directions. |
| Show recognizable icons for scanned food | Match full food names and common plurals; use the neutral icon when there is no reliable match. |
| Group Going bad soon by category | Keep the existing search and filters, and sort items by date within their food categories. |
| Remove an ingredient from chat only when asked | Type an explicit command such as “Remove Apples from my pantry.” A unique exact match opens a confirmation. Ambiguous names direct the user to Ingredients. |

To see OKR #3, open **Supabase → SQL Editor → New query**, paste the linked report, and select **Run**. Read `active_percent` and `meets_80_percent`. This measures app opens through session starts; it does not measure feature usage.

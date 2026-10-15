# MyPantry

## 1. App Summary

Our app helps reduce household food waste by making it easier for users to keep track of the food they already have and decide what to eat before it expires.

Users can track food in their fridge and pantry, including expiration dates, so they know what they have and what needs to be used soon. The app also suggests recipes based on ingredients the user already has, helping them use food before buying more or letting it go to waste.

The app also includes an AI chat assistant that can answer food-related questions, recommend recipes, and help users decide what to make. Users can also browse food reels for meal inspiration and discover new ways to use the ingredients they already have.

Here is our demo: https://jarod049.github.io/MyPantry/

### Key Features
- Track food stored in the fridge and pantry
- Track expiration dates and identify food that should be used soon
- Get recipe suggestions based on food already available
- Ask an AI assistant questions about food, cooking, and recipes
- Browse food reels for meal and recipe inspiration
  
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

For an isolated classroom prototype, set `DEMO_MODE=true` in `.env`. This mode uses the displayed demo credentials, persists its demo session across reloads, and never connects to Supabase. Demo signup and email sending are unavailable. Use Restart prototype to clear demo state.

Use an HTTP server locally, rather than opening `index.html` as a file. `npm run build` generates `dist/config.js` and copies the website files into `dist/`.

## 5. Authentication

Connected mode uses Supabase Auth for sign-in, signup, email confirmation, password recovery, session restoration, and logout. Sessions persist on the same browser until sign-out or server-side expiry/revocation. Browser storage restrictions may prevent persistence. Demo bypasses are disabled in connected mode.

Saved recipe preferences are stored locally under a key specific to each authenticated user. They are not yet synced across devices. Existing demo preferences are kept separate from real accounts.

## 6. Deploy

The current site uses GitHub Pages at https://jarod049.github.io/MyPantry/. The deployment workflow generates browser configuration from repository Actions secrets `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`; keep that existing setup. It uploads the HTML, CSS, app.js, auth.js, and generated config.js. Merging to `main` triggers deployment. For optional Netlify hosting, set the same build environment values; `netlify.toml` builds and publishes `dist`. Complete [AUTH_SETUP.md](AUTH_SETUP.md) before deployment. Use a preview deployment and verify account isolation before updating production.

## 7. Verify

- Sign up with a real email and complete confirmation if required.
- Sign in, reload, and reopen the same site: the account remains signed in.
- Sign out and reload: the login form remains visible.
- Sign in as a second account: neither the first account's pantry nor its local saved recipes appear.
- Test the password-reset email and save a new password.
- Test again with browser storage unavailable and with a network failure; errors should be visible.

The original pantry database integration supports loading and editing existing rows. Other prototype actions (including adding/deleting food) are not converted into complete database CRUD by this authentication change. See AUTH_SETUP.md for the existing-data ownership step and remaining limitations.

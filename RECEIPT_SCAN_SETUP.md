# Receipt scanning

In connected mode, **Scan → Take a picture of your receipt** now reads a real
photo. Demo mode (`DEMO_MODE=true`) keeps the simulated Smith's receipt.

## How it works

1. The user takes a photo (phones open the rear camera) or chooses one from
   their photos.
2. The browser shrinks it to at most 2400 px on the long side (JPEG) and sends
   it to the `receipt-scan` Supabase Edge Function with the user's session.
3. The function verifies the session, checks an hourly quota (20 receipts per
   user), and asks OpenAI to extract food and drink lines as strict JSON:
   name, original receipt text, category, quantity, unit and usual storage.
   Non-food lines, tax, totals and coupons are skipped. The output is
   re-validated against the app's categories and units before it is returned.
4. The items open on the existing review screen, showing the original receipt
   line next to each name so the user can check the reading. Spoil dates are
   estimated with the app's shelf-life table (marked "AI estimate").
5. Nothing is saved until the user taps **Add N items to MyPantry**, which uses
   the existing `pantry_item` insert with `way_added = 'receipt'`.

The function never writes to the database, and receipt photos are not stored
(OpenAI requests use `store:false`; OpenAI's other retention policies still
apply).

## Backend setup

1. Run `supabase/receipt_scan_quota.sql` once in the SQL editor.
2. Reuse the `OPENAI_API_KEY` secret from Pantry Pal chat. Optionally set
   `RECEIPT_MODEL` to a vision-capable model; otherwise `OPENAI_MODEL` or the
   chat default is used.
3. Deploy: `supabase functions deploy receipt-scan --no-verify-jwt`. The handler
   verifies tokens itself, the same as `pantry-chat`.
4. CORS allows `https://jarod049.github.io`. For local or preview testing, set
   the `ALLOWED_ORIGINS` secret to a comma-separated list, for example
   `http://127.0.0.1:4173`.
5. Merge the frontend to deploy through the existing Pages workflow.

## Verify

- `npm test` covers the function (auth, quota, image validation, output
  cleaning) and the UI (upload, review, partial save, errors, escaping, and
  discarding a result that arrives after sign-out).
- Live: sign in, scan a real receipt, remove one item, save, reload, and
  confirm the rest appear on the Ingredients tab. Try a blurry photo and a
  non-receipt photo and confirm a clear error appears.

The pantry/fridge photo and barcode options are still simulated.

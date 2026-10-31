# USDA bar-code lookup setup

MyPantry decodes UPC/EAN bar codes in the browser and sends only the decoded
number to the `barcode-lookup` Supabase Edge Function. The function verifies the
signed-in user and looks for the product in USDA FoodData Central first. If USDA
has no matching record, it performs an exact barcode lookup in Open Food Facts.
It returns fields supported by the existing item editor and does not write pantry
data; the user reviews and confirms the item first.

No database migration is required.

## 1. Get a USDA API key

For a quick development test, FoodData Central accepts `DEMO_KEY` with a small
shared allowance. For normal testing, request a free key at:

https://api.data.gov/signup/

Do not put this key in `.env`, `app.js`, GitHub secrets used to build the browser
site, or any other client-visible file.

## 2. Configure Supabase secrets

Store the key as an Edge Function secret:

```sh
npx supabase secrets set USDA_FDC_API_KEY=YOUR_DATA_GOV_KEY
```

The function automatically accepts the app on port 4173 from `localhost`,
`127.0.0.1`, and private LAN addresses in the `10.x.x.x`, `172.16-31.x.x`, and
`192.168.x.x` ranges. No CORS secret is needed for normal local or phone testing.

For a separately hosted preview, add its exact HTTPS origin to `ALLOWED_ORIGINS`.
If the secret already contains preview origins, retain them in the comma-separated
list rather than overwriting them:

```sh
npx supabase secrets set ALLOWED_ORIGINS=https://preview.example.com
```

The production GitHub Pages origin is allowed by the function automatically.

## 3. Deploy the function

```sh
npx supabase functions deploy barcode-lookup --no-verify-jwt
```

The function validates the access token itself, matching the existing photo-scan
function and supporting Supabase's current signing keys.

## 4. Test

Run the website locally with `npm start`, sign in, choose **Scan your item's bar
code**, and photograph or choose a clear photo of a UPC-A, UPC-E, EAN-8, EAN-13,
or GTIN-14 food code. On HTTPS and localhost, the scan screen opens a live camera
preview and captures one still frame when the shutter is pressed. Plain-HTTP LAN
addresses and browsers without camera permission retain the file-capture fallback.
The app never analyzes continuously; decoding starts only after shutter capture or
photo selection.

The USDA package description, quantity, unit, and broad category are prefilled.
MyPantry estimates the spoil date from the existing category and storage tables.
The user can change every field in the existing item editor before saving.

Decoding is progressive: supported browsers try their native `BarcodeDetector`,
then ZXing tries the original lossless image and enhanced crop, rotation,
contrast, and threshold variants. If image decoding still fails, the user can
enter the digits printed below the bar code. The number's check digit is
validated before any USDA request.

If neither source has an exact match, the app offers another scan or manual entry.
It never accepts a fuzzy product result for a different bar code.

## Open Food Facts fallback

The fallback uses the read-only Open Food Facts product endpoint and does not
require an API key. Requests identify this school project with a `User-Agent`, as
requested by Open Food Facts. Product-read requests are rate limited, so USDA
remains the first source and the fallback runs only after a USDA miss.

Open Food Facts is community-maintained and may have incomplete or inaccurate
fields. The app labels the source and always opens the editable confirmation form.
Data from Open Food Facts is available under the Open Database License (ODbL):

https://world.openfoodfacts.org/

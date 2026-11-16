# Food date estimate Edge Function

This function uses OpenAI to select a food from a pinned USDA FoodKeeper catalog. It never asks the model to invent a storage duration or date. The server reads the selected FoodKeeper record and calculates a date from its guidance. The caller should still show the result as an estimate for review. Package dates supplied by the user or read from a label should take precedence.

## Catalog provenance

USDA Food Safety and Inspection Service publishes the English FoodKeeper JSON through the [official Data.gov catalog](https://catalog.data.gov/dataset/fsis-foodkeeper-data). The catalog identifies the data as [CC0](https://creativecommons.org/publicdomain/zero/1.0/) and lists its last update as January 22, 2025. The official JSON download was returning HTTP 403 from this environment, so this snapshot was copied from a [pinned public mirror](https://raw.githubusercontent.com/haggman/A4I2026-challenge-2-food-equity/1eec1dd74082656ed37183c2ab0799445867f9bb/data/foodkeeper.json).

- Mirror input SHA-256: `e84caab9d4b603209e31d21d5027c41d29adfecbca7051ff7322e9fb0226c01d`
- Snapshot: `foodkeeper-catalog.json`, containing all 661 product IDs with names, search terms, categories, and numeric or nonnumeric storage guidance. Tips, images, and display-only descriptions were removed.

The date calculation uses the lower end of a numeric FoodKeeper range in days, weeks, months, or years. Hour-based guidance cannot be represented safely by a calendar date, so it returns no date. It also returns no date for guidance such as “Package use-by date,” “Indefinitely,” “When Ripe,” or “Not Recommended.” The response still includes that guidance in `basis`. If `opened_on` is given, the record must have a numeric after-opening duration for that storage location; otherwise the function returns no date. An opened-food date never extends a shorter date calculated from acquisition. FoodKeeper has no after-opening freezer field, so an opened freezer item has no catalog estimate.

`acquired_on` is the date the item was bought or brought home. For freezer items, this estimate assumes it was frozen then. When the actual purchase, opening, or freezing date is unknown, the caller should make that assumption clear and let the user correct the date. FoodKeeper guidance is about storage quality and cannot establish whether a particular item is safe to eat.

## API

Apply `supabase/migrations/20261113_food_date_estimate_quota.sql` before deploying with `npx supabase functions deploy food-date-estimate --no-verify-jwt`. The migration creates a server-only, atomic allowance of 120 foods matched per account per UTC hour. Foods with no lexical catalog candidate do not use the allowance. A failed AI request after the allowance is consumed still counts. The handler checks the supplied Supabase bearer token itself. It uses the existing `OPENAI_API_KEY`, optional `FOOD_DATE_MODEL` (otherwise `OPENAI_MODEL` or `gpt-6-luna`), and the same production/local CORS rules as the other functions. A separately hosted preview can be added through `ALLOWED_ORIGINS`.

Send a `POST` to `/functions/v1/food-date-estimate` with the session token and 1–30 items:

```json
{
  "items": [
    {
      "key": "t1",
      "name": "Cottage cheese",
      "brand": "",
      "product_name": "",
      "category": "Dairy & Eggs",
      "storage": "Fridge",
      "acquired_on": "2026-11-13",
      "opened_on": "2026-11-14"
    }
  ]
}
```

`brand`, `product_name`, and `opened_on` are optional. `key` must be unique within the request. The response contains one entry per input in the same order:

```json
{
  "items": [
    {
      "key": "t1",
      "estimated_date": "2026-11-21",
      "basis": "USDA FoodKeeper: 1 Week from opening",
      "matched_food": "Cottage cheese"
    }
  ]
}
```

For no reliable catalog match, `estimated_date`, `basis`, and `matched_food` are `null`. When a catalog item matches but has no usable date, `estimated_date` is `null`, while `matched_food` and a short `basis` explain why. The production website asks the user for a package or personal check-by date whenever there is no usable estimate; it does not substitute a category estimate. The function does not write pantry data. The AI request uses `store:false`; each request is bounded to one model call, 30 items, 15 lexical catalog choices per item, and a 45-second model timeout.

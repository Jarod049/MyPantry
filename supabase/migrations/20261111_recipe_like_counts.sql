-- Real like counts for Reels.
-- Each account's likes already live in user_app_state.liked_recipe_ids (owner-only RLS).
-- This function exposes only the per-recipe totals, never who liked what.
-- The caller's own likes are excluded so the app can add them live as the user taps
-- the heart, without double-counting before the account state finishes syncing.
begin;

-- Retire the placeholder numbers that were seeded into the catalog.
update public.recipe set base_likes = 0 where base_likes <> 0;

create index if not exists user_app_state_liked_recipe_ids_idx
  on public.user_app_state using gin (liked_recipe_ids);

create or replace function public.recipe_like_counts()
returns table (recipe_id text, likes bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select liked.recipe_id, count(distinct s.user_id) as likes
  from public.user_app_state s
  cross join lateral unnest(s.liked_recipe_ids) as liked(recipe_id)
  where s.user_id is distinct from (select auth.uid())
  group by liked.recipe_id;
$$;

revoke all on function public.recipe_like_counts() from public;
grant execute on function public.recipe_like_counts() to anon, authenticated;

commit;

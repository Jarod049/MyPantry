-- OKR 3: Run as a project admin in the SQL editor.
-- Last completed calendar week in Mountain Time. Denominator: confirmed accounts
-- created before that week began. Numerator: those with a recorded app
-- session start in that week. Multiple starts count as one user.
with bounds as (
  select date_trunc('week', now() at time zone 'America/Denver') as current_week
), week_window as (
  select ((current_week - interval '1 week') at time zone 'America/Denver') as start_at,
         (current_week at time zone 'America/Denver') as end_at
  from bounds
), eligible as (
  select u.id from auth.users u cross join week_window w
  where u.created_at < w.start_at
    and u.email_confirmed_at < w.start_at
    and not coalesce(u.is_anonymous, false)
), totals as (
  select count(*) as eligible_users, count(*) filter (where exists (
    select 1 from public.app_sessions s cross join week_window w
    where s.user_id = e.id and s.started_at < w.end_at
      and s.started_at >= w.start_at
  )) as active_users
  from eligible e
)
select (w.start_at at time zone 'America/Denver')::date as week_start,
       (w.end_at at time zone 'America/Denver')::date as week_end_exclusive,
       t.eligible_users, t.active_users,
       round(100.0 * t.active_users / nullif(t.eligible_users, 0), 1) as active_percent,
       case when t.eligible_users > 0 then t.active_users * 5 >= t.eligible_users * 4 end as meets_80_percent
from totals t cross join week_window w;

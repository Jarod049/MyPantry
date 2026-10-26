-- Track authenticated app sessions without collecting IP addresses or device data.
begin;

create table if not exists public.app_sessions (
  session_id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  last_active_at timestamptz not null default now(),
  ended_at timestamptz,
  end_reason text check (end_reason is null or end_reason in ('signed_out', 'inactive_timeout')),
  constraint app_sessions_end_state check (
    (ended_at is null and end_reason is null)
    or (ended_at is not null and end_reason is not null)
  )
);

create index if not exists app_sessions_user_started_idx
  on public.app_sessions (user_id, started_at desc);

alter table public.app_sessions enable row level security;
drop policy if exists app_sessions_owner_all on public.app_sessions;
create policy app_sessions_owner_all on public.app_sessions
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update on public.app_sessions to authenticated;

commit;

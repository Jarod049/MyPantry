-- Server-only hourly counter for receipt scans (mirrors chat_quota.sql).
-- Authenticated browsers cannot read or alter quotas.
create table if not exists public.receipt_scan_usage (
 user_id uuid primary key references auth.users(id) on delete cascade,
 hour_start timestamptz not null,
 requests integer not null
);
alter table public.receipt_scan_usage enable row level security;
revoke all on public.receipt_scan_usage from public, anon, authenticated;
grant all on public.receipt_scan_usage to service_role;
create or replace function public.consume_receipt_scan(owner uuid) returns boolean
language sql security invoker set search_path = '' as $$
 with consumed as (
 insert into public.receipt_scan_usage as usage (user_id,hour_start,requests)
 values(owner,date_trunc('hour',now()),1)
 on conflict(user_id) do update set
 hour_start=date_trunc('hour',now()),
 requests=case when usage.hour_start=date_trunc('hour',now()) then usage.requests+1 else 1 end
 where usage.hour_start<>date_trunc('hour',now()) or usage.requests<20
 returning 1
 ) select exists(select 1 from consumed);
$$;
revoke all on function public.consume_receipt_scan(uuid) from public,anon,authenticated;
grant execute on function public.consume_receipt_scan(uuid) to service_role;

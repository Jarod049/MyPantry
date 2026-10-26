-- Server-only counter: authenticated browsers cannot read or alter quotas.
create table if not exists public.pantry_chat_usage (
 user_id uuid primary key references auth.users(id) on delete cascade,
 hour_start timestamptz not null,
 requests integer not null
);
alter table public.pantry_chat_usage enable row level security;
revoke all on public.pantry_chat_usage from public, anon, authenticated;
grant all on public.pantry_chat_usage to service_role;
create or replace function public.consume_pantry_chat(owner uuid) returns boolean
language sql security invoker set search_path = '' as $$
 with consumed as (
 insert into public.pantry_chat_usage as usage (user_id,hour_start,requests)
 values(owner,date_trunc('hour',now()),1)
 on conflict(user_id) do update set
 hour_start=date_trunc('hour',now()),
 requests=case when usage.hour_start=date_trunc('hour',now()) then usage.requests+1 else 1 end
 where usage.hour_start<>date_trunc('hour',now()) or usage.requests<30
 returning 1
 ) select exists(select 1 from consumed);
$$;
revoke all on function public.consume_pantry_chat(uuid) from public,anon,authenticated;
grant execute on function public.consume_pantry_chat(uuid) to service_role;

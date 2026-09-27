-- Run once in the Supabase SQL Editor.
create table if not exists public.trainer_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  entries jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.trainer_progress enable row level security;
revoke all on public.trainer_progress from anon, authenticated;
grant select, insert, update on public.trainer_progress to authenticated;
create policy "Read own progress" on public.trainer_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Insert own progress" on public.trainer_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own progress" on public.trainer_progress
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Atomic patch: independent questions from different devices are preserved.
create or replace function public.merge_trainer_progress(patch jsonb)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare result jsonb;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if jsonb_typeof(patch) <> 'object' or octet_length(patch::text) > 1000000 then
    raise exception 'Invalid progress';
  end if;
  insert into public.trainer_progress(user_id, entries)
    values(auth.uid(), patch)
  on conflict (user_id) do update
    set entries = public.trainer_progress.entries || excluded.entries,
        updated_at = now()
  returning entries into result;
  return result;
end;
$$;
revoke all on function public.merge_trainer_progress(jsonb) from public, anon;
grant execute on function public.merge_trainer_progress(jsonb) to authenticated;

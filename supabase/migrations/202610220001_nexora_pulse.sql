-- NEXORA PULSE foundation. Additive only: no existing tables or records are changed.
create table if not exists public.pulse_connections (
  id uuid primary key default gen_random_uuid(),
  user_low uuid not null references public.profiles(id) on delete cascade,
  user_high uuid not null references public.profiles(id) on delete cascade,
  invited_by uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','active','declined','ended')),
  level smallint not null default 0 check (level between 0 and 7),
  experience integer not null default 0 check (experience >= 0),
  total_interactions integer not null default 0 check (total_interactions >= 0),
  last_interaction_at timestamptz,
  active_days date[] not null default '{}',
  visible_on_profiles boolean not null default false,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pulse_connections_distinct_users check (user_low <> user_high),
  constraint pulse_connections_ordered_users check (user_low < user_high),
  constraint pulse_connections_unique_pair unique (user_low, user_high)
);

create table if not exists public.pulse_events (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references public.pulse_connections(id) on delete cascade,
  actor_id uuid not null references public.profiles(id) on delete cascade,
  event_type text not null check (event_type in ('message','reaction','check_in','milestone','memory')),
  idempotency_key text not null,
  created_at timestamptz not null default now(),
  constraint pulse_events_idempotency unique (actor_id, idempotency_key)
);

create table if not exists public.pulse_memories (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references public.pulse_connections(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 80),
  note text not null default '' check (char_length(note) <= 500),
  approved_by_other boolean not null default false,
  visible_on_profiles boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists pulse_connections_user_low_status_idx on public.pulse_connections(user_low, status);
create index if not exists pulse_connections_user_high_status_idx on public.pulse_connections(user_high, status);
create index if not exists pulse_events_connection_created_idx on public.pulse_events(connection_id, created_at desc);
create index if not exists pulse_memories_connection_created_idx on public.pulse_memories(connection_id, created_at desc);

alter table public.pulse_connections enable row level security;
alter table public.pulse_events enable row level security;
alter table public.pulse_memories enable row level security;

drop policy if exists "Pulse participants can view their connections" on public.pulse_connections;
create policy "Pulse participants can view their connections"
on public.pulse_connections for select to authenticated
using (auth.uid() = user_low or auth.uid() = user_high);

drop policy if exists "Pulse participants can view connection events" on public.pulse_events;
create policy "Pulse participants can view connection events"
on public.pulse_events for select to authenticated
using (exists (
  select 1 from public.pulse_connections pc
  where pc.id = pulse_events.connection_id
    and pc.status = 'active'
    and (pc.user_low = auth.uid() or pc.user_high = auth.uid())
));

drop policy if exists "Pulse participants can view shared memories" on public.pulse_memories;
create policy "Pulse participants can view shared memories"
on public.pulse_memories for select to authenticated
using (exists (
  select 1 from public.pulse_connections pc
  where pc.id = pulse_memories.connection_id
    and (pc.user_low = auth.uid() or pc.user_high = auth.uid())
    and (pc.status = 'active' or pc.created_by = auth.uid())
));

-- Mutations are deliberately available only through these validated RPCs.
revoke insert, update, delete on public.pulse_connections from anon, authenticated;
revoke insert, update, delete on public.pulse_events from anon, authenticated;
revoke insert, update, delete on public.pulse_memories from anon, authenticated;
grant select on public.pulse_connections, public.pulse_events, public.pulse_memories to authenticated;

create or replace function public.pulse_invite(p_target_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_actor uuid := auth.uid();
  v_low uuid;
  v_high uuid;
  v_connection_id uuid;
  v_allowed boolean := false;
begin
  if v_actor is null then raise exception 'Entre na Nexora para criar um Pulse.'; end if;
  if p_target_user_id is null or p_target_user_id = v_actor then
    raise exception 'Escolha outra pessoa para criar uma conexão.';
  end if;
  if not exists (select 1 from public.profiles where id = p_target_user_id) then
    raise exception 'Perfil não encontrado.';
  end if;

  select exists (
    select 1 from public.follows f1
    join public.follows f2 on f2.follower_id = f1.following_id and f2.following_id = f1.follower_id
    where f1.follower_id = v_actor and f1.following_id = p_target_user_id
  ) into v_allowed;

  if not v_allowed then
    select exists (
      select 1
      from public.conversations c
      join public.conversation_members cm1 on cm1.conversation_id = c.id and cm1.user_id = v_actor
      join public.conversation_members cm2 on cm2.conversation_id = c.id and cm2.user_id = p_target_user_id
      where c.kind = 'direct'
        and (select count(*) from public.conversation_members cmx where cmx.conversation_id = c.id) = 2
    ) into v_allowed;
  end if;

  if not v_allowed then
    raise exception 'Para convidar, vocês precisam se seguir mutuamente ou já ter uma conversa direta.';
  end if;

  v_low := least(v_actor, p_target_user_id);
  v_high := greatest(v_actor, p_target_user_id);

  insert into public.pulse_connections(user_low, user_high, invited_by, status)
  values (v_low, v_high, v_actor, 'pending')
  on conflict (user_low, user_high) do update
    set invited_by = excluded.invited_by,
        status = 'pending',
        accepted_at = null,
        updated_at = now()
    where public.pulse_connections.status in ('declined','ended')
  returning id into v_connection_id;

  if v_connection_id is null then
    raise exception 'Já existe um convite ou Pulse para essa pessoa.';
  end if;

  return v_connection_id;
end;
$$;

create or replace function public.pulse_respond(p_connection_id uuid, p_accept boolean)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare v_actor uuid := auth.uid();
begin
  if v_actor is null then raise exception 'Entre na Nexora para responder.'; end if;
  update public.pulse_connections
  set status = case when p_accept then 'active' else 'declined' end,
      accepted_at = case when p_accept then now() else null end,
      updated_at = now()
  where id = p_connection_id
    and status = 'pending'
    and (user_low = v_actor or user_high = v_actor)
    and invited_by <> v_actor;
  if not found then raise exception 'Convite não encontrado ou não autorizado.'; end if;
end;
$$;

create or replace function public.pulse_record_activity(
  p_connection_id uuid,
  p_event_type text,
  p_idempotency_key text
)
returns table (new_level smallint, new_experience integer, new_total_interactions integer)
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_actor uuid := auth.uid();
  v_today date := (now() at time zone 'utc')::date;
  v_count_today integer;
  v_new_xp integer;
  v_new_level smallint;
  v_inserted uuid;
begin
  if v_actor is null then raise exception 'Entre na Nexora para interagir.'; end if;
  if p_event_type not in ('message','reaction','check_in','memory') then
    raise exception 'Tipo de interação inválido.';
  end if;
  if p_idempotency_key is null or char_length(p_idempotency_key) < 8 or char_length(p_idempotency_key) > 120 then
    raise exception 'Identificador de interação inválido.';
  end if;

  if not exists (
    select 1 from public.pulse_connections
    where id = p_connection_id and status = 'active'
      and (user_low = v_actor or user_high = v_actor)
  ) then raise exception 'Pulse não encontrado ou inativo.'; end if;

  select count(*) into v_count_today
  from public.pulse_events
  where connection_id = p_connection_id and actor_id = v_actor
    and created_at >= date_trunc('day', now() at time zone 'utc') at time zone 'utc';

  if v_count_today >= 8 then
    raise exception 'Você já contribuiu bastante hoje. Volte amanhã para continuar evoluindo o Pulse.';
  end if;

  insert into public.pulse_events(connection_id, actor_id, event_type, idempotency_key)
  values (p_connection_id, v_actor, p_event_type, p_idempotency_key)
  on conflict (actor_id, idempotency_key) do nothing
  returning id into v_inserted;

  if v_inserted is null then
    select level, experience, total_interactions into new_level, new_experience, new_total_interactions
    from public.pulse_connections where id = p_connection_id;
    return next;
    return;
  end if;

  update public.pulse_connections pc
  set experience = pc.experience + 1,
      level = least(7, floor((pc.experience + 1)::numeric / 5)::smallint),
      total_interactions = pc.total_interactions + 1,
      last_interaction_at = now(),
      active_days = (select coalesce(array_agg(d order by d), '{}'::date[])
        from (select distinct unnest(pc.active_days || v_today) as d order by d desc limit 365) days),
      updated_at = now()
  where pc.id = p_connection_id
  returning pc.level, pc.experience, pc.total_interactions
  into new_level, new_experience, new_total_interactions;

  return next;
end;
$$;

create or replace function public.pulse_set_profile_visibility(p_connection_id uuid, p_visible boolean)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare v_actor uuid := auth.uid();
begin
  if v_actor is null then raise exception 'Entre na Nexora para alterar a privacidade.'; end if;
  if not exists (select 1 from public.pulse_connections where id = p_connection_id and status = 'active' and (user_low = v_actor or user_high = v_actor)) then
    raise exception 'Pulse não encontrado ou inativo.';
  end if;
  -- Public display requires both people to explicitly opt in.
  if p_visible then
    update public.pulse_connections set visible_on_profiles = true, updated_at = now()
    where id = p_connection_id and status = 'active'
      and (user_low = v_actor or user_high = v_actor);
  else
    update public.pulse_connections set visible_on_profiles = false, updated_at = now()
    where id = p_connection_id and (user_low = v_actor or user_high = v_actor);
  end if;
end;
$$;

revoke all on function public.pulse_invite(uuid) from public, anon;
revoke all on function public.pulse_respond(uuid, boolean) from public, anon;
revoke all on function public.pulse_record_activity(uuid, text, text) from public, anon;
revoke all on function public.pulse_set_profile_visibility(uuid, boolean) from public, anon;
grant execute on function public.pulse_invite(uuid) to authenticated;
grant execute on function public.pulse_respond(uuid, boolean) to authenticated;
grant execute on function public.pulse_record_activity(uuid, text, text) to authenticated;
grant execute on function public.pulse_set_profile_visibility(uuid, boolean) to authenticated;

do $$
begin
  if exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'pulse_connections') then
    null;
  else
    alter publication supabase_realtime add table public.pulse_connections;
  end if;
exception when undefined_object then
  raise notice 'supabase_realtime publication not found; enable pulse_connections in Realtime after migration.';
end $$;

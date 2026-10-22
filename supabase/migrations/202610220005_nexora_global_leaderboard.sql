-- NEXORA GLOBAL leaderboard: aggregate only public ranking fields; never expose message content.
-- Additive migration: existing tables and records are untouched.
create or replace function public.pulse_global_leaderboard(
  p_search text default null,
  p_me_only boolean default false
)
returns table (
  position bigint,
  user_id uuid,
  username text,
  display_name text,
  avatar_url text,
  score bigint,
  pulse_connections bigint,
  interactions bigint
)
language sql
stable
security definer
set search_path = public, auth
as $$
  with event_scores as (
    select pe.actor_id, count(*)::bigint as interaction_count
    from public.pulse_events pe
    join public.pulse_connections active_pc on active_pc.id = pe.connection_id and active_pc.status = 'active'
    group by pe.actor_id
  ),
  connection_scores as (
    select participant.user_id,
           count(*)::bigint as connection_count,
           coalesce(sum(pc.level), 0)::bigint as level_sum
    from public.pulse_connections pc
    cross join lateral (
      values (pc.user_low), (pc.user_high)
    ) participant(user_id)
    where pc.status = 'active'
    group by participant.user_id
  ),
  scored as (
    select p.id as uid,
           p.username::text as uname,
           coalesce(nullif(p.display_name, ''), p.username)::text as display,
           p.avatar_url::text as avatar,
           coalesce(es.interaction_count, 0)::bigint as interactions_total,
           coalesce(cs.connection_count, 0)::bigint as connections_total,
           (coalesce(es.interaction_count, 0) + coalesce(cs.level_sum, 0) * 5)::bigint as points
    from public.profiles p
    left join event_scores es on es.actor_id = p.id
    left join connection_scores cs on cs.user_id = p.id
    where coalesce(es.interaction_count, 0) > 0
       or coalesce(cs.connection_count, 0) > 0
  ),
  ranked as (
    select row_number() over (order by points desc, interactions_total desc, uname asc)::bigint as rank_no,
           *
    from scored
  )
  select r.rank_no, r.uid, r.uname, r.display, r.avatar, r.points,
         r.connections_total, r.interactions_total
  from ranked r
  where r.rank_no <= 100
    and (
      (coalesce(p_me_only, false) and auth.uid() = r.uid)
      or (
        not coalesce(p_me_only, false)
        and (
          nullif(trim(coalesce(p_search, '')), '') is null
          or r.uname ilike '%' || left(trim(p_search), 40) || '%'
          or r.display ilike '%' || left(trim(p_search), 40) || '%'
        )
      )
    )
  order by r.rank_no
  limit case
    when coalesce(p_me_only, false) then 1
    when nullif(trim(coalesce(p_search, '')), '') is null then 10
    else 20
  end;
$$;

revoke all on function public.pulse_global_leaderboard(text, boolean) from public;
grant execute on function public.pulse_global_leaderboard(text, boolean) to anon, authenticated;

-- Automatically count real persisted direct messages as Pulse activity.
-- The event stores no message body or media URL.
create or replace function public.pulse_track_direct_message()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_other uuid;
  v_connection_id uuid;
  v_low uuid;
  v_high uuid;
  v_event_id uuid;
  v_today date := (now() at time zone 'utc')::date;
  v_count_today integer;
  v_low_active boolean;
  v_high_active boolean;
  v_awarded boolean;
begin
  begin
    if new.sender_id is null or new.conversation_id is null then return new; end if;

    select cm.user_id into v_other
    from public.conversation_members cm
    join public.conversations c on c.id = cm.conversation_id
    where cm.conversation_id = new.conversation_id
      and c.kind = 'direct'
      and cm.user_id <> new.sender_id
      and (select count(*) from public.conversation_members cmx where cmx.conversation_id = new.conversation_id) = 2
    limit 1;

    if v_other is null then return new; end if;

    select pc.id, pc.user_low, pc.user_high
    into v_connection_id, v_low, v_high
    from public.pulse_connections pc
    where pc.status = 'active'
      and pc.user_low = least(new.sender_id, v_other)
      and pc.user_high = greatest(new.sender_id, v_other)
    for update;

    if v_connection_id is null then return new; end if;

    select count(*) into v_count_today
    from public.pulse_events pe
    where pe.connection_id = v_connection_id
      and pe.actor_id = new.sender_id
      and pe.created_at >= (date_trunc('day', now() at time zone 'utc') at time zone 'utc');

    if v_count_today >= 8 then return new; end if;

    insert into public.pulse_events(connection_id, actor_id, event_type, idempotency_key)
    values (v_connection_id, new.sender_id, 'message', 'message:' || new.id::text)
    on conflict (actor_id, idempotency_key) do nothing
    returning id into v_event_id;

    if v_event_id is null then return new; end if;

    insert into public.pulse_daily_progress(connection_id, activity_day)
    values (v_connection_id, v_today)
    on conflict (connection_id, activity_day) do nothing;

    update public.pulse_daily_progress dp
    set user_low_active = dp.user_low_active or (new.sender_id = v_low),
        user_high_active = dp.user_high_active or (new.sender_id = v_high),
        updated_at = now()
    where dp.connection_id = v_connection_id and dp.activity_day = v_today
    returning dp.user_low_active, dp.user_high_active, dp.reward_awarded
    into v_low_active, v_high_active, v_awarded;

    update public.pulse_connections pc
    set total_interactions = pc.total_interactions + 1,
        last_interaction_at = now(),
        active_days = (select coalesce(array_agg(d order by d), '{}'::date[])
          from (select distinct unnest(pc.active_days || v_today) as d order by d desc limit 365) days),
        experience = pc.experience + case when v_low_active and v_high_active and not v_awarded then 1 else 0 end,
        level = least(7, floor((pc.experience + case when v_low_active and v_high_active and not v_awarded then 1 else 0 end)::numeric / 5)::smallint),
        updated_at = now()
    where pc.id = v_connection_id;

    if v_low_active and v_high_active and not v_awarded then
      update public.pulse_daily_progress
      set reward_awarded = true, updated_at = now()
      where connection_id = v_connection_id and activity_day = v_today;
    end if;
  exception when others then
    -- Never make a message fail just because optional Pulse analytics had an error.
    raise warning 'Nexora Pulse message tracking skipped for message %: %', new.id, sqlerrm;
  end;
  return new;
end;
$$;

revoke all on function public.pulse_track_direct_message() from public, anon, authenticated;
drop trigger if exists pulse_track_direct_message on public.messages;
create trigger pulse_track_direct_message
after insert on public.messages
for each row execute function public.pulse_track_direct_message();

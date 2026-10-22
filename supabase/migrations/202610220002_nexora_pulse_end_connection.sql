-- Add an explicit, non-destructive way for either participant to end a Pulse.
create or replace function public.pulse_end_connection(p_connection_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare v_actor uuid := auth.uid();
begin
  if v_actor is null then raise exception 'Entre na Nexora para gerenciar seu Pulse.'; end if;
  update public.pulse_connections
  set status = 'ended',
      visible_on_profiles = false,
      visible_low_opt_in = false,
      visible_high_opt_in = false,
      updated_at = now()
  where id = p_connection_id
    and status in ('pending','active')
    and (user_low = v_actor or user_high = v_actor);
  if not found then raise exception 'Pulse não encontrado ou já encerrado.'; end if;
end;
$$;

revoke all on function public.pulse_end_connection(uuid) from public, anon;
grant execute on function public.pulse_end_connection(uuid) to authenticated;

-- Public profile display is allowed only after both Pulse participants opt in.
drop policy if exists "Pulse participants can view their connections" on public.pulse_connections;
create policy "Pulse participants can view their connections"
on public.pulse_connections for select to authenticated
using (
  auth.uid() = user_low
  or auth.uid() = user_high
  or (status = 'active' and visible_on_profiles = true)
);

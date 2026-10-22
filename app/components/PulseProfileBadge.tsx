"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "../../lib/supabase";

type SharedPulse = { id: string; user_low: string; user_high: string; level: number };
type Person = { id: string; username: string; display_name: string };

export default function PulseProfileBadge() {
  const [items, setItems] = useState<Array<{ connection: SharedPulse; person: Person }>>([]);
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    let cancelled = false;
    async function load() {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth.user?.id;
      if (!userId) return;
      const { data: rows, error } = await supabase.from("pulse_connections")
        .select("id,user_low,user_high,level")
        .eq("status", "active").eq("visible_on_profiles", true)
        .or("user_low.eq." + userId + ",user_high.eq." + userId);
      if (error || !rows?.length) { if (!cancelled) setItems([]); return; }
      const ids = rows.map((row: SharedPulse) => row.user_low === userId ? row.user_high : row.user_low);
      const { data: people } = await supabase.from("profiles").select("id,username,display_name").in("id", ids);
      if (cancelled) return;
      const byId = new Map<string, Person>((people || []).map((person: Person) => [person.id, person] as [string, Person]));
      setItems((rows as SharedPulse[]).flatMap((connection) => {
        const otherId = connection.user_low === userId ? connection.user_high : connection.user_low;
        const person = byId.get(otherId);
        return person ? [{ connection, person }] : [];
      }));
    }
    void load();
    const channel = supabase.channel("pulse-profile-badges")
      .on("postgres_changes", { event: "*", schema: "public", table: "pulse_connections" }, () => { void load(); })
      .subscribe();
    return () => { cancelled = true; void supabase.removeChannel(channel); };
  }, []);

  if (!items.length) return null;
  return <section aria-label="Conexões Pulse compartilhadas" style={{ margin: "16px 0", padding: "14px", borderRadius: 18, border: "1px solid #6f80ff38", background: "linear-gradient(115deg,#142039,#211437 70%,#151026)" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
      <div><div style={{ color: "#73e7ff", fontSize: 9, fontWeight: 900, letterSpacing: 1.5 }}>NEXORA PULSE</div><strong style={{ color: "#f5f6ff", fontSize: 13 }}>Conexões em sintonia</strong></div>
      <Link href="/pulse" style={{ color: "#b9b0ff", fontSize: 10, fontWeight: 800, textDecoration: "none" }}>Ver todas ↗</Link>
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {items.map(({ connection, person }) => <Link key={connection.id} href="/pulse" style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 10px", borderRadius: 999, border: "1px solid #7e8aff38", background: "#080d1b99", color: "#f1f4ff", textDecoration: "none", fontSize: 10 }}>
        <span aria-hidden="true" style={{ color: "#70e5ff", textShadow: "0 0 12px #70e5ff", fontSize: 13 }}>✦</span><span>{person.display_name || person.username}</span><b style={{ color: "#c2a7ff" }}>N{connection.level}</b>
      </Link>)}
    </div>
  </section>;
}

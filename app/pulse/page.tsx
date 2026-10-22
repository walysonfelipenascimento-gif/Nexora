"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import PrimaryNav from "../components/PrimaryNav";
import "./pulse.css";
import { getSupabaseBrowserClient } from "../../lib/supabase";

type Profile = { id: string; username: string; display_name: string; avatar_url: string | null };
type Connection = {
  id: string; user_low: string; user_high: string; invited_by: string;
  status: "pending" | "active" | "declined" | "ended"; level: number; experience: number;
  total_interactions: number; last_interaction_at: string | null; active_days: string[];
  visible_on_profiles: boolean; visible_low_opt_in: boolean; visible_high_opt_in: boolean;
  created_at: string; updated_at: string;
};
type Memory = { id: string; connection_id: string; created_by: string; title: string; note: string; approved_by_other: boolean; visible_on_profiles: boolean; created_at: string };
const levelNames = ["Faísca", "Faísca", "Sintonia", "Sintonia", "Órbita", "Órbita", "Supernova", "Supernova"];
const levelColors = ["#50dfff", "#50dfff", "#9b8cff", "#9b8cff", "#d17cff", "#d17cff", "#ff80d5", "#ff80d5"];
const buttonStyle: CSSProperties = { border: "1px solid rgba(113,222,255,.35)", background: "linear-gradient(110deg,rgba(58,215,255,.18),rgba(160,105,255,.18))", color: "#f7f8ff", padding: "10px 13px", borderRadius: 12, fontWeight: 800, cursor: "pointer" };
const fieldStyle: CSSProperties = { width: "100%", boxSizing: "border-box", background: "#080d1c", color: "#f5f7ff", border: "1px solid #303a59", borderRadius: 12, padding: "12px 13px", outline: "none" };

export default function NexoraPulsePage() {
  const supabase = getSupabaseBrowserClient();
  const [userId, setUserId] = useState("");
  const [myProfile, setMyProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [memories, setMemories] = useState<Memory[]>([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Profile[]>([]);
  const [memoryTitle, setMemoryTitle] = useState("");
  const [memoryNote, setMemoryNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);

  const activeConnections = connections.filter((item) => item.status === "active");
  const selected = activeConnections.find((item) => item.id === selectedId) || activeConnections[0] || null;
  const partnerId = selected && myProfile ? (selected.user_low === myProfile.id ? selected.user_high : selected.user_low) : "";
  const partner = partnerId ? profiles[partnerId] : null;
  const incoming = connections.filter((item) => item.status === "pending" && item.invited_by !== userId);
  const outgoing = connections.filter((item) => item.status === "pending" && item.invited_by === userId);
  const level = selected ? Math.max(0, Math.min(7, selected.level)) : 0;
  const progress = selected ? Math.min(100, (selected.experience % 5) * 20) : 0;
  const dayCount = useMemo(() => selected?.active_days?.length || 0, [selected?.active_days]);

  const loadData = useCallback(async (knownUserId?: string) => {
    if (!supabase) {
      setError("O Supabase não está configurado neste ambiente. Nenhuma interação foi salva.");
      setLoading(false);
      return;
    }
    setError("");
    const { data: authData } = await supabase.auth.getUser();
    const uid = knownUserId || authData.user?.id || "";
    if (!uid) {
      setUserId(""); setMyProfile(null); setConnections([]);
      setError("Entre na sua conta Nexora para usar o Pulse."); setLoading(false); return;
    }
    setUserId(uid);
    const [profileResult, connectionResult] = await Promise.all([
      supabase.from("profiles").select("id,username,display_name,avatar_url").eq("id", uid).maybeSingle(),
      supabase.from("pulse_connections").select("*").in("status", ["pending", "active"]).order("updated_at", { ascending: false }),
    ]);
    if (profileResult.error) setError(profileResult.error.message);
    else if (profileResult.data) setMyProfile(profileResult.data as Profile);
    if (connectionResult.error) {
      setError(connectionResult.error.message.includes("pulse_connections") ? "A migração do Pulse ainda precisa ser aplicada ao Supabase. Ela está preparada em supabase/migrations." : connectionResult.error.message);
      setConnections([]); setLoading(false); return;
    }
    const list = (connectionResult.data || []) as Connection[];
    setConnections(list);
    if (!selectedId && list.some((item) => item.status === "active")) setSelectedId(list.find((item) => item.status === "active")!.id);
    const ids = Array.from(new Set(list.flatMap((item) => [item.user_low, item.user_high])));
    if (ids.length) {
      const { data: people } = await supabase.from("profiles").select("id,username,display_name,avatar_url").in("id", ids);
      const map: Record<string, Profile> = {};
      (people || []).forEach((person) => { map[person.id] = person as Profile; });
      setProfiles(map);
    }
    setLoading(false);
  }, [supabase, selectedId]);

  useEffect(() => { void loadData(); }, [loadData]);

  useEffect(() => {
    if (!supabase || !userId) return;
    const channel = supabase.channel("nexora-pulse-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "pulse_connections" }, () => { void loadData(userId); })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [supabase, userId, loadData]);

  useEffect(() => {
    let cancelled = false;
    async function findPeople() {
      if (!supabase || !userId || search.trim().length < 2) { setResults([]); return; }
      setSearching(true);
      const clean = search.trim().replace(/^@/, "").replace(/[%_,]/g, "");
      const { data, error: searchError } = await supabase.from("profiles")
        .select("id,username,display_name,avatar_url").ilike("username", "%" + clean + "%")
        .neq("id", userId).limit(8);
      if (!cancelled) {
        if (searchError) setError(searchError.message);
        setResults((data || []) as Profile[]); setSearching(false);
      }
    }
    const handle = window.setTimeout(() => { void findPeople(); }, 250);
    return () => { cancelled = true; window.clearTimeout(handle); };
  }, [supabase, userId, search]);

  const loadMemories = useCallback(async (connectionId: string) => {
    if (!supabase || !connectionId) { setMemories([]); return; }
    const { data, error: memoryError } = await supabase.from("pulse_memories").select("*").eq("connection_id", connectionId).order("created_at", { ascending: false }).limit(30);
    if (memoryError) { setError(memoryError.message); setMemories([]); return; }
    setMemories((data || []) as Memory[]);
  }, [supabase]);

  useEffect(() => { if (selected?.id) void loadMemories(selected.id); else setMemories([]); }, [selected?.id, loadMemories]);

  async function runAction(action: () => Promise<void>, success: string) {
    setBusy(true); setError(""); setNotice("");
    try { await action(); setNotice(success); await loadData(userId); if (selected?.id) await loadMemories(selected.id); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível concluir. Tente novamente."); }
    finally { setBusy(false); }
  }

  async function invite(profile: Profile) {
    if (!supabase) return;
    await runAction(async () => {
      const { error: rpcError } = await supabase.rpc("pulse_invite", { p_target_user_id: profile.id });
      if (rpcError) throw rpcError;
      setSearch(""); setResults([]);
    }, "Convite do Pulse enviado para @" + profile.username + ".");
  }

  async function respond(connection: Connection, accept: boolean) {
    if (!supabase) return;
    await runAction(async () => {
      const { error: rpcError } = await supabase.rpc("pulse_respond", { p_connection_id: connection.id, p_accept: accept });
      if (rpcError) throw rpcError;
      if (accept) setSelectedId(connection.id);
    }, accept ? "Conexão aceita! O Pulse está ativo entre vocês." : "Convite recusado.");
  }

  async function celebrate(connection: Connection) {
    if (!supabase) return;
    await runAction(async () => {
      const { error: rpcError } = await supabase.rpc("pulse_record_activity", {
        p_connection_id: connection.id, p_event_type: "reaction", p_idempotency_key: "pulse-ui-" + crypto.randomUUID(),
      });
      if (rpcError) throw rpcError;
    }, "Sua energia foi enviada. O progresso foi salvo no servidor.");
  }

  async function saveMemory() {
    if (!supabase || !selected) return;
    await runAction(async () => {
      const { error: rpcError } = await supabase.rpc("pulse_create_memory", { p_connection_id: selected.id, p_title: memoryTitle.trim(), p_note: memoryNote.trim() });
      if (rpcError) throw rpcError;
      setMemoryTitle(""); setMemoryNote("");
    }, "Memória guardada para vocês dois.");
  }

  async function approveMemory(memory: Memory, approve: boolean) {
    if (!supabase) return;
    await runAction(async () => {
      const { error: rpcError } = await supabase.rpc("pulse_approve_memory", { p_memory_id: memory.id, p_approve: approve });
      if (rpcError) throw rpcError;
    }, approve ? "Memória aprovada." : "Memória não aprovada.");
  }

  async function toggleVisibility(connection: Connection) {
    if (!supabase || !myProfile) return;
    const myConsent = connection.user_low === myProfile.id ? connection.visible_low_opt_in : connection.visible_high_opt_in;
    await runAction(async () => {
      const { error: rpcError } = await supabase.rpc("pulse_set_profile_visibility", { p_connection_id: connection.id, p_visible: !myConsent });
      if (rpcError) throw rpcError;
    }, !myConsent ? "Sua autorização foi registrada. A exibição pública só ativa com o consentimento dos dois." : "Sua autorização de exibição foi retirada.");
  }

  return <main className="pulse-page">
    <div className="pulse-shell">
      <header className="pulse-header">
        <Link href="/" className="pulse-brand"><span className="pulse-logo">N</span><span>NEXORA <b>PULSE</b></span></Link>
        <div className="pulse-header-right"><span className="pulse-live-dot" /> CONEXÕES QUE EVOLUEM</div>
      </header>
      <section className="pulse-hero">
        <div className="pulse-hero-copy">
          <div className="pulse-eyebrow">✦ UMA NOVA ENERGIA SOCIAL</div>
          <h1>Conexões que <em>ganham vida.</em></h1>
          <p>Construa sintonia com amigos e pessoas com quem você conversa. Cada conquista é compartilhada — e a privacidade continua nas suas mãos.</p>
          <div className="pulse-hero-pills"><span>⚡ Evolução bilateral</span><span>✧ Conquistas</span><span>◈ Memórias privadas</span></div>
        </div>
        <div className="pulse-orb-wrap" aria-label="Núcleo de energia Pulse"><div className="pulse-orbit orbit-a" /><div className="pulse-orbit orbit-b" /><div className="pulse-orb">✦</div><i className="pulse-particle particle-a" /><i className="pulse-particle particle-b" /><i className="pulse-particle particle-c" /><div className="pulse-orb-caption">SUA ENERGIA SOCIAL</div></div>
      </section>

      <div className="pulse-content-grid">
        <section className="pulse-main-column">
          <div className="pulse-section-title"><div><span className="pulse-eyebrow">SEU UNIVERSO</span><h2>Suas conexões</h2></div><span className="pulse-count">{activeConnections.length} ativa{activeConnections.length === 1 ? "" : "s"}</span></div>
          {loading && <div className="pulse-card">Carregando seu universo Pulse…</div>}
          {!loading && !userId && <div className="pulse-card"><h3>Entre para acender seu Pulse</h3><p>As conexões ficam vinculadas à sua conta e sincronizam entre dispositivos.</p><Link href="/perfil" className="pulse-button">Ir para meu perfil</Link></div>}
          {!loading && userId && activeConnections.length === 0 && <div className="pulse-card pulse-empty"><div className="pulse-empty-icon">✧</div><h3>Seu universo começa com uma faísca</h3><p>Procure alguém que segue você de volta ou com quem já tenha uma conversa direta e envie um convite.</p></div>}

          {activeConnections.map((connection) => {
            const otherId = connection.user_low === userId ? connection.user_high : connection.user_low;
            const person = profiles[otherId];
            const connectionLevel = Math.max(0, Math.min(7, connection.level));
            return <button key={connection.id} className={"pulse-connection " + (selected?.id === connection.id ? "selected" : "")} onClick={() => setSelectedId(connection.id)}>
              <span className={"pulse-mini-orb stage-" + connectionLevel}>✦</span><span className="pulse-connection-person"><strong>{person?.display_name || person?.username || "Conexão Nexora"}</strong><small>@{person?.username || "carregando"}</small></span>
              <span className="pulse-connection-level"><b style={{ color: levelColors[connectionLevel] }}>{levelNames[connectionLevel]}</b><small>Nível {connectionLevel}/7</small></span><span className="pulse-connection-chevron">›</span>
            </button>;
          })}

          {selected && <section className="pulse-card pulse-detail">
            <div className="pulse-detail-top"><div className="pulse-detail-person"><span className={"pulse-big-orb stage-" + level}>✦</span><div><span className="pulse-eyebrow">PULSE ATIVO</span><h2>{partner?.display_name || partner?.username || "Sua conexão"}</h2><p>@{partner?.username || "Nexora"} · {levelNames[level]}</p></div></div><span className="pulse-level-badge" style={{ color: levelColors[level], borderColor: levelColors[level] + "66" }}>NÍVEL {level}/7</span></div>
            <div className="pulse-progress-label"><span>Próximo marco</span><strong>{level >= 7 ? "Supernova máxima" : (5 - (selected.experience % 5)) + " dias em sintonia para evoluir"}</strong></div>
            <div className="pulse-progress"><span style={{ width: level >= 7 ? "100%" : progress + "%", background: "linear-gradient(90deg,#48dfff," + levelColors[level] + ",#ff80d5)" }} /></div>
            <div className="pulse-stats"><div><strong>{selected.total_interactions}</strong><span>interações válidas</span></div><div><strong>{dayCount}</strong><span>dias de conexão</span></div><div><strong>{selected.last_interaction_at ? new Date(selected.last_interaction_at).toLocaleDateString("pt-BR") : "—"}</strong><span>última atividade</span></div></div>
            <button className="pulse-button pulse-button-wide" disabled={busy || level >= 7} onClick={() => void celebrate(selected)}>✦ Enviar energia para esta conexão</button>
            <p className="pulse-footnote">Até 8 contribuições por pessoa a cada dia. O conteúdo das mensagens privadas não é copiado para o histórico do Pulse.</p>
            <div className="pulse-privacy"><div><strong>Exibir esta conexão no perfil?</strong><small>Precisa da autorização de vocês dois.</small></div><button className="pulse-button" disabled={busy} onClick={() => void toggleVisibility(selected)}>{(selected.user_low === userId ? selected.visible_low_opt_in : selected.visible_high_opt_in) ? "Retirar meu consentimento" : "Autorizar exibição"}</button></div>
            <div className="pulse-memory-section"><div className="pulse-section-title"><div><span className="pulse-eyebrow">MOMENTOS QUE FICAM</span><h3>Memórias compartilhadas</h3></div><span className="pulse-count">{memories.length}</span></div>
              <form onSubmit={(event) => { event.preventDefault(); void saveMemory(); }} className="pulse-memory-form"><input value={memoryTitle} onChange={(event) => setMemoryTitle(event.target.value)} placeholder="Título do momento" maxLength={80} required style={fieldStyle}/><textarea value={memoryNote} onChange={(event) => setMemoryNote(event.target.value)} placeholder="Uma lembrança (opcional)" maxLength={500} rows={2} style={fieldStyle}/><button className="pulse-button" disabled={busy || !memoryTitle.trim()}>Guardar memória privada</button></form>
              {memories.map((memory) => <article className="pulse-memory" key={memory.id}><div><strong>{memory.title}</strong><p>{memory.note || "Um momento especial da conexão."}</p><small>{new Date(memory.created_at).toLocaleDateString("pt-BR")} · {memory.approved_by_other ? "Aprovada pela outra pessoa" : memory.created_by === userId ? "Aguardando a outra pessoa" : "Aguardando sua aprovação"}</small></div>{memory.created_by !== userId && !memory.approved_by_other && <button className="pulse-button" disabled={busy} onClick={() => void approveMemory(memory, true)}>Aprovar</button>}</article>)}
              {memories.length === 0 && <p className="pulse-muted">Ainda não há memórias. Guardem a primeira quando quiserem.</p>}
            </div>
          </section>}
          <div className="pulse-disclaimer">O Pulse não apaga conquistas por ausência. Os registros são mantidos no servidor e só mudam por ações autorizadas.</div>
        </section>

        <aside className="pulse-side-column">
          <section className="pulse-card pulse-invite-card"><span className="pulse-eyebrow">CRIAR UMA CONEXÃO</span><h2>Acenda uma faísca</h2><p>Busque pelo nome de usuário. Convites só são permitidos entre seguidores mútuos ou pessoas com uma conversa direta existente.</p><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar @usuário" maxLength={40} style={fieldStyle} aria-label="Buscar usuário para convite"/>
            {searching && <p className="pulse-muted">Buscando pessoas…</p>}
            {results.map((person) => <div className="pulse-search-result" key={person.id}><div className="pulse-avatar">{(person.display_name || person.username).slice(0,1).toUpperCase()}</div><div className="pulse-search-name"><strong>{person.display_name || person.username}</strong><small>@{person.username}</small></div><button className="pulse-button" disabled={busy} onClick={() => void invite(person)}>Convidar</button></div>)}
            {search.trim().length >= 2 && !searching && results.length === 0 && <p className="pulse-muted">Nenhum perfil encontrado com esse nome.</p>}
          </section>

          {incoming.length > 0 && <section className="pulse-card"><span className="pulse-eyebrow">NOVAS FAÍSCAS</span><h3>Convites recebidos</h3>{incoming.map((connection) => { const otherId = connection.user_low === userId ? connection.user_high : connection.user_low; const person = profiles[otherId]; return <div className="pulse-pending" key={connection.id}><div><strong>{person?.display_name || person?.username || "Pessoa Nexora"}</strong><small>@{person?.username || "usuário"}</small></div><div className="pulse-pending-actions"><button className="pulse-button" disabled={busy} onClick={() => void respond(connection, true)}>Aceitar</button><button className="pulse-decline" disabled={busy} onClick={() => void respond(connection, false)}>Recusar</button></div></div>; })}</section>}
          {outgoing.length > 0 && <section className="pulse-card"><span className="pulse-eyebrow">AGUARDANDO SINTONIA</span><h3>Convites enviados</h3>{outgoing.map((connection) => { const otherId = connection.user_low === userId ? connection.user_high : connection.user_low; const person = profiles[otherId]; return <div className="pulse-pending" key={connection.id}><div><strong>{person?.display_name || person?.username || "Pessoa Nexora"}</strong><small>Convite enviado</small></div><span className="pulse-waiting">Pendente</span></div>; })}</section>}

          <section className="pulse-card pulse-how-card"><span className="pulse-eyebrow">COMO EVOLUI</span><h3>Da faísca à Supernova</h3>{[["01","Faísca","O convite é aceito."],["02","Sintonia","As duas pessoas contribuem."],["03","Órbita","A conexão ganha história."],["04","Supernova","Conquistas especiais são desbloqueadas."]].map(([number,title,desc]) => <div className="pulse-stage-row" key={number}><span>{number}</span><div><strong>{title}</strong><small>{desc}</small></div></div>)}<p className="pulse-muted">Sem punição por ficar offline. Sem mensagens privadas expostas. Sem progresso ilimitado por spam.</p></section>
        </aside>
      </div>

      {(notice || error) && <div className={"pulse-toast " + (error ? "is-error" : "")} role={error ? "alert" : "status"}>{error || notice}<button onClick={() => { setError(""); setNotice(""); }} aria-label="Fechar aviso">×</button></div>}
      <PrimaryNav active="pulse" />
    </div>
  </main>;
}

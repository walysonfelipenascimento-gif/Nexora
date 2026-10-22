"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import PrimaryNav from "../components/PrimaryNav";
import { getSupabaseBrowserClient } from "../../lib/supabase";
import { getSavedLanguage, type NexoraLanguage } from "../../lib/i18n";
import "./global.css";

type Leader = {
  position: number;
  user_id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  score: number;
  pulse_connections: number;
  interactions: number;
};

const copy = {
  "pt-BR": { kicker:"PLACAR GLOBAL NEXORA", title:"Seu lugar no", accent:"universo.", subtitle:"Conexões reais. Energia compartilhada. Uma classificação construída pela evolução do NEXORA PULSE.", top:"TOP 10 GLOBAL", topSub:"As dez posições em destaque", search:"Pesquisar alguém do Top 100", placeholder:"Nome ou @usuário", searchBtn:"Pesquisar", me:"Ver minha posição", loading:"Sincronizando o placar…", empty:"Ainda não há pontuações suficientes para montar o placar.", noResults:"Ninguém encontrado no Top 100 com esse nome.", score:"pontos", links:"conexões Pulse", interactions:"interações", yourRank:"SUA POSIÇÃO", privacy:"Só mostramos informações públicas do perfil e pontuação agregada. Mensagens e memórias privadas nunca entram no placar.", openPulse:"Abrir Pulse", back:"Voltar ao início", error:"Não foi possível carregar o placar agora." },
  "en-US": { kicker:"NEXORA GLOBAL LEADERBOARD", title:"Your place in the", accent:"universe.", subtitle:"Real connections. Shared energy. A ranking built around NEXORA PULSE progress.", top:"GLOBAL TOP 10", topSub:"The ten featured positions", search:"Find someone in the Top 100", placeholder:"Name or @username", searchBtn:"Search", me:"View my position", loading:"Syncing leaderboard…", empty:"Not enough scores to build the leaderboard yet.", noResults:"No one found in the Top 100 for that search.", score:"points", links:"Pulse connections", interactions:"interactions", yourRank:"YOUR POSITION", privacy:"Only public profile details and aggregated scores are shown. Private messages and memories never enter the leaderboard.", openPulse:"Open Pulse", back:"Back to home", error:"Couldn't load the leaderboard right now." },
  es: { kicker:"CLASIFICACIÓN GLOBAL NEXORA", title:"Tu lugar en el", accent:"universo.", subtitle:"Conexiones reales. Energía compartida. Una clasificación basada en el progreso de NEXORA PULSE.", top:"TOP 10 GLOBAL", topSub:"Las diez posiciones destacadas", search:"Buscar a alguien del Top 100", placeholder:"Nombre o @usuario", searchBtn:"Buscar", me:"Ver mi posición", loading:"Sincronizando la clasificación…", empty:"Aún no hay puntuaciones suficientes.", noResults:"No se encontró a nadie en el Top 100.", score:"puntos", links:"conexiones Pulse", interactions:"interacciones", yourRank:"TU POSICIÓN", privacy:"Solo mostramos datos públicos del perfil y puntuaciones agregadas. Los mensajes y recuerdos privados nunca aparecen.", openPulse:"Abrir Pulse", back:"Volver al inicio", error:"No se pudo cargar la clasificación." }
} as const;

function medal(position: number) { return position === 1 ? "crown" : position === 2 ? "silver" : position === 3 ? "bronze" : "standard"; }
function Avatar({ person, large = false }: { person: Leader; large?: boolean }) {
  return <span className={large ? "global-avatar global-avatar-large" : "global-avatar"}>
    {person.avatar_url ? <img src={person.avatar_url} alt="" /> : <span>{(person.display_name || person.username || "N").slice(0, 1).toUpperCase()}</span>}
  </span>;
}
function Icon({ name }: { name: "globe" | "search" | "arrow" | "pulse" | "spark" }) {
  const paths = {
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    pulse: <><path d="M3 12h4l3-7 4 14 3-7h4"/></>,
    spark: <><path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z"/><path d="m19 16 .9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16Z"/></>
  };
  return <svg className="global-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function NexoraGlobalPage() {
  const supabase = getSupabaseBrowserClient();
  const [language, setLanguage] = useState<NexoraLanguage>("pt-BR");
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [matches, setMatches] = useState<Leader[]>([]);
  const [myPosition, setMyPosition] = useState<Leader | null>(null);
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const t = copy[language as keyof typeof copy] || copy["pt-BR"];
  const loadTop = useCallback(async () => {
    if (!supabase) { setError(t.error); setLoading(false); return; }
    const { data, error: rpcError } = await supabase.rpc("pulse_global_leaderboard", { p_search: null, p_me_only: false });
    if (rpcError) setError(rpcError.message);
    else setLeaders((data || []) as Leader[]);
    setLoading(false);
  }, [supabase, t.error]);
  useEffect(() => {
    setLanguage(getSavedLanguage());
    const update = () => setLanguage(getSavedLanguage());
    window.addEventListener("nexora-language-change", update);
    window.addEventListener("storage", update);
    return () => { window.removeEventListener("nexora-language-change", update); window.removeEventListener("storage", update); };
  }, []);
  useEffect(() => { void loadTop(); }, [loadTop]);
  async function searchPeople(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearched(true);
    setSearching(true);
    setError("");
    if (!supabase || query.trim().length < 2) { setMatches([]); setSearching(false); return; }
    const { data, error: rpcError } = await supabase.rpc("pulse_global_leaderboard", { p_search: query.trim().replace(/^@/, ""), p_me_only: false });
    if (rpcError) setError(rpcError.message);
    setMatches((data || []) as Leader[]);
    setSearching(false);
  }
  async function findMe() {
    setSearching(true); setSearched(true); setError("");
    if (!supabase) { setSearching(false); return; }
    const { data, error: rpcError } = await supabase.rpc("pulse_global_leaderboard", { p_search: null, p_me_only: true });
    if (rpcError) setError(rpcError.message);
    setMyPosition(((data || [])[0] as Leader) || null);
    setMatches((data || []) as Leader[]);
    setSearching(false);
  }
  const podium = [leaders[1], leaders[0], leaders[2]].filter(Boolean);
  return <main className="global-page">
    <div className="global-shell">
      <header className="global-header">
        <Link href="/" className="global-brand"><span className="global-logo">N</span><span>NEXORA <b>GLOBAL</b></span></Link>
        <span className="global-live"><i /> <Icon name="globe" /> GLOBAL RANKING</span>
      </header>
      <section className="global-hero">
        <div className="global-hero-copy">
          <span className="global-kicker"><Icon name="spark" /> {t.kicker}</span>
          <h1>{t.title} <em>{t.accent}</em></h1>
          <p>{t.subtitle}</p>
          <div className="global-actions"><Link href="/pulse" className="global-button"><Icon name="pulse" /> {t.openPulse}</Link><Link href="/" className="global-text-link">{t.back} <Icon name="arrow" /></Link></div>
        </div>
        <div className="global-orbit" aria-hidden="true"><span className="global-ring ring-one"/><span className="global-ring ring-two"/><span className="global-core"><Icon name="globe"/></span><i className="global-star star-one"/><i className="global-star star-two"/><i className="global-star star-three"/></div>
      </section>
      <section className="global-card">
        <div className="global-section-heading"><div><span className="global-kicker">{t.top}</span><h2>{t.topSub}</h2></div><span className="global-count">TOP 10 <Icon name="spark"/></span></div>
        {loading && <div className="global-state">{t.loading}</div>}
        {!loading && leaders.length === 0 && <div className="global-state">{error || t.empty}</div>}
        {!loading && leaders.length > 0 && <div className="global-podium">
          {podium.map((person) => <article key={person.user_id} className={"global-podium-person rank-" + medal(person.position)}>
            <span className="global-medal">{person.position === 1 ? "✦" : person.position === 2 ? "Ⅱ" : "Ⅲ"}</span>
            <Avatar person={person} large/>
            <strong>{person.display_name || person.username}</strong><span className="global-handle">@{person.username}</span>
            <b className="global-points">{person.score.toLocaleString()} <small>{t.score}</small></b>
            <span className="global-podium-position">#{person.position}</span>
          </article>)}
        </div>}
        {!loading && leaders.length > 0 && <div className="global-top-list">
          {leaders.filter((person) => person.position > 3).map((person) => <article className="global-row" key={person.user_id}>
            <span className="global-position">#{person.position}</span><Avatar person={person}/>
            <span className="global-person-copy"><strong>{person.display_name || person.username}</strong><small>@{person.username}</small></span>
            <span className="global-row-score">{person.score.toLocaleString()} <small>{t.score}</small></span>
            <span className="global-row-meta">{person.pulse_connections} {t.links}</span>
          </article>)}
        </div>}
      </section>
      <section className="global-search-card">
        <div><span className="global-kicker"><Icon name="search" /> {t.search}</span><p>O ranking completo não fica aberto na tela: pesquise uma pessoa ou consulte sua própria posição.</p></div>
        <form className="global-search-form" onSubmit={searchPeople}><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.placeholder} maxLength={40} aria-label={t.placeholder}/><button type="submit" disabled={searching || query.trim().length < 2}><Icon name="search"/> {t.searchBtn}</button></form>
        <button type="button" className="global-button global-me-button" onClick={() => void findMe()} disabled={searching}><Icon name="spark"/> {t.me}</button>
        {searching && <p className="global-state">{t.loading}</p>}
        {error && <p className="global-error" role="alert">{error}</p>}
        {searched && !searching && matches.length === 0 && <p className="global-state">{t.noResults}</p>}
        {searched && !searching && matches.length > 0 && <div className="global-results">
          {matches.map((person) => <article className={"global-row " + (myPosition?.user_id === person.user_id ? "global-own-row" : "")} key={person.user_id}>
            <span className="global-position">#{person.position}</span><Avatar person={person}/>
            <span className="global-person-copy"><strong>{person.display_name || person.username}{myPosition?.user_id === person.user_id ? " · " + t.yourRank : ""}</strong><small>@{person.username}</small></span>
            <span className="global-row-score">{person.score.toLocaleString()} <small>{t.score}</small></span>
          </article>)}
        </div>}
        <p className="global-privacy">{t.privacy}</p>
      </section>
      <footer className="global-footer"><span>✦ NEXORA GLOBAL</span><span>TOP 10 · TOP 100 · PULSE</span></footer>
      <PrimaryNav active="global" />
    </div>
  </main>;
}
